'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 解析 --images 参数，将本地文件转为 base64，URL/dataURI/base64 直接返回。
 * @param {string} rawParam 逗号分隔的图片来源
 * @returns {{ ok: true, images: string[] } | { ok: false, message: string }}
 */
function resolveImages(rawParam) {
  const rawImages = String(rawParam).split(',').map(s => s.trim()).filter(Boolean);

  if (rawImages.length === 0) {
    return { ok: false, message: '--images 参数不能为空（图生图需要 1-3 张参考图）' };
  }
  if (rawImages.length > 3) {
    return { ok: false, message: '--images 最多支持 3 张参考图' };
  }

  const images = [];
  for (const img of rawImages) {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      images.push(img);
    } else if (img.startsWith('data:image/')) {
      images.push(img);
    } else if (img.length > 1000) {
      // 超长字符串视为 raw base64
      images.push(img);
    } else {
      // 本地文件路径 → 读取转 base64
      const filePath = path.resolve(img);
      if (!fs.existsSync(filePath)) {
        return { ok: false, message: `参考图片文件不存在: ${filePath}` };
      }
      try {
        const buf = fs.readFileSync(filePath);
        images.push(buf.toString('base64'));
      } catch (err) {
        return { ok: false, message: `读取参考图片失败: ${filePath} — ${err.message}` };
      }
    }
  }

  return { ok: true, images };
}

module.exports = { resolveImages };
