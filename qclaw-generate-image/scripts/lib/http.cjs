'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const { PROXY_HOST, PROXY_PORT, REQUEST_TIMEOUT_MS, DOWNLOAD_TIMEOUT_MS } = require('./config.cjs');

/**
 * 向 Auth Gateway 发送 POST 请求
 */
function gatewayPost(requestPath, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      host: PROXY_HOST, port: Number(PROXY_PORT), path: requestPath, method: 'POST',
      timeout: REQUEST_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve({ statusCode: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ statusCode: res.statusCode, data: { error: { code: 'parse_error', message: data.slice(0, 500) } } }); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('请求超时')); });
    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

/**
 * 下载图片到本地文件（支持重定向，最多 5 次）
 */
function downloadImage(url, destPath, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) { reject(new Error('重定向次数过多')); return; }
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: DOWNLOAD_TIMEOUT_MS }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (!loc) { reject(new Error('重定向无 Location')); return; }
        downloadImage(loc, destPath, redirectsLeft - 1).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`下载失败: HTTP ${res.statusCode}`)); return; }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(destPath); });
      fileStream.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('下载超时')); });
    req.on('error', reject);
  });
}

/**
 * 带重试的图片下载（指数退避，最多重试 2 次）
 * @param {string} url - 图片 URL
 * @param {string} destPath - 本地保存路径
 * @param {number} maxRetries - 最大重试次数（默认 2）
 * @returns {Promise<string>} 本地文件路径
 */
async function downloadImageWithRetry(url, destPath, maxRetries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await downloadImage(url, destPath);
    } catch (err) {
      lastErr = err;
      // 清理可能的不完整文件
      try { fs.unlinkSync(destPath); } catch { /* ignore */ }
      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt); // 1s, 2s
        process.stderr.write(`[retry] 图片下载第 ${attempt + 1} 次失败: ${err.message}，${delay}ms 后重试...\n`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

module.exports = { gatewayPost, downloadImage, downloadImageWithRetry };
