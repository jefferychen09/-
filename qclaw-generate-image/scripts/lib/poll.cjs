'use strict';

const { QUERY_PATH, DEFAULT_POLL_INTERVAL_MS, MAX_POLL_TIME_MS } = require('./config.cjs');
const { gatewayPost } = require('./http.cjs');

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/** 连续错误（网络错误 + HTTP 临时性错误）超过此阈值则判定为不可恢复 */
const MAX_CONSECUTIVE_ERRORS = 5;

/** 这些 HTTP 状态码属于临时性错误，应当重试而非立即退出 */
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

/**
 * 轮询任务状态直到 succeeded、failed 或超时。
 * 后端状态机：submitted → queued → running → succeeded / failed
 */
async function pollJobResult(jobId, initialPollMs) {
  const startTime = Date.now();
  let pollInterval = initialPollMs || DEFAULT_POLL_INTERVAL_MS;
  let consecutiveErrors = 0;

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    await sleep(pollInterval);

    let result;
    try {
      result = await gatewayPost(QUERY_PATH, { job_id: jobId });
    } catch (err) {
      consecutiveErrors++;
      process.stderr.write(`[poll] 网络错误 (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): ${err.message}\n`);
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        return { success: false, message: '网络连接异常（连续多次请求失败），请检查网络后重试', retryable: true };
      }
      continue;
    }

    const data = result.data;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stderr.write(`[poll] ${elapsed}s HTTP=${result.statusCode} status=${data.status || 'N/A'}\n`);

    // ── 处理非 200 响应 ─────────────────────────────────────────────────
    if (result.statusCode !== 200) {
      // 临时性错误（5xx、429 等）或明确标记 retryable → 当作网络错误重试
      const isRetryable = RETRYABLE_STATUS_CODES.has(result.statusCode)
        || (data.error && data.error.retryable);

      if (isRetryable) {
        consecutiveErrors++;
        process.stderr.write(`[poll] 临时错误，重试 (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): HTTP ${result.statusCode} ${JSON.stringify(data.error || {})}\n`);
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          return { success: false, message: `查询任务状态异常（连续 ${MAX_CONSECUTIVE_ERRORS} 次失败），请稍后重试`, retryable: true };
        }
        continue;
      }

      // 不可重试的明确错误（400、401、403 等）→ 立即退出
      if (data.error) {
        process.stderr.write(`[poll] 不可恢复错误: HTTP ${result.statusCode} error=${JSON.stringify(data.error)}\n`);
        return { success: false, message: data.error.message || `查询失败 (HTTP ${result.statusCode})`, retryable: false };
      }
    }

    // HTTP 200 或无 error 字段，重置连续错误计数
    consecutiveErrors = 0;

    // ── 根据 status 字段判断最终状态 ─────────────────────────────────────
    if (data.status === 'succeeded') {
      const urls = (data.result_images || []).map((img) => img.url).filter(Boolean);
      process.stderr.write(`[poll] 成功! 共 ${urls.length} 张图片\n`);
      return { success: true, imageUrls: urls, revisedPrompt: Array.isArray(data.revised_prompt) ? data.revised_prompt[0] : null };
    }

    if (data.status === 'failed') {
      const errObj = data.error || {};
      process.stderr.write(`[poll] 生成失败: ${JSON.stringify(errObj)}\n`);
      return { success: false, message: errObj.message || '图片生成失败', retryable: errObj.retryable || false, errorCode: errObj.code || 'unknown' };
    }

    // 其他中间状态（submitted / queued / running）继续轮询
    if (data.poll_after_ms) { pollInterval = data.poll_after_ms; }
  }

  return { success: false, message: '生图超时（超过180秒），请稍后重试', retryable: true };
}

module.exports = { pollJobResult };
