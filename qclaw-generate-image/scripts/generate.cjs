#!/usr/bin/env node

/**
 * qclaw-generate-image/scripts/generate.cjs — AI 生图入口脚本
 *
 * 支持文生图 (text_to_image) 和图生图 (image_to_image)。
 * 流程: 参数解析 → Submit → Poll → Download → 输出本地路径 JSON
 *
 * 用法:
 *   文生图: node generate.cjs --prompt="图片描述" [--resolution=宽:高] [--revise=1|0] [--seed=N]
 *   图生图: node generate.cjs --prompt="风格描述" --images="/path/ref.png" [--resolution=宽:高]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { SUBMIT_PATH, IMAGE_OUTPUT_DIR, VALID_RESOLUTIONS } = require('./lib/config.cjs');
const { gatewayPost, downloadImageWithRetry } = require('./lib/http.cjs');
const { pollJobResult } = require('./lib/poll.cjs');
const { resolveImages } = require('./lib/images.cjs');

// ── 工具函数 ─────────────────────────────────────────────────────────────────

function output(result) {
  console.log(JSON.stringify(result, null, 2));
}

function parseCliArgs(argv) {
  const params = {};
  for (const arg of argv) {
    const match = arg.match(/^--([a-zA-Z_]+)=(.*)$/);
    if (match) {
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (/^\d+$/.test(value)) value = Number(value);
      params[match[1]] = value;
    }
  }
  return params;
}

function normalizeResolution(input) {
  return String(input).replace(/x/gi, ':');
}

// ── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    output({ success: false, message: '缺少参数。\n用法: node generate.cjs --prompt="图片描述"\n图生图: node generate.cjs --prompt="风格描述" --images="/path/ref.png"' });
    process.exit(1);
  }

  const params = parseCliArgs(args);

  if (!params.prompt) {
    output({ success: false, message: '缺少必填参数 --prompt' });
    process.exit(1);
  }

  const resolution = normalizeResolution(params.resolution || '1024:1024');
  if (!VALID_RESOLUTIONS.has(resolution)) {
    output({ success: false, message: `不支持的分辨率: ${resolution}\n支持: ${[...VALID_RESOLUTIONS].join(', ')}` });
    process.exit(1);
  }

  const revise = params.revise !== undefined ? Number(params.revise) : 1;

  // ── 判断任务类型 ─────────────────────────────────────────────────────────
  let taskType = 'text_to_image';
  let imagesList = [];

  if (params.images) {
    taskType = 'image_to_image';
    const result = resolveImages(params.images);
    if (!result.ok) { output({ success: false, message: result.message }); process.exit(1); }
    imagesList = result.images;
  }

  // ── Step 1: 提交任务 ────────────────────────────────────────────────────
  const submitBody = { task_type: taskType, prompt: String(params.prompt), resolution, revise };
  if (taskType === 'image_to_image') submitBody.images = imagesList;
  if (params.seed !== undefined && Number(params.seed) > 0) submitBody.seed = Number(params.seed);

  let submitResult;
  try { submitResult = await gatewayPost(SUBMIT_PATH, submitBody); }
  catch (err) { output({ success: false, message: `提交任务失败: ${err.message}` }); process.exit(1); }

  if (submitResult.statusCode !== 202 && submitResult.statusCode !== 200) {
    const msg = (submitResult.data.error || {}).message || `HTTP ${submitResult.statusCode}`;
    output({ success: false, message: `提交任务失败: ${msg}` });
    process.exit(1);
  }

  const jobId = submitResult.data.job_id;
  if (!jobId) { output({ success: false, message: '提交任务失败: 服务未返回 job_id' }); process.exit(1); }

  // ── Step 2: 轮询结果（可重试错误自动重新提交一次） ─────────────────────────
  let pollResult;
  try { pollResult = await pollJobResult(jobId, submitResult.data.poll_after_ms); }
  catch (err) { output({ success: false, message: `查询任务状态异常: ${err.message}` }); process.exit(1); }

  // 如果轮询返回可重试错误，自动重试一次（重新 submit + poll）
  if (!pollResult.success && pollResult.retryable) {
    process.stderr.write(`[retry] 首次轮询失败（${pollResult.message}），等待 3s 后重试...\n`);
    await new Promise((r) => setTimeout(r, 3000));
    let retrySubmit;
    try { retrySubmit = await gatewayPost(SUBMIT_PATH, submitBody); }
    catch (err) { output({ success: false, message: `重试提交失败: ${err.message}` }); process.exit(1); }
    if (retrySubmit.statusCode === 202 || retrySubmit.statusCode === 200) {
      const retryJobId = retrySubmit.data.job_id;
      if (retryJobId) {
        process.stderr.write(`[retry] 重新提交成功，job_id=${retryJobId}\n`);
        try { pollResult = await pollJobResult(retryJobId, retrySubmit.data.poll_after_ms); }
        catch (err) { output({ success: false, message: `重试查询异常: ${err.message}` }); process.exit(1); }
      }
    }
  }

  if (!pollResult.success) { output({ success: false, message: pollResult.message }); process.exit(1); }

  // ── Step 3: 下载图片（带重试） ─────────────────────────────────────────────
  if (!pollResult.imageUrls || pollResult.imageUrls.length === 0) {
    output({ success: false, message: '生成成功但未返回图片 URL' });
    process.exit(1);
  }

  if (!fs.existsSync(IMAGE_OUTPUT_DIR)) fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });

  const localPaths = [];
  const failedUrls = [];
  for (let i = 0; i < pollResult.imageUrls.length; i++) {
    const filename = `img_${crypto.randomBytes(8).toString('hex')}.png`;
    const destPath = path.join(IMAGE_OUTPUT_DIR, filename);
    try {
      await downloadImageWithRetry(pollResult.imageUrls[i], destPath);
      localPaths.push(destPath);
    } catch (err) {
      process.stderr.write(`[warn] 图片 ${i + 1} 下载失败（已重试）: ${err.message}\n`);
      failedUrls.push(pollResult.imageUrls[i]);
    }
  }

  if (localPaths.length === 0) {
    // 全部下载失败，返回原始 URL 供用户手动下载（URL 有效期约 1 小时）
    output({
      success: false,
      message: '图片下载全部失败，已附上临时链接（有效期约1小时），可手动在浏览器中打开保存',
      fallbackUrls: pollResult.imageUrls,
    });
    process.exit(1);
  }

  // ── Step 4: 输出结果 ────────────────────────────────────────────────────
  const result = {
    success: true,
    message: '✅ 图片已生成',
    images: localPaths,
    prompt: String(params.prompt),
    revisedPrompt: pollResult.revisedPrompt,
    resolution,
    taskType,
  };
  // 部分图片下载失败时，附上失败图片的原始 URL
  if (failedUrls.length > 0) result.fallbackUrls = failedUrls;
  output(result);
}

main().catch((err) => { output({ success: false, message: `未知错误: ${err.message}` }); process.exit(1); });
