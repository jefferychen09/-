'use strict';

const path = require('path');

// ── Auth Gateway 配置 ────────────────────────────────────────────────────────
const PROXY_PORT = process.env.AUTH_GATEWAY_PORT || '19000';
const PROXY_HOST = '127.0.0.1';
const SUBMIT_PATH = '/proxy/qclaw-generate-image/submit';
const QUERY_PATH = '/proxy/qclaw-generate-image/query';

// ── 超时配置 ─────────────────────────────────────────────────────────────────
const REQUEST_TIMEOUT_MS = 30000;      // 单次 HTTP 请求超时 30s
const MAX_POLL_TIME_MS = 180000;       // 最大等待 180s（后端建议 2-3 分钟）
const DOWNLOAD_TIMEOUT_MS = 60000;     // 图片下载超时 60s
const DEFAULT_POLL_INTERVAL_MS = 3000; // 默认轮询间隔 3s

// ── 图片保存目录 ─────────────────────────────────────────────────────────────
// OpenClaw 框架执行 skill 脚本时会将 cwd 设置为当前 agent 的 workspace 目录，
// 因此 process.cwd() 指向用户可见的工作空间。
// 保存到 workspace/generated-images/ 可被文件系统追踪，便于展示。
//
// 兼容性保护：若 cwd 不可写（如 Electron 渲染进程默认 cwd 为 / 的极端情况），
// 则回退到用户 home 目录下的 .qclaw/generated-images/。
const os = require('os');
const fs = require('fs');

function resolveImageOutputDir() {
  const primary = path.join(process.cwd(), 'generated-images');
  try {
    // 尝试在 cwd 下创建目录，验证可写性
    if (!fs.existsSync(primary)) fs.mkdirSync(primary, { recursive: true });
    // 验证目录确实可写
    fs.accessSync(primary, fs.constants.W_OK);
    return primary;
  } catch {
    // cwd 不可写，回退到 home 目录
    const fallback = path.join(os.homedir(), '.qclaw', 'generated-images');
    if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const IMAGE_OUTPUT_DIR = resolveImageOutputDir();

// ── 分辨率白名单 ─────────────────────────────────────────────────────────────
const VALID_RESOLUTIONS = new Set([
  '768:768', '1024:1024',
  '768:1024', '864:1152',
  '1024:768', '1152:864',
  '768:1344', '576:1024',
  '1344:768', '1024:576',
]);

module.exports = {
  PROXY_PORT,
  PROXY_HOST,
  SUBMIT_PATH,
  QUERY_PATH,
  REQUEST_TIMEOUT_MS,
  MAX_POLL_TIME_MS,
  DOWNLOAD_TIMEOUT_MS,
  DEFAULT_POLL_INTERVAL_MS,
  IMAGE_OUTPUT_DIR,
  VALID_RESOLUTIONS,
};
