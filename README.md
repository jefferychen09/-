# 陈杰辉个人作品集原型

这是第一版可运行个人作品集原型，定位为“嵌入式开发 + AI 开发”的求职展示与技术创作者主页。

## 运行

```bash
node server.mjs
```

然后打开：

```text
http://localhost:3000
```

如果 3000 端口被占用：

```bash
PORT=3001 node server.mjs
```

## 修改内容

主要内容在 [content.js](/Users/chen/Downloads/codex项目1/content.js)：

- `zh`：中文文案
- `en`：英文文案
- `projectsData`：项目内容
- `stacks`：技术能力
- `achievementsData`：经历与奖项
- `notesData`：博客占位内容

视觉样式在 [styles.css](/Users/chen/Downloads/codex项目1/styles.css)。

## 后续升级方向

下一阶段可以迁移到：

- Next.js
- TypeScript
- MDX
- Framer Motion
- Vercel 部署
- TinaCMS / Decap CMS 后台编辑
