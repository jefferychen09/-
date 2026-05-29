# 陈杰辉个人作品集网站设计方案

## 1. 网站定位

网站类型：个人作品集 / 求职展示 / 技术创作者主页

中文姓名：陈杰辉  
英文姓名：Jiehui Chen  
核心方向：嵌入式开发 + AI 开发  
主要目标：展示专业能力、项目经历、审美风格，并为后续博客沉淀留下空间。

网站应给访问者留下的印象：

- 具备扎实的嵌入式软件开发基础
- 有 AI 模型部署与嵌入式硬件结合的项目经验
- 项目经历真实，具备团队协作和项目负责能力
- 页面审美克制、高级、清晰，接近 Apple 产品页气质

## 2. 视觉方向

关键词：

- 极简
- 科技感
- Apple 风
- 大留白
- 精致动效
- 清晰层级
- 专业可信

整体视觉建议：

- 背景以白色、近白色、浅灰为主，局部使用深色区域制造产品发布页式节奏。
- 大标题使用较大的无衬线字体，文案短、准、有气势。
- 避免复杂装饰，重点通过排版、动效、留白、光影和高质量项目卡片建立高级感。
- 项目视觉可使用抽象硬件芯片、传感器网格、AI 识别框、嵌入式电路纹理等科技感占位图。
- 页面滚动时使用轻微淡入、位移、模糊还原、数字递增等动效。

色彩建议：

- 主背景：#F5F5F7 / #FFFFFF
- 主文字：#1D1D1F
- 次级文字：#6E6E73
- 深色区：#000000 / #111111
- 科技蓝：#0071E3
- 辅助绿：#30D158
- 分割线：#D2D2D7

字体建议：

- 中文：PingFang SC / system-ui
- 英文：SF Pro Display 风格的系统字体
- 代码/技术标签：JetBrains Mono 或 Menlo

## 3. 信息架构

第一版建议采用“首页 + 项目详情 + 博客 + 关于”的结构。

### 首页 Home

首页是最重要的页面，承担第一印象、专业定位、项目入口。

推荐模块：

1. Hero 首屏
2. 精选项目 Featured Projects
3. 技术能力 Tech Stack
4. 经历与成果 Experience & Awards
5. 技术笔记入口 Blog Preview
6. 联系方式 Contact

### 项目 Projects

展示所有项目。第一版重点展示两个来自简历的项目：

- 智能灭火机器人系统
- 基于嵌入式智能 AI 的电子导盲装置

每个项目建议包含：

- 项目标题
- 时间
- 角色
- 项目简介
- 技术栈
- 我负责的部分
- 项目价值
- 图片/视频/代码链接，后期可补

### 博客 Blog

第一版先做内容系统和列表页，文章可以先放 3 篇占位文章。

建议栏目：

- 嵌入式笔记
- AI 模型部署
- 项目复盘
- Linux / C / C++
- 面试与成长记录

### 关于 About

用于承接完整简历信息，但视觉上不能像普通简历表格。

内容包括：

- 个人简介
- 教育背景
- 技术能力
- 校园经历
- 获奖情况
- 联系方式

## 4. 首页详细设计

### 4.1 Hero 首屏

设计目标：像 Apple 产品页一样，用极少信息建立高级感和专业定位。

中文文案：

主标题：

> 陈杰辉

副标题：

> 嵌入式软件开发与 AI 应用开发

简介：

> 专注于嵌入式系统、AI 模型部署与智能硬件应用，将算法能力落到真实设备与项目场景中。

按钮：

- 查看项目
- 阅读博客
- 下载简历

英文文案：

Title:

> Jiehui Chen

Subtitle:

> Embedded Software & AI Application Developer

Intro:

> Building intelligent embedded systems that connect software, hardware, and AI in practical scenarios.

Buttons:

- View Projects
- Read Notes
- Resume

视觉建议：

- 中央大标题
- 大面积留白
- 背后可放一个低对比度的 3D 芯片/开发板/AI 识别网格视觉
- 首屏底部露出下一段项目内容，形成继续滚动的暗示

### 4.2 精选项目

标题：

中文：

> Featured Projects  
> 从硬件到算法，从原型到落地。

英文：

> Featured Projects  
> From hardware to algorithms, from prototype to implementation.

项目 1：

名称：

> 智能灭火机器人系统

角色：

> 项目负责人

时间：

> 2023.06 - 2024.06

摘要：

> 集成嵌入式系统、传感器与图像识别模块，结合 Fire-YOLO 火焰检测算法，实现更及时、更有针对性的火焰识别与灭火控制。

技术标签：

- Embedded System
- Sensor Integration
- Fire-YOLO
- Image Recognition
- Robot Control

展示重点：

- 硬件与软件选型
- 模块通信与协同
- 火焰检测算法
- 灭火效率提升

项目 2：

名称：

> 基于嵌入式智能 AI 的电子导盲装置

角色：

> 项目核心成员

时间：

> 2024.04 - 2024.08

摘要：

> 基于 YOLOv5-Lite 训练目标识别模型，并部署到 RK3566 开发板，结合 STM32 主控与电机驱动模块，为视障人士提供辅助感知能力。

技术标签：

- YOLOv5-Lite
- RK3566
- STM32
- Model Deployment
- Motor Driver
- Assistive Device

展示重点：

- 轻量化模型训练与优化
- 嵌入式 AI 部署
- STM32 主控系统搭建
- 硬件模块测试

### 4.3 技术能力

建议用四组能力块，不要做成普通技能条。

Embedded：

- STM32
- ARM
- UART / I2C / SPI
- Sensor Integration
- Motor Control

AI：

- YOLOv5-Lite
- Fire-YOLO
- Image Recognition
- Model Optimization
- Edge AI Deployment

Software：

- C / C++
- Data Structures
- Linux
- Multi-threading Basics
- Debugging

Engineering：

- Hardware-Software Integration
- Project Documentation
- Team Collaboration
- Research Proposal Writing
- Project Leadership

### 4.4 经历与成果

建议用横向时间线或 Apple 风的数字卡片。

可展示数字：

- 2 个重点 AI + 嵌入式项目
- 多项创新创业训练计划立项
- 挑战杯科技发明制作类三等奖
- 电子协会技术部部长
- 学生主席经历

内容来源：

- 2022-2023 佛山大学电子设计大赛二等奖
- 2023 年大学生创新创业训练计划校级立项，项目负责人
- 2024 年大学生创新创业训练计划省级立项
- 2023、2024 年实验室开放创新基金立项，项目负责人
- 2024 年佛山大学挑战杯科技发明制作类三等奖
- 2023、2024 年优秀学生干部

### 4.5 博客入口

标题：

中文：

> 技术笔记

副标题：

> 记录嵌入式开发、AI 部署与项目复盘。

英文：

> Technical Notes

Subtitle:

> Notes on embedded development, AI deployment, and project retrospectives.

第一版占位文章建议：

1. 将 YOLOv5-Lite 部署到 RK3566 的实践记录
2. STM32 主控模块在智能硬件项目中的职责
3. 从智能灭火机器人项目看嵌入式系统集成

### 4.6 联系方式

中文：

> 联系我

说明：

> 如果你对我的项目、技术经历或岗位匹配感兴趣，欢迎联系我。

公开联系方式：

- 电话 / 微信：13433841774
- 邮箱：2034821101@qq.com
- 地址：广东省佛山市

后期可添加：

- GitHub
- Gitee
- LinkedIn
- B站
- 小红书

## 5. 中英双语策略

建议使用站内语言切换，不做两个完全独立网站。

默认语言：

- 如果面向国内招聘，可以默认中文。
- 如果后期投海外或国际团队，可以默认英文。

第一版推荐：

- 默认中文
- 右上角提供 CN / EN 切换
- 项目、博客、按钮、导航都支持双语字段

导航示例：

中文：

- 首页
- 项目
- 博客
- 关于
- 联系

英文：

- Home
- Projects
- Blog
- About
- Contact

## 6. 内容管理方案

第一版建议技术路线：

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- MDX
- 内容文件本地管理

原因：

- 后期容易修改
- 适合博客和项目详情
- 不需要数据库
- 容易部署到 Vercel
- 以后可以升级到 CMS

建议内容目录：

```text
content/
  projects/
    fire-fighting-robot.mdx
    ai-guide-device.mdx
  posts/
    yolo-rk3566-deployment.mdx
    stm32-control-module.mdx
    embedded-system-integration.mdx
  profile/
    zh.json
    en.json
```

项目 MDX 字段建议：

```yaml
title: 智能灭火机器人系统
titleEn: Intelligent Fire-Fighting Robot System
date: 2023.06 - 2024.06
role: 项目负责人
roleEn: Project Lead
tags:
  - Embedded System
  - Fire-YOLO
  - Image Recognition
  - Robot Control
featured: true
```

博客 MDX 字段建议：

```yaml
title: 将 YOLOv5-Lite 部署到 RK3566 的实践记录
titleEn: Deploying YOLOv5-Lite on RK3566
date: 2026-05-29
category: AI Deployment
tags:
  - YOLOv5-Lite
  - RK3566
  - Embedded AI
```

## 7. 动效设计

推荐动效：

- 首屏标题缓慢淡入
- 背景科技视觉轻微位移
- 项目卡片滚动进入时淡入上移
- 技术标签 hover 时轻微发光或边框变化
- 页面切换时使用轻量过渡
- 博客卡片 hover 时产生细微位移

避免：

- 过度炫酷的粒子背景
- 大量复杂 3D 动画
- 影响阅读的闪烁和高速移动
- 颜色过多导致廉价科技感

## 8. 第一版页面文案草案

### 中文 Hero

陈杰辉

嵌入式软件开发与 AI 应用开发

专注于嵌入式系统、AI 模型部署与智能硬件应用，将算法能力落到真实设备与项目场景中。

### 英文 Hero

Jiehui Chen

Embedded Software & AI Application Developer

Building intelligent embedded systems that connect software, hardware, and AI in practical scenarios.

### 中文 About

我来自佛山大学电子信息工程专业，主要关注嵌入式系统、智能硬件与 AI 应用开发。我的项目经历覆盖机器人系统、图像识别、开发板部署、STM32 主控模块与多传感器协同，擅长在软硬件结合的场景中推进项目从原型到落地。

### 英文 About

I studied Electronic Information Engineering at Foshan University, with a focus on embedded systems, intelligent hardware, and AI application development. My project experience spans robotics, image recognition, edge model deployment, STM32-based control modules, and multi-sensor integration.

## 9. 后续开发优先级

第一阶段：可运行原型

- Next.js 项目初始化
- 首页视觉与响应式布局
- 中英双语切换
- 项目内容 MDX
- 博客列表与文章详情
- About / Contact 页面

第二阶段：视觉强化

- 科技感占位图
- Hero 动效
- 项目详情页视觉升级
- 移动端细节优化

第三阶段：内容完善

- 添加真实项目图片
- 添加代码仓库链接
- 添加更多博客文章
- 添加 PDF 简历下载

第四阶段：后台升级

- 接入 TinaCMS 或 Decap CMS
- 网页后台编辑项目和博客
- 图片上传与管理

## 10. 总结

这个网站的核心不是“堆功能”，而是建立一个清晰、可信、长期可维护的个人技术作品集。

第一版应该重点完成：

- Apple 风第一印象
- 嵌入式 + AI 的专业定位
- 两个重点项目的高级展示
- 可持续更新的博客系统
- 中英双语能力
- 后期容易维护和扩展的技术结构
