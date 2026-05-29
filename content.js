export const content = {
  zh: {
    nav: {
      projects: "项目",
      stack: "能力",
      blog: "博客",
      about: "关于",
      contact: "联系"
    },
    hero: {
      eyebrow: "Embedded AI Portfolio",
      title: "陈杰辉",
      subtitle: "嵌入式软件开发 / 边缘 AI 应用开发",
      intro: "以 C/C++、STM32、Linux 与边缘 AI 部署为核心能力，参与智能硬件项目从需求拆解、模块联调到原型验证的完整过程。",
      ctaProjects: "查看项目",
      ctaNotes: "阅读博客",
      metric: "从算法到设备"
    },
    proofData: [
      ["2", "AI + 嵌入式重点项目"],
      ["STM32", "主控、通信与外设联调"],
      ["YOLO", "轻量化识别模型部署"],
      ["Linux", "开发板环境与调试基础"]
    ],
    spotlight: {
      eyebrow: "Focus",
      title: "把 AI 能力落到真实硬件系统中。",
      body: "我关注的不是单点算法展示，而是算法、主控、传感器、执行机构与通信链路之间的协同。项目中更看重模块边界清晰、调试路径明确、系统能够稳定演示和持续迭代。"
    },
    principles: {
      eyebrow: "Engineering Direction",
      title: "关注可部署、可协同、可验证的智能硬件系统。"
    },
    principlesData: [
      {
        title: "边缘部署",
        body: "将轻量化识别模型适配到开发板环境，关注推理效率、资源占用与实际场景可用性。"
      },
      {
        title: "软硬件协同",
        body: "围绕 STM32 主控、传感器、通信协议和执行机构建立清晰的数据流与控制流。"
      },
      {
        title: "系统验证",
        body: "通过模块测试、联调和项目文档沉淀，让原型能够被复现、解释和继续优化。"
      }
    ],
    projects: {
      eyebrow: "Featured Projects",
      title: "用案例展示工程判断，而不只是罗列技术栈。",
      labels: {
        challenge: "项目挑战",
        responsibility: "我的职责",
        outcome: "结果沉淀",
        verifiedFacts: "已确认信息",
        materials: "后续材料",
        status: "素材说明"
      }
    },
    stack: {
      eyebrow: "Tech Stack",
      title: "围绕嵌入式 AI 项目建立的能力结构。"
    },
    process: {
      eyebrow: "Workflow",
      title: "用工程流程把项目从想法推进到可演示原型。"
    },
    processData: [
      ["01", "需求拆解", "明确项目目标、硬件输入输出、算法职责和演示场景。"],
      ["02", "模块实现", "分别推进模型训练、主控程序、传感器接入和执行机构测试。"],
      ["03", "系统联调", "定位通信、时序、识别结果与控制逻辑之间的问题。"],
      ["04", "复盘沉淀", "整理项目文档、技术路线和后续可优化方向。"]
    ],
    achievements: {
      eyebrow: "Experience",
      title: "项目、竞赛与组织经验共同支撑工程执行力。"
    },
    notes: {
      eyebrow: "Technical Notes",
      title: "记录嵌入式开发、AI 部署与项目复盘。"
    },
    about: {
      eyebrow: "About",
      title: "电子信息工程背景，聚焦嵌入式系统与边缘 AI。",
      body: "我来自佛山大学电子信息工程专业，长期参与智能硬件与嵌入式项目实践。相比只完成单个模块，我更关注系统如何协同运行：模型如何部署到开发板、主控如何组织外设与执行机构、传感器数据如何进入控制链路，以及项目如何通过文档和测试持续迭代。",
      educationLabel: "教育背景",
      education: "佛山大学 · 电子信息工程 · 本科"
    },
    contact: {
      eyebrow: "Contact",
      title: "欢迎交流项目、岗位与技术方向。",
      location: "广东省佛山市",
      social: "GitHub / Gitee / LinkedIn 等链接可后续添加。"
    },
    footer: {
      back: "回到顶部"
    },
    projectsData: [
      {
        title: "智能灭火机器人系统",
        role: "项目负责人",
        date: "2023.06 - 2024.06",
        image: "./public/assets/fire-fighting-robot-render.png",
        imageAlt: "智能灭火机器人系统的工程样机视觉化渲染图",
        status: "项目视觉化渲染，非真实实物照片",
        summary:
          "面向火情预警与自动灭火场景，参与机器人硬件/软件方案选型，集成嵌入式系统、传感器与图像识别模块，并围绕 Fire-YOLO 火焰检测结果构建更明确的控制链路。",
        challenge: "多模块之间存在通信、协同和稳定性问题，传统检测方式响应不够及时，灭火动作缺少针对性。",
        responsibility: "负责项目推进、模块集成与联调，参与硬件和软件选型，协调传感器、识别模块与灭火执行机构之间的数据流。",
        outcome: "形成可演示的机器人系统方案，提升火焰识别与灭火控制的联动效率，为后续优化检测精度和运动控制留下清晰接口。",
        highlights: ["系统集成", "项目负责", "火焰检测", "传感器协同"],
        metrics: ["项目负责人", "2023.06 - 2024.06", "Fire-YOLO 火焰检测", "嵌入式系统与传感器集成"],
        evidence: ["实物照片待补充", "演示视频待补充", "代码仓库待补充"],
        tags: ["Embedded System", "Sensor Integration", "Fire-YOLO", "Image Recognition", "Robot Control"]
      },
      {
        title: "基于嵌入式智能 AI 的电子导盲装置",
        role: "项目核心成员",
        date: "2024.04 - 2024.08",
        image: "./public/assets/ai-guide-device-render.png",
        imageAlt: "嵌入式智能 AI 电子导盲装置的工程样机视觉化渲染图",
        status: "项目视觉化渲染，非真实实物照片",
        summary:
          "围绕视障人士辅助出行场景，使用 YOLOv5-Lite 训练目标识别模型并部署到 RK3566 开发板，同时参与 STM32 主控系统和电机驱动模块测试。",
        challenge: "需要在嵌入式开发板上运行目标识别能力，并让识别结果能够与主控和执行模块形成稳定协同。",
        responsibility: "负责模型训练、轻量化部署相关工作，参与硬件系统搭建，完成 STM32 主控模块与电机驱动等模块测试。",
        outcome: "实现板端目标识别能力与硬件控制模块的结合，为辅助感知、提示和行动反馈提供项目基础。",
        highlights: ["边缘 AI 部署", "RK3566", "STM32 主控", "目标识别"],
        metrics: ["项目核心成员", "2024.04 - 2024.08", "YOLOv5-Lite 模型训练", "RK3566 部署", "STM32 主控与电机驱动测试"],
        evidence: ["实物照片待补充", "演示视频待补充", "代码仓库待补充"],
        tags: ["YOLOv5-Lite", "RK3566", "STM32", "Model Deployment", "Motor Driver", "Assistive Device"]
      }
    ],
    stacks: [
      {
        title: "Embedded",
        items: ["STM32 主控开发", "ARM 体系结构基础", "UART / I2C / SPI 通信", "传感器接入与联调", "电机驱动模块测试"]
      },
      {
        title: "AI",
        items: ["YOLOv5-Lite 训练", "Fire-YOLO 火焰检测", "图像识别任务理解", "模型轻量化思路", "边缘端部署实践"]
      },
      {
        title: "Software",
        items: ["C / C++ 编程", "数据结构与算法基础", "Linux 常用命令", "多线程程序基础", "调试与问题定位"]
      },
      {
        title: "Engineering",
        items: ["软硬件系统集成", "项目申请与技术文档", "团队协作与任务拆解", "项目汇报与阶段复盘"]
      }
    ],
    achievementsData: [
      ["2024", "大学生创新创业训练计划省级立项；佛山大学挑战杯科技发明制作类三等奖。"],
      ["2023", "大学生创新创业训练计划校级立项，担任项目负责人并推进项目申请、会议组织和阶段汇报。"],
      ["2023-2024", "实验室开放创新基金、学术基金项目立项；连续获得优秀学生干部。"],
      ["2023-2024", "担任佛山大学电子协会技术部部长、电子信息工程学院学生主席，负责组织协调与团队管理工作。"],
      ["2022-2023", "佛山大学电子设计大赛二等奖；暑期三下乡校级、省级重点立项。"]
    ],
    notesData: [
      {
        title: "将 YOLOv5-Lite 部署到 RK3566 的实践记录",
        date: "Draft",
        summary: "记录轻量化模型训练、部署链路、板端推理与性能优化思路。"
      },
      {
        title: "STM32 主控模块在智能硬件项目中的职责",
        date: "Draft",
        summary: "梳理主控、传感器、电机驱动与上位算法模块之间的协作边界。"
      },
      {
        title: "从灭火机器人项目看嵌入式系统集成",
        date: "Draft",
        summary: "复盘模块通信、系统稳定性、算法检测与执行机构之间的工程取舍。"
      }
    ]
  },
  en: {
    nav: {
      projects: "Projects",
      stack: "Stack",
      blog: "Blog",
      about: "About",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Embedded AI Portfolio",
      title: "Jiehui Chen",
      subtitle: "Embedded Software / Edge AI Application Developer",
      intro: "Focused on C/C++, STM32, Linux, and edge AI deployment, with hands-on experience across requirement breakdown, module integration, and prototype validation for intelligent hardware systems.",
      ctaProjects: "View Projects",
      ctaNotes: "Read Notes",
      metric: "From model to device"
    },
    proofData: [
      ["2", "Featured AI + embedded projects"],
      ["STM32", "Control, communication, and peripherals"],
      ["YOLO", "Lightweight vision model deployment"],
      ["Linux", "Board-side development and debugging"]
    ],
    spotlight: {
      eyebrow: "Focus",
      title: "Bringing AI capability into real hardware systems.",
      body: "My focus is not only on standalone algorithms, but on how models, control modules, sensors, actuators, and communication links work together. I care about clear module boundaries, practical debugging paths, stable demos, and systems that can keep evolving."
    },
    principles: {
      eyebrow: "Engineering Direction",
      title: "Designing intelligent hardware systems that are deployable, coordinated, and verifiable."
    },
    principlesData: [
      {
        title: "Edge Deployment",
        body: "Adapting lightweight recognition models to development-board environments with attention to inference efficiency, resource usage, and real-world usability."
      },
      {
        title: "Hardware-Software Integration",
        body: "Building clear data and control flows around STM32, sensors, communication protocols, and actuator modules."
      },
      {
        title: "System Validation",
        body: "Using module tests, integration debugging, and project documentation to make prototypes explainable, repeatable, and easier to improve."
      }
    ],
    projects: {
      eyebrow: "Featured Projects",
      title: "Case studies that show engineering judgment, not just a list of tools.",
      labels: {
        challenge: "Challenge",
        responsibility: "Responsibility",
        outcome: "Outcome",
        verifiedFacts: "Verified facts",
        materials: "Materials to add",
        status: "Asset note"
      }
    },
    stack: {
      eyebrow: "Tech Stack",
      title: "A capability structure built around embedded AI projects."
    },
    process: {
      eyebrow: "Workflow",
      title: "Moving from ideas to demonstrable prototypes through an engineering workflow."
    },
    processData: [
      ["01", "Requirement Breakdown", "Clarify project goals, hardware I/O, algorithm responsibilities, and demo scenarios."],
      ["02", "Module Implementation", "Work on model training, control logic, sensor access, and actuator testing in parallel."],
      ["03", "System Integration", "Debug communication, timing, recognition outputs, and control logic across modules."],
      ["04", "Retrospective", "Document technical routes, project decisions, and future optimization directions."]
    ],
    achievements: {
      eyebrow: "Experience",
      title: "Projects, competitions, and leadership experience support my engineering execution."
    },
    notes: {
      eyebrow: "Technical Notes",
      title: "Notes on embedded development, AI deployment, and project retrospectives."
    },
    about: {
      eyebrow: "About",
      title: "Electronic information engineering background with a focus on embedded systems and edge AI.",
      body: "I studied Electronic Information Engineering at Foshan University and have been involved in intelligent hardware and embedded system projects. Beyond completing individual modules, I care about how the whole system works together: how models are deployed to boards, how control modules coordinate peripherals and actuators, how sensor data enters the control loop, and how documentation and testing help the project keep improving.",
      educationLabel: "Education",
      education: "Foshan University · Electronic Information Engineering · B.Eng."
    },
    contact: {
      eyebrow: "Contact",
      title: "Open to opportunities, project discussions, and technical exchange.",
      location: "Foshan, Guangdong, China",
      social: "GitHub / Gitee / LinkedIn links can be added later."
    },
    footer: {
      back: "Back to top"
    },
    projectsData: [
      {
        title: "Intelligent Fire-Fighting Robot System",
        role: "Project Lead",
        date: "2023.06 - 2024.06",
        image: "./public/assets/fire-fighting-robot-render.png",
        imageAlt: "Visualized engineering render of the intelligent fire-fighting robot system",
        status: "Visualized project render, not an actual project photo",
        summary:
          "Built around fire warning and automated fire-fighting scenarios, this project integrated embedded systems, sensors, and image recognition modules, using Fire-YOLO detection results to support a clearer control chain.",
        challenge: "The system needed to resolve communication, coordination, and stability issues across modules while improving detection timeliness and targeted fire-fighting behavior.",
        responsibility: "Led project coordination, module integration, and debugging; participated in hardware/software selection and connected sensors, recognition modules, and fire-fighting actuators into a working flow.",
        outcome: "Produced a demonstrable robot system direction with improved linkage between flame recognition and fire-fighting control, leaving clearer interfaces for future detection and motion-control optimization.",
        highlights: ["System Integration", "Project Leadership", "Flame Detection", "Sensor Coordination"],
        metrics: ["Project Lead", "2023.06 - 2024.06", "Fire-YOLO flame detection", "Embedded system and sensor integration"],
        evidence: ["Real project photos to add", "Demo video to add", "Code repository to add"],
        tags: ["Embedded System", "Sensor Integration", "Fire-YOLO", "Image Recognition", "Robot Control"]
      },
      {
        title: "Embedded AI Electronic Guide Device",
        role: "Core Member",
        date: "2024.04 - 2024.08",
        image: "./public/assets/ai-guide-device-render.png",
        imageAlt: "Visualized engineering render of the embedded AI electronic guide device",
        status: "Visualized project render, not an actual project photo",
        summary:
          "Designed for assistive mobility scenarios, this project trained a YOLOv5-Lite object detection model for RK3566 deployment and combined it with STM32 control and motor-driver module testing.",
        challenge: "The project required object recognition to run on an embedded board and coordinate reliably with the main control and execution modules.",
        responsibility: "Worked on model training and lightweight deployment, participated in hardware system construction, and tested STM32 control and motor-driver modules.",
        outcome: "Connected board-side recognition capability with hardware control modules, building a foundation for environment perception, prompts, and assistive feedback.",
        highlights: ["Edge AI Deployment", "RK3566", "STM32 Control", "Object Detection"],
        metrics: ["Core Member", "2024.04 - 2024.08", "YOLOv5-Lite model training", "RK3566 deployment", "STM32 control and motor-driver testing"],
        evidence: ["Real project photos to add", "Demo video to add", "Code repository to add"],
        tags: ["YOLOv5-Lite", "RK3566", "STM32", "Model Deployment", "Motor Driver", "Assistive Device"]
      }
    ],
    stacks: [
      {
        title: "Embedded",
        items: ["STM32 control development", "ARM architecture fundamentals", "UART / I2C / SPI communication", "Sensor integration and debugging", "Motor-driver module testing"]
      },
      {
        title: "AI",
        items: ["YOLOv5-Lite training", "Fire-YOLO flame detection", "Image recognition task understanding", "Model lightweighting concepts", "Edge deployment practice"]
      },
      {
        title: "Software",
        items: ["C / C++ programming", "Data structures and algorithms", "Linux command-line workflow", "Multi-threading fundamentals", "Debugging and issue isolation"]
      },
      {
        title: "Engineering",
        items: ["Hardware-software integration", "Research proposals and documentation", "Team collaboration and task breakdown", "Project reporting and retrospectives"]
      }
    ],
    achievementsData: [
      ["2024", "Provincial-level Innovation and Entrepreneurship Training Program; third prize in Foshan University Challenge Cup technology invention category."],
      ["2023", "University-level Innovation and Entrepreneurship Training Program as project lead, covering proposal writing, meeting organization, and progress reporting."],
      ["2023-2024", "Laboratory open innovation fund and academic fund projects; Excellent Student Cadre awards."],
      ["2023-2024", "Technical Department Lead of the Electronics Association and Student Union President of the School of Electronic Information Engineering."],
      ["2022-2023", "Second prize in Foshan University Electronic Design Competition; key university/provincial summer social practice projects."]
    ],
    notesData: [
      {
        title: "Deploying YOLOv5-Lite on RK3566",
        date: "Draft",
        summary: "A practical note on lightweight model training, deployment, board-side inference, and optimization."
      },
      {
        title: "The Role of STM32 Control Modules in Intelligent Hardware",
        date: "Draft",
        summary: "A breakdown of control logic, sensors, motor drivers, and algorithm module boundaries."
      },
      {
        title: "Embedded System Integration in a Fire-Fighting Robot",
        date: "Draft",
        summary: "A retrospective on communication, stability, detection algorithms, and execution mechanisms."
      }
    ]
  }
};
