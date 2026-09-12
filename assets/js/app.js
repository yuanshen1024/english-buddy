(() => {
  "use strict";

  const STORAGE_KEY = "english-buddy-state-v2";
  const NOW = new Date();
  const baseNow = NOW.getTime();
  const APP_BASE = (
    document.querySelector('meta[name="app-base"]')?.getAttribute("content") || ""
  ).replace(/\/+$/, "");
  let BUILTIN_VOCABULARY = [];
  let BUILTIN_WORD_IDS = new Set();

  const iconPaths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    "book-open":
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    graduation:
      '<path d="m2 10 10-5 10 5-10 5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/>',
    library:
      '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    layers:
      '<path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    car:
      '<path d="M5 17h14l1-6-2-5H6l-2 5Z"/><path d="M4 17v3h2v-2h12v2h2v-3"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    notebook:
      '<path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M8 2v20"/><path d="M12 7h5"/><path d="M12 11h5"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    settings:
      '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2 3.46-.08-.02a1.7 1.7 0 0 0-1.9-.1l-.2.12a1.7 1.7 0 0 0-.8 1.6v.1h-4v-.1a1.7 1.7 0 0 0-.8-1.6l-.2-.12a1.7 1.7 0 0 0-1.9.1l-.08.02-2-3.46.06-.06A1.7 1.7 0 0 0 6.6 15v-.2a1.7 1.7 0 0 0-1.33-1.5l-.1-.02v-4l.1-.02A1.7 1.7 0 0 0 6.6 7.8V7.6a1.7 1.7 0 0 0-.34-1.88L6.2 5.66l2-3.46.08.02a1.7 1.7 0 0 0 1.9.1l.2-.12a1.7 1.7 0 0 0 .8-1.6V.5h4v.1a1.7 1.7 0 0 0 .8 1.6l.2.12a1.7 1.7 0 0 0 1.9-.1l.08-.02 2 3.46-.06.06a1.7 1.7 0 0 0-.34 1.88v.2a1.7 1.7 0 0 0 1.33 1.5l.1.02v4l-.1.02a1.7 1.7 0 0 0-1.33 1.5Z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.3-2.9 1.7-2.9 3"/><path d="M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sparkles:
      '<path d="m12 3-1.3 3.7L7 8l3.7 1.3L12 13l1.3-3.7L17 8l-3.7-1.3Z"/><path d="m5 14-.9 2.1L2 17l2.1.9L5 20l.9-2.1L8 17l-2.1-.9Z"/><path d="m19 14-.9 2.1L16 17l2.1.9L19 20l.9-2.1L22 17l-2.1-.9Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
    pin: '<path d="M12 17v5"/><path d="m5 3 14 14"/><path d="M9 3h6l-1 7 3 3H7l3-3Z"/>',
    archive: '<path d="M4 7h16v14H4Z"/><path d="M2 3h20v4H2Z"/><path d="M9 11h6"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m7 7 1 14h8l1-14"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    arrowLeft: '<path d="m15 18-6-6 6-6"/><path d="M21 12H9"/>',
    arrowRight: '<path d="m9 18 6-6-6-6"/><path d="M3 12h12"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    folder: '<path d="M3 5h6l2 2h10v12H3Z"/>',
    tag: '<path d="M20 13 11 22 2 13V2h11Z"/><circle cx="7" cy="7" r="1"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6a8 8 0 0 1 0 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    upload: '<path d="M12 16V3"/><path d="m7 8 5-5 5 5"/><path d="M4 15v6h16v-6"/>',
    wand: '<path d="m15 4 5 5L7 22l-5-5Z"/><path d="m14 5 5 5"/><path d="m6 13 5 5"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 11"/><path d="M5.5 15A7 7 0 0 0 18 17.5l2-4.5"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    highlighter: '<path d="m9 11 4 4"/><path d="M5 15 2 18l4 4 3-3"/><path d="m9 11 8-8 4 4-8 8Z"/>',
    bold: '<path d="M6 4h7a4 4 0 0 1 0 8H6Z"/><path d="M6 12h8a4 4 0 0 1 0 8H6Z"/>',
    italic: '<path d="M10 4h8M6 20h8M14 4 10 20"/>',
    underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 21h16"/>',
    heading: '<path d="M6 4v16M18 4v16M6 12h12"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    quote: '<path d="M3 21c3 0 5-2 5-5V8H2v8h4c0 2-1 3-3 3Z"/><path d="M14 21c3 0 5-2 5-5V8h-6v8h4c0 2-1 3-3 3Z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
    minus: '<path d="M5 12h14"/>',
    panels: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-1.5 9 5-3 5 3-1.5-9"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v7H5a1 1 0 0 1-1-1Z"/><path d="M20 14h-3v7h2a1 1 0 0 0 1-1Z"/>',
    languages: '<path d="M4 5h8M8 3v2c0 4-2 7-5 9"/><path d="M5 9c1.5 2 3.5 3.5 6 5"/><path d="m14 20 4-10 4 10M15.5 17h5"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    flame: '<path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-5 0 2 1 3 2 3 0-3 1-6 1-8Z"/>',
    type: '<path d="M4 6V4h16v2M9 20h6M12 4v16"/>',
    file: '<path d="M6 2h8l4 4v16H6Z"/><path d="M14 2v5h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    thumbsUp: '<path d="M7 10v11H3V10Z"/><path d="M7 19c1 2 3 3 6 3h1a5 5 0 0 0 5-5v-3h2a2 2 0 0 0 2-2l-2-6c-.3-1-1.2-2-2.5-2H15c-1 0-2 1-2 2v3H7Z"/>',
  };

  const icon = (name, className = "") =>
    `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${
      iconPaths[name] || iconPaths.sparkles
    }</svg>`;

  const escapeHTML = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const stripHTML = (value = "") =>
    String(value)
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

  const uid = (prefix = "id") =>
    `${prefix}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

  const daysAgo = (days, hours = 0) =>
    new Date(baseNow - days * 86400000 - hours * 3600000).toISOString();

  const CLOZE_EXAMPLES = [
    { answer: "universe", sentence: "The ______ is very large, and our knowledge of it is still expanding." },
    { answer: "sustainable", sentence: "The city is investing in ______ public transport." },
    { answer: "deadline", sentence: "We need to submit the report before the ______." },
    { answer: "registration", sentence: "______ closes this Friday for new students." },
    { answer: "available", sentence: "Are you ______ for a meeting tomorrow morning?" },
    { answer: "opportunity", sentence: "The exchange program offers an ______ to use English." },
    { answer: "maintain", sentence: "Regular review helps learners ______ their vocabulary." },
    { answer: "significant", sentence: "There has been a ______ improvement in air quality." },
    { answer: "inevitable", sentence: "Some degree of change is ______." },
    { answer: "hypothesis", sentence: "The results support the original ______." },
  ];

  const SHADOWING_SENTENCES = [
    "How do I get to the station?",
    "I would like to improve my English.",
    "The universe is very large and still expanding.",
    "Public policy and individual action can reinforce each other.",
    "Registration closes this Friday, but you need your student card.",
    "The results support the original hypothesis.",
  ];

  const TRANSLATION_DICTIONARY = {
    "我想提高我的英语": "I’d like to improve my English.",
    "我想提高英语": "I want to improve my English.",
    "我怎么去车站": "How do I get to the station?",
    "你明天上午有空吗": "Are you available tomorrow morning?",
    "我想申请退款": "I would like to request a refund.",
    "请给我推荐一家餐厅": "Could you recommend a restaurant?",
    "这有助于提高记忆力": "This helps improve memory.",
    "人工智能正在改变教育": "Artificial intelligence is changing education.",
    "环境保护需要每个人参与": "Environmental protection requires everyone’s participation.",
    "请问注册什么时候截止": "When does registration close?",
    "我不明白这个问题": "I don’t understand this question.",
    "你能再说慢一点吗": "Could you speak more slowly?",
    "这个观点值得进一步讨论": "This idea deserves further discussion.",
    "研究表明睡眠会影响记忆": "Research shows that sleep affects memory.",
    "这项政策有利于可持续发展": "This policy supports sustainable development.",
    "我已经完成今天的学习任务": "I have completed today’s learning tasks.",
    "i would like to improve my english": "我想提高我的英语。",
    "how do i get to the station": "我怎么去车站？",
    "i would like to request a refund": "我想申请退款。",
    "artificial intelligence is changing education": "人工智能正在改变教育。",
    "environmental protection requires everyone's participation": "环境保护需要每个人参与。",
    "research shows that sleep affects memory": "研究表明睡眠会影响记忆。",
  };

  const READING_PASSAGES = [
    {
      id: "passage-station",
      title: "Asking for Directions",
      category: "日常",
      level: "A2",
      minutes: 2,
      english: [
        "Excuse me. How do I get to the station?",
        "Go straight for two blocks and turn left at the traffic lights.",
        "The station will be on your right, next to the public library.",
        "Thank you. How long does it take to walk there?",
        "It should take about ten minutes.",
      ],
      chinese: [
        "打扰一下，我怎么去车站？",
        "直走两个街区，然后在红绿灯处左转。",
        "车站就在你右边，公共图书馆旁边。",
        "谢谢。步行到那里需要多久？",
        "大约需要十分钟。",
      ],
    },
    {
      id: "passage-study",
      title: "Building a Learning Habit",
      category: "学习",
      level: "B1",
      minutes: 3,
      english: [
        "Language learning becomes easier when practice is part of a daily routine.",
        "Short and regular study sessions are usually more effective than occasional long sessions.",
        "Reviewing new words at increasing intervals helps move them into long-term memory.",
        "It is also important to use new vocabulary in speaking and writing.",
        "Progress may be slow, but consistent effort produces meaningful results.",
      ],
      chinese: [
        "当练习成为日常习惯的一部分时，语言学习会变得更容易。",
        "短而规律的学习通常比偶尔进行长时间学习更有效。",
        "按逐渐延长的时间间隔复习新词，有助于把单词转入长期记忆。",
        "在口语和写作中使用新词汇也很重要。",
        "进步可能很慢，但持续努力会带来有意义的结果。",
      ],
    },
    {
      id: "passage-environment",
      title: "Small Actions, Shared Expectations",
      category: "考试",
      level: "B2",
      minutes: 3,
      english: [
        "Many people believe that individual action is too small to affect a global problem.",
        "However, personal habits can shape what governments and companies consider normal.",
        "Individual choices therefore do not replace public policy.",
        "Instead, they can create the social pressure that makes stronger policy possible.",
        "The most effective approach is to make private action and public systems reinforce each other.",
      ],
      chinese: [
        "许多人认为，个人行动太小，无法影响全球性问题。",
        "然而，个人习惯可以改变政府和企业眼中的常态。",
        "因此，个人选择不会替代公共政策。",
        "相反，它们可以形成推动更强政策的社会压力。",
        "最有效的方法，是让个人行动与公共制度彼此促进。",
      ],
    },
    {
      id: "passage-ai",
      title: "AI and Independent Learning",
      category: "学术",
      level: "B2",
      minutes: 4,
      english: [
        "Artificial intelligence can provide immediate feedback and personalized practice.",
        "However, access to more information does not automatically produce better learning.",
        "Learners still need clear goals and the ability to judge the quality of information.",
        "AI is most useful when it supports reflection rather than replacing it.",
        "The aim is not to depend on the tool, but to become a more independent learner.",
      ],
      chinese: [
        "人工智能可以提供即时反馈和个性化练习。",
        "然而，获得更多信息并不会自动带来更好的学习。",
        "学习者仍然需要明确目标，以及判断信息质量的能力。",
        "当 AI 支持反思而不是替代反思时，它才最有价值。",
        "目标不是依赖工具，而是成为更独立的学习者。",
      ],
    },
    {
      id: "passage-sleep",
      title: "Sleep and Memory",
      category: "学术",
      level: "C1",
      minutes: 4,
      english: [
        "Sleep plays an active role in memory consolidation.",
        "During sleep, the brain reorganizes recently learned information.",
        "This process can make knowledge easier to retrieve later.",
        "Students who regularly lose sleep may therefore struggle with recall.",
        "A consistent sleep schedule can be as important as repeated study.",
      ],
      chinese: [
        "睡眠在记忆巩固中发挥着积极作用。",
        "睡眠期间，大脑会重新组织最近学习的信息。",
        "这一过程可以让知识在之后更容易被提取。",
        "因此，经常睡眠不足的学生可能在回忆信息时遇到困难。",
        "规律的睡眠时间表可能与反复学习同样重要。",
      ],
    },
    {
      id: "passage-career",
      title: "Communicating at Work",
      category: "商务",
      level: "B1",
      minutes: 3,
      english: [
        "Clear communication is essential in a successful team.",
        "Before a meeting, decide what result you want to achieve.",
        "Listen carefully and ask questions when something is unclear.",
        "When you disagree, explain your reasoning rather than simply rejecting an idea.",
        "Good communication turns different opinions into better decisions.",
      ],
      chinese: [
        "清晰的沟通对一个成功的团队至关重要。",
        "开会前，先确定你希望取得什么结果。",
        "认真倾听，并在不清楚时提出问题。",
        "当你不同意时，解释你的理由，而不是简单否定一个想法。",
        "良好的沟通能把不同意见转化为更好的决策。",
      ],
    },
    {
      id: "passage-technology",
      title: "Technology and Everyday Attention",
      category: "科技",
      level: "B2",
      minutes: 4,
      english: [
        "Digital tools are designed to make daily tasks faster and more convenient.",
        "At the same time, many applications compete for a user’s limited attention.",
        "Notifications can interrupt deep thinking even when a person does not respond immediately.",
        "A healthier approach is to decide in advance when technology should be available.",
        "Attention is easier to protect when people set clear boundaries.",
      ],
      chinese: [
        "数字工具的设计目标是让日常任务更快、更方便。",
        "与此同时，许多应用都在争夺用户有限的注意力。",
        "即使一个人没有立即回应，通知也可能打断深度思考。",
        "更健康的方法是提前决定什么时候可以使用科技产品。",
        "当人们设定清晰边界时，注意力会更容易得到保护。",
      ],
    },
    {
      id: "passage-health",
      title: "Movement and Long-Term Health",
      category: "健康",
      level: "B1",
      minutes: 3,
      english: [
        "Regular movement supports both physical and mental health.",
        "It does not always require a long workout or special equipment.",
        "Walking, stretching and taking short movement breaks can all make a difference.",
        "The most useful routine is one that is realistic enough to repeat.",
        "Consistency matters more than a single intense effort.",
      ],
      chinese: [
        "规律活动有助于身心健康。",
        "它并不总是需要长时间锻炼或特殊设备。",
        "散步、拉伸和短暂活动休息都能产生作用。",
        "最有用的习惯，是现实到足以重复执行的习惯。",
        "持续比一次高强度努力更重要。",
      ],
    },
    {
      id: "passage-culture",
      title: "Understanding Cultural Differences",
      category: "文化",
      level: "B2",
      minutes: 4,
      english: [
        "Culture influences how people communicate and interpret behavior.",
        "A direct style may seem efficient in one context and impolite in another.",
        "Misunderstandings often happen when people assume that their own expectations are universal.",
        "Asking questions can be more useful than making quick judgments.",
        "Cultural awareness grows through observation, patience and reflection.",
      ],
      chinese: [
        "文化会影响人们沟通和解读行为的方式。",
        "直接风格在一种情境中可能显得高效，在另一种情境中却可能显得无礼。",
        "当人们把自己国家的期待当成普遍规则时，就容易产生误解。",
        "提问往往比快速下结论更有帮助。",
        "文化意识通过观察、耐心和反思逐渐形成。",
      ],
    },
    {
      id: "passage-environment-policy",
      title: "From Personal Choice to Public Change",
      category: "环境",
      level: "C1",
      minutes: 4,
      english: [
        "Environmental progress depends on both personal choices and institutional action.",
        "Individual habits can signal demand for cleaner products and stronger standards.",
        "Policy, however, can change entire systems much faster than isolated choices.",
        "The two levels of action are most effective when they support each other.",
        "Evidence-based policy can turn widespread concern into measurable change.",
      ],
      chinese: [
        "环境进步既依赖个人选择，也依赖制度行动。",
        "个人习惯可以表达对更清洁产品和更严格标准的需求。",
        "不过，政策改变整个系统的速度远快于孤立的选择。",
        "当两个层面的行动互相支持时，效果最好。",
        "基于证据的政策可以把广泛担忧转化为可衡量的改变。",
      ],
    },
    {
      id: "passage-auto-service",
      title: "Diagnosing an Engine Warning Light",
      category: "汽车",
      level: "B1",
      minutes: 4,
      english: [
        "When the engine warning light appears, the vehicle may have stored a diagnostic trouble code.",
        "A technician connects a scan tool to the diagnostic connector and reads the fault code.",
        "The code identifies the affected system, but it does not always identify the failed component.",
        "The technician then checks live sensor data, wiring and mechanical condition.",
        "After the repair, the system is tested again to confirm that the fault has been cleared.",
      ],
      chinese: [
        "当发动机故障灯亮起时，车辆可能已经存储了诊断故障码。",
        "维修技师将诊断仪连接到诊断接口并读取故障码。",
        "故障码可以指出受影响的系统，但不一定直接指出损坏的部件。",
        "随后技师需要检查传感器实时数据、线路和机械状况。",
        "维修完成后，需要再次测试系统，确认故障已经排除。",
      ],
    },
    {
      id: "passage-auto-ev",
      title: "Electric Vehicle Charging",
      category: "汽车",
      level: "B2",
      minutes: 4,
      english: [
        "Electric vehicles store energy in a high-voltage battery pack.",
        "The battery management system monitors voltage, temperature and state of charge.",
        "Fast charging reduces charging time but can increase thermal stress on the battery.",
        "Vehicle-to-grid technology may allow electric cars to support the power grid.",
        "Charging performance depends on the vehicle, charger and battery condition.",
      ],
      chinese: [
        "电动汽车将能量储存在高压电池包中。",
        "电池管理系统会监测电压、温度和荷电状态。",
        "快速充电可以缩短充电时间，但可能增加电池的热压力。",
        "车辆到电网技术可以让电动汽车为电网提供支持。",
        "充电性能取决于车辆、充电设备和电池状态。",
      ],
    },
    {
      id: "passage-auto-adas",
      title: "Driver Assistance Systems",
      category: "汽车",
      level: "B2",
      minutes: 4,
      english: [
        "Advanced driver assistance systems use cameras, radar and other sensors to understand the road.",
        "Adaptive cruise control can adjust speed to maintain a safe distance from the vehicle ahead.",
        "Lane keeping assistance monitors lane markings and can provide steering support.",
        "These systems assist the driver, but they do not replace driver responsibility.",
        "Clear sensor data and reliable software are essential for safe operation.",
      ],
      chinese: [
        "高级驾驶辅助系统使用摄像头、雷达和其他传感器理解道路环境。",
        "自适应巡航控制可以调整车速，与前车保持安全距离。",
        "车道保持辅助会监测车道线，并提供转向支持。",
        "这些系统辅助驾驶员，但不能替代驾驶员责任。",
        "清晰的传感器数据和可靠的软件对安全运行至关重要。",
      ],
    },
    {
      id: "passage-auto-manufacturing",
      title: "Vehicle Manufacturing and Quality",
      category: "汽车",
      level: "C1",
      minutes: 5,
      english: [
        "Vehicle manufacturing combines stamping, welding, painting and final assembly.",
        "Automotive engineers use computer-aided design and simulation before a prototype is built.",
        "Tolerance control is critical because small variations can affect fit, safety and performance.",
        "Assembly-line workers and automated systems follow standardized work instructions.",
        "Quality control continues through production, testing and after-sales feedback.",
      ],
      chinese: [
        "汽车制造包括冲压、焊接、涂装和总装。",
        "汽车工程师会在制造样车之前使用计算机辅助设计和仿真。",
        "公差控制非常关键，因为微小偏差会影响装配、安全性和性能。",
        "装配线员工和自动化系统按照标准化作业指导书操作。",
        "质量控制贯穿生产、测试和售后反馈全过程。",
      ],
    },
  ];

  const DAILY_ENGLISH_CONTENT = [
    {
      english: "Small steps every day lead to big changes.",
      chinese: "每天迈出一小步，最终会带来巨大的改变。",
      type: "学习动力",
      note: "lead to 表示“导致；带来”，后面接名词或动名词。",
    },
    {
      english: "Could you say that again in another way?",
      chinese: "你能换一种方式再说一遍吗？",
      type: "课堂口语",
      note: "in another way 是请求换一种表达方式的自然说法。",
    },
    {
      english: "I’m not sure I follow your point.",
      chinese: "我不太确定自己是否理解了你的观点。",
      type: "讨论表达",
      note: "比 I don’t understand 更委婉，适合会议和课堂讨论。",
    },
    {
      english: "The evidence suggests a different conclusion.",
      chinese: "这些证据指向一个不同的结论。",
      type: "学术表达",
      note: "suggest 在这里表示“表明；暗示”，常用于学术写作。",
    },
    {
      english: "We need to weigh the benefits against the costs.",
      chinese: "我们需要权衡收益与成本。",
      type: "写作表达",
      note: "weigh A against B 表示“权衡 A 与 B”。",
    },
    {
      english: "Would you mind speaking a little more slowly?",
      chinese: "你介意说得再慢一点吗？",
      type: "听力沟通",
      note: "Would you mind + doing 是礼貌请求的常用结构。",
    },
    {
      english: "The findings are consistent with previous research.",
      chinese: "这些发现与先前的研究一致。",
      type: "文献阅读",
      note: "be consistent with 表示“与……一致”。",
    },
    {
      english: "I’d like to add one more point.",
      chinese: "我想再补充一点。",
      type: "商务口语",
      note: "适合会议中承接讨论并增加自己的观点。",
    },
    {
      english: "It depends on how we define success.",
      chinese: "这取决于我们如何定义成功。",
      type: "观点表达",
      note: "depend on 后面可接名词、代词或由 how/what 引导的从句。",
    },
    {
      english: "Practice becomes easier when it becomes a habit.",
      chinese: "当练习成为习惯时，它就会变得更容易。",
      type: "学习方法",
      note: "when 引导时间状语从句，两个 becomes 形成结构呼应。",
    },
    {
      english: "The main advantage is that it saves time.",
      chinese: "主要优点是它可以节省时间。",
      type: "议论文句型",
      note: "The main advantage is that… 适合说明观点或优点。",
    },
    {
      english: "Let’s review what we learned yesterday.",
      chinese: "让我们复习一下昨天学过的内容。",
      type: "课堂用语",
      note: "what we learned yesterday 是名词性从句，作 review 的宾语。",
    },
  ];

  const defaultState = {
    notes: [
      {
        id: "note-cet4-environment",
        title: "CET-4 阅读：环境保护",
        summary:
          "文章讨论个人行动与环保政策之间的关系，重点整理转折词和作者态度。",
        body:
          "<p>文章的核心观点是：<strong>个人行动有意义，但系统性政策同样重要。</strong></p><h3>重点词</h3><p><strong>sustainable</strong> = 可持续的<br><strong>emission</strong> = 排放</p><blockquote>The real challenge is not choosing between individual action and public policy, but making them reinforce each other.</blockquote><p>真正的挑战不是二选一，而是让个人行动与公共政策彼此促进。</p>",
        category: "exam",
        tags: ["CET-4", "阅读", "环保"],
        updatedAt: daysAgo(0, 2),
        createdAt: daysAgo(3),
        favorite: true,
        pinned: true,
        important: true,
        reviewAt: new Date(baseNow + 3600000 * 6).toISOString(),
        reviewCards: [
          {
            front: "What does “sustainable” mean?",
            back: "可持续的",
          },
          {
            front: "Please paraphrase: individual action and public policy",
            back: "个人行动与公共政策",
          },
        ],
      },
      {
        id: "note-universe",
        title: "Universe：宇宙与尺度",
        summary:
          "universe / very large / expand 三个高频表达，以及一个可用于口语的例句。",
        body:
          '<h2>Universe</h2><h3>单词</h3><p><strong>universe</strong><br>宇宙</p><h3>例句</h3><p class="english-text">The universe is very large.</p><h3>重点</h3><p><strong>very large</strong> = 非常大</p>',
        category: "vocabulary",
        tags: ["词汇", "天文", "例句"],
        updatedAt: daysAgo(0, 5),
        createdAt: daysAgo(1),
        favorite: false,
        pinned: true,
        important: true,
        reviewAt: new Date(baseNow + 86400000).toISOString(),
        reviewCards: [
          { front: "What does “universe” mean?", back: "宇宙" },
          { front: "How do you say “非常大”?", back: "very large" },
          { front: "The universe is very large.", back: "宇宙非常大。" },
        ],
      },
      {
        id: "note-station",
        title: "问路口语：How do I get to…?",
        summary:
          "get to 表示“到达”，问路时比 Where is 更自然、更完整。",
        body:
          '<div class="english-block"><div class="english-block-header">English</div><div class="english-block-row"><label>English</label><div class="english-text">How do I get to the station?</div></div><div class="english-block-row"><label>中文</label><div>我怎么去车站？</div></div><div class="english-block-row"><label>Notes</label><div><strong>get to</strong> = 到达；抵达</div></div></div><p><strong>使用场景：</strong>向陌生人问路，语气自然礼貌。</p>',
        category: "speaking",
        tags: ["口语", "问路", "短语"],
        updatedAt: daysAgo(1, 1),
        createdAt: daysAgo(4),
        favorite: true,
        pinned: false,
        important: false,
        reviewAt: new Date(baseNow + 3 * 86400000).toISOString(),
        reviewCards: [
          {
            front: "How do you naturally ask how to reach a place?",
            back: "How do I get to…?",
          },
        ],
      },
      {
        id: "note-listening-ielts",
        title: "听力场景：校园注册",
        summary:
          "registration、student card、deadline 等注册场景高频词与连读提示。",
        body:
          "<h3>场景词</h3><ul><li><strong>registration</strong> 注册</li><li><strong>student card</strong> 学生证</li><li><strong>deadline</strong> 截止日期</li></ul><p>注意 <em>registration office</em> 中 t 的弱读。</p>",
        category: "listening",
        tags: ["听力", "校园", "场景词"],
        updatedAt: daysAgo(2),
        createdAt: daysAgo(6),
        favorite: false,
        pinned: false,
        important: true,
        reviewAt: new Date(baseNow + 7 * 86400000).toISOString(),
        reviewCards: [
          { front: "registration", back: "注册；登记" },
          { front: "deadline", back: "截止日期" },
        ],
      },
      {
        id: "note-writing",
        title: "作文开头：减少无意义铺垫",
        summary:
          "用清晰立场开头，避免 In modern society 这类空泛表达。",
        body:
          '<p>不要写：<br><em>With the development of modern society...</em></p><p>可以写：<br><strong>Public libraries still matter because they make knowledge accessible to everyone.</strong></p><p>先给立场，再给理由。</p>',
        category: "writing",
        tags: ["作文", "写作", "句式"],
        updatedAt: daysAgo(3, 2),
        createdAt: daysAgo(8),
        favorite: true,
        pinned: false,
        important: false,
        reviewAt: null,
        reviewCards: [
          {
            front: "Avoid an empty essay opening. Give an example.",
            back: "Public libraries still matter because they make knowledge accessible to everyone.",
          },
        ],
      },
      {
        id: "note-grammar",
        title: "语法：not…but… 的平行结构",
        summary:
          "连接的两个部分应保持相同语法形式，尤其注意名词、动词和介词短语。",
        body:
          "<p><strong>结构：</strong>not A but B</p><p>The problem is <strong>not</strong> a lack of time <strong>but</strong> a lack of focus.</p><p>问题不是缺少时间，而是缺少专注。</p>",
        category: "grammar",
        tags: ["语法", "平行结构", "长难句"],
        updatedAt: daysAgo(5),
        createdAt: daysAgo(10),
        favorite: false,
        pinned: false,
        important: false,
        reviewAt: new Date(baseNow - 3600000 * 5).toISOString(),
        reviewCards: [
          {
            front: "What should follow “not A but B”?",
            back: "A and B should have parallel grammatical forms.",
          },
        ],
      },
    ],
    categories: [
      { id: "vocabulary", name: "单词笔记", icon: "type" },
      { id: "grammar", name: "语法笔记", icon: "heading" },
      { id: "speaking", name: "口语笔记", icon: "mic" },
      { id: "listening", name: "听力笔记", icon: "headphones" },
      { id: "reading", name: "阅读笔记", icon: "book-open" },
      { id: "writing", name: "作文笔记", icon: "edit" },
      { id: "exam", name: "考试笔记", icon: "graduation" },
      { id: "literature", name: "文献笔记", icon: "library" },
      { id: "class", name: "课堂笔记", icon: "notebook" },
      { id: "other", name: "其他", icon: "folder" },
    ],
    words: [
      {
        id: "word-universe",
        word: "universe",
        phonetic: "/ˈjuːnɪvɜːrs/",
        part: "noun",
        meaning: "宇宙；万物；领域",
        example:
          "The universe is very large, and our knowledge of it is still expanding.",
        translation: "宇宙非常广阔，我们对它的认识仍在不断扩展。",
        deck: "CET-4",
        mastery: 72,
        tags: ["天文", "核心词"],
        source: "CET-4 核心词汇",
        noteId: "note-universe",
      },
      {
        id: "word-sustainable",
        word: "sustainable",
        phonetic: "/səˈsteɪnəbl/",
        part: "adjective",
        meaning: "可持续的；能够维持的",
        example: "The city is investing in sustainable public transport.",
        translation: "这座城市正在投资可持续的公共交通。",
        deck: "CET-4",
        mastery: 58,
        tags: ["环保", "学术"],
        source: "CET-4 阅读：环境保护",
        noteId: "note-cet4-environment",
      },
      {
        id: "word-emission",
        word: "emission",
        phonetic: "/ɪˈmɪʃn/",
        part: "noun",
        meaning: "排放；排放物",
        example: "Carbon emissions must be reduced significantly.",
        translation: "碳排放必须大幅减少。",
        deck: "CET-4",
        mastery: 46,
        tags: ["环保", "高频"],
        source: "CET-4 阅读：环境保护",
        noteId: "note-cet4-environment",
      },
      {
        id: "word-reinforce",
        word: "reinforce",
        phonetic: "/ˌriːɪnˈfɔːrs/",
        part: "verb",
        meaning: "加强；强化；支持",
        example: "The results reinforce the need for public policy.",
        translation: "这些结果强化了制定公共政策的必要性。",
        deck: "CET-6",
        mastery: 35,
        tags: ["学术", "写作"],
        source: "CET-4 阅读：环境保护",
        noteId: "note-cet4-environment",
      },
      {
        id: "word-registration",
        word: "registration",
        phonetic: "/ˌredʒɪˈstreɪʃn/",
        part: "noun",
        meaning: "注册；登记",
        example: "Registration closes this Friday.",
        translation: "注册将于本周五截止。",
        deck: "场景听力",
        mastery: 64,
        tags: ["校园", "听力"],
        source: "听力场景：校园注册",
        noteId: "note-listening-ielts",
      },
      {
        id: "word-deadline",
        word: "deadline",
        phonetic: "/ˈdedlaɪn/",
        part: "noun",
        meaning: "截止日期；最后期限",
        example: "We need to submit the report before the deadline.",
        translation: "我们需要在截止日期前提交报告。",
        deck: "场景听力",
        mastery: 81,
        tags: ["校园", "听力"],
        source: "听力场景：校园注册",
        noteId: "note-listening-ielts",
      },
      {
        id: "word-access",
        word: "accessible",
        phonetic: "/əkˈsesəbl/",
        part: "adjective",
        meaning: "易接近的；可获得的；易懂的",
        example: "Public libraries make knowledge accessible to everyone.",
        translation: "公共图书馆让每个人都能获得知识。",
        deck: "学术英语",
        mastery: 52,
        tags: ["学术", "写作"],
        source: "作文开头：减少无意义铺垫",
        noteId: "note-writing",
      },
      {
        id: "word-parallel",
        word: "parallel",
        phonetic: "/ˈpærəlel/",
        part: "adjective",
        meaning: "平行的；相似的",
        example:
          "The two clauses should have parallel grammatical structures.",
        translation: "这两个从句应具有平行的语法结构。",
        deck: "语法词汇",
        mastery: 42,
        tags: ["语法", "写作"],
        source: "语法：not…but… 的平行结构",
        noteId: "note-grammar",
      },
      {
        id: "word-adapt",
        word: "adapt",
        phonetic: "/əˈdæpt/",
        part: "verb",
        meaning: "适应；改编",
        example: "Students need time to adapt to a new learning environment.",
        translation: "学生需要时间适应新的学习环境。",
        deck: "CET-4",
        mastery: 38,
        tags: ["核心词", "教育"],
        source: "CET-4 核心词汇",
      },
      {
        id: "word-significant",
        word: "significant",
        phonetic: "/sɪɡˈnɪfɪkənt/",
        part: "adjective",
        meaning: "重要的；显著的",
        example: "There has been a significant improvement in air quality.",
        translation: "空气质量已有显著改善。",
        deck: "CET-4",
        mastery: 61,
        tags: ["高频", "写作"],
        source: "CET-4 核心词汇",
      },
      {
        id: "word-consume",
        word: "consume",
        phonetic: "/kənˈsuːm/",
        part: "verb",
        meaning: "消耗；消费",
        example: "Urban households consume a large amount of energy.",
        translation: "城市家庭消耗大量能源。",
        deck: "CET-4",
        mastery: 47,
        tags: ["环境", "高频"],
        source: "CET-4 核心词汇",
      },
      {
        id: "word-maintain",
        word: "maintain",
        phonetic: "/meɪnˈteɪn/",
        part: "verb",
        meaning: "维持；保养；坚持认为",
        example: "Regular review helps learners maintain their vocabulary.",
        translation: "定期复习有助于学习者保持词汇量。",
        deck: "CET-4",
        mastery: 68,
        tags: ["核心词", "学习"],
        source: "CET-4 核心词汇",
      },
      {
        id: "word-opportunity",
        word: "opportunity",
        phonetic: "/ˌɑːpərˈtuːnəti/",
        part: "noun",
        meaning: "机会；时机",
        example: "The exchange program offers an opportunity to use English.",
        translation: "交换项目提供了使用英语的机会。",
        deck: "CET-4",
        mastery: 76,
        tags: ["高频", "校园"],
        source: "CET-4 核心词汇",
      },
      {
        id: "word-inevitable",
        word: "inevitable",
        phonetic: "/ɪnˈevɪtəbl/",
        part: "adjective",
        meaning: "不可避免的",
        example: "Some degree of change is inevitable.",
        translation: "某种程度的变化是不可避免的。",
        deck: "CET-6",
        mastery: 31,
        tags: ["高频", "写作"],
        source: "CET-6 核心词汇",
      },
      {
        id: "word-controversy",
        word: "controversy",
        phonetic: "/ˈkɑːntrəvɜːrsi/",
        part: "noun",
        meaning: "争议；争论",
        example: "The proposal has generated considerable controversy.",
        translation: "这项提议引发了相当大的争议。",
        deck: "CET-6",
        mastery: 29,
        tags: ["学术", "阅读"],
        source: "CET-6 核心词汇",
      },
      {
        id: "word-demonstrate",
        word: "demonstrate",
        phonetic: "/ˈdemənstreɪt/",
        part: "verb",
        meaning: "证明；展示；示范",
        example: "The experiment demonstrates the value of active recall.",
        translation: "这项实验证明了主动回忆的价值。",
        deck: "CET-6",
        mastery: 44,
        tags: ["学术", "写作"],
        source: "CET-6 核心词汇",
      },
      {
        id: "word-comprehensive",
        word: "comprehensive",
        phonetic: "/ˌkɑːmprɪˈhensɪv/",
        part: "adjective",
        meaning: "全面的；综合的",
        example: "The report provides a comprehensive review of the issue.",
        translation: "这份报告对该问题进行了全面回顾。",
        deck: "CET-6",
        mastery: 36,
        tags: ["学术", "写作"],
        source: "CET-6 核心词汇",
      },
      {
        id: "word-undermine",
        word: "undermine",
        phonetic: "/ˌʌndərˈmaɪn/",
        part: "verb",
        meaning: "削弱；损害",
        example: "Misinformation can undermine public trust.",
        translation: "错误信息会削弱公众信任。",
        deck: "CET-6",
        mastery: 24,
        tags: ["学术", "阅读"],
        source: "CET-6 核心词汇",
      },
      {
        id: "word-biodiversity",
        word: "biodiversity",
        phonetic: "/ˌbaɪoʊdaɪˈvɜːrsəti/",
        part: "noun",
        meaning: "生物多样性",
        example: "The wetland supports a remarkable level of biodiversity.",
        translation: "这片湿地维持着极高的生物多样性。",
        deck: "雅思学术",
        mastery: 22,
        tags: ["IELTS", "环境"],
        source: "IELTS Academic Vocabulary",
      },
      {
        id: "word-urbanization",
        word: "urbanization",
        phonetic: "/ˌɜːrbənaɪˈzeɪʃn/",
        part: "noun",
        meaning: "城市化",
        example: "Rapid urbanization has increased demand for housing.",
        translation: "快速城市化增加了住房需求。",
        deck: "雅思学术",
        mastery: 35,
        tags: ["IELTS", "城市"],
        source: "IELTS Academic Vocabulary",
      },
      {
        id: "word-infrastructure",
        word: "infrastructure",
        phonetic: "/ˈɪnfrəstrʌktʃər/",
        part: "noun",
        meaning: "基础设施",
        example: "The city needs to invest in public infrastructure.",
        translation: "这座城市需要投资公共基础设施。",
        deck: "雅思学术",
        mastery: 40,
        tags: ["IELTS", "社会"],
        source: "IELTS Academic Vocabulary",
      },
      {
        id: "word-curriculum",
        word: "curriculum",
        phonetic: "/kəˈrɪkjələm/",
        part: "noun",
        meaning: "课程体系",
        example: "Digital skills are now part of the school curriculum.",
        translation: "数字技能现在已成为学校课程的一部分。",
        deck: "雅思学术",
        mastery: 45,
        tags: ["IELTS", "教育"],
        source: "IELTS Academic Vocabulary",
      },
      {
        id: "word-expenditure",
        word: "expenditure",
        phonetic: "/ɪkˈspendɪtʃər/",
        part: "noun",
        meaning: "支出；花费",
        example: "Public expenditure on education increased last year.",
        translation: "去年公共教育支出有所增加。",
        deck: "雅思学术",
        mastery: 18,
        tags: ["IELTS", "数据"],
        source: "IELTS Academic Vocabulary",
      },
      {
        id: "word-fluctuate",
        word: "fluctuate",
        phonetic: "/ˈflʌktʃueɪt/",
        part: "verb",
        meaning: "波动；起伏",
        example: "The figures fluctuated sharply during the period.",
        translation: "该时期内数据出现了剧烈波动。",
        deck: "雅思学术",
        mastery: 27,
        tags: ["IELTS", "图表"],
        source: "IELTS Writing Task 1",
      },
      {
        id: "word-hypothesis",
        word: "hypothesis",
        phonetic: "/haɪˈpɑːθəsɪs/",
        part: "noun",
        meaning: "假设；假说",
        example: "The results support the original hypothesis.",
        translation: "研究结果支持最初的假设。",
        deck: "托福学术",
        mastery: 33,
        tags: ["TOEFL", "研究"],
        source: "TOEFL Academic Vocabulary",
      },
      {
        id: "word-phenomenon",
        word: "phenomenon",
        phonetic: "/fəˈnɑːmɪnən/",
        part: "noun",
        meaning: "现象",
        example: "Scientists are still studying this unusual phenomenon.",
        translation: "科学家仍在研究这一异常现象。",
        deck: "托福学术",
        mastery: 39,
        tags: ["TOEFL", "科学"],
        source: "TOEFL Academic Vocabulary",
      },
      {
        id: "word-correlation",
        word: "correlation",
        phonetic: "/ˌkɔːrəˈleɪʃn/",
        part: "noun",
        meaning: "相关性；关联",
        example: "The study found a correlation between sleep and memory.",
        translation: "研究发现睡眠与记忆之间存在相关性。",
        deck: "托福学术",
        mastery: 21,
        tags: ["TOEFL", "研究"],
        source: "TOEFL Academic Vocabulary",
      },
      {
        id: "word-empirical",
        word: "empirical",
        phonetic: "/ɪmˈpɪrɪkl/",
        part: "adjective",
        meaning: "以实验为依据的；经验主义的",
        example: "The claim must be supported by empirical evidence.",
        translation: "这一主张必须有实证证据支持。",
        deck: "托福学术",
        mastery: 17,
        tags: ["TOEFL", "学术"],
        source: "TOEFL Academic Vocabulary",
      },
      {
        id: "word-methodology",
        word: "methodology",
        phonetic: "/ˌmeθəˈdɑːlədʒi/",
        part: "noun",
        meaning: "研究方法；方法论",
        example: "The paper explains its methodology in detail.",
        translation: "这篇论文详细解释了其研究方法。",
        deck: "托福学术",
        mastery: 26,
        tags: ["TOEFL", "文献"],
        source: "Academic Paper Vocabulary",
      },
      {
        id: "word-paradigm",
        word: "paradigm",
        phonetic: "/ˈpærədaɪm/",
        part: "noun",
        meaning: "范式；模式",
        example: "The discovery led to a new scientific paradigm.",
        translation: "这一发现促成了新的科学范式。",
        deck: "托福学术",
        mastery: 14,
        tags: ["TOEFL", "学术"],
        source: "Academic Paper Vocabulary",
      },
      {
        id: "word-implication",
        word: "implication",
        phonetic: "/ˌɪmplɪˈkeɪʃn/",
        part: "noun",
        meaning: "影响；含义；暗示",
        example: "The findings have important implications for teaching.",
        translation: "研究结果对教学具有重要影响。",
        deck: "托福学术",
        mastery: 30,
        tags: ["TOEFL", "写作"],
        source: "Academic Paper Vocabulary",
      },
      {
        id: "word-commute",
        word: "commute",
        phonetic: "/kəˈmjuːt/",
        part: "verb",
        meaning: "通勤；上下班往返",
        example: "I usually commute to work by subway.",
        translation: "我通常乘地铁通勤。",
        deck: "日常口语",
        mastery: 57,
        tags: ["口语", "城市"],
        source: "Daily Conversation",
      },
      {
        id: "word-refund",
        word: "refund",
        phonetic: "/ˈriːfʌnd/",
        part: "noun",
        meaning: "退款",
        example: "I would like to request a refund for this purchase.",
        translation: "我想为这次购买申请退款。",
        deck: "日常口语",
        mastery: 49,
        tags: ["口语", "消费"],
        source: "Daily Conversation",
      },
      {
        id: "word-appointment",
        word: "appointment",
        phonetic: "/əˈpɔɪntmənt/",
        part: "noun",
        meaning: "预约；约会；任命",
        example: "I have an appointment with the doctor at three.",
        translation: "我三点和医生有预约。",
        deck: "日常口语",
        mastery: 63,
        tags: ["口语", "生活"],
        source: "Daily Conversation",
      },
      {
        id: "word-recommendation",
        word: "recommendation",
        phonetic: "/ˌrekəmenˈdeɪʃn/",
        part: "noun",
        meaning: "推荐；建议",
        example: "Could you give me a recommendation for a good restaurant?",
        translation: "你能给我推荐一家好餐厅吗？",
        deck: "日常口语",
        mastery: 51,
        tags: ["口语", "旅行"],
        source: "Daily Conversation",
      },
      {
        id: "word-available",
        word: "available",
        phonetic: "/əˈveɪləbl/",
        part: "adjective",
        meaning: "可获得的；有空的",
        example: "Are you available for a meeting tomorrow morning?",
        translation: "你明天上午有空开会吗？",
        deck: "日常口语",
        mastery: 73,
        tags: ["口语", "商务"],
        source: "Business English",
      },
      {
        id: "word-negotiate",
        word: "negotiate",
        phonetic: "/nɪˈɡoʊʃieɪt/",
        part: "verb",
        meaning: "谈判；协商",
        example: "The two companies are negotiating a new contract.",
        translation: "两家公司正在协商一份新合同。",
        deck: "商务英语",
        mastery: 23,
        tags: ["商务", "职场"],
        source: "Business English",
      },
      {
        id: "word-stakeholder",
        word: "stakeholder",
        phonetic: "/ˈsteɪkhoʊldər/",
        part: "noun",
        meaning: "利益相关者",
        example: "All stakeholders should be included in the discussion.",
        translation: "所有利益相关者都应参与讨论。",
        deck: "商务英语",
        mastery: 16,
        tags: ["商务", "会议"],
        source: "Business English",
      },
      {
        id: "word-revenue",
        word: "revenue",
        phonetic: "/ˈrevənuː/",
        part: "noun",
        meaning: "收入；营业额",
        example: "Online sales account for most of the company’s revenue.",
        translation: "线上销售占公司收入的大部分。",
        deck: "商务英语",
        mastery: 34,
        tags: ["商务", "数据"],
        source: "Business English",
      },
    ],
    papers: [
      {
        id: "paper-carbon",
        title: "Can Individual Action Reduce Carbon Emissions?",
        authors: "M. Cooper, L. Zhang",
        journal: "Environmental Policy Review",
        year: "2025",
        abstract:
          "This study examines whether everyday individual actions can produce meaningful changes in carbon emissions. It argues that individual behavior and public policy reinforce each other rather than operate as alternatives.",
        keywords: ["carbon emissions", "individual action", "public policy"],
        category: "academic",
        exam: ["CET-4", "IELTS", "TOEFL"],
        saved: true,
        progress: 62,
        citations: 48,
        sections: [
          [
            "Introduction",
            "Many discussions of climate change frame personal action and public policy as competing strategies. This paper treats them as complementary forces that shape social expectations.",
          ],
          [
            "Method",
            "The authors compare household behavior data with changes in regional environmental policy across five countries.",
          ],
          [
            "Findings",
            "Individual actions rarely produce large direct reductions by themselves. However, consistent behavior can change what governments and companies consider socially and politically feasible.",
          ],
          [
            "Conclusion",
            "The most effective strategy is not choosing between individual action and public policy, but making them reinforce each other.",
          ],
        ],
      },
      {
        id: "paper-digital-learning",
        title: "Digital Learning and Student Autonomy",
        authors: "S. Martin",
        journal: "Education Research",
        year: "2024",
        abstract:
          "This paper explores how digital learning environments influence student autonomy, motivation, and the ability to plan long-term learning.",
        keywords: ["digital learning", "autonomy", "motivation"],
        category: "education",
        exam: ["CET-6", "TOEFL"],
        saved: true,
        progress: 28,
        citations: 73,
        sections: [
          [
            "Research question",
            "How do digital environments change the learner's responsibility for planning and monitoring progress?",
          ],
          [
            "Key finding",
            "Technology can support autonomy, but only when learners receive clear goals and timely feedback.",
          ],
        ],
      },
      {
        id: "paper-spaced-repetition",
        title: "Language Acquisition Through Spaced Repetition",
        authors: "J. Allen, R. Ito",
        journal: "Applied Linguistics",
        year: "2023",
        abstract:
          "The study investigates how spaced repetition improves long-term vocabulary retention for second-language learners.",
        keywords: ["spaced repetition", "vocabulary", "memory"],
        category: "linguistics",
        exam: ["IELTS", "TOEFL"],
        saved: false,
        progress: 0,
        citations: 126,
        sections: [
          [
            "Abstract",
            "Spaced repetition schedules review at increasing intervals. The authors test whether this method improves recall more than massed practice.",
          ],
          [
            "Results",
            "Participants using spaced repetition remembered significantly more words after four weeks.",
          ],
        ],
      },
      {
        id: "paper-urban-farming",
        title: "The Future of Urban Farming",
        authors: "IELTS Academic Reading",
        journal: "Adapted academic passage",
        year: "2024",
        abstract:
          "Urban farming is expanding from community gardens into commercial rooftops and vertical facilities. Supporters see it as a way to shorten supply chains, while critics question its energy cost and limited scale.",
        keywords: ["urban farming", "food supply", "sustainability"],
        category: "environment",
        exam: ["IELTS"],
        saved: true,
        progress: 8,
        citations: 0,
        sections: [
          [
            "Reading focus",
            "Match headings to paragraphs and distinguish the views of supporters and critics.",
          ],
          [
            "Academic vocabulary",
            "commercial, vertical, supply chain, feasibility, scale",
          ],
        ],
      },
      {
        id: "paper-sleep-memory",
        title: "Sleep, Memory and Academic Performance",
        authors: "TOEFL Academic Reading",
        journal: "Adapted science passage",
        year: "2025",
        abstract:
          "Research indicates that sleep supports memory consolidation and may influence a student's ability to retrieve information during examinations.",
        keywords: ["sleep", "memory consolidation", "academic performance"],
        category: "science",
        exam: ["TOEFL"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          [
            "Research summary",
            "Sleep stages interact with newly formed memories and help stabilize information.",
          ],
          [
            "Question type",
            "Vocabulary in context, inference, and rhetorical purpose.",
          ],
        ],
      },
      {
        id: "paper-attention-economy",
        title: "The Attention Economy and Digital Well-being",
        authors: "CET-6 Academic Reading",
        journal: "Adapted social science passage",
        year: "2024",
        abstract:
          "Digital platforms compete for limited human attention. The passage examines how recommendation systems influence behavior and discusses possible forms of individual and regulatory control.",
        keywords: ["attention economy", "digital well-being", "recommendation"],
        category: "technology",
        exam: ["CET-6"],
        saved: true,
        progress: 35,
        citations: 0,
        sections: [
          [
            "Main argument",
            "Attention has become a valuable resource, and platform design can shape user choices.",
          ],
          [
            "Useful vocabulary",
            "engagement, manipulation, regulation, well-being",
          ],
        ],
      },
      {
        id: "paper-coral-reefs",
        title: "Coral Reefs Under Environmental Stress",
        authors: "IELTS Academic Reading",
        journal: "Adapted environmental science passage",
        year: "2025",
        abstract:
          "Coral reefs are sensitive to rising temperatures and changing ocean chemistry. The passage explains how scientists monitor reef health and why local conservation alone may not be enough.",
        keywords: ["coral reef", "biodiversity", "ocean temperature"],
        category: "environment",
        exam: ["IELTS"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Overview", "Temperature stress can cause coral bleaching and reduce biodiversity."],
          ["Reading skill", "Matching information and identifying the writer's claim."],
        ],
      },
      {
        id: "paper-renewable-grid",
        title: "Integrating Renewable Energy into National Grids",
        authors: "IELTS Academic Reading",
        journal: "Adapted technology passage",
        year: "2024",
        abstract:
          "Solar and wind power can reduce emissions, but their changing output creates challenges for electricity grids. Storage and flexible demand are presented as possible solutions.",
        keywords: ["renewable energy", "grid", "storage"],
        category: "technology",
        exam: ["IELTS"],
        saved: true,
        progress: 20,
        citations: 0,
        sections: [
          ["Problem", "Renewable output varies with weather and time of day."],
          ["Solution", "Grid storage and demand management can improve reliability."],
        ],
      },
      {
        id: "paper-museum-heritage",
        title: "Museums and the Interpretation of Cultural Heritage",
        authors: "IELTS Academic Reading",
        journal: "Adapted humanities passage",
        year: "2023",
        abstract:
          "Museums no longer present objects as neutral historical facts. Curators increasingly explain how objects acquired meaning and whose perspectives are represented.",
        keywords: ["museum", "heritage", "interpretation"],
        category: "humanities",
        exam: ["IELTS"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Main idea", "Interpretation changes the way visitors understand cultural heritage."],
          ["Question focus", "Author purpose and attitude."],
        ],
      },
      {
        id: "paper-consumer-behavior",
        title: "How Framing Influences Consumer Decisions",
        authors: "IELTS Academic Reading",
        journal: "Adapted psychology passage",
        year: "2024",
        abstract:
          "Small changes in wording can influence what consumers choose. The passage reviews examples from pricing and health communication.",
        keywords: ["consumer behavior", "framing", "decision making"],
        category: "psychology",
        exam: ["IELTS"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Key concept", "Framing changes attention without changing the underlying facts."],
          ["Exam skill", "True / False / Not Given."],
        ],
      },
      {
        id: "paper-animal-navigation",
        title: "Animal Navigation and Magnetic Fields",
        authors: "TOEFL Academic Reading",
        journal: "Adapted biology passage",
        year: "2025",
        abstract:
          "Some animals appear to use Earth's magnetic field when traveling long distances. Researchers continue to debate how magnetic information is detected and processed.",
        keywords: ["magnetic field", "navigation", "biology"],
        category: "science",
        exam: ["TOEFL"],
        saved: true,
        progress: 15,
        citations: 0,
        sections: [
          ["Central claim", "Magnetic navigation is likely one part of a broader sensory system."],
          ["TOEFL skill", "Inference and rhetorical purpose."],
        ],
      },
      {
        id: "paper-volcanic-islands",
        title: "The Formation of Volcanic Island Chains",
        authors: "TOEFL Academic Reading",
        journal: "Adapted geology passage",
        year: "2023",
        abstract:
          "Volcanic island chains can reveal the movement of tectonic plates. The passage compares hotspot activity with other geological explanations.",
        keywords: ["volcano", "tectonic plate", "geology"],
        category: "science",
        exam: ["TOEFL"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Process", "A hotspot can produce a series of islands as a plate moves."],
          ["Question focus", "Cause and effect."],
        ],
      },
      {
        id: "paper-jazz-history",
        title: "The Social History of Early Jazz",
        authors: "TOEFL Academic Reading",
        journal: "Adapted music history passage",
        year: "2024",
        abstract:
          "Early jazz developed through the interaction of African musical traditions, urban migration and new recording technology.",
        keywords: ["jazz", "music history", "urban culture"],
        category: "arts",
        exam: ["TOEFL"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Main idea", "Jazz emerged from overlapping social and technological changes."],
          ["TOEFL skill", "Vocabulary in context."],
        ],
      },
      {
        id: "paper-campus-food-waste",
        title: "Reducing Food Waste on University Campuses",
        authors: "CET-4 Academic Reading",
        journal: "Adapted campus report",
        year: "2025",
        abstract:
          "Universities are testing smaller portions, shared data and student-led campaigns to reduce food waste in dining halls.",
        keywords: ["food waste", "campus", "behavior"],
        category: "education",
        exam: ["CET-4"],
        saved: true,
        progress: 44,
        citations: 0,
        sections: [
          ["Solutions", "Portion size, pricing and information can change student behavior."],
          ["CET-4 vocabulary", "portion, campaign, reduce, dining hall"],
        ],
      },
      {
        id: "paper-data-privacy",
        title: "Personal Data, Consent and Digital Privacy",
        authors: "CET-6 Academic Reading",
        journal: "Adapted technology and law passage",
        year: "2024",
        abstract:
          "Consent is central to digital privacy, but users may not understand how their information will be used. The passage discusses transparency and regulation.",
        keywords: ["data privacy", "consent", "regulation"],
        category: "technology",
        exam: ["CET-6"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Central issue", "Meaningful consent requires understandable information."],
          ["Useful vocabulary", "consent, transparency, regulation, exposure"],
        ],
      },
      {
        id: "paper-digital-classroom",
        title: "Digital Classrooms and Independent Learning",
        authors: "CET-4 Academic Reading",
        journal: "Adapted education passage",
        year: "2024",
        abstract:
          "Digital tools can provide immediate feedback and flexible learning materials, but students still need goals and guidance to become independent learners.",
        keywords: ["digital classroom", "feedback", "independent learning"],
        category: "education",
        exam: ["CET-4"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Key point", "Technology supports learning only when it is connected to clear teaching goals."],
          ["Reading focus", "Cause and effect."],
        ],
      },
      {
        id: "paper-automation-employment",
        title: "Automation and the Future of Employment",
        authors: "CET-6 Academic Reading",
        journal: "Adapted economics passage",
        year: "2025",
        abstract:
          "Automation may replace some routine tasks while creating demand for new technical and social skills. The passage examines both disruption and adaptation.",
        keywords: ["automation", "employment", "skills"],
        category: "social-science",
        exam: ["CET-6"],
        saved: true,
        progress: 18,
        citations: 0,
        sections: [
          ["Argument", "The effect of automation depends on how quickly workers and institutions adapt."],
          ["CET-6 vocabulary", "automation, disruption, routine, adaptation"],
        ],
      },
      {
        id: "paper-sustainable-cities",
        title: "Designing Sustainable Cities",
        authors: "IELTS Academic Reading",
        journal: "Adapted urban studies passage",
        year: "2025",
        abstract:
          "Sustainable city design combines public transport, green space, efficient buildings and community participation. No single measure is sufficient on its own.",
        keywords: ["sustainable city", "transport", "green space"],
        category: "environment",
        exam: ["IELTS"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Main idea", "Urban sustainability requires coordinated changes across several systems."],
          ["IELTS skill", "Matching headings."],
        ],
      },
      {
        id: "paper-art-authenticity",
        title: "Authenticity and Restoration in Art Museums",
        authors: "TOEFL Academic Reading",
        journal: "Adapted art history passage",
        year: "2023",
        abstract:
          "Restoration can preserve a work of art while also changing how future viewers understand it. Museums must balance physical stability with historical authenticity.",
        keywords: ["restoration", "authenticity", "museum"],
        category: "arts",
        exam: ["TOEFL"],
        saved: false,
        progress: 0,
        citations: 0,
        sections: [
          ["Central tension", "Restoration protects objects but may alter their historical character."],
          ["TOEFL skill", "Inference and vocabulary in context."],
        ],
      },
      {
        id: "paper-peer-review",
        title: "The Function and Limits of Peer Review",
        authors: "Academic Research Methods",
        journal: "Adapted research methodology passage",
        year: "2024",
        abstract:
          "Peer review is intended to evaluate research quality before publication. The process can improve papers, but reviewers may also introduce bias or delay.",
        keywords: ["peer review", "research quality", "publication"],
        category: "academic",
        exam: ["Academic", "TOEFL"],
        saved: true,
        progress: 11,
        citations: 0,
        sections: [
          ["Process", "Independent experts assess methods, evidence and significance."],
          ["Limitations", "Review quality depends on expertise, time and transparency."],
        ],
      },
    ],
    books: [
      {
        id: "book-vocabulary-in-use",
        title: "English Vocabulary in Use",
        author: "Michael McCarthy / Felicity O'Dell",
        publisher: "Cambridge University Press",
        category: "vocabulary",
        exam: ["通用"],
        level: "中级",
        description: "按主题和用法组织词汇，适合日常积累与搭配学习。",
        tags: ["词汇", "搭配", "英式英语"],
        saved: true,
        progress: 24,
        units: 100,
      },
      {
        id: "book-word-power",
        title: "Word Power Made Easy",
        author: "Norman Lewis",
        publisher: "Anchor Books",
        category: "vocabulary",
        exam: ["通用", "TOEFL"],
        level: "中高级",
        description: "通过词根、词缀和语义关系扩展英语词汇。",
        tags: ["词根", "词缀", "词汇"],
        saved: false,
        progress: 0,
        units: 45,
      },
      {
        id: "book-new-concept-2",
        title: "新概念英语 2",
        author: "L. G. Alexander",
        publisher: "外语教学与研究出版社",
        category: "course",
        exam: ["通用"],
        level: "初中级",
        description: "以递进式课文训练语法、句型、阅读与表达。",
        tags: ["教材", "语法", "句型"],
        saved: true,
        progress: 56,
        units: 96,
      },
      {
        id: "book-grammar-in-use",
        title: "English Grammar in Use",
        author: "Raymond Murphy",
        publisher: "Cambridge University Press",
        category: "grammar",
        exam: ["通用", "CET-4", "IELTS"],
        level: "中级",
        description: "以讲解和练习结合的方式系统整理英语语法。",
        tags: ["语法", "练习", "参考书"],
        saved: true,
        progress: 18,
        units: 145,
      },
      {
        id: "book-elements-style",
        title: "The Elements of Style",
        author: "William Strunk Jr. / E. B. White",
        publisher: "Pearson",
        category: "writing",
        exam: ["CET-6", "TOEFL", "IELTS"],
        level: "高级",
        description: "聚焦简洁、清晰和有效的英文写作原则。",
        tags: ["写作", "风格", "学术表达"],
        saved: false,
        progress: 0,
        units: 20,
      },
      {
        id: "book-oxford-advanced",
        title: "Oxford Advanced Learner's Dictionary",
        author: "Oxford University Press",
        publisher: "Oxford University Press",
        category: "reference",
        exam: ["通用", "CET-4", "CET-6", "IELTS", "TOEFL"],
        level: "全阶段",
        description: "提供释义、搭配、例句和用法说明，可作为查词与写作参考。",
        tags: ["词典", "搭配", "用法"],
        saved: true,
        progress: 0,
        units: 1,
      },
      {
        id: "book-cet4-vocabulary",
        title: "CET-4 核心词汇与真题语境",
        author: "English Buddy 自建学习卡",
        publisher: "本地学习资料",
        category: "cet4",
        exam: ["CET-4"],
        level: "四级",
        description: "按高频词、阅读语境、听力场景和写作表达分类。",
        tags: ["CET-4", "高频词", "真题语境"],
        saved: true,
        progress: 37,
        units: 30,
      },
      {
        id: "book-cet4-papers",
        title: "CET-4 历年真题方法分类",
        author: "English Buddy 考试资料",
        publisher: "本地学习资料",
        category: "cet4",
        exam: ["CET-4"],
        level: "四级",
        description: "按听力、阅读、写作、翻译和错题原因组织真题训练。",
        tags: ["CET-4", "真题", "错题"],
        saved: false,
        progress: 12,
        units: 20,
      },
      {
        id: "book-cet6-vocabulary",
        title: "CET-6 高阶词汇与学术阅读",
        author: "English Buddy 自建学习卡",
        publisher: "本地学习资料",
        category: "cet6",
        exam: ["CET-6"],
        level: "六级",
        description: "聚焦长难句、学术词义、同义替换和写作表达。",
        tags: ["CET-6", "学术阅读", "同义替换"],
        saved: true,
        progress: 21,
        units: 32,
      },
      {
        id: "book-cambridge-ielts",
        title: "Cambridge IELTS Academic",
        author: "Cambridge University Press & Assessment",
        publisher: "Cambridge University Press",
        category: "ielts",
        exam: ["IELTS"],
        level: "雅思",
        description: "用于雅思听力、学术阅读、写作和口语分项训练。",
        tags: ["IELTS", "真题", "学术"],
        saved: true,
        progress: 15,
        units: 4,
      },
      {
        id: "book-ielts-guide",
        title: "IELTS Academic Writing Guide",
        author: "English Buddy 自建学习模块",
        publisher: "本地学习资料",
        category: "ielts",
        exam: ["IELTS"],
        level: "雅思",
        description: "按 Task 1 图表和 Task 2 议论文组织结构、词汇与句型。",
        tags: ["IELTS", "写作", "Task 1", "Task 2"],
        saved: false,
        progress: 0,
        units: 24,
      },
      {
        id: "book-toefl-official",
        title: "The Official Guide to the TOEFL iBT Test",
        author: "Educational Testing Service",
        publisher: "McGraw Hill",
        category: "toefl",
        exam: ["TOEFL"],
        level: "托福",
        description: "覆盖 TOEFL iBT 各题型、考试说明和官方练习。",
        tags: ["TOEFL", "官方指南", "综合技能"],
        saved: true,
        progress: 9,
        units: 12,
      },
      {
        id: "book-toefl-academic",
        title: "TOEFL Academic Vocabulary",
        author: "English Buddy 自建词库",
        publisher: "本地学习资料",
        category: "toefl",
        exam: ["TOEFL"],
        level: "托福",
        description: "覆盖科学研究、历史、艺术和社会科学常见学术词。",
        tags: ["TOEFL", "学术词汇", "阅读"],
        saved: true,
        progress: 18,
        units: 40,
      },
      {
        id: "book-pride-prejudice",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        publisher: "Public Domain",
        category: "classic",
        exam: ["原著阅读"],
        level: "高级",
        description: "十九世纪英国社会与婚姻题材经典小说，适合长篇原著阅读。",
        tags: ["英文原著", "小说", "公版"],
        saved: true,
        progress: 12,
        units: 61,
      },
      {
        id: "book-1984",
        title: "1984",
        author: "George Orwell",
        publisher: "经典文学书目",
        category: "classic",
        exam: ["原著阅读"],
        level: "高级",
        description: "反乌托邦经典，词汇与政治社会表达丰富。",
        tags: ["英文原著", "小说", "社会"],
        saved: false,
        progress: 0,
        units: 24,
      },
      {
        id: "book-brief-history",
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        publisher: "Bantam",
        category: "nonfiction",
        exam: ["TOEFL", "IELTS"],
        level: "高级",
        description: "宇宙学与非虚构科学写作，适合训练学术阅读和科学词汇。",
        tags: ["科普", "物理", "学术阅读"],
        saved: false,
        progress: 0,
        units: 12,
      },
      {
        id: "book-sapiens",
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        publisher: "Harper",
        category: "nonfiction",
        exam: ["IELTS", "TOEFL"],
        level: "中高级",
        description: "人类历史与社会主题非虚构读物，适合提高长篇阅读耐力。",
        tags: ["历史", "社会", "非虚构"],
        saved: true,
        progress: 7,
        units: 20,
      },
      {
        id: "book-educated",
        title: "Educated",
        author: "Tara Westover",
        publisher: "Random House",
        category: "nonfiction",
        exam: ["原著阅读"],
        level: "中高级",
        description: "回忆录题材，叙事语言自然，适合练习真实语境阅读。",
        tags: ["回忆录", "教育", "现代英语"],
        saved: false,
        progress: 0,
        units: 40,
      },
      {
        id: "book-merriam-vocabulary",
        title: "Merriam-Webster's Vocabulary Builder",
        author: "Mary Wood Cornog",
        publisher: "Merriam-Webster",
        category: "vocabulary",
        exam: ["通用", "TOEFL"],
        level: "高级",
        description: "以词根和主题单元扩展 academic vocabulary，适合长期词根学习。",
        tags: ["词根", "高级词汇", "学术"],
        saved: false,
        progress: 0,
        units: 30,
      },
      {
        id: "book-1100-words",
        title: "1100 Words You Need to Know",
        author: "Murray Bromberg / Melvin Gordon",
        publisher: "Barron's",
        category: "vocabulary",
        exam: ["TOEFL", "IELTS"],
        level: "中高级",
        description: "通过每周词表、例句和语境练习积累高频考试词汇。",
        tags: ["高频词", "练习", "考试"],
        saved: false,
        progress: 0,
        units: 46,
      },
      {
        id: "book-vocabulary-practice",
        title: "English Vocabulary in Practice",
        author: "Cambridge University Press",
        publisher: "Cambridge University Press",
        category: "vocabulary",
        exam: ["通用", "IELTS"],
        level: "中级",
        description: "按主题提供短练习，适合碎片化复习搭配和词形变化。",
        tags: ["练习", "主题词汇", "搭配"],
        saved: false,
        progress: 0,
        units: 60,
      },
      {
        id: "book-check-vocabulary-ielts",
        title: "Check Your English Vocabulary for IELTS",
        author: "Rawdon Wyatt",
        publisher: "Bloomsbury",
        category: "ielts",
        exam: ["IELTS"],
        level: "雅思",
        description: "集中训练雅思阅读、写作和听力场景所需词汇。",
        tags: ["IELTS", "词汇练习", "写作"],
        saved: false,
        progress: 0,
        units: 32,
      },
      {
        id: "book-cambridge-vocabulary-ielts",
        title: "Cambridge Vocabulary for IELTS",
        author: "Pauline Cullen",
        publisher: "Cambridge University Press",
        category: "ielts",
        exam: ["IELTS"],
        level: "雅思",
        description: "结合听、说、读、写任务训练雅思学术词汇。",
        tags: ["IELTS", "学术词汇", "四项技能"],
        saved: true,
        progress: 10,
        units: 25,
      },
      {
        id: "book-toefl-vocabulary-builder",
        title: "TOEFL iBT Vocabulary Builder",
        author: "English Buddy Catalog",
        publisher: "本地学习资料",
        category: "toefl",
        exam: ["TOEFL"],
        level: "托福",
        description: "按自然科学、社会科学、艺术和历史主题整理托福词汇。",
        tags: ["TOEFL", "学科词汇", "阅读"],
        saved: true,
        progress: 6,
        units: 36,
      },
      {
        id: "book-barrons-essential-ielts",
        title: "Barron's Essential Words for IELTS",
        author: "Lin Lougheed",
        publisher: "Barron's",
        category: "ielts",
        exam: ["IELTS"],
        level: "雅思",
        description: "以高频词、同义替换和语境练习服务雅思考试。",
        tags: ["IELTS", "同义替换", "高频词"],
        saved: false,
        progress: 0,
        units: 30,
      },
      {
        id: "book-cet4-vocabulary-guide",
        title: "大学英语四级高频词汇指南",
        author: "English Buddy 自建目录",
        publisher: "本地学习资料",
        category: "cet4",
        exam: ["CET-4"],
        level: "四级",
        description: "按照写作、听力、阅读和翻译场景整理四级高频词。",
        tags: ["CET-4", "高频词", "场景"],
        saved: true,
        progress: 42,
        units: 40,
      },
      {
        id: "book-cet6-vocabulary-guide",
        title: "大学英语六级核心词汇指南",
        author: "English Buddy 自建目录",
        publisher: "本地学习资料",
        category: "cet6",
        exam: ["CET-6"],
        level: "六级",
        description: "聚焦六级阅读、翻译和写作中的高阶词汇与搭配。",
        tags: ["CET-6", "核心词", "长难句"],
        saved: false,
        progress: 0,
        units: 38,
      },
      {
        id: "book-oxford-word-skills",
        title: "Oxford Word Skills",
        author: "Ruth Gairns / Stuart Redman",
        publisher: "Oxford University Press",
        category: "vocabulary",
        exam: ["通用", "IELTS"],
        level: "中级",
        description: "按真实生活主题训练词汇、搭配和口语表达。",
        tags: ["词汇技能", "搭配", "口语"],
        saved: true,
        progress: 14,
        units: 80,
      },
      {
        id: "book-collins-cobuild",
        title: "Collins COBUILD Learner's Dictionary",
        author: "HarperCollins",
        publisher: "Collins",
        category: "reference",
        exam: ["通用", "CET-4", "CET-6", "IELTS", "TOEFL"],
        level: "全阶段",
        description: "以完整句子解释词义，帮助理解词语在真实语境中的使用。",
        tags: ["词典", "语境释义", "例句"],
        saved: true,
        progress: 0,
        units: 1,
      },
      {
        id: "book-longman-dictionary",
        title: "Longman Dictionary of Contemporary English",
        author: "Pearson",
        publisher: "Pearson Longman",
        category: "reference",
        exam: ["通用", "IELTS", "TOEFL"],
        level: "全阶段",
        description: "以高频义项、搭配和语料库例句支持阅读与写作。",
        tags: ["词典", "语料库", "搭配"],
        saved: false,
        progress: 0,
        units: 1,
      },
      {
        id: "book-collocations-in-use",
        title: "English Collocations in Use",
        author: "Michael McCarthy / Felicity O'Dell",
        publisher: "Cambridge University Press",
        category: "writing",
        exam: ["CET-6", "IELTS", "TOEFL"],
        level: "中高级",
        description: "训练自然搭配，改善中式英语和写作表达。",
        tags: ["搭配", "写作", "自然表达"],
        saved: true,
        progress: 9,
        units: 60,
      },
      {
        id: "book-phrasal-verbs",
        title: "Oxford Phrasal Verbs Dictionary",
        author: "Oxford University Press",
        publisher: "Oxford University Press",
        category: "reference",
        exam: ["通用", "IELTS"],
        level: "中级",
        description: "系统整理短语动词、用法和语境例句。",
        tags: ["短语动词", "口语", "词典"],
        saved: false,
        progress: 0,
        units: 1,
      },
      {
        id: "book-word-smart",
        title: "Word Smart",
        author: "The Princeton Review",
        publisher: "Princeton Review",
        category: "vocabulary",
        exam: ["TOEFL", "IELTS"],
        level: "中高级",
        description: "通过词根、联想和测验扩大高阶词汇量。",
        tags: ["高阶词汇", "测验", "词根"],
        saved: false,
        progress: 0,
        units: 30,
      },
      {
        id: "book-verbal-advantage",
        title: "Verbal Advantage",
        author: "Charles Harrington Elster",
        publisher: "Random House",
        category: "vocabulary",
        exam: ["TOEFL"],
        level: "高级",
        description: "强调难词辨析、词义层级和高级英文表达。",
        tags: ["高阶", "辨析", "学术"],
        saved: false,
        progress: 0,
        units: 50,
      },
    ],
    activeCategory: "all",
    activeTag: null,
    noteQuery: "",
    activeWordId: "word-universe",
    activeWordDeck: "全部词库",
    wordQuery: "",
    wordPage: 0,
    wordStatusFilter: "all",
    dailyWordIds: [],
    dailyCompletedIds: [],
    automotiveQuery: "",
    automotiveCategory: "全部",
    automotivePage: 0,
    speech: {
      accent: "en-GB",
      rate: 0.92,
      voiceURI: "",
      quality: "natural",
    },
    training: {
      dailyDate: "",
      completedTaskIds: [],
      session: {
        mode: "",
        index: 0,
        score: 0,
        items: [],
        revealed: false,
        feedback: "",
      },
    },
    translation: {
      direction: "zh-en",
      input: "我想提高我的英语。",
      output:
        "I’d like to improve my English. 这是一个自然、礼貌的表达，适合口语和目标陈述。",
      status: "idle",
      error: "",
      style: "natural",
      history: [],
      activePassageId: "passage-station",
      passageFilter: "全部",
    },
    collectionQuery: "",
    collectionType: "all",
    collectionCategory: "全部",
    collectionPage: 0,
    activeCollectionId: "collection-0001",
    collectionFavorites: [],
    collectionProgress: {},
    speechQuery: "",
    speechCategory: "全部",
    speechLevel: "全部",
    speechPage: 0,
    speechSavedIds: [],
    activeSpeechId: "speech-000001",
    businessQuery: "",
    businessCategory: "全部",
    businessPage: 0,
    businessSavedIds: [],
    literatureQuery: "",
    literatureFilter: "all",
    literatureExamFilter: "all",
    activePaperId: "paper-carbon",
    bookQuery: "",
    bookFilter: "all",
    activeBookId: "book-vocabulary-in-use",
    vocabTest: {
      active: false,
      index: 0,
      score: 0,
      mode: "meaning",
      wordIds: [],
      spellingCorrect: null,
    },
    menuOpen: { study: true, exams: false, reading: false },
    aiOpen: false,
    mobileMenuOpen: false,
    aiMessages: [],
    review: {
      noteId: null,
      index: 0,
      flipped: false,
      known: 0,
      unknown: 0,
    },
  };

  function cloneDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function mergeByKey(seedItems, storedItems, key) {
    const merged = new Map();
    seedItems.forEach((item) => merged.set(item[key], { ...item }));
    storedItems.forEach((item) => {
      if (!item?.[key]) return;
      merged.set(item[key], {
        ...(merged.get(item[key]) || {}),
        ...item,
      });
    });
    return [...merged.values()];
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || !Array.isArray(stored.notes)) {
        const initial = cloneDefaultState();
        initial.words = [...BUILTIN_VOCABULARY, ...initial.words];
        return initial;
      }
      const fallback = cloneDefaultState();
      return {
        ...fallback,
        ...stored,
        categories:
          Array.isArray(stored.categories) && stored.categories.length
            ? stored.categories
            : fallback.categories,
        words:
          Array.isArray(stored.words) && stored.words.length
            ? mergeByKey(
                [...BUILTIN_VOCABULARY, ...fallback.words],
                stored.words,
                "id",
              )
            : [...BUILTIN_VOCABULARY, ...fallback.words],
        papers:
          Array.isArray(stored.papers) && stored.papers.length
            ? mergeByKey(fallback.papers, stored.papers, "id")
            : fallback.papers,
        books:
          Array.isArray(stored.books) && stored.books.length
            ? mergeByKey(fallback.books, stored.books, "id")
            : fallback.books,
        review: { ...fallback.review, ...(stored.review || {}) },
        vocabTest: { ...fallback.vocabTest, ...(stored.vocabTest || {}) },
        speech: { ...fallback.speech, ...(stored.speech || {}) },
        training: {
          ...fallback.training,
          ...(stored.training || {}),
          session: {
            ...fallback.training.session,
            ...(stored.training?.session || {}),
          },
        },
        translation: {
          ...fallback.translation,
          ...(stored.translation || {}),
          history: Array.isArray(stored.translation?.history)
            ? stored.translation.history
            : fallback.translation.history,
        },
      };
    } catch {
      return cloneDefaultState();
    }
  }

  let state;
  let speechVoices = [];
  let articleLibrary = [];
  let articleLibraryLoading = false;
  let articleLibraryError = "";
  let speechLibrary = [];
  let speechLibraryLoading = false;
  let speechLibraryError = "";
  let businessLibrary = [];
  let businessLibraryLoading = false;
  let businessLibraryError = "";

  function initializeState() {
    state = loadState();
    if (state.training?.session?.mode === "image-association") {
      state.training.session = {
        mode: "",
        index: 0,
        score: 0,
        items: [],
        revealed: false,
        feedback: "",
      };
    }
    if (Array.isArray(state.training?.completedTaskIds)) {
      state.training.completedTaskIds =
        state.training.completedTaskIds.filter(
          (id) => id !== "image-association",
      );
    }
    if (state.collectionCategory === "all") {
      state.collectionCategory = "全部";
    }
    if (!state.dailyWordIds.length) {
      state.dailyCompletedIds = [];
    }
    ensureDailyTraining();
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function ensureDailyTraining() {
    const today = todayKey();
    if (state.training.dailyDate !== today) {
      state.training.dailyDate = today;
      state.training.completedTaskIds = [];
      state.dailyWordIds = [];
      state.dailyCompletedIds = [];
    }
  }

  const saveState = () => {
    try {
      const persistedWords = state.words
        .filter(
          (word) =>
            !BUILTIN_WORD_IDS.has(word.id) ||
            word.userAdded ||
            word.noteId ||
            word.mastery > 0 ||
            Boolean(word.reviewAt),
        )
        .map((word) =>
          BUILTIN_WORD_IDS.has(word.id)
            ? {
                id: word.id,
                mastery: word.mastery,
                reviewAt: word.reviewAt,
                noteId: word.noteId,
              }
            : word,
        );
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, words: persistedWords }),
      );
    } catch {
      showToast("本地保存空间不足，请导出重要笔记。", "error");
    }
  };

  let saveTimer = null;
  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveState, 320);
  }

  function showToast(message, type = "info") {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icon(type === "success" ? "check" : "sparkles")}<span>${escapeHTML(
      message,
    )}</span>`;
    root.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function getRoute() {
    if (location.protocol === "file:") {
      return location.hash.replace(/^#\/?/, "").replace(/\/+$/, "") || "home";
    }
    let pathname = decodeURIComponent(location.pathname);
    if (APP_BASE && pathname.startsWith(APP_BASE)) {
      pathname = pathname.slice(APP_BASE.length);
    }
    return pathname.replace(/^\/+|\/+$/g, "") || "home";
  }

  function hrefFor(route) {
    const clean = route === "home" ? "" : route;
    if (location.protocol === "file:") return `#/${clean}`;
    return `${APP_BASE}/${clean}`;
  }

  function navigate(route, { replace = false } = {}) {
    state.mobileMenuOpen = false;
    const clean = route === "home" ? "" : route;
    if (location.protocol === "file:") {
      if (replace) location.replace(`#/${clean}`);
      else location.hash = `/${clean}`;
      return;
    }
    history[replace ? "replaceState" : "pushState"]({}, "", hrefFor(route));
    renderApp();
  }

  const pageMeta = {
    home: ["首页", "今天学什么"],
    study: ["学习", "学习中心"],
    "study/words": ["学习 / 单词", "单词学习"],
    "study/training": ["学习 / 训练中心", "单词训练中心"],
    "study/automotive": ["学习 / 汽车专业英语", "汽车专业英语"],
    "study/business": ["学习 / 商务英语", "商务英语"],
    "study/listening": ["学习 / 听力", "听力训练"],
    "study/speaking": ["学习 / 朗读", "跟读朗读"],
    "study/translation": ["学习 / 翻译与英语朗读", "翻译与英语朗读"],
    "study/plan": ["学习 / 学习计划", "学习计划"],
    speaking: ["AI 口语", "AI 英语口语"],
    exams: ["英语考试", "考试中心"],
    "exams/cet4": ["考试 / CET-4", "CET-4 模拟考试"],
    "exams/cet6": ["考试 / CET-6", "CET-6 模拟考试"],
    "exams/mock": ["考试 / 模拟考试", "模拟考试"],
    "exams/training": ["考试 / 专项训练", "专项训练"],
    "exams/mistakes": ["考试 / 错题本", "错题本"],
    reading: ["阅读", "英语阅读"],
    "reading/articles": ["阅读 / 英文阅读", "英文阅读"],
    "reading/collections": ["阅读 / 文章与文献库", "文章与文献库"],
    "reading/literature": ["阅读 / 英文文献", "英文文献"],
    "reading/library": ["阅读 / 英语书籍与资料", "英语书籍与资料"],
    "reading/mine": ["阅读 / 我的文章", "我的文章"],
    notes: ["笔记", "我的英语笔记"],
    "notes/review": ["笔记 / 待复习", "复习卡片"],
    profile: ["我的", "个人中心"],
    settings: ["设置", "偏好设置"],
    help: ["帮助", "帮助与反馈"],
  };

  function getActiveTop(route) {
    if (route.startsWith("study")) return "study";
    if (route.startsWith("exams")) return "exams";
    if (route.startsWith("reading")) return "reading";
    if (route.startsWith("notes")) return "notes";
    return route;
  }

  function renderSidebar() {
    const route = getRoute();
    const active = getActiveTop(route);
    const item = (r, label, iconName) =>
      `<a class="nav-item ${active === r ? "active" : ""}" href="${hrefFor(
        r,
      )}" data-route="${r}">${icon(iconName)}<span>${label}</span></a>`;
    const child = (r, label) =>
      `<a class="nav-child ${
        route === r ? "active" : ""
      }" href="${hrefFor(r)}" data-route="${r}">${label}</a>`;
    const toggle = (key, label, iconName, routes) => {
      const open = state.menuOpen[key] || routes.some((r) => route.startsWith(r));
      const isActive = routes.some((r) => route.startsWith(r));
      return `
        <button class="nav-toggle ${isActive ? "active" : ""}" data-action="toggle-nav" data-menu="${key}" aria-expanded="${open}">
          ${icon(iconName)}<span class="nav-label">${label}</span>${icon(
            "chevronDown",
            "chevron",
          )}
        </button>
        <div class="nav-children ${open ? "open" : ""}" data-nav-children="${key}">
          ${routes
            .map(([r, text]) => child(r, text))
            .join("")}
        </div>
      `;
    };

    return `
      <aside class="sidebar" aria-label="主导航">
        <a class="brand" href="${hrefFor("home")}" data-route="home">
          <span class="brand-mark">E</span>
          <span class="brand-name"><strong>English Buddy</strong><span>AI 学习空间</span></span>
        </a>
        <nav class="sidebar-nav">
          ${item("home", "首页", "home")}
          ${toggle(
            "study",
            "学习",
            "book-open",
            [
              ["study/words", "单词"],
              ["study/training", "训练中心"],
              ["study/automotive", "汽车英语"],
              ["study/business", "商务英语"],
              ["study/listening", "听力"],
              ["study/speaking", "朗读"],
              ["study/translation", "翻译"],
              ["study/plan", "学习计划"],
            ],
          )}
          ${item("speaking", "口语", "mic")}
          ${toggle(
            "exams",
            "考试",
            "graduation",
            [
              ["exams/cet4", "CET-4"],
              ["exams/cet6", "CET-6"],
              ["exams/mock", "模拟考试"],
              ["exams/training", "专项训练"],
              ["exams/mistakes", "错题本"],
            ],
          )}
          ${toggle(
            "reading",
            "阅读",
            "library",
            [
              ["reading/articles", "英文阅读"],
              ["reading/collections", "文章文献库"],
              ["reading/literature", "英文文献"],
              ["reading/library", "英语书籍与资料"],
              ["reading/mine", "我的文章"],
            ],
          )}
          ${item("notes", "笔记", "notebook")}
          ${item("profile", "我的", "user")}
        </nav>
        <div class="sidebar-footer">
          ${item("settings", "设置", "settings")}
          ${item("help", "帮助", "help")}
        </div>
      </aside>
    `;
  }

  function renderTopbar() {
    const route = getRoute();
    const [, title] = pageMeta[route] || pageMeta.home;
    return `
      <header class="topbar">
        <a class="mobile-brand" href="${hrefFor("home")}" data-route="home">
          <span class="brand-mark">E</span><span>English Buddy</span>
        </a>
        <button class="icon-button mobile-menu-button" data-action="toggle-mobile-more" aria-label="打开全部功能">${icon(
          "menu",
        )}</button>
        <button class="global-search" data-action="open-search" aria-label="全局搜索">
          ${icon("search")}<span>搜索单词、笔记、文章或题目</span><span class="kbd">⌘K</span>
        </button>
        <div class="topbar-actions">
          <div class="top-day" title="连续学习">${icon("flame")} 12 天</div>
          <button class="icon-button" data-action="notifications" aria-label="学习提醒">${icon(
            "bell",
          )}</button>
          <a class="avatar-button" href="${hrefFor(
            "profile",
          )}" data-route="profile" aria-label="打开个人中心">L</a>
        </div>
        <span class="sr-only">${escapeHTML(title)}</span>
      </header>
    `;
  }

  function renderMobileNav() {
    const route = getRoute();
    const active = getActiveTop(route);
    const items = [
      ["home", "首页", "home"],
      ["study", "学习", "book-open"],
      ["speaking", "口语", "mic"],
      ["notes", "笔记", "notebook"],
      ["profile", "我的", "user"],
    ];
    return `
      <nav class="mobile-bottom-nav" aria-label="移动端导航">
        ${items
          .map(
            ([r, label, iconName]) => `
              <a class="mobile-nav-item ${
                active === r ? "active" : ""
              }" href="${hrefFor(r)}" data-route="${r}">
                ${icon(iconName)}<span>${label}</span>
              </a>`,
          )
          .join("")}
      </nav>
      <div class="mobile-more-panel ${
        state.mobileMenuOpen ? "open" : ""
      }">
        <div class="mobile-more-head">
          <strong>全部功能</strong>
          <button class="icon-button" data-action="toggle-mobile-more" aria-label="关闭菜单">${icon(
            "x",
          )}</button>
        </div>
        <div class="mobile-more-grid">
          ${[
            ["study/words", "单词", "type"],
            ["study/training", "训练中心", "target"],
            ["study/automotive", "汽车英语", "car"],
            ["study/business", "商务英语", "chart"],
            ["study/listening", "听力", "headphones"],
            ["study/speaking", "朗读", "mic"],
            ["study/translation", "翻译", "languages"],
            ["study/plan", "学习计划", "calendar"],
            ["exams/cet4", "CET-4", "graduation"],
            ["exams/cet6", "CET-6", "graduation"],
            ["exams/mock", "模拟考试", "clock"],
            ["exams/training", "专项训练", "target"],
            ["exams/mistakes", "错题本", "notebook"],
            ["reading/articles", "英文阅读", "book-open"],
            ["reading/collections", "文章文献库", "layers"],
            ["reading/literature", "英文文献", "library"],
            ["reading/library", "书籍资料", "layers"],
            ["reading/mine", "我的文章", "file"],
            ["notes/review", "待复习", "refresh"],
            ["settings", "设置", "settings"],
          ]
            .map(
              ([routeName, label, iconName]) =>
                `<a href="${hrefFor(
                  routeName,
                )}" data-route="${routeName}">${icon(
                  iconName,
                )}<span>${label}</span></a>`,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderAiFab() {
    const route = getRoute();
    const examMode =
      route === "exams/mock" ||
      route === "exams/cet4" ||
      route === "exams/cet6";
    if (examMode) return "";
    return `
      <button class="ai-fab" data-action="toggle-ai" aria-label="打开 AI 学习助手">
        ${icon("sparkles")}
      </button>
    `;
  }

  function renderAiPanel() {
    if (!state.aiOpen) return "";
    const route = getRoute();
    if (!state.aiMessages.length) {
      const context = route.startsWith("reading")
        ? "需要我解释当前文章，或帮你提取重点词汇吗？"
        : route.startsWith("notes")
          ? "我可以帮你整理笔记、提取词组，或生成复习卡片。"
          : route.startsWith("speaking")
            ? "准备好后，我们可以围绕今天的主题开始对话。"
            : "今天想先提高哪一项？我可以根据你的目标安排下一步。";
      state.aiMessages.push({ role: "assistant", text: context });
    }
    return `
      <section class="ai-panel" aria-label="AI 学习助手">
        <div class="ai-panel-header">
          <span class="ai-avatar">${icon("sparkles")}</span>
          <div><strong>English Buddy AI</strong><span>会根据当前页面提供帮助</span></div>
          <button class="icon-button" data-action="close-ai" aria-label="关闭 AI 助手">${icon(
            "x",
          )}</button>
        </div>
        <div class="ai-messages">
          ${state.aiMessages
            .map(
              (message) =>
                `<div class="ai-message ${message.role}">${escapeHTML(
                  message.text,
                )}</div>`,
            )
            .join("")}
        </div>
        <div class="ai-suggestions">
          ${[
            route.startsWith("notes") ? "整理这段笔记" : "解释一个难点",
            "生成 3 道练习",
            "帮我制定今天计划",
          ]
            .map(
              (text) =>
                `<button class="suggestion-chip" data-action="ai-suggestion" data-text="${escapeHTML(
                  text,
                )}">${text}</button>`,
            )
            .join("")}
        </div>
        <form class="ai-composer" data-form="ai-message">
          <input class="input" name="message" autocomplete="off" placeholder="向 AI 提问…" />
          <button class="btn primary icon-only" aria-label="发送">${icon(
            "send",
          )}</button>
        </form>
      </section>
    `;
  }

  function renderApp() {
    try {
      renderAppView();
    } catch (error) {
      console.error("English Buddy render error:", error);
      renderFatalError(error);
    }
  }

  function renderAppView() {
    const app = document.getElementById("app");
    if (!app) return;
    const route = getRoute();
    if (
      !pageMeta[route] &&
      !route.startsWith("notes/") &&
      !route.startsWith("reading/literature/") &&
      !route.startsWith("reading/collection/")
    ) {
      navigate("home", { replace: true });
      return;
    }
    app.innerHTML = `
      <div class="app-shell">
        ${renderSidebar()}
        <div class="main-shell">
          ${renderTopbar()}
          <main>${renderPage(route)}</main>
        </div>
        ${renderMobileNav()}
        ${renderAiFab()}
        ${renderAiPanel()}
      </div>
    `;
    bindPage(route);
  }

  function renderFatalError(error) {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
      <div class="app-shell">
        ${renderSidebar()}
        <div class="main-shell">
          ${renderTopbar()}
          <main>
            <div class="page narrow">
              <div class="empty-state">
                <div>
                  <span class="empty-icon">${icon("refresh")}</span>
                  <h3>暂时无法完成页面加载</h3>
                  <p>网站已经保留本地学习数据。请重试；如果问题持续出现，可在设置中运行功能自检。</p>
                  <button class="btn primary" data-action="reload-page">${icon(
                    "refresh",
                  )}重试</button>
                  <button class="btn" data-action="run-diagnostics">${icon(
                    "shield",
                  )}功能自检</button>
                </div>
              </div>
              <p class="sr-only">${escapeHTML(error?.message || "Unknown error")}</p>
            </div>
          </main>
        </div>
      </div>
    `;
  }

  function renderPage(route) {
    if (route === "home") return renderHomePage();
    if (route === "study") return renderStudyOverview();
    if (route === "study/automotive") return renderAutomotiveWorkspace();
    if (route === "study/business") return renderBusinessWorkspace();
    if (route.startsWith("study/")) return renderStudyPage(route);
    if (route === "speaking") return renderSpeakingPage();
    if (route === "exams") return renderExamsOverview();
    if (route.startsWith("exams/")) return renderExamPage(route);
    if (route === "reading") return renderReadingOverview();
    if (route === "reading/collections") return renderArticleLibrary();
    if (route.startsWith("reading/collection/"))
      return renderArticleDetail(route.split("/").pop());
    if (route.startsWith("reading/literature/"))
      return renderLiteratureDetail(route.split("/").pop());
    if (route.startsWith("reading/")) return renderReadingPage(route);
    if (route === "notes") return renderNotesPage();
    if (route === "notes/review") return renderReviewPage();
    if (route.startsWith("notes/")) return renderNoteEditor(route.split("/")[1]);
    if (route === "profile") return renderProfilePage();
    if (route === "settings") return renderSettingsPage();
    if (route === "help") return renderHelpPage();
    return renderNotFound();
  }

  function renderPageHeader(eyebrow, title, subtitle, actions = "") {
    return `
      <header class="page-header">
        <div>
          ${eyebrow ? `<div class="eyebrow">${escapeHTML(eyebrow)}</div>` : ""}
          <h1 class="page-title">${escapeHTML(title)}</h1>
          ${subtitle ? `<p class="page-subtitle">${escapeHTML(subtitle)}</p>` : ""}
        </div>
        ${actions ? `<div class="page-actions">${actions}</div>` : ""}
      </header>
    `;
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 6) return "Still up?";
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  }

  function renderHomePage() {
    const dailyContent =
      DAILY_ENGLISH_CONTENT[
        Math.floor(baseNow / 86400000) % DAILY_ENGLISH_CONTENT.length
      ];
    const recentNotes = [...state.notes]
      .filter((note) => !note.archived)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3);
    return `
      <div class="page">
        <section class="home-hero">
          <div class="hero-copy">
            <div class="hero-greeting">${greeting()}</div>
            <h1 class="hero-title">今天学什么？</h1>
            <p>准备开始今天的英语学习了吗？先完成一个小任务，AI 会根据结果调整接下来的计划。</p>
            <button class="btn primary" data-action="continue-learning">${icon(
              "play",
            )}继续学习</button>
          </div>
          <div class="hero-progress">
            <div class="progress-ring"><strong>0%</strong></div>
            <div class="hero-progress-title">今日学习进度</div>
            <p class="hero-progress-note">完成 1 个任务即可开始记录</p>
          </div>
        </section>

        <section class="section daily-english-section">
          <div class="panel daily-english-card">
            <div class="daily-english-copy">
              <div class="eyebrow">TODAY'S ENGLISH</div>
              <h2>${escapeHTML(dailyContent.english)}</h2>
              <p>${escapeHTML(dailyContent.chinese)}</p>
              <div class="daily-english-note">
                <span class="note-category">${escapeHTML(
                  dailyContent.type,
                )}</span>
                <span>${escapeHTML(dailyContent.note)}</span>
              </div>
            </div>
            <div class="daily-english-actions">
              <button class="btn primary" data-action="speak-text" data-text="${escapeHTML(
                dailyContent.english,
              )}">${icon("volume")}朗读</button>
              <button class="btn" data-action="shadow-daily-text" data-text="${escapeHTML(
                dailyContent.english,
              )}">${icon("mic")}跟读</button>
              <button class="btn soft" data-action="save-daily-content">${icon(
                "plus",
              )}加入笔记</button>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <div><h2>今日任务</h2><p>约 28 分钟，按自己的节奏完成</p></div>
            <a class="section-link" href="${hrefFor(
              "study/plan",
            )}" data-route="study/plan">调整计划 ${icon("chevronRight")}</a>
          </div>
          <div class="daily-grid">
            ${[
              [
                "training",
                "单词训练",
                "卡片 · 听力 · 拼写 · 跟读",
                35,
                "target",
              ],
              ["listening", "听力", "校园注册场景", 0, "headphones"],
              ["articles", "阅读", "环境保护短文", 0, "book-open"],
              ["speaking", "口语", "问路对话", 0, "mic"],
              ["exams", "考试", "CET-4 阅读专项", 0, "graduation"],
            ]
              .map(
                ([route, title, desc, progress, iconName]) => `
                  <a class="task-card" href="${hrefFor(
                    route === "exams" ? "exams/training" : `study/${route}`,
                  )}" data-route="${
                    route === "exams" ? "exams/training" : `study/${route}`
                  }">
                    <span class="task-icon">${icon(iconName)}</span>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <div class="mini-progress"><span style="width:${progress}%"></span></div>
                  </a>`,
              )
              .join("")}
          </div>
        </section>

        <section class="section dashboard-grid">
          <div class="panel">
            <div class="section-head panel-body" style="padding-bottom:0">
              <div><h2>继续上次的学习</h2><p>停在“环境保护”第 2 段</p></div>
            </div>
            <div class="continue-panel">
              <div class="continue-cover">Aa</div>
              <div>
                <h3>CET-4 阅读：环境保护</h3>
                <p>阅读 · 6 / 10 题 · 上次学习 2 小时前</p>
                <div class="week-row">
                  ${["一", "二", "三", "四", "五", "六", "日"]
                    .map(
                      (day, index) =>
                        `<span class="week-day ${
                          index < 4 ? "done" : ""
                        } ${index === 4 ? "today" : ""}">${day}</span>`,
                    )
                    .join("")}
                </div>
              </div>
              <a class="btn primary" href="${hrefFor(
                "reading/articles",
              )}" data-route="reading/articles">继续</a>
            </div>
          </div>
          <div class="panel">
            <div class="section-head panel-body" style="padding-bottom:10px">
              <div><h2>最近笔记</h2><p>${
                state.notes.filter((note) => !note.archived).length
              } 条内容已沉淀</p></div>
              <a class="section-link" href="${hrefFor(
                "notes",
              )}" data-route="notes">全部 ${icon("chevronRight")}</a>
            </div>
            <div class="notes-preview">
              ${recentNotes
                .map(
                  (note) => `
                    <a class="note-preview-item" href="${hrefFor(
                      `notes/${note.id}`,
                    )}" data-route="notes/${note.id}">
                      <span class="note-dot"></span>
                      <div><strong>${escapeHTML(note.title)}</strong><span>${escapeHTML(
                        categoryName(note.category),
                      )}</span></div>
                      <time>${formatRelative(note.updatedAt)}</time>
                    </a>`,
                )
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function categoryName(id) {
    return state.categories.find((category) => category.id === id)?.name || "其他";
  }

  function formatRelative(dateValue) {
    if (!dateValue) return "尚未安排";
    const date = new Date(dateValue);
    const diff = baseNow - date.getTime();
    const minutes = Math.max(1, Math.round(Math.abs(diff) / 60000));
    if (diff >= 0 && minutes < 60) return `${minutes} 分钟前`;
    if (diff >= 0 && minutes < 1440)
      return `今天 ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`;
    if (diff >= 0 && minutes < 2880) return "昨天";
    if (diff >= 0 && minutes < 10080) return `${Math.round(minutes / 1440)} 天前`;
    if (diff < 0 && minutes < 1440)
      return `今天 ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`;
    if (diff < 0 && minutes < 2880) return "明天";
    if (diff < 0 && minutes < 10080) return `${Math.round(minutes / 1440)} 天后`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function noteMatchesCategory(note, category) {
    if (category === "archived") return Boolean(note.archived);
    if (note.archived) return false;
    if (category === "all") return true;
    if (category === "favorites") return note.favorite;
    if (category === "pinned") return note.pinned;
    if (category === "review") return Boolean(note.reviewAt);
    return note.category === category;
  }

  function filterNotes() {
    const query = state.noteQuery.trim().toLowerCase();
    return state.notes
      .filter((note) => noteMatchesCategory(note, state.activeCategory))
      .filter(
        (note) =>
          !state.activeTag || (note.tags || []).includes(state.activeTag),
      )
      .filter((note) => {
        if (!query) return true;
        return [
          note.title,
          note.summary,
          stripHTML(note.body),
          categoryName(note.category),
          ...(note.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }

  function renderNoteCard(note) {
    return `
      <article class="note-card" data-action="open-note" data-id="${note.id}" tabindex="0">
        <div class="note-card-top">
          <span class="note-category">${escapeHTML(
            categoryName(note.category),
          )}</span>
          ${note.pinned ? `<span class="note-pin" title="已置顶">${icon("pin")}</span>` : ""}
          <button class="icon-button note-favorite ${
            note.favorite ? "active" : ""
          }" data-action="toggle-favorite" data-id="${note.id}" aria-label="${
            note.favorite ? "取消收藏" : "收藏"
          }">${icon("bookmark")}</button>
        </div>
        <h3>${escapeHTML(note.title)}</h3>
        <p>${escapeHTML(note.summary || stripHTML(note.body).slice(0, 120))}</p>
        <div class="note-tags">
          ${(note.tags || [])
            .slice(0, 4)
            .map(
              (tag) =>
                `<button class="tag tag-button" data-action="filter-tag" data-tag="${escapeHTML(
                  tag,
                )}">${escapeHTML(tag)}</button>`,
            )
            .join("")}
        </div>
        <div class="note-card-footer">
          <span>${formatRelative(note.updatedAt)} 更新</span>
          <span>${wordCount(note.body)} 字</span>
        </div>
      </article>
    `;
  }

  function wordCount(html) {
    return stripHTML(html).length;
  }

  function noteReadingMinutes(note) {
    return Math.max(1, Math.ceil(wordCount(note.body) / 450));
  }

  function getRelatedNotes(note) {
    return state.notes
      .filter(
        (item) =>
          item.id !== note.id &&
          !item.archived &&
          (item.category === note.category ||
            (item.tags || []).some((tag) => (note.tags || []).includes(tag))),
      )
      .map((item) => ({
        note: item,
        score:
          (item.category === note.category ? 2 : 0) +
          (item.tags || []).filter((tag) =>
            (note.tags || []).includes(tag),
          ).length,
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.note.updatedAt) - new Date(a.note.updatedAt),
      )
      .slice(0, 4)
      .map((item) => item.note);
  }

  function getNoteOutline(note) {
    return [...String(note.body || "").matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
      .map((match) => stripHTML(match[1]))
      .filter(Boolean)
      .slice(0, 8);
  }

  function formatWordForms(forms) {
    const labels = {
      p: "过去式",
      d: "过去分词",
      i: "现在分词",
      "3": "第三人称单数",
      r: "比较级",
      t: "最高级",
      s: "复数",
      "0": "原形",
      "1": "变化",
    };
    return String(forms || "")
      .split("/")
      .map((item) => {
        const [key, ...rest] = item.split(":");
        const value = rest.join(":").trim();
        if (!value) return "";
        return `${labels[key] || key}：${value}`;
      })
      .filter(Boolean)
      .join(" · ");
  }

  function renderNotesPage() {
    const filtered = filterNotes();
    const recent = [...filtered].slice(0, 6);
    const recentStudy = filtered
      .filter((note) =>
        ["reading", "listening", "exam", "speaking", "literature"].includes(
          note.category,
        ),
      )
      .slice(0, 3);
    const favorite = filtered.filter((note) => note.favorite).slice(0, 3);
    const important = filtered.filter((note) => note.important).slice(0, 3);
    const due = state.notes.filter(
      (note) =>
        !note.archived &&
        note.reviewAt &&
        new Date(note.reviewAt).getTime() <= baseNow + 86400000,
    );

    const groups = [
      ["最近编辑", recent],
      ["最近学习", recentStudy],
      ["最近收藏", favorite],
      ["重要笔记", important],
    ].filter(([, notes]) => notes.length);

    return `
      <div class="page">
        ${renderPageHeader(
          "English Notes",
          "我的英语笔记",
          "把学过的内容真正留下来。",
          `
            <button class="btn" data-action="open-quick-record">${icon(
              "clock",
            )}快速记录</button>
            <button class="btn" data-action="random-note-review">${icon(
              "refresh",
            )}今日回忆</button>
            <button class="btn soft" data-action="open-ai-organize">${icon(
              "sparkles",
            )}AI 整理</button>
            <button class="btn soft" data-action="export-all-notes">${icon(
              "file",
            )}导出全部</button>
            <button class="btn primary" data-action="new-note">${icon(
              "plus",
            )}新建笔记</button>
          `,
        )}

        <div class="notes-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="notes-search" value="${escapeHTML(
              state.noteQuery,
            )}" placeholder="搜索标题、正文、单词、标签或分类" />
          </label>
          <button class="btn" data-action="open-search">${icon(
            "search",
          )}全文搜索</button>
          ${
            state.activeTag
              ? `<button class="btn soft" data-action="clear-tag-filter">${icon(
                  "tag",
                )}标签：${escapeHTML(state.activeTag)} ${icon("x")}</button>`
              : ""
          }
          <button class="btn" data-action="generate-review" data-id="${
            filtered[0]?.id || state.notes[0]?.id || ""
          }">${icon("refresh")}生成复习卡片</button>
        </div>

        <div class="notes-layout">
          <aside class="panel category-panel">
            <div class="category-title"><span>我的分类</span><button class="icon-button" data-action="show-category-create" aria-label="新建分类">${icon(
              "plus",
            )}</button></div>
            <div class="category-list">
              ${renderCategoryButton("all", "全部笔记", "notebook")}
              ${state.categories
                .map((category) =>
                  renderCategoryButton(
                    category.id,
                    category.name,
                    category.icon || "folder",
                    true,
                  ),
                )
                .join("")}
              ${renderCategoryButton("favorites", "我的收藏", "bookmark")}
              ${renderCategoryButton("pinned", "置顶笔记", "pin")}
              ${renderCategoryButton("review", "待复习", "clock")}
              ${renderCategoryButton("archived", "归档", "archive")}
            </div>
            <form class="category-create" data-form="create-category">
              <input class="input" name="category" maxlength="18" placeholder="分类名称" />
              <button class="btn primary small">添加</button>
            </form>
          </aside>

          <section class="notes-main">
            <div class="notes-stats">
              ${[
                [
                  "全部笔记",
                  state.notes.filter((note) => !note.archived).length,
                ],
                [
                  "收藏",
                  state.notes.filter(
                    (note) => !note.archived && note.favorite,
                  ).length,
                ],
                [
                  "重要",
                  state.notes.filter(
                    (note) => !note.archived && note.important,
                  ).length,
                ],
                ["待复习", due.length],
              ]
                .map(
                  ([label, value]) =>
                    `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
                )
                .join("")}
            </div>

            <div class="review-banner">
              <span class="review-banner-icon">${icon("clock")}</span>
              <div><strong>今日待复习 ${due.length} 条</strong><p>你有 ${
                due.length
              } 个英语知识点需要复习。完成后会自动调整下次复习时间。</p></div>
              <a class="btn primary small" href="${hrefFor(
                "notes/review",
              )}" data-route="notes/review">开始复习</a>
            </div>

            ${
              filtered.length
                ? groups
                    .map(
                      ([label, notes]) => `
                        <section class="note-group">
                          <div class="section-head">
                            <div><h2>${label}</h2><p>${notes.length} 条笔记</p></div>
                            ${
                              label === "最近编辑"
                                ? `<button class="section-link" data-action="show-all-notes">查看全部 ${icon(
                                    "chevronRight",
                                  )}</button>`
                                : ""
                            }
                          </div>
                          <div class="note-grid">${notes
                            .map(renderNoteCard)
                            .join("")}</div>
                        </section>
                      `,
                    )
                    .join("")
                : renderEmptyNotes()
            }
          </section>
        </div>
      </div>
    `;
  }

  function renderCategoryButton(id, name, iconName, editable = false) {
    const count = state.notes.filter((note) =>
      noteMatchesCategory(note, id),
    ).length;
    return `
      <button class="category-item ${
        state.activeCategory === id ? "active" : ""
      }" data-action="set-category" data-category="${id}">
        ${icon(iconName)}<span>${escapeHTML(name)}</span>
        <span class="category-count">${count}</span>
        ${
          editable
            ? `<span class="icon-button category-menu" data-action="manage-category" data-category="${id}" title="管理分类">${icon(
                "more",
              )}</span>`
            : ""
        }
      </button>
    `;
  }

  function renderEmptyNotes() {
    return `
      <div class="empty-state">
        <div>
          <span class="empty-icon">${icon("notebook")}</span>
          <h3>还没有英语笔记</h3>
          <p>把今天学到的第一句话记录下来吧。单词、好句、错题和文章都可以沉淀到这里。</p>
          <button class="btn primary" data-action="new-note">${icon(
            "plus",
          )}新建笔记</button>
        </div>
      </div>
    `;
  }

  function renderNoteEditor(id) {
    const note = state.notes.find((item) => item.id === id);
    if (!note) {
      return `
        <div class="page narrow">
          <div class="empty-state">
            <div>
              <span class="empty-icon">${icon("notebook")}</span>
              <h3>这篇笔记不存在</h3>
              <p>它可能已经被删除，或链接输入有误。</p>
              <button class="btn primary" data-route="notes" data-action="go-route">返回笔记中心</button>
            </div>
          </div>
        </div>
      `;
    }
    const outline = getNoteOutline(note);
    const relatedNotes = getRelatedNotes(note);
    return `
      <div class="page">
        <div class="editor-shell">
          <div class="editor-topline">
            <a class="editor-back" href="${hrefFor(
              "notes",
            )}" data-route="notes">${icon("arrowLeft")}我的英语笔记</a>
            <span class="editor-save-state" id="save-state">${icon(
              "check",
            )} 已保存到本地</span>
          </div>
          <div class="editor-layout">
            <section class="panel editor-panel">
              <input
                class="editor-title"
                id="editor-title"
                value="${escapeHTML(note.title)}"
                placeholder="无标题笔记"
                maxlength="100"
              />
              <div class="editor-meta-row">
                <span>${categoryName(note.category)}</span>
                <span>·</span>
                <span>${formatRelative(note.updatedAt)}更新</span>
                <span>·</span>
                <span>${wordCount(note.body)} 字</span>
                <span>·</span>
                <span>约 ${noteReadingMinutes(note)} 分钟阅读</span>
              </div>
              <div class="editor-toolbar" role="toolbar" aria-label="笔记格式">
                ${[
                  ["bold", "bold", "加粗"],
                  ["italic", "italic", "斜体"],
                  ["underline", "underline", "下划线"],
                  ["hiliteColor", "highlighter", "高亮"],
                ]
                  .map(
                    ([command, iconName, label]) =>
                      `<button class="toolbar-button" data-action="editor-command" data-command="${command}" title="${label}">${icon(
                        iconName,
                      )}</button>`,
                  )
                  .join("")}
                <span class="toolbar-divider"></span>
                ${[
                  ["h2", "heading", "标题"],
                  ["insertUnorderedList", "list", "列表"],
                  ["formatBlock:blockquote", "quote", "引用"],
                  ["insertHorizontalRule", "minus", "分隔线"],
                ]
                  .map(
                    ([command, iconName, label]) =>
                      `<button class="toolbar-button" data-action="editor-command" data-command="${command}" title="${label}">${icon(
                        iconName,
                      )}</button>`,
                  )
                  .join("")}
                <span class="toolbar-divider"></span>
                <button class="toolbar-button" data-action="insert-image" title="图片">${icon(
                  "image",
                )}</button>
                <button class="toolbar-button" data-action="insert-table" title="表格">${icon(
                  "table",
                )}</button>
                <button class="toolbar-button" data-action="insert-english-block" title="英语内容块">${icon(
                  "languages",
                )}</button>
                <button class="toolbar-button" data-action="open-note-templates" title="笔记模板">${icon(
                  "layers",
                )}</button>
                <button class="toolbar-button" data-action="ai-note-summary" title="AI 总结笔记">${icon(
                  "sparkles",
                )}</button>
              </div>
              <div
                class="editor-content"
                id="editor-content"
                contenteditable="true"
                data-placeholder="开始记录，或粘贴你今天学到的英语内容…"
              >${note.body}</div>
              <input class="hidden" id="editor-image-input" type="file" accept="image/*" />
            </section>

            <aside class="editor-side">
              <section class="panel side-panel">
                <h3>${icon("sparkles")}AI 英语学习</h3>
                <label class="field-label" for="english-ai-input">输入一句英语</label>
                <textarea
                  class="textarea"
                  id="english-ai-input"
                  rows="3"
                  placeholder="How do I get to the station?"
                ></textarea>
                <button class="btn soft" style="width:100%;margin-top:9px" data-action="ai-learn">${icon(
                  "sparkles",
                )}AI 学习</button>
                <div id="ai-analysis"></div>
              </section>

              <section class="panel side-panel">
                <h3>${icon("folder")}笔记信息</h3>
                <div class="field">
                  <label class="field-label" for="note-category">分类</label>
                  <select class="select" id="note-category">
                    ${state.categories
                      .map(
                        (category) =>
                          `<option value="${category.id}" ${
                            note.category === category.id ? "selected" : ""
                          }>${escapeHTML(category.name)}</option>`,
                      )
                      .join("")}
                  </select>
                </div>
                <div class="field">
                  <label class="field-label">标签</label>
                  <div class="tag-editor" id="tag-editor">
                    ${(note.tags || [])
                      .map(
                        (tag) => `
                          <span class="tag">${escapeHTML(
                            tag,
                          )}<button class="tag-remove" data-action="remove-tag" data-tag="${escapeHTML(
                            tag,
                          )}" aria-label="移除 ${escapeHTML(tag)}">${icon(
                            "x",
                          )}</button></span>`,
                      )
                      .join("")}
                  </div>
                  <form class="input-with-action" style="margin-top:8px" data-form="add-tag">
                    <input class="input" name="tag" maxlength="16" placeholder="添加标签" />
                    <button class="btn small" aria-label="添加标签">${icon(
                      "plus",
                    )}</button>
                  </form>
                </div>
              </section>

              <section class="panel side-panel">
                <h3>${icon("list")}笔记大纲</h3>
                ${
                  outline.length
                    ? `<div class="note-outline-list">${outline
                        .map(
                          (heading, index) =>
                            `<button data-action="scroll-note-heading" data-index="${index}"><span>${
                              index + 1
                            }</span>${escapeHTML(heading)}</button>`,
                        )
                        .join("")}</div>`
                    : `<p class="side-empty">添加标题后会自动生成笔记大纲。</p>`
                }
              </section>

              <section class="panel side-panel">
                <h3>${icon("layers")}相关笔记</h3>
                ${
                  relatedNotes.length
                    ? `<div class="related-note-list">${relatedNotes
                        .map(
                          (item) => `
                            <button data-action="open-note" data-id="${
                              item.id
                            }">
                              <strong>${escapeHTML(item.title)}</strong>
                              <span>${escapeHTML(
                                (item.tags || []).slice(0, 3).join(" · ") ||
                                  categoryName(item.category),
                              )}</span>
                            </button>`,
                        )
                        .join("")}</div>`
                    : `<p class="side-empty">还没有同分类或相同标签的笔记。</p>`
                }
              </section>

              <section class="panel side-panel">
                <h3>${icon("target")}笔记操作</h3>
                <div class="editor-actions">
                  <button class="btn small ${
                    note.favorite ? "soft" : ""
                  }" data-action="toggle-favorite" data-id="${note.id}">${icon(
                    "bookmark",
                  )}${note.favorite ? "取消收藏" : "收藏"}</button>
                  <button class="btn small ${
                    note.pinned ? "soft" : ""
                  }" data-action="toggle-pin" data-id="${note.id}">${icon(
                    "pin",
                  )}${note.pinned ? "取消置顶" : "置顶"}</button>
                  <button class="btn small" data-action="generate-review" data-id="${
                    note.id
                  }">${icon("refresh")}复习卡片</button>
                  <button class="btn small" data-action="schedule-review" data-id="${
                    note.id
                  }">${icon("clock")}安排复习</button>
                </div>
                <button class="btn small" style="width:100%;margin-top:7px" data-action="${
                  note.archived ? "restore-note" : "archive-note"
                }" data-id="${note.id}">${icon("archive")}${
                  note.archived ? "恢复笔记" : "归档笔记"
                }</button>
                <div class="editor-actions" style="margin-top:7px">
                  <button class="btn small" data-action="duplicate-note" data-id="${
                    note.id
                  }">${icon("layers")}复制</button>
                  <button class="btn small" data-action="export-note-markdown" data-id="${
                    note.id
                  }">${icon("file")}Markdown</button>
                </div>
              </section>

              <button class="btn danger" data-action="delete-note" data-id="${
                note.id
              }">${icon("trash")}删除笔记</button>
            </aside>
          </div>
        </div>
      </div>
    `;
  }

  function renderReviewPage() {
    return `
      <div class="page narrow">
        ${renderPageHeader(
          "Spaced Repetition",
          "待复习",
          "用间隔复习把短期记忆变成长期掌握。",
          `<a class="btn" href="${hrefFor(
            "notes",
          )}" data-route="notes">${icon("arrowLeft")}返回笔记</a>`,
        )}
        <section class="panel panel-body">
          <div class="section-head">
            <div><h2>今日复习</h2><p>完成 8 个知识点，预计 6 分钟</p></div>
            <span class="tag">AI 自动排序</span>
          </div>
          <div class="study-hero review-overview-grid">
            <div class="content-card" style="min-height:360px;display:grid;place-items:center;text-align:center">
              <div>
                <span class="empty-icon">${icon("refresh")}</span>
                <h3>准备好开始复习了吗？</h3>
                <p>系统会优先显示即将遗忘的内容，并根据“我认识 / 我不认识”自动调整间隔。</p>
                <button class="btn primary" data-action="start-review">${icon(
                  "play",
                )}开始复习</button>
              </div>
            </div>
            <div class="panel panel-body">
              <h3>复习计划</h3>
              <div class="progress-list">
                ${[
                  ["今天", 8, 100],
                  ["明天", 5, 22],
                  ["3 天后", 12, 8],
                  ["7 天后", 18, 0],
                ]
                  .map(
                    ([label, count, progress]) => `
                      <div class="progress-row">
                        <span>${label}<strong>${count} 条</strong></span>
                        <div class="large-progress"><span style="width:${progress}%"></span></div>
                      </div>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderStudyOverview() {
    return `
      <div class="page">
        ${renderPageHeader(
          "Learning Hub",
          "学习中心",
          "沿着同一条学习路径，把输入、练习和输出连接起来。",
          `<a class="btn primary" href="${hrefFor(
            "study/words",
          )}" data-route="study/words">${icon("play")}继续学习</a>`,
        )}
        <section class="home-hero">
          <div class="hero-copy">
            <div class="hero-greeting">Today's focus</div>
            <h1 class="hero-title">今天先把 20 个单词真正用起来</h1>
            <p>不是快速浏览，而是完成识别、听音、造句和复习四个步骤。</p>
            <a class="btn primary" href="${hrefFor(
              "study/words",
            )}" data-route="study/words">${icon("play")}开始单词训练</a>
          </div>
          <div class="hero-progress">
            <div class="progress-ring"><strong>36%</strong></div>
            <div class="hero-progress-title">本周学习目标</div>
            <p class="hero-progress-note">已完成 3 / 5 天</p>
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <div><h2>学习模块</h2><p>每个模块都统一包含进度、练习和完成状态</p></div>
          </div>
          <div class="cards-grid">
            ${[
              [
                "study/words",
                "单词",
                "用例句和发音建立真实语境",
                "今日 20 词",
                "type",
              ],
              [
                "study/training",
                "训练中心",
                "卡片、听音、拼写、填空和跟读",
                "每日 7 项任务",
                "target",
              ],
              [
                "study/automotive",
                "汽车专业英语",
                "整车、发动机、新能源、维修与制造术语",
                "230 个专业词条",
                "car",
              ],
              [
                "study/business",
                "商务英语",
                "管理、财务、市场、供应链和国际商务术语",
                "3000 个商务词条",
                "chart",
              ],
              [
                "study/listening",
                "听力",
                "从校园、旅行到学术场景",
                "校园注册",
                "headphones",
              ],
              [
                "study/speaking",
                "朗读",
                "跟读、评分并修正语音",
                "今日 3 句",
                "mic",
              ],
              [
                "study/translation",
                "翻译",
                "中英互译并学习自然表达",
                "2 组练习",
                "languages",
              ],
            ]
              .map(
                ([route, title, desc, meta, iconName]) => `
                  <a class="content-card" href="${hrefFor(
                    route,
                  )}" data-route="${route}">
                    <span class="task-icon">${icon(iconName)}</span>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <div class="content-card-meta"><span>${meta}</span><span>·</span><span>约 8 分钟</span></div>
                  </a>`,
              )
              .join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderVocabularyWorkspace() {
    const decks = [
      "全部词库",
      ...new Set(state.words.map((word) => word.deck)),
    ];
    const query = state.wordQuery.trim().toLowerCase();
    const words = state.words
      .filter(
        (word) =>
          state.activeWordDeck === "全部词库" ||
          word.deck === state.activeWordDeck,
      )
      .filter((word) => {
        if (state.wordStatusFilter === "new") return word.mastery === 0;
        if (state.wordStatusFilter === "learning")
          return word.mastery > 0 && word.mastery < 80;
        if (state.wordStatusFilter === "mastered") return word.mastery >= 80;
        return true;
      })
      .filter((word) =>
        `${word.word} ${word.meaning} ${word.definition || ""} ${
          word.forms || ""
        } ${word.source} ${(word.tags || []).join(" ")}`
          .toLowerCase()
          .includes(query),
      );
    const activeWord =
      words.find((word) => word.id === state.activeWordId) ||
      words[0] ||
      state.words.find((word) => word.id === state.activeWordId) ||
      state.words[0];
    const pageSize = 80;
    const totalPages = Math.max(1, Math.ceil(words.length / pageSize));
    const wordPage = Math.min(state.wordPage, totalPages - 1);
    const visibleWords = words.slice(
      wordPage * pageSize,
      wordPage * pageSize + pageSize,
    );
    const mastered = state.words.filter((word) => word.mastery >= 80).length;
    const learning = state.words.filter(
      (word) => word.mastery > 0 && word.mastery < 80,
    ).length;
    const needReview = state.words.filter(
      (word) => word.mastery > 0 && word.mastery < 60,
    ).length;
    const newWords = state.words.filter((word) => word.mastery === 0).length;
    const average = Math.round(
      state.words.reduce((sum, word) => sum + word.mastery, 0) /
        Math.max(state.words.length, 1),
    );
    const dailyStarted = state.dailyWordIds.length > 0;
    const dailyTarget = dailyStarted ? state.dailyWordIds.length : 50;
    const dailyCompleted = dailyStarted
      ? new Set(
          state.dailyCompletedIds.filter((id) =>
            state.dailyWordIds.includes(id),
          ),
        ).size
      : 0;
    const dailyProgress = Math.round(
      (dailyCompleted / Math.max(dailyTarget, 1)) * 100,
    );

    return `
      <div class="page">
        ${renderPageHeader(
          "Vocabulary Studio",
          "单词工作区",
          "按照考试词库、学习状态和词频管理单词，并随时沉淀到英语笔记。",
          `<button class="btn" data-action="open-word-import">${icon(
            "upload",
          )}导入单词</button>
           <button class="btn" data-action="start-daily-words">${icon(
             "calendar",
           )}今日 50 词</button>
           <button class="btn" data-action="start-random-word">${icon(
             "refresh",
           )}随机学习</button>
           <button class="btn soft" data-action="start-spelling-test">${icon(
             "edit",
           )}拼写测试</button>
           <button class="btn soft" data-action="start-vocab-test">${icon(
             "target",
           )}词义测试</button>
           <button class="btn primary" data-action="add-word-note" data-id="${
             activeWord?.id || ""
           }">${icon("plus")}加入笔记</button>`,
        )}

        <div class="notes-stats vocabulary-stats">
          ${[
            ["词库总量", state.words.length],
            ["新词", newWords],
            ["学习中", learning],
            ["已掌握", mastered],
            ["平均掌握度", `${average}%`],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>

        <div class="vocabulary-study-bar panel">
          <div class="vocabulary-status-filters">
            ${[
              ["all", "全部"],
              ["new", "新词"],
              ["learning", "学习中"],
              ["mastered", "已掌握"],
            ]
              .map(
                ([status, label]) =>
                  `<button class="course-chip ${
                    state.wordStatusFilter === status ? "active" : ""
                  }" data-action="set-word-status" data-status="${status}">${label}</button>`,
              )
              .join("")}
          </div>
          ${
            dailyStarted
              ? `<div class="daily-word-progress" data-daily-progress="${dailyProgress}">
                  <div class="daily-progress-top">
                    <span>${icon("flame")}今日单词训练</span>
                    <strong>${dailyCompleted}<small> / ${dailyTarget}</small></strong>
                  </div>
                  <div class="daily-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${dailyTarget}" aria-valuenow="${dailyCompleted}">
                    <span class="daily-progress-fill" style="width:${dailyProgress}%"></span>
                  </div>
                  <div class="daily-progress-bottom">
                    <span>${dailyProgress}% 已完成</span>
                    <span>${Math.max(dailyTarget - dailyCompleted, 0)} 个剩余</span>
                  </div>
                  <button class="btn small ${
                    dailyProgress >= 100 ? "ghost" : "primary"
                  }" data-action="begin-daily-words">${icon(
                    dailyProgress >= 100 ? "check" : "play",
                  )}${dailyProgress >= 100 ? "今日已完成" : "继续今日任务"}</button>
                </div>`
              : `<div class="daily-word-start">
                  <span class="task-icon">${icon("flame")}</span>
                  <div><strong>今日单词任务尚未开始</strong><small>开始后才会记录并显示进度</small></div>
                  <button class="btn small primary" data-action="start-daily-words">${icon(
                    "play",
                  )}开始今日 50 词</button>
                </div>`
          }
        </div>

        <div class="vocabulary-layout">
          <aside class="panel vocabulary-decks">
            <div class="category-title"><span>我的词库</span></div>
            <div class="category-list">
              ${decks
                .map(
                  (deck) => `
                    <button class="category-item ${
                      state.activeWordDeck === deck ? "active" : ""
                    }" data-action="set-word-deck" data-deck="${escapeHTML(deck)}">
                      ${icon(deck === "全部词库" ? "notebook" : "folder")}
                      <span>${escapeHTML(deck)}</span>
                      <span class="category-count">${
                        deck === "全部词库"
                          ? state.words.length
                          : state.words.filter((word) => word.deck === deck)
                              .length
                      }</span>
                    </button>`,
                )
                .join("")}
            </div>
            <div class="vocabulary-side-note">
              <span class="task-icon">${icon("sparkles")}</span>
              <strong>今日建议</strong>
              <p>优先学习 ${newWords} 个新词，并复习 ${needReview} 个薄弱词。</p>
            </div>
          </aside>

          <section class="panel vocabulary-list-panel">
            <div class="vocabulary-list-head">
              <div>
                <h2>${escapeHTML(state.activeWordDeck)}</h2>
                <p>${words.length} 个单词 · 当前显示 ${
                  words.length ? wordPage * pageSize + 1 : 0
                }-${Math.min((wordPage + 1) * pageSize, words.length)}</p>
              </div>
              <label class="search-field compact">
                ${icon("search")}
                <input id="word-search" value="${escapeHTML(
                  state.wordQuery,
                )}" placeholder="搜索单词或释义" />
              </label>
            </div>
            <div class="vocabulary-list">
              ${
                visibleWords.length
                  ? visibleWords
                      .map(
                        (word) => `
                          <button class="vocabulary-item ${
                            activeWord?.id === word.id ? "active" : ""
                          }" data-action="select-word" data-id="${word.id}">
                            <span>
                              <strong>${escapeHTML(word.word)}</strong>
                              <small>${escapeHTML(word.phonetic)}</small>
                            </span>
                            <span class="vocabulary-meaning">${escapeHTML(
                              word.meaning,
                            )}</span>
                            <span class="mastery-pill ${
                              word.mastery >= 80
                                ? "high"
                                : word.mastery >= 60
                                  ? "medium"
                                  : "low"
                            }">${
                              word.mastery === 0 ? "新词" : `${word.mastery}%`
                            }</span>
                          </button>`,
                      )
                      .join("")
                  : `<div class="empty-state" style="min-height:300px"><div><span class="empty-icon">${icon(
                      "search",
                    )}</span><h3>没有找到匹配单词</h3><p>尝试更换关键词或切换词库。</p></div></div>`
              }
            </div>
            ${
              totalPages > 1
                ? `<div class="vocabulary-pagination">
                    <button class="btn small" data-action="word-page-prev" ${
                      wordPage === 0 ? "disabled" : ""
                    }>${icon("chevronLeft")}上一页</button>
                    <span>第 ${wordPage + 1} / ${totalPages} 页</span>
                    <button class="btn small" data-action="word-page-next" ${
                      wordPage >= totalPages - 1 ? "disabled" : ""
                    }>下一页${icon("chevronRight")}</button>
                  </div>`
                : ""
            }
          </section>

          <aside class="panel vocabulary-detail">
            ${
              activeWord
                ? `
                  <div class="eyebrow">${escapeHTML(activeWord.deck)} · Word Detail</div>
                  <div class="word-detail-title">
                    <h2>${escapeHTML(activeWord.word)}</h2>
                    <button class="icon-button" data-action="speak-text" data-text="${
                      activeWord.word
                    }" aria-label="朗读单词">${icon("volume")}</button>
                  </div>
                  <div class="phonetic">${escapeHTML(
                    activeWord.phonetic,
                  )} · ${escapeHTML(activeWord.part)}</div>
                  ${
                    activeWord.phoneticUS &&
                    activeWord.phoneticUS !== activeWord.phonetic
                      ? `<div class="phonetic phonetic-us"><span>美</span>${escapeHTML(
                          activeWord.phoneticUS,
                        )}</div>`
                      : ""
                  }
                  <div class="definition">${escapeHTML(
                    activeWord.meaning,
                  )}</div>
                  <div class="word-example">
                    <span class="field-label">例句</span>
                    <p class="english-text">${escapeHTML(
                      activeWord.example ||
                        activeWord.definition ||
                        `Learn ${activeWord.word} in context.`,
                    )}</p>
                    ${
                      activeWord.translation
                        ? `<p>${escapeHTML(activeWord.translation)}</p>`
                        : ""
                    }
                  </div>
                  <div class="word-source">来源：${escapeHTML(
                    activeWord.source,
                  )}</div>
                  ${
                    activeWord.forms
                      ? `<div class="word-forms"><span class="field-label">词形变化</span><p>${escapeHTML(
                          formatWordForms(activeWord.forms),
                        )}</p></div>`
                      : ""
                  }
                  ${
                    activeWord.frequencyRank
                      ? `<div class="word-frequency">词频排名约 ${activeWord.frequencyRank.toLocaleString(
                          "en-US",
                        )}</div>`
                      : ""
                  }
                  <div class="field-label" style="margin-top:15px">掌握度</div>
                  <div class="large-progress"><span style="width:${
                    activeWord.mastery
                  }%"></span></div>
                  <div class="study-actions" style="margin-top:16px">
                    <button class="btn primary" data-action="mark-word-known" data-id="${
                      activeWord.id
                    }">${icon("check")}我认识</button>
                    <button class="btn" data-action="mark-word-review" data-id="${
                      activeWord.id
                    }">${icon("refresh")}需复习</button>
                  </div>
                  <button class="btn soft" style="width:100%;margin-top:8px" data-action="add-word-note" data-id="${
                    activeWord.id
                  }">${icon("plus")}加入英语笔记</button>
                  <button class="btn ghost" style="width:100%;margin-top:6px" data-action="open-oxford" data-word="${
                    activeWord.word
                  }">${icon("book-open")}在牛津词典中查询</button>
                  <button class="btn ghost" style="width:100%;margin-top:6px" data-action="schedule-word-review" data-id="${
                    activeWord.id
                  }">${icon("calendar")}加入今日学习任务</button>
                  ${
                    activeWord.noteId
                      ? `<button class="btn ghost" style="width:100%;margin-top:6px" data-action="open-note" data-id="${activeWord.noteId}">${icon(
                          "notebook",
                        )}查看关联笔记</button>`
                      : ""
                  }
                `
                : ""
            }
          </aside>
        </div>
      </div>
    `;
  }

  function renderStudyTraining() {
    ensureDailyTraining();
    const modes = [
      {
        id: "word-cards",
        title: "单词卡片",
        description: "正面单词、背面释义，快速建立识别记忆。",
        icon: "layers",
        group: "输入",
        count: 12,
      },
      {
        id: "listening-choice",
        title: "听音选义",
        description: "听英语单词，从多个释义中选出正确答案。",
        icon: "headphones",
        group: "听力",
        count: 10,
      },
      {
        id: "spelling",
        title: "拼写训练",
        description: "根据释义和词频，完整拼写英文单词。",
        icon: "edit",
        group: "输出",
        count: 20,
      },
      {
        id: "cloze",
        title: "例句填空",
        description: "在真实句子中选择最合适的单词。",
        icon: "quote",
        group: "输出",
        count: 10,
      },
      {
        id: "shadowing",
        title: "发音跟读",
        description: "先听标准朗读，再录音跟读并自评。",
        icon: "mic",
        group: "口语",
        count: 6,
      },
      {
        id: "spaced-review",
        title: "间隔复习",
        description: "按遗忘时间安排复习，调整下一次间隔。",
        icon: "refresh",
        group: "复习",
        count: state.words.filter(
          (word) =>
            word.reviewAt &&
            new Date(word.reviewAt).getTime() <= Date.now(),
        ).length,
      },
      {
        id: "daily-words",
        title: "每日新词",
        description: "按词频和考试价值学习今天的 50 个新词。",
        icon: "calendar",
        group: "计划",
        count: 50,
      },
    ];
    const completed = state.training.completedTaskIds.length;
    const progress = Math.round((completed / modes.length) * 100);
    const dueCount = modes.find((mode) => mode.id === "spaced-review")?.count || 0;

    return `
      <div class="page">
        ${renderPageHeader(
          "Daily Training",
          "单词训练中心",
          "每天用一组短训练完成输入、输出、发音和复习，所有结果都会回写到单词掌握度。",
          `<button class="btn" data-action="start-daily-words">${icon(
            "calendar",
          )}开始今日 50 词</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}

        <section class="panel training-dashboard">
          <div>
            <div class="eyebrow">TODAY'S PROGRESS</div>
            <h2>今日完成 ${completed} / ${modes.length} 项训练</h2>
            <p>完成全部训练约需 20 分钟。系统会根据结果自动调整下次复习时间。</p>
          </div>
          <div class="training-progress-ring">
            <div class="progress-ring"><strong>${progress}%</strong></div>
          </div>
          <div class="training-dashboard-meta">
            <span>${icon("refresh")} 待复习 ${dueCount} 词</span>
            <span>${icon("flame")} 连续学习 12 天</span>
          </div>
        </section>

        ${["输入", "听力", "输出", "口语", "复习", "计划"]
          .map(
            (group) => `
              <section class="section">
                <div class="section-head">
                  <div><h2>${group}训练</h2><p>${trainingGroupDescription(
                    group,
                  )}</p></div>
                </div>
                <div class="training-grid">
                  ${modes
                    .filter((mode) => mode.group === group)
                    .map((mode) => {
                      const isDone =
                        state.training.completedTaskIds.includes(mode.id);
                      return `
                        <article class="training-card ${
                          isDone ? "completed" : ""
                        }">
                          <div class="training-card-top">
                            <span class="task-icon">${icon(mode.icon)}</span>
                            ${
                              isDone
                                ? `<span class="training-done">${icon(
                                    "check",
                                  )}已完成</span>`
                                : `<span class="note-category">${mode.count} 项</span>`
                            }
                          </div>
                          <h3>${mode.title}</h3>
                          <p>${mode.description}</p>
                          <button class="btn ${
                            isDone ? "ghost" : "primary"
                          }" data-action="start-training-mode" data-mode="${
                            mode.id
                          }">${icon(
                            isDone ? "refresh" : "play",
                          )}${isDone ? "再练一次" : "开始训练"}</button>
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              </section>`,
          )
          .join("")}
      </div>
    `;
  }

  function trainingGroupDescription(group) {
    return {
      输入: "先建立音、形、义的初步连接。",
      听力: "把拼写和声音直接连接起来。",
      输出: "通过拼写和语境使用检验掌握程度。",
      口语: "朗读、跟读并关注语音节奏。",
      复习: "使用间隔复习减少遗忘。",
      计划: "根据词频和考试目标安排每日任务。",
    }[group];
  }

  function renderTranslationWorkspace() {
    const translation = state.translation;
    const fromLanguage =
      translation.direction === "zh-en" ? "中文" : "English";
    const toLanguage =
      translation.direction === "zh-en" ? "English" : "中文";
    const categories = [
      "全部",
      ...new Set(READING_PASSAGES.map((passage) => passage.category)),
    ];
    const passages = READING_PASSAGES.filter(
      (passage) =>
        translation.passageFilter === "全部" ||
        passage.category === translation.passageFilter,
    );
    const activePassage =
      READING_PASSAGES.find(
        (passage) => passage.id === translation.activePassageId,
      ) ||
      passages[0] ||
      READING_PASSAGES[0];
    const fullEnglish = activePassage.english.join(" ");

    return `
      <div class="page">
        ${renderPageHeader(
          "Translation & Reading",
          "翻译与英语朗读",
          "支持中英双向翻译、在线翻译、历史记录、朗读跟读和学习笔记联动。",
          `<button class="btn" data-action="swap-translation-direction">${icon(
            "refresh",
          )}切换方向</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}

        <section class="translation-workbench">
          <div class="translation-direction">
            <button class="course-chip ${
              translation.direction === "zh-en" ? "active" : ""
            }" data-action="set-translation-direction" data-direction="zh-en">中译英</button>
            <button class="course-chip ${
              translation.direction === "en-zh" ? "active" : ""
            }" data-action="set-translation-direction" data-direction="en-zh">英译中</button>
            <span>${fromLanguage} → ${toLanguage}</span>
          </div>
          <div class="translation-columns">
            <article class="panel translation-box">
              <div class="translation-box-head">
                <div><span class="field-label">原文</span><strong>${fromLanguage}</strong></div>
                <span>${translation.input.length} 字符</span>
              </div>
              <textarea id="translation-input" class="translation-textarea" placeholder="${
                translation.direction === "zh-en"
                  ? "输入中文，例如：我想提高我的英语。"
                  : "Enter English text here."
              }">${escapeHTML(translation.input)}</textarea>
              <div class="translation-box-actions">
                <button class="btn primary" data-action="translate-submit">${icon(
                  "languages",
                )}${translation.status === "loading" ? "正在翻译…" : "开始翻译"}</button>
                <button class="btn" data-action="speak-translation-input">${icon(
                  "volume",
                )}朗读原文</button>
                <button class="btn ghost" data-action="clear-translation">清空</button>
              </div>
            </article>
            <article class="panel translation-box output-box">
              <div class="translation-box-head">
                <div><span class="field-label">译文</span><strong>${toLanguage}</strong></div>
                <span>${translation.status === "success" ? "翻译完成" : ""}</span>
              </div>
              <div class="translation-output">
                ${
                  translation.status === "loading"
                    ? `<div class="analysis-loading"><span class="spinner"></span><span>正在翻译，请稍候……</span></div>`
                    : translation.status === "error"
                      ? `<div class="translation-error"><span class="empty-icon">${icon(
                          "refresh",
                        )}</span><h3>暂时无法完成翻译</h3><p>${escapeHTML(
                          translation.error ||
                            "请检查网络或稍后重试。",
                        )}</p><button class="btn primary" data-action="translate-submit">${icon(
                          "refresh",
                        )}重试</button></div>`
                      : `<p>${escapeHTML(
                          translation.output ||
                            "翻译结果会显示在这里。",
                        )}</p>`
                }
              </div>
              <div class="translation-box-actions">
                <button class="btn soft" data-action="speak-translation-output" ${
                  translation.output ? "" : "disabled"
                }>${icon("volume")}朗读译文</button>
                <button class="btn" data-action="copy-translation" ${
                  translation.output ? "" : "disabled"
                }>${icon("file")}复制译文</button>
                <button class="btn" data-action="save-translation-note" ${
                  translation.output ? "" : "disabled"
                }>${icon("plus")}加入笔记</button>
              </div>
            </article>
          </div>
          ${
            translation.history.length
              ? `<div class="translation-history">
                  <span class="field-label">最近翻译</span>
                  <div class="translation-history-list">
                    ${translation.history
                      .slice(0, 6)
                      .map(
                        (item, index) => `
                          <button data-action="load-translation-history" data-index="${index}">
                            <strong>${escapeHTML(
                              item.input.slice(0, 32),
                            )}</strong>
                            <span>${escapeHTML(
                              item.output.slice(0, 42),
                            )}</span>
                          </button>`,
                      )
                      .join("")}
                  </div>
                </div>`
              : ""
          }
        </section>

        <section class="section">
          <div class="section-head">
            <div><h2>英语朗读语料库</h2><p>按场景选择短文，支持逐句翻译、标准朗读和跟读评分。</p></div>
          </div>
          <div class="resource-filters">
            ${categories
              .map(
                (category) => `
                  <button class="course-chip ${
                    translation.passageFilter === category ? "active" : ""
                  }" data-action="filter-passages" data-filter="${escapeHTML(
                    category,
                  )}">${escapeHTML(category)}</button>`,
              )
              .join("")}
          </div>
          <div class="reading-library-layout">
            <aside class="panel reading-passage-list">
              ${passages
                .map(
                  (passage) => `
                    <button class="reading-passage-item ${
                      passage.id === activePassage.id ? "active" : ""
                    }" data-action="select-reading-passage" data-id="${
                      passage.id
                    }">
                      <span class="note-category">${escapeHTML(
                        passage.category,
                      )}</span>
                      <strong>${escapeHTML(passage.title)}</strong>
                      <small>${passage.level} · ${passage.minutes} 分钟</small>
                    </button>`,
                )
                .join("")}
            </aside>
            <article class="panel reading-passage-content">
              <div class="section-head">
                <div><h2>${escapeHTML(
                  activePassage.title,
                )}</h2><p>${escapeHTML(
                  activePassage.category,
                )} · ${activePassage.level} · ${activePassage.minutes} 分钟</p></div>
                <span class="tag">${activePassage.english.length} 句</span>
              </div>
              <div class="passage-actions">
                <button class="btn primary" data-action="speak-passage" data-id="${
                  activePassage.id
                }">${icon("play")}朗读全文</button>
                <button class="btn soft" data-action="shadow-passage" data-id="${
                  activePassage.id
                }">${icon("mic")}跟读全文</button>
                <button class="btn" data-action="add-passage-note" data-id="${
                  activePassage.id
                }">${icon("plus")}加入笔记</button>
              </div>
              <div class="passage-sentences">
                ${activePassage.english
                  .map(
                    (sentence, index) => `
                      <div class="passage-sentence">
                        <span class="passage-index">${index + 1}</span>
                        <div>
                          <p class="english-text">${escapeHTML(
                            sentence,
                          )}</p>
                          <p class="passage-translation">${escapeHTML(
                            activePassage.chinese[index] || "",
                          )}</p>
                        </div>
                        <div class="passage-sentence-actions">
                          <button class="icon-button" data-action="speak-text" data-text="${escapeHTML(
                            sentence,
                          )}" title="朗读句子">${icon("volume")}</button>
                          <button class="icon-button" data-action="shadow-text" data-text="${escapeHTML(
                            sentence,
                          )}" title="跟读句子">${icon("mic")}</button>
                        </div>
                      </div>`,
                  )
                  .join("")}
              </div>
            </article>
          </div>
        </section>
      </div>
    `;
  }

  function renderAutomotiveWorkspace() {
    const allTerms = state.words.filter(
      (word) => word.deck === "汽车专业",
    );
    const categories = [
      "全部",
      ...new Set(
        allTerms
          .map((word) => word.automotiveCategory)
          .filter(Boolean),
      ),
    ];
    const query = state.automotiveQuery.trim().toLowerCase();
    const terms = allTerms.filter((word) => {
      if (
        state.automotiveCategory !== "全部" &&
        word.automotiveCategory !== state.automotiveCategory
      ) {
        return false;
      }
      return `${word.word} ${word.meaning} ${
        word.automotiveCategory || ""
      } ${(word.tags || []).join(" ")}`
        .toLowerCase()
        .includes(query);
    });
    const pageSize = 60;
    const totalPages = Math.max(1, Math.ceil(terms.length / pageSize));
    const page = Math.min(state.automotivePage, totalPages - 1);
    const visible = terms.slice(page * pageSize, page * pageSize + pageSize);
    const mastered = allTerms.filter((word) => word.mastery >= 80).length;
    const learning = allTerms.filter(
      (word) => word.mastery > 0 && word.mastery < 80,
    ).length;
    const automotivePassages = READING_PASSAGES.filter(
      (passage) => passage.category === "汽车",
    );

    return `
      <div class="page">
        ${renderPageHeader(
          "Automotive English",
          "汽车专业英语",
          "覆盖整车架构、动力系统、新能源三电、底盘、电气、诊断维修、制造和商务术语。",
          `<button class="btn primary" data-action="start-automotive-training">${icon(
            "target",
          )}开始汽车词训练</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}

        <div class="notes-stats automotive-stats">
          ${[
            ["专业词条", allTerms.length],
            ["术语分类", categories.length - 1],
            ["学习中", learning],
            ["已掌握", mastered],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>

        <div class="notes-toolbar automotive-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="automotive-search" value="${escapeHTML(
              state.automotiveQuery,
            )}" placeholder="搜索汽车英文术语或中文释义" />
          </label>
        </div>
        <div class="resource-filters">
          ${categories
            .map(
              (category) => `
                <button class="course-chip ${
                  state.automotiveCategory === category ? "active" : ""
                }" data-action="filter-automotive" data-filter="${escapeHTML(
                  category,
                )}">${escapeHTML(category)}</button>`,
            )
            .join("")}
        </div>

        <div class="automotive-layout">
          <section class="panel automotive-glossary">
            <div class="section-head">
              <div><h2>汽车术语表</h2><p>${terms.length} 个匹配词条</p></div>
            </div>
            <div class="automotive-term-grid">
              ${visible
                .map(
                  (word) => `
                    <button class="automotive-term-card" data-action="open-automotive-term" data-id="${
                      word.id
                    }">
                      <div>
                        <span class="note-category">${escapeHTML(
                          word.automotiveCategory || "汽车专业",
                        )}</span>
                        <strong>${escapeHTML(word.word)}</strong>
                        <p>${escapeHTML(word.meaning)}</p>
                      </div>
                      <span class="mastery-pill ${
                        word.mastery >= 80 ? "high" : word.mastery ? "medium" : "low"
                      }">${word.mastery ? `${word.mastery}%` : "新词"}</span>
                    </button>`,
                )
                .join("")}
            </div>
            ${
              totalPages > 1
                ? `<div class="vocabulary-pagination">
                    <button class="btn small" data-action="automotive-page-prev" ${
                      page === 0 ? "disabled" : ""
                    }>${icon("chevronLeft")}上一页</button>
                    <span>第 ${page + 1} / ${totalPages} 页</span>
                    <button class="btn small" data-action="automotive-page-next" ${
                      page >= totalPages - 1 ? "disabled" : ""
                    }>下一页${icon("chevronRight")}</button>
                  </div>`
                : ""
            }
          </section>

          <aside class="automotive-side">
            <section class="panel">
              <div class="panel-body">
                <div class="section-head"><div><h2>汽车英语朗读</h2><p>专业场景短文与跟读</p></div></div>
                <div class="automotive-passage-list">
                  ${automotivePassages
                    .map(
                      (passage) => `
                        <article class="automotive-passage-card">
                          <span class="note-category">${escapeHTML(
                            passage.level,
                          )}</span>
                          <strong>${escapeHTML(passage.title)}</strong>
                          <p>${escapeHTML(passage.english[0])}</p>
                          <div class="study-actions">
                            <button class="btn small" data-action="speak-passage" data-id="${
                              passage.id
                            }">${icon("volume")}朗读</button>
                            <button class="btn small soft" data-action="shadow-passage" data-id="${
                              passage.id
                            }">${icon("mic")}跟读</button>
                          </div>
                        </article>`,
                    )
                    .join("")}
                </div>
              </div>
            </section>
            <section class="panel panel-body">
              <h2 style="font-size:17px">建议学习顺序</h2>
              <ol class="automotive-path">
                <li>先按分类认识部件和系统名称</li>
                <li>听音并跟读专业术语和缩写</li>
                <li>阅读维修、制造和新能源场景短文</li>
                <li>把术语加入笔记并安排间隔复习</li>
              </ol>
            </section>
          </aside>
        </div>
      </div>
    `;
  }

  function renderBusinessWorkspace() {
    if (!businessLibrary.length) {
      if (!businessLibraryLoading) ensureBusinessLibrary();
      if (businessLibraryError) {
        return `
          <div class="page narrow">
            <div class="empty-state"><div><span class="empty-icon">${icon(
              "refresh",
            )}</span><h3>商务英语词库加载失败</h3><p>${escapeHTML(
              businessLibraryError,
            )}</p><button class="btn primary" data-action="retry-business-library">${icon(
              "refresh",
            )}重试</button></div></div>
          </div>
        `;
      }
      return renderDataLoading(
        "Business English",
        "正在准备 3000 条商务英语专业词条。",
      );
    }

    const categories = [
      "全部",
      ...new Set(
        businessLibrary
          .map((word) => word.businessCategory)
          .filter(Boolean),
      ),
    ];
    const query = state.businessQuery.trim().toLowerCase();
    const terms = businessLibrary.filter((word) => {
      if (
        state.businessCategory !== "全部" &&
        word.businessCategory !== state.businessCategory
      ) {
        return false;
      }
      return `${word.word} ${word.meaning} ${
        word.businessCategory || ""
      } ${(word.tags || []).join(" ")}`
        .toLowerCase()
        .includes(query);
    });
    const pageSize = 80;
    const totalPages = Math.max(1, Math.ceil(terms.length / pageSize));
    const page = Math.min(state.businessPage, totalPages - 1);
    const visible = terms.slice(page * pageSize, page * pageSize + pageSize);
    const mastered = businessLibrary.filter(
      (word) => word.mastery >= 80,
    ).length;

    return `
      <div class="page">
        ${renderPageHeader(
          "Business English",
          "商务英语词库",
          "覆盖经营管理、财务金融、市场营销、供应链采购、人力资源、国际贸易、商务法律和商务沟通。",
          `<button class="btn primary" data-action="start-business-training">${icon(
            "target",
          )}开始商务词训练</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}
        <div class="notes-stats automotive-stats">
          ${[
            ["商务词条", businessLibrary.length],
            ["术语分类", categories.length - 1],
            [
              "专业短语",
              businessLibrary.filter(
                (word) =>
                  word.word.includes(" ") || word.word.includes("-"),
              ).length,
            ],
            ["已掌握", mastered],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
        <div class="notes-toolbar automotive-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="business-search" value="${escapeHTML(
              state.businessQuery,
            )}" placeholder="搜索商务英语术语或中文释义" />
          </label>
        </div>
        <div class="resource-filters">
          ${categories
            .map(
              (category) => `
                <button class="course-chip ${
                  state.businessCategory === category ? "active" : ""
                }" data-action="filter-business" data-category="${escapeHTML(
                  category,
                )}">${escapeHTML(category)}</button>`,
            )
            .join("")}
        </div>
        <section class="panel automotive-glossary">
          <div class="section-head">
            <div><h2>商务术语表</h2><p>${terms.length} 个匹配词条</p></div>
          </div>
          <div class="automotive-term-grid">
            ${visible
              .map(
                (word) => `
                  <button class="automotive-term-card" data-action="open-business-term" data-id="${
                    word.id
                  }">
                    <div>
                      <span class="note-category">${escapeHTML(
                        word.businessCategory || "商务英语",
                      )}</span>
                      <strong>${escapeHTML(word.word)}</strong>
                      <p>${escapeHTML(word.meaning)}</p>
                    </div>
                    <span class="mastery-pill ${
                      word.mastery >= 80
                        ? "high"
                        : word.mastery
                          ? "medium"
                          : "low"
                    }">${word.mastery ? `${word.mastery}%` : "新词"}</span>
                  </button>`,
              )
              .join("")}
          </div>
          ${
            totalPages > 1
              ? `<div class="vocabulary-pagination">
                  <button class="btn small" data-action="business-page-prev" ${
                    page === 0 ? "disabled" : ""
                  }>${icon("chevronLeft")}上一页</button>
                  <span>第 ${page + 1} / ${totalPages} 页</span>
                  <button class="btn small" data-action="business-page-next" ${
                    page >= totalPages - 1 ? "disabled" : ""
                  }>下一页${icon("chevronRight")}</button>
                </div>`
              : ""
          }
        </section>
      </div>
    `;
  }

  function renderSpeechLibrary() {
    if (!speechLibrary.length) {
      if (!speechLibraryLoading) ensureSpeechLibrary();
      if (speechLibraryError) {
        return `
          <div class="page narrow">
            <div class="empty-state"><div><span class="empty-icon">${icon(
              "refresh",
            )}</span><h3>朗读短句库加载失败</h3><p>${escapeHTML(
              speechLibraryError,
            )}</p><button class="btn primary" data-action="retry-speech-library">${icon(
              "refresh",
            )}重试</button></div></div>
          </div>
        `;
      }
      return renderDataLoading(
        "English Speaking Library",
        "正在准备 56800 条单词与短句朗读内容。",
      );
    }

    const categories = [
      "全部",
      ...new Set(speechLibrary.map((item) => item.category)),
    ].sort((a, b) => a.localeCompare(b, "zh-CN"));
    const levels = [
      "全部",
      ...new Set(speechLibrary.map((item) => item.level)),
    ];
    const query = state.speechQuery.trim().toLowerCase();
    const filtered = speechLibrary.filter((item) => {
      if (
        state.speechCategory !== "全部" &&
        item.category !== state.speechCategory
      )
        return false;
      if (
        state.speechLevel !== "全部" &&
        item.level !== state.speechLevel
      )
        return false;
      return `${item.english} ${item.chinese} ${item.word} ${
        item.meaning
      } ${item.deck}`
        .toLowerCase()
        .includes(query);
    });
    const pageSize = 80;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(state.speechPage, totalPages - 1);
    const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);
    const words = new Set(speechLibrary.map((item) => item.word)).size;

    return `
      <div class="page">
        ${renderPageHeader(
          "English Read Aloud",
          "英语朗读短句库",
          "56800 条单词、短语和短句，支持标准朗读、跟读、收藏和加入笔记。",
          `<button class="btn" data-action="random-speech-item">${icon(
            "refresh",
          )}随机朗读</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}
        <div class="notes-stats speech-stats">
          ${[
            ["朗读内容", speechLibrary.length],
            ["核心单词", words],
            ["短句分类", categories.length - 1],
            ["已收藏", state.speechSavedIds.length],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
        <div class="notes-toolbar speech-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="speech-search" value="${escapeHTML(
              state.speechQuery,
            )}" placeholder="搜索英文短句、中文、单词或分类" />
          </label>
        </div>
        <div class="resource-filters">
          ${categories
            .map(
              (category) => `
                <button class="course-chip ${
                  state.speechCategory === category ? "active" : ""
                }" data-action="filter-speech-category" data-category="${escapeHTML(
                  category,
                )}">${escapeHTML(category)}</button>`,
            )
            .join("")}
        </div>
        <div class="resource-filters speech-levels">
          ${levels
            .map(
              (level) => `
                <button class="course-chip ${
                  state.speechLevel === level ? "active" : ""
                }" data-action="filter-speech-level" data-level="${level}">${level}</button>`,
            )
            .join("")}
        </div>
        <div class="speech-library-grid">
          ${visible
            .map(
              (item) => `
                <article class="speech-library-card">
                  <div class="speech-card-head">
                    <div>
                      <span class="note-category">${escapeHTML(
                        item.category,
                      )}</span>
                      <span class="tag">${item.level}</span>
                    </div>
                    <button class="icon-button ${
                      state.speechSavedIds.includes(item.id)
                        ? "is-saved"
                        : ""
                    }" data-action="toggle-speech-save" data-id="${
                      item.id
                    }">${icon("bookmark")}</button>
                  </div>
                  <p class="speech-english">${escapeHTML(item.english)}</p>
                  <p class="speech-chinese">${escapeHTML(item.chinese)}</p>
                  <div class="speech-word">
                    <strong>${escapeHTML(item.word)}</strong>
                    <span>${escapeHTML(item.meaning)}</span>
                  </div>
                  <div class="speech-card-actions">
                    <button class="btn small primary" data-action="speak-text" data-text="${escapeHTML(
                      item.english,
                    )}">${icon("volume")}朗读</button>
                    <button class="btn small soft" data-action="shadow-text" data-text="${escapeHTML(
                      item.english,
                    )}">${icon("mic")}跟读</button>
                    <button class="btn small" data-action="add-speech-note" data-id="${
                      item.id
                    }">${icon("plus")}笔记</button>
                  </div>
                </article>`,
            )
            .join("")}
        </div>
        ${
          totalPages > 1
            ? `<div class="vocabulary-pagination collection-pagination">
                <button class="btn small" data-action="speech-page-prev" ${
                  page === 0 ? "disabled" : ""
                }>${icon("chevronLeft")}上一页</button>
                <span>第 ${page + 1} / ${totalPages} 页</span>
                <button class="btn small" data-action="speech-page-next" ${
                  page >= totalPages - 1 ? "disabled" : ""
                }>下一页${icon("chevronRight")}</button>
              </div>`
            : ""
        }
      </div>
    `;
  }

  function renderStudyPage(route) {
    const page = route.split("/")[1];
    if (page === "words") {
      return renderVocabularyWorkspace();
    }
    if (page === "training") {
      return renderStudyTraining();
    }

    if (page === "listening") {
      return `
        <div class="page narrow">
          ${renderPageHeader(
            "Listening",
            "听力训练",
            "校园注册 · 对话理解 · 5 道题",
            `<button class="btn" data-action="speak-text" data-text="Hello, I would like to register for a course.">${icon(
              "volume",
            )}朗读材料</button>
             <button class="btn soft" data-action="add-demo-note" data-kind="listening">${icon(
               "plus",
             )}加入笔记</button>`,
          )}
          <section class="split-workspace">
            <div class="panel workspace-panel">
              <div class="eyebrow">Listening 01</div>
              <h2>校园注册</h2>
              <p>Listen once for the main idea, then listen again for details.</p>
              <button class="btn primary" data-action="speak-text" data-text="Hello, I would like to register for a course. Could you tell me the deadline for new students?">${icon(
                "play",
              )}播放录音</button>
              <div style="margin-top:28px;padding:20px;border:1px solid var(--line);border-radius:8px;background:var(--surface-muted)">
                <div class="tag" style="margin-bottom:12px">00:18 / 01:42</div>
                <div class="large-progress"><span style="width:18%"></span></div>
              </div>
              <h3 style="margin-top:28px;font-size:15px">Transcript</h3>
              <div class="article-copy" style="font-size:16px">
                <p>“Hello, I would like to register for a course. Could you tell me the deadline for new students?”</p>
                <p>“Of course. Registration closes this Friday, but you need to collect your student card before that.”</p>
              </div>
            </div>
            <div class="panel workspace-panel">
              <h2>理解检查</h2>
              <p>根据对话选择正确答案。</p>
              <div class="question-text" style="font-size:18px">When does registration close?</div>
              <div class="answer-list">
                <button class="answer-option"><span>A</span><span>Next Monday</span></button>
                <button class="answer-option"><span>B</span><span>This Friday</span></button>
                <button class="answer-option"><span>C</span><span>At the end of the month</span></button>
                <button class="answer-option"><span>D</span><span>Before the student card arrives</span></button>
              </div>
              <div class="exam-footer" style="margin-top:28px">
                <button class="btn" data-action="previous-step">${icon(
                  "chevronLeft",
                )}上一题</button>
                <span class="exam-stat">1 / 5</span>
                <button class="btn primary" data-action="next-step">下一题${icon(
                  "chevronRight",
                )}</button>
              </div>
            </div>
          </section>
        </div>
      `;
    }

    if (page === "speaking") {
      return renderSpeechLibrary();
    }

    if (page === "translation") {
      return renderTranslationWorkspace();
    }

    return `
      <div class="page narrow">
        ${renderPageHeader(
          "Study Plan",
          "学习计划",
          "根据你最近的学习记录，AI 已经把本周任务拆成可执行的小步骤。",
          `<button class="btn soft" data-action="regenerate-plan">${icon(
            "sparkles",
          )}重新生成</button>`,
        )}
        <section class="dashboard-grid">
          <div class="panel panel-body">
            <div class="section-head">
              <div><h2>本周计划</h2><p>9 月 8 日 - 9 月 14 日</p></div>
              <span class="tag">目标：CET-4</span>
            </div>
            <div class="progress-list">
              ${[
                ["周一", "单词 20 个 + 听力 1 组", 100],
                ["周二", "阅读 2 篇 + 生词复盘", 100],
                ["周三", "口语 15 分钟 + 语法", 70],
                ["周四", "CET-4 阅读专项", 0],
                ["周五", "错题整理 + 复习卡片", 0],
                ["周六", "模拟考试", 0],
                ["周日", "轻量复习", 0],
              ]
                .map(
                  ([day, task, progress]) => `
                    <div class="progress-row">
                      <span><strong>${day}</strong> ${task}<em style="font-style:normal">${progress}%</em></span>
                      <div class="large-progress"><span style="width:${progress}%"></span></div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>
          <div class="panel panel-body">
            <h2 style="font-size:17px">AI 学习建议</h2>
            <p style="color:var(--ink-muted);font-size:13px">过去 7 天，你的阅读和单词完成得很好。口语练习次数偏少，建议今天安排 10 分钟问路场景对话。</p>
            <div class="review-banner" style="margin:16px 0 0">
              <span class="review-banner-icon">${icon("prompt")}</span>
              <div><strong>今日建议</strong><p>先把 4 个待复习单词完成，再开始阅读。</p></div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderSpeakingPage() {
    return `
      <div class="page narrow">
        ${renderPageHeader(
          "AI Conversation",
          "AI 英语口语",
          "围绕真实场景开口练习，结束后得到发音、表达和错误修改建议。",
          `<button class="btn soft" data-action="add-demo-note" data-kind="speaking">${icon(
            "plus",
          )}生成口语笔记</button>`,
        )}
        <section class="panel speaking-stage">
          <div class="speaking-center">
            <div class="speaking-avatar">${icon("sparkles")}</div>
            <div class="tag" style="margin-bottom:12px">场景：在车站问路</div>
            <div class="dialog-bubble">Hi! You look a little lost. Where are you trying to go?</div>
            <div class="dialog-translation">你好！你看起来有点迷路。你想去哪里？</div>
            <button class="mic-button" data-action="toggle-listening" aria-label="开始说话">${icon(
              "mic",
            )}</button>
            <div class="speaking-controls">
              <button class="btn small" data-action="speak-text" data-text="Hi! You look a little lost. Where are you trying to go?" data-rate="0.72">${icon(
                "volume",
              )}慢速</button>
              <button class="btn small" data-action="speak-text" data-text="Hi! You look a little lost. Where are you trying to go?">${icon(
                "volume",
              )}正常</button>
              <button class="btn small" data-action="repeat-dialog">${icon(
                "refresh",
              )}重复</button>
              <button class="btn small" data-action="toggle-translation">${icon(
                "languages",
              )}翻译</button>
            </div>
          </div>
        </section>
        <section class="cards-grid" style="margin-top:16px">
          <div class="content-card">
            <div class="content-card-meta">语音评分</div>
            <strong style="font-size:31px;display:block;margin:5px 0">86</strong>
            <p>清晰度不错，注意 station 的重音。</p>
          </div>
          <div class="content-card">
            <div class="content-card-meta">表达建议</div>
            <strong style="display:block;margin:5px 0">How do I get to…?</strong>
            <p>比 Where is…? 更完整自然。</p>
          </div>
          <div class="content-card">
            <div class="content-card-meta">错误修改</div>
            <strong style="display:block;margin:5px 0">I need go to station</strong>
            <p>改为 I need to get to the station.</p>
          </div>
        </section>
      </div>
    `;
  }

  function renderExamsOverview() {
    return `
      <div class="page">
        ${renderPageHeader(
          "English Exams",
          "英语考试",
          "专注训练、模拟环境、错题沉淀。AI 提示在正式考试中会自动关闭。",
          `<a class="btn primary" href="${hrefFor(
            "exams/mock",
          )}" data-route="exams/mock">${icon("play")}开始模拟考试</a>`,
        )}
        <section class="study-hero">
          <div class="panel panel-body" style="padding:28px">
            <div class="eyebrow">Next Goal</div>
            <h2 style="font-size:25px;margin-bottom:6px">CET-4 模拟考试</h2>
            <p style="color:var(--ink-muted)">根据你的最近成绩预测：487 分 · 距离目标还差 13 分</p>
            <div class="progress-list" style="margin:22px 0 24px">
              <div class="progress-row"><span>听力<strong>72%</strong></span><div class="large-progress"><span style="width:72%"></span></div></div>
              <div class="progress-row"><span>阅读<strong>81%</strong></span><div class="large-progress"><span style="width:81%"></span></div></div>
              <div class="progress-row"><span>写作与翻译<strong>64%</strong></span><div class="large-progress"><span style="width:64%"></span></div></div>
            </div>
            <button class="btn primary" data-route="exams/mock" data-action="go-route">开始考试</button>
          </div>
          <div class="panel panel-body">
            <h2 style="font-size:17px">考试工具</h2>
            <div class="tool-list">
              <a class="btn" href="${hrefFor(
                "exams/cet4",
              )}" data-route="exams/cet4">${icon(
                "graduation",
              )}CET-4 专项</a>
              <a class="btn" href="${hrefFor(
                "exams/cet6",
              )}" data-route="exams/cet6">${icon(
                "graduation",
              )}CET-6 专项</a>
              <a class="btn" href="${hrefFor(
                "exams/training",
              )}" data-route="exams/training">${icon(
                "target",
              )}专项训练</a>
              <a class="btn" href="${hrefFor(
                "exams/mistakes",
              )}" data-route="exams/mistakes">${icon(
                "notebook",
              )}错题本</a>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="section-head"><div><h2>最近记录</h2><p>保持每周一次完整模拟</p></div></div>
          <div class="cards-grid">
            ${[
              ["CET-4 阅读专项", "18 / 20 正确", "今天", "81%"],
              ["CET-4 听力专项", "15 / 20 正确", "3 天前", "72%"],
              ["CET-6 模拟考试", "438 分", "上周", "69%"],
            ]
              .map(
                ([title, score, date, progress]) =>
                  `<div class="content-card"><h3>${title}</h3><p>${score}</p><div class="content-card-meta"><span>${date}</span><span>·</span><span>${progress}</span></div></div>`,
              )
              .join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderExamPage(route) {
    if (route === "exams/mistakes") {
      return `
        <div class="page">
          ${renderPageHeader(
            "Mistake Notebook",
            "错题本",
            "不是收藏错误，而是追踪错误原因，直到同类题不再出错。",
            `<button class="btn soft" data-action="add-demo-note" data-kind="mistake">${icon(
              "plus",
            )}批量加入笔记</button>`,
          )}
          <div class="notes-stats">
            ${[
              ["待复盘", 12],
              ["已掌握", 36],
              ["阅读", 8],
              ["语法", 4],
            ]
              .map(
                ([label, value]) =>
                  `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
              )
              .join("")}
          </div>
          <section class="panel">
            <div class="notes-preview">
              ${[
                [
                  "CET-4 阅读 Q18",
                  "推断题 · 忽略了 however 后的转折",
                  "今天",
                ],
                [
                  "CET-6 听力 Q7",
                  "同义替换 · deadline = due date",
                  "昨天",
                ],
                [
                  "语法：平行结构",
                  "not A but B 中 A、B 形式不一致",
                  "3 天前",
                ],
              ]
                .map(
                  ([title, reason, date]) => `
                    <div class="note-preview-item">
                      <span class="note-dot"></span>
                      <div><strong>${title}</strong><span>${reason}</span></div>
                      <time>${date}</time>
                      <button class="btn small" data-action="add-demo-note" data-kind="mistake">加入笔记</button>
                    </div>`,
                )
                .join("")}
            </div>
          </section>
        </div>
      `;
    }

    const title =
      route === "exams/cet6"
        ? "CET-6 模拟考试"
        : route === "exams/mock"
          ? "CET-4 全真模拟"
          : route === "exams/training"
            ? "阅读专项训练"
            : "CET-4 模拟考试";
    return `
      <div class="page">
        <div class="exam-bar panel" style="padding:13px 18px">
          <span class="exam-name">${title}</span>
          <span class="exam-stat">第 1 / 20 题</span>
          <span class="exam-timer">${icon("clock")} 44:28</span>
        </div>
        <div class="exam-layout">
          <section class="panel question-panel">
            <div class="question-number">Reading Comprehension · Question 1</div>
            <div class="question-text">
              What is the author’s main concern about individual environmental action?
            </div>
            <div class="answer-list">
              ${[
                ["A", "It is less important than public policy."],
                ["B", "It can distract people from systemic solutions."],
                ["C", "It is meaningful only when supported by public policy."],
                ["D", "It has no measurable effect on emissions."],
              ]
                .map(
                  ([letter, text]) =>
                    `<button class="answer-option" data-action="select-answer" data-letter="${letter}"><span>${letter}</span><span>${text}</span></button>`,
                )
                .join("")}
            </div>
            <div class="exam-footer">
              <button class="btn" data-action="previous-question">${icon(
                "chevronLeft",
              )}上一题</button>
              <div class="exam-footer-actions">
                <button class="btn" data-action="next-question">下一题${icon(
                  "chevronRight",
                )}</button>
                <button class="btn primary" data-action="submit-exam">提交试卷</button>
              </div>
            </div>
          </section>
          <aside class="panel question-nav">
            <h3 style="margin-bottom:12px;font-size:14px">题号</h3>
            <div class="question-grid">
              ${Array.from(
                { length: 20 },
                (_, index) =>
                  `<button class="question-dot ${
                    index === 0
                      ? "current"
                      : index < 3
                        ? "answered"
                        : ""
                  }">${index + 1}</button>`,
              ).join("")}
            </div>
            <div style="margin-top:17px;padding-top:14px;border-top:1px solid var(--line);color:var(--ink-muted);font-size:12px">
              已答 3 题 · 未答 17 题
            </div>
            <button class="btn" style="width:100%;margin-top:12px" data-action="exit-exam">退出考试</button>
          </aside>
        </div>
      </div>
    `;
  }

  function renderReadingOverview() {
    return `
      <div class="page">
        ${renderPageHeader(
          "Reading",
          "英语阅读",
          "从分级文章到英文文献，统一支持翻译、查词、朗读和加入笔记。",
          `<a class="btn primary" href="${hrefFor(
            "reading/articles",
          )}" data-route="reading/articles">${icon("play")}继续阅读</a>`,
        )}
        <section class="cards-grid">
          ${[
            [
              "reading/articles",
              "英文阅读",
              "短篇分级阅读与真题文章",
              "12 篇未读",
              "book-open",
            ],
            [
              "reading/collections",
              "文章与文献库",
              "2623 篇原创英语文章与学习文献导读",
              "22 个主题分类",
              "layers",
            ],
            [
              "reading/literature",
              "英文文献",
              "四级、雅思、托福和学术论文",
              "6 类文献",
              "library",
            ],
            [
              "reading/library",
              "英语书籍与资料",
              "词汇、语法、教材、原著与考试书",
              "18 本资料",
              "layers",
            ],
            [
              "reading/mine",
              "我的文章",
              "上传个人材料并进入 AI 阅读工作区",
              "3 篇已上传",
              "file",
            ],
          ]
            .map(
              ([route, title, desc, meta, iconName]) => `
                <a class="content-card" href="${hrefFor(
                  route,
                )}" data-route="${route}">
                  <span class="task-icon">${icon(iconName)}</span>
                  <h3>${title}</h3>
                  <p>${desc}</p>
                  <div class="content-card-meta">${meta}</div>
                </a>`,
            )
            .join("")}
        </section>
        <section class="section">
          <div class="section-head"><div><h2>推荐阅读</h2><p>根据你的 CET-4 目标推荐</p></div></div>
          <div class="panel">
            ${[
              [
                "Why Small Actions Still Matter",
                "环境 · 6 分钟 · CET-4",
                "已完成 60%",
              ],
              [
                "The Science of Sleep",
                "健康 · 8 分钟 · CET-4",
                "未开始",
              ],
              [
                "How Cities Shape Our Lives",
                "社会 · 7 分钟 · CET-6",
                "未开始",
              ],
            ]
              .map(
                ([title, meta, status]) => `
                  <a class="note-preview-item" href="${hrefFor(
                    "reading/articles",
                  )}" data-route="reading/articles">
                    <span class="note-dot"></span>
                    <div><strong>${title}</strong><span>${meta}</span></div>
                    <time>${status}</time>
                  </a>`,
              )
              .join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderLiteratureDetail(paperId) {
    const paper = state.papers.find((item) => item.id === paperId);
    if (!paper) {
      return `
        <div class="page narrow">
          <div class="empty-state">
            <div>
              <span class="empty-icon">${icon("library")}</span>
              <h3>这篇文献不存在</h3>
              <p>它可能已经被移除，返回文献工作区选择其他论文。</p>
              <button class="btn primary" data-action="go-route" data-route="reading/literature">返回文献工作区</button>
            </div>
          </div>
        </div>
      `;
    }
    state.activePaperId = paper.id;
    return `
      <div class="page">
        ${renderPageHeader(
          "Paper Reader",
          paper.title,
          `${paper.authors} · ${paper.journal} · ${paper.year}`,
          `<button class="btn" data-route="reading/literature" data-action="go-route">${icon(
            "arrowLeft",
          )}返回文献库</button>
           <button class="btn ${
             paper.saved ? "soft" : ""
           }" data-action="toggle-paper-save" data-id="${paper.id}">${icon(
             "bookmark",
           )}${paper.saved ? "已收藏" : "收藏"}</button>
           <button class="btn primary" data-action="literature-tool" data-tool="加入笔记" data-id="${
             paper.id
           }">${icon("plus")}加入笔记</button>`,
        )}
        <div class="document-layout literature-detail-layout">
          <aside class="panel doc-outline">
            <div class="field-label">论文目录</div>
            <div class="outline-list">
              <button class="outline-item active">Abstract</button>
              ${paper.sections
                .map(
                  ([title]) =>
                    `<button class="outline-item">${escapeHTML(title)}</button>`,
                )
                .join("")}
            </div>
            <div class="paper-citation">
              <span class="field-label">引用次数</span>
              <strong>${paper.citations}</strong>
            </div>
          </aside>

          <article class="panel document-copy paper-copy">
            <div class="eyebrow">Academic Paper</div>
            <h2>${escapeHTML(paper.title)}</h2>
            <div class="paper-meta">${escapeHTML(
              paper.authors,
            )} · ${escapeHTML(paper.journal)} · ${paper.year}</div>
            <div class="paper-abstract">
              <span class="field-label">Abstract</span>
              <p>${escapeHTML(paper.abstract)}</p>
            </div>
            <div class="paper-keywords">
              ${paper.keywords
                .map(
                  (keyword) =>
                    `<button class="tag tag-button" data-action="paper-keyword" data-word="${escapeHTML(
                      keyword,
                    )}">${escapeHTML(keyword)}</button>`,
                )
                .join("")}
            </div>
            ${paper.sections
              .map(
                ([title, content]) => `
                  <section class="paper-section">
                    <h3>${escapeHTML(title)}</h3>
                    <p>${escapeHTML(content)}</p>
                  </section>`,
              )
              .join("")}
            <div class="paper-reading-progress">
              <div class="progress-row">
                <span>阅读进度<strong>${paper.progress}%</strong></span>
                <div class="large-progress"><span style="width:${paper.progress}%"></span></div>
              </div>
              <button class="btn small" data-action="complete-paper-reading" data-id="${
                paper.id
              }">${icon("check")}标记已阅读</button>
            </div>
          </article>

          <aside class="panel doc-tools literature-tools">
            <div class="field-label">AI 文献工具</div>
            <div class="tool-list">
              ${[
                ["file", "生成摘要"],
                ["languages", "翻译选段"],
                ["type", "提取专业词汇"],
                ["target", "生成阅读理解题"],
                ["quote", "生成引用"],
                ["notebook", "加入笔记"],
              ]
                .map(
                  ([iconName, label]) =>
                    `<button class="btn small" data-action="literature-tool" data-tool="${label}" data-id="${
                      paper.id
                    }">${icon(iconName)}${label}</button>`,
                )
                .join("")}
            </div>
            <div class="vocabulary-side-note">
              <span class="task-icon">${icon("sparkles")}</span>
              <strong>阅读建议</strong>
              <p>先阅读 Abstract 和 Conclusion，再回到 Method 核对研究过程。</p>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function renderDataLoading(title, description) {
    return `
      <div class="page narrow">
        ${renderPageHeader("Loading Library", title, description)}
        <div class="panel panel-body">
          <div class="analysis-loading">
            <span class="spinner"></span>
            <span>正在加载内容，请稍候……</span>
          </div>
        </div>
      </div>
    `;
  }

  function ensureArticleLibrary() {
    if (articleLibrary.length) return Promise.resolve(articleLibrary);
    if (articleLibraryLoading) return articleLibrary._promise;
    articleLibraryLoading = true;
    articleLibraryError = "";
    const promise =
      window.ENGLISH_BUDDY_ARTICLE_LIBRARY_READY ||
      Promise.reject(new Error("Article library loader is unavailable."));
    articleLibrary._promise = promise
      .then((entries) => {
        articleLibrary = Array.isArray(entries) ? entries : [];
        articleLibraryLoading = false;
        if (getRoute().startsWith("reading/collection")) renderApp();
        return articleLibrary;
      })
      .catch((error) => {
        articleLibraryLoading = false;
        articleLibraryError =
          error?.message || "文章库暂时无法加载，请稍后重试。";
        if (getRoute().startsWith("reading/collection")) renderApp();
        throw error;
      });
    return articleLibrary._promise;
  }

  function ensureSpeechLibrary() {
    if (speechLibrary.length) return Promise.resolve(speechLibrary);
    if (speechLibraryLoading) return speechLibrary._promise;
    speechLibraryLoading = true;
    speechLibraryError = "";
    const promise =
      window.ENGLISH_BUDDY_SPEECH_LIBRARY_READY ||
      Promise.reject(new Error("Speech library loader is unavailable."));
    speechLibrary._promise = promise
      .then((entries) => {
        speechLibrary = Array.isArray(entries) ? entries : [];
        speechLibraryLoading = false;
        if (getRoute() === "study/speaking") renderApp();
        return speechLibrary;
      })
      .catch((error) => {
        speechLibraryLoading = false;
        speechLibraryError =
          error?.message || "朗读短句库暂时无法加载，请稍后重试。";
        if (getRoute() === "study/speaking") renderApp();
        throw error;
      });
    return speechLibrary._promise;
  }

  function ensureBusinessLibrary() {
    if (businessLibrary.length) return Promise.resolve(businessLibrary);
    if (businessLibraryLoading) return businessLibrary._promise;
    businessLibraryLoading = true;
    businessLibraryError = "";
    const promise =
      window.ENGLISH_BUDDY_BUSINESS_LIBRARY_READY ||
      Promise.reject(new Error("Business library loader is unavailable."));
    businessLibrary._promise = promise
      .then((entries) => {
        businessLibrary = Array.isArray(entries) ? entries : [];
        businessLibraryLoading = false;
        if (getRoute() === "study/business") renderApp();
        return businessLibrary;
      })
      .catch((error) => {
        businessLibraryLoading = false;
        businessLibraryError =
          error?.message || "商务英语词库暂时无法加载，请稍后重试。";
        if (getRoute() === "study/business") renderApp();
        throw error;
      });
    return businessLibrary._promise;
  }

  function renderArticleLibrary() {
    if (!articleLibrary.length) {
      if (!articleLibraryLoading) ensureArticleLibrary();
      if (articleLibraryError) {
        return `
          <div class="page narrow">
            <div class="empty-state">
              <div><span class="empty-icon">${icon(
                "refresh",
              )}</span><h3>文章库加载失败</h3><p>${escapeHTML(
                articleLibraryError,
              )}</p><button class="btn primary" data-action="retry-article-library">${icon(
                "refresh",
              )}重试</button></div>
            </div>
          </div>
        `;
      }
      return renderDataLoading(
        "文章与文献库",
        "正在准备 2623 篇原创英语内容和学习文献导读。",
      );
    }

    const categories = [
      "全部",
      ...new Set(articleLibrary.map((item) => item.category)),
    ].sort((a, b) => a.localeCompare(b, "zh-CN"));
    const query = state.collectionQuery.trim().toLowerCase();
    const filtered = articleLibrary.filter((item) => {
      if (
        state.collectionType !== "all" &&
        item.type !== state.collectionType
      )
        return false;
      if (
        state.collectionCategory !== "全部" &&
        item.category !== state.collectionCategory
      )
        return false;
      return `${item.title} ${item.abstract} ${item.summary} ${item.keywords.join(
        " ",
      )} ${item.category} ${item.exam.join(" ")}`
        .toLowerCase()
        .includes(query);
    });
    const pageSize = 60;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(state.collectionPage, totalPages - 1);
    const visible = filtered.slice(page * pageSize, page * pageSize + pageSize);
    const articleCount = articleLibrary.filter(
      (item) => item.type === "article",
    ).length;
    const literatureCount = articleLibrary.length - articleCount;

    return `
      <div class="page">
        ${renderPageHeader(
          "Reading Collection",
          "文章与文献库",
          "2623 篇原创英语学习文章与学习文献导读，覆盖 22 个主题和不同英语难度。",
          `<button class="btn" data-action="random-collection">${icon(
            "refresh",
          )}随机阅读</button>
           <button class="btn soft" data-action="open-speech-settings">${icon(
             "volume",
           )}朗读设置</button>`,
        )}
        <div class="notes-stats collection-stats">
          ${[
            ["内容总量", articleLibrary.length],
            ["学习文章", articleCount],
            ["文献导读", literatureCount],
            ["主题分类", categories.length - 1],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
        <div class="notes-toolbar collection-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="collection-search" value="${escapeHTML(
              state.collectionQuery,
            )}" placeholder="搜索标题、主题、关键词、考试或内容摘要" />
          </label>
          <button class="btn ${
            state.collectionType === "all" ? "soft" : ""
          }" data-action="filter-collection-type" data-type="all">全部</button>
          <button class="btn ${
            state.collectionType === "article" ? "soft" : ""
          }" data-action="filter-collection-type" data-type="article">文章</button>
          <button class="btn ${
            state.collectionType === "literature" ? "soft" : ""
          }" data-action="filter-collection-type" data-type="literature">文献导读</button>
        </div>
        <div class="resource-filters">
          ${categories
            .map(
              (category) => `
                <button class="course-chip ${
                  state.collectionCategory === category ? "active" : ""
                }" data-action="filter-collection-category" data-category="${escapeHTML(
                  category,
                )}">${escapeHTML(category)}</button>`,
            )
            .join("")}
        </div>
        ${
          visible.length
            ? `<div class="collection-grid">
                ${visible
                  .map(
                    (item) => `
                      <article class="collection-card">
                        <div class="collection-card-top">
                          <span class="note-category">${
                            item.type === "literature"
                              ? "文献导读"
                              : "学习文章"
                          }</span>
                          <span>${escapeHTML(item.level)} · ${
                            item.readingMinutes
                          } 分钟</span>
                        </div>
                        <h3>${escapeHTML(item.title)}</h3>
                        <p>${escapeHTML(item.summary)}</p>
                        <div class="note-tags">${item.keywords
                          .slice(0, 3)
                          .map(
                            (keyword) =>
                              `<span class="tag">${escapeHTML(
                                keyword,
                              )}</span>`,
                          )
                          .join("")}</div>
                        <div class="collection-card-footer">
                          <span>${escapeHTML(item.category)}</span>
                          <div>
                            <button class="icon-button ${
                              state.collectionFavorites.includes(item.id)
                                ? "is-saved"
                                : ""
                            }" data-action="toggle-collection-save" data-id="${
                              item.id
                            }">${icon("bookmark")}</button>
                            <button class="btn small primary" data-action="open-collection" data-id="${
                              item.id
                            }">阅读</button>
                          </div>
                        </div>
                      </article>`,
                  )
                  .join("")}
              </div>
              ${
                totalPages > 1
                  ? `<div class="vocabulary-pagination collection-pagination">
                      <button class="btn small" data-action="collection-page-prev" ${
                        page === 0 ? "disabled" : ""
                      }>${icon("chevronLeft")}上一页</button>
                      <span>第 ${page + 1} / ${totalPages} 页</span>
                      <button class="btn small" data-action="collection-page-next" ${
                        page >= totalPages - 1 ? "disabled" : ""
                      }>下一页${icon("chevronRight")}</button>
                    </div>`
                  : ""
              }`
            : `<div class="empty-state"><div><span class="empty-icon">${icon(
                "search",
              )}</span><h3>没有找到匹配内容</h3><p>尝试更换关键词、主题或内容类型。</p></div></div>`
        }
      </div>
    `;
  }

  function renderArticleDetail(articleId) {
    if (!articleLibrary.length) {
      if (!articleLibraryLoading) ensureArticleLibrary();
      return renderDataLoading(
        "Article Reader",
        "正在加载文章内容。",
      );
    }
    const article = articleLibrary.find((item) => item.id === articleId);
    if (!article) {
      return `
        <div class="page narrow">
          <div class="empty-state"><div><span class="empty-icon">${icon(
            "file",
          )}</span><h3>没有找到这篇内容</h3><p>返回文章文献库选择其他内容。</p><button class="btn primary" data-route="reading/collections" data-action="go-route">返回文章库</button></div></div>
        </div>
      `;
    }
    const saved = state.collectionFavorites.includes(article.id);
    const progress = state.collectionProgress[article.id] || 0;
    return `
      <div class="page">
        ${renderPageHeader(
          article.type === "literature" ? "Study Literature" : "English Article",
          article.title,
          `${article.sourceType} · ${article.level} · ${article.readingMinutes} 分钟 · ${article.category}`,
          `<button class="btn" data-route="reading/collections" data-action="go-route">${icon(
            "arrowLeft",
          )}返回文章库</button>
           <button class="btn ${saved ? "soft" : ""}" data-action="toggle-collection-save" data-id="${
             article.id
           }">${icon("bookmark")}${saved ? "已收藏" : "收藏"}</button>
           <button class="btn primary" data-action="add-collection-note" data-id="${
             article.id
           }">${icon("plus")}加入笔记</button>`,
        )}
        <div class="article-reader-layout">
          <article class="panel article-reader">
            <div class="article-reader-meta">
              <span>${escapeHTML(article.author)}</span>
              <span>${escapeHTML(article.journal)}</span>
              <span>${article.year}</span>
            </div>
            <div class="paper-abstract">
              <span class="field-label">英文摘要</span>
              <p>${escapeHTML(article.abstract)}</p>
            </div>
            <div class="passage-actions">
              <button class="btn primary" data-action="speak-text" data-text="${escapeHTML(
                article.content.join(" "),
              )}">${icon("play")}朗读全文</button>
              <button class="btn soft" data-action="shadow-text" data-text="${escapeHTML(
                article.content.join(" "),
              )}">${icon("mic")}跟读全文</button>
              <button class="btn" data-action="complete-collection" data-id="${
                article.id
              }">${icon("check")}标记完成</button>
            </div>
            <div class="article-paragraphs">
              ${article.content
                .map(
                  (paragraph, index) => `
                    <section class="article-paragraph">
                      <div class="article-paragraph-head">
                        <span>Paragraph ${index + 1}</span>
                        <button class="icon-button" data-action="speak-text" data-text="${escapeHTML(
                          paragraph,
                        )}">${icon("volume")}</button>
                      </div>
                      <p class="english-text">${escapeHTML(paragraph)}</p>
                      <p class="article-translation">${escapeHTML(
                        article.translation[index] || "",
                      )}</p>
                    </section>`,
                )
                .join("")}
            </div>
          </article>
          <aside class="article-reader-side">
            <section class="panel panel-body">
              <h3>阅读信息</h3>
              <div class="progress-row">
                <span>阅读进度<strong>${progress}%</strong></span>
                <div class="large-progress"><span style="width:${progress}%"></span></div>
              </div>
              <div class="note-tags" style="margin-top:14px">${article.exam
                .map((exam) => `<span class="tag">${escapeHTML(exam)}</span>`)
                .join("")}</div>
            </section>
            <section class="panel panel-body">
              <h3>关键词</h3>
              <div class="note-tags">${article.keywords
                .map(
                  (keyword) =>
                    `<button class="tag tag-button" data-action="paper-keyword" data-word="${escapeHTML(
                      keyword,
                    )}">${escapeHTML(keyword)}</button>`,
                )
                .join("")}</div>
            </section>
            <section class="panel panel-body">
              <h3>内容说明</h3>
              <p class="side-empty">${escapeHTML(
                article.summary,
              )}</p>
            </section>
          </aside>
        </div>
      </div>
    `;
  }

  function renderResourceLibrary() {
    const categories = [
      ["all", "全部资料"],
      ["vocabulary", "词汇书"],
      ["grammar", "语法写作"],
      ["course", "经典教材"],
      ["cet4", "四级资料"],
      ["cet6", "六级资料"],
      ["ielts", "雅思资料"],
      ["toefl", "托福资料"],
      ["classic", "英文原著"],
      ["nonfiction", "非虚构"],
      ["reference", "工具书"],
    ];
    const query = state.bookQuery.trim().toLowerCase();
    const books = state.books.filter((book) => {
      if (state.bookFilter !== "all" && book.category !== state.bookFilter)
        return false;
      return `${book.title} ${book.author} ${book.publisher} ${
        book.description
      } ${book.tags.join(" ")} ${book.exam.join(" ")}`
        .toLowerCase()
        .includes(query);
    });
    const learning = state.books.filter(
      (book) => book.progress > 0 && book.progress < 100,
    ).length;

    return `
      <div class="page">
        ${renderPageHeader(
          "English Resource Library",
          "英语书籍与资料",
          "按词汇、语法、教材、四级、六级、雅思、托福和英文原著分类。这里保存书目与自建学习模块，不复制受版权保护的正文。",
          `<button class="btn" data-action="open-resource-add">${icon(
            "plus",
          )}添加资料</button>
           <button class="btn primary" data-action="open-resource-plan">${icon(
             "calendar",
           )}生成阅读计划</button>`,
        )}
        <div class="notes-stats">
          ${[
            ["资料总数", state.books.length],
            ["收藏资料", state.books.filter((book) => book.saved).length],
            ["正在学习", learning],
            [
              "覆盖考试",
              new Set(state.books.flatMap((book) => book.exam)).size,
            ],
          ]
            .map(
              ([label, value]) =>
                `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
        <div class="notes-toolbar resource-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input id="book-search" value="${escapeHTML(
              state.bookQuery,
            )}" placeholder="搜索书名、作者、出版社、考试或学习主题" />
          </label>
        </div>
        <div class="resource-filters">
          ${categories
            .map(
              ([id, label]) => `
                <button class="course-chip ${
                  state.bookFilter === id ? "active" : ""
                }" data-action="filter-books" data-filter="${id}">${label}</button>`,
            )
            .join("")}
        </div>
        ${
          books.length
            ? `<div class="resource-grid">
                ${books
                  .map(
                    (book) => `
                      <article class="resource-card" data-category="${
                        book.category
                      }">
                        <div class="resource-cover">
                          <span>${escapeHTML(book.category.toUpperCase())}</span>
                          <strong>${escapeHTML(book.title)}</strong>
                          <small>${escapeHTML(book.author)}</small>
                        </div>
                        <div class="resource-card-body">
                          <div class="resource-card-top">
                            <span class="note-category">${escapeHTML(
                              book.level,
                            )}</span>
                            <button class="icon-button ${
                              book.saved ? "is-saved" : ""
                            }" data-action="toggle-book-save" data-id="${
                              book.id
                            }" aria-label="${
                              book.saved ? "取消收藏" : "收藏资料"
                            }">${icon("bookmark")}</button>
                          </div>
                          <h3>${escapeHTML(book.title)}</h3>
                          <p>${escapeHTML(book.description)}</p>
                          <div class="note-tags">${book.tags
                            .slice(0, 3)
                            .map(
                              (tag) =>
                                `<span class="tag">${escapeHTML(tag)}</span>`,
                            )
                            .join("")}</div>
                          <div class="resource-progress">
                            <span>学习进度 ${book.progress}%</span>
                            <div class="mini-progress"><span style="width:${
                              book.progress
                            }%"></span></div>
                          </div>
                          <div class="editor-actions" style="margin-top:12px">
                            <button class="btn small" data-action="open-book" data-id="${
                              book.id
                            }">${icon("book-open")}查看资料</button>
                            <button class="btn small soft" data-action="add-book-plan" data-id="${
                              book.id
                            }">${icon("calendar")}加入计划</button>
                          </div>
                        </div>
                      </article>`,
                  )
                  .join("")}
              </div>`
            : `<div class="empty-state"><div><span class="empty-icon">${icon(
                "layers",
              )}</span><h3>没有找到匹配资料</h3><p>尝试更换关键词或选择其他分类。</p></div></div>`
        }
      </div>
    `;
  }

  function renderReadingPage(route) {
    if (route === "reading/library") return renderResourceLibrary();
    if (route === "reading/literature") {
      const query = state.literatureQuery.trim().toLowerCase();
      const papers = state.papers.filter((paper) => {
        if (
          state.literatureExamFilter !== "all" &&
          !(
            (paper.exam || []).includes(state.literatureExamFilter) ||
            (state.literatureExamFilter === "Academic" &&
              ["academic", "education", "linguistics"].includes(paper.category))
          )
        )
          return false;
        if (state.literatureFilter === "saved" && !paper.saved) return false;
        if (
          state.literatureFilter === "reading" &&
          (paper.progress <= 0 || paper.progress >= 100)
        )
          return false;
        if (
          state.literatureFilter === "completed" &&
          paper.progress < 100
        )
          return false;
        return `${paper.title} ${paper.authors} ${paper.journal} ${paper.year} ${paper.keywords.join(
          " ",
        )}`
          .toLowerCase()
          .includes(query);
      });
      return `
        <div class="page">
          ${renderPageHeader(
            "Academic Library",
            "英文文献工作区",
            "检索、收藏并阅读论文，自动提取摘要、关键词、研究方法和专业词汇。",
            `<button class="btn" data-action="start-literature-search">${icon(
              "search",
            )}检索文献</button>
             <button class="btn primary" data-action="open-literature-import">${icon(
               "upload",
             )}导入文献</button>`,
          )}

          <div class="notes-stats literature-stats">
            ${[
              ["文献总数", state.papers.length],
              ["已收藏", state.papers.filter((paper) => paper.saved).length],
              [
                "阅读中",
                state.papers.filter(
                  (paper) => paper.progress > 0 && paper.progress < 100,
                ).length,
              ],
              ["关键词", new Set(state.papers.flatMap((paper) => paper.keywords)).size],
            ]
              .map(
                ([label, value]) =>
                  `<div class="stat-tile"><span>${label}</span><strong>${value}</strong></div>`,
              )
              .join("")}
          </div>

          <div class="notes-toolbar literature-toolbar">
            <label class="search-field">
              ${icon("search")}
              <input id="literature-search" value="${escapeHTML(
                state.literatureQuery,
              )}" placeholder="搜索标题、作者、期刊或关键词" />
            </label>
            ${[
              ["all", "全部"],
              ["saved", "已收藏"],
              ["reading", "阅读中"],
              ["completed", "已完成"],
            ]
              .map(
                ([filter, label]) =>
                  `<button class="btn small ${
                    state.literatureFilter === filter ? "soft" : ""
                  }" data-action="filter-literature" data-filter="${filter}">${label}</button>`,
              )
              .join("")}
          </div>
          <div class="resource-filters">
            ${[
              ["all", "全部考试"],
              ["CET-4", "CET-4"],
              ["CET-6", "CET-6"],
              ["IELTS", "雅思 IELTS"],
              ["TOEFL", "托福 TOEFL"],
              ["Academic", "通用学术"],
            ]
              .map(
                ([filter, label]) =>
                  `<button class="course-chip ${
                    state.literatureExamFilter === filter ? "active" : ""
                  }" data-action="filter-literature-exam" data-filter="${filter}">${label}</button>`,
              )
              .join("")}
          </div>

          ${
            papers.length
              ? `<div class="literature-grid">
                  ${papers
                    .map(
                      (paper) => `
                        <article class="content-card literature-card">
                          <div class="literature-card-head">
                            <span class="task-icon">${icon("library")}</span>
                            <button class="icon-button ${
                              paper.saved ? "is-saved" : ""
                            }" data-action="toggle-paper-save" data-id="${
                              paper.id
                            }" aria-label="${
                              paper.saved ? "取消收藏" : "收藏文献"
                            }">${icon("bookmark")}</button>
                          </div>
                          <h3>${escapeHTML(paper.title)}</h3>
                          <p>${escapeHTML(
                            paper.authors,
                          )} · ${escapeHTML(paper.journal)} · ${
                            paper.year
                          }</p>
                          <div class="note-tags">${paper.keywords
                            .map(
                              (keyword) =>
                                `<span class="tag">${escapeHTML(
                                  keyword,
                                )}</span>`,
                            )
                            .join("")}</div>
                          <div class="literature-card-footer">
                            <span>引用 ${paper.citations}</span>
                            <span>阅读进度 ${paper.progress}%</span>
                          </div>
                          <a class="btn primary" href="${hrefFor(
                            `reading/literature/${paper.id}`,
                          )}" data-route="reading/literature/${paper.id}">${icon(
                            "book-open",
                          )}打开论文</a>
                        </article>`,
                    )
                    .join("")}
                </div>`
              : `<div class="empty-state"><div><span class="empty-icon">${icon(
                  "library",
                )}</span><h3>没有找到匹配文献</h3><p>换个关键词或清除筛选条件后再试。</p></div></div>`
          }
        </div>
      `;
    }

    if (route === "reading/mine") {
      return `
        <div class="page">
          ${renderPageHeader(
            "My Documents",
            "我的文章",
            "把个人材料变成可查询、可朗读、可练习的阅读工作区。",
            `<button class="btn" data-action="upload-document">${icon(
              "upload",
            )}上传文章</button>
             <button class="btn soft" data-action="add-demo-note" data-kind="reading">${icon(
               "plus",
             )}加入笔记</button>`,
          )}
          <div class="document-layout">
            <aside class="panel doc-outline">
              <div class="field-label">文章目录</div>
              <div class="outline-list">
                <button class="outline-item active">Introduction</button>
                <button class="outline-item">The problem</button>
                <button class="outline-item">Key evidence</button>
                <button class="outline-item">Conclusion</button>
              </div>
            </aside>
            <article class="panel document-copy" id="document-copy">
              <div class="eyebrow">Uploaded Document</div>
              <h2>Why Learning English Changes How We See the World</h2>
              <p>Language is not only a system of words. It is also a way of noticing what matters. When we learn another language, we begin to recognize distinctions that once seemed invisible.</p>
              <h3>1. Language shapes attention</h3>
              <p>A new word does not merely give us a label for something we already know. It can teach us to look more carefully. In English, for example, the difference between <em>borrow</em> and <em>lend</em> forces the speaker to make the direction of an exchange explicit.</p>
              <h3>2. Practice creates confidence</h3>
              <p>Confidence is not the starting point of learning. It is a result of doing something often enough that it becomes familiar. Small, consistent practice therefore matters more than occasional intense effort.</p>
            </article>
            <aside class="panel doc-tools">
              <div class="field-label">AI 工具</div>
              <div class="tool-list">
                ${[
                  ["languages", "翻译全文"],
                  ["file", "生成摘要"],
                  ["edit", "检查错误"],
                  ["volume", "朗读文章"],
                  ["type", "提取单词"],
                  ["target", "生成题目"],
                  ["plus", "加入笔记"],
                ]
                  .map(
                    ([iconName, label]) =>
                      `<button class="btn small" data-action="article-tool" data-tool="${label}">${icon(
                        iconName,
                      )}${label}</button>`,
                  )
                  .join("")}
              </div>
            </aside>
          </div>
        </div>
      `;
    }

    return `
      <div class="page">
        ${renderPageHeader(
          "Bilingual Reading",
          "Why Small Actions Still Matter",
          "环境 · CET-4 · 6 分钟 · 原文与译文对照阅读",
          `<button class="btn" data-action="speak-text" data-text="Why Small Actions Still Matter">${icon(
            "volume",
          )}朗读</button>
           <button class="btn soft" data-action="add-demo-note" data-kind="reading">${icon(
             "plus",
           )}加入笔记</button>`,
        )}
        <div class="reader-switch">
          <button class="btn small soft" data-action="reader-mode" data-mode="original">原文</button>
          <button class="btn small" data-action="reader-mode" data-mode="translation">翻译</button>
        </div>
        <section class="panel panel-body reading-dual" id="reading-dual">
          <div class="split-workspace">
            <div class="article-copy">
              <p>Many people believe that <span class="selectable-word" data-action="word-popover" data-word="individual">individual</span> choices are too small to affect a global problem. They <span class="selectable-word" data-action="word-popover" data-word="recycle">recycle</span> one bottle, turn off one light, and conclude that nothing has changed.</p>
              <p>This conclusion misses an important point. Individual action is not a replacement for public <span class="selectable-word" data-action="word-popover" data-word="policy">policy</span>; it is part of the social pressure that makes policy possible.</p>
              <p>When people change their habits, they also change what governments and companies consider normal. A single choice may be small, but shared <span class="selectable-word" data-action="word-popover" data-word="expectation">expectations</span> can move entire systems.</p>
            </div>
            <div class="translation-copy">
              <p>许多人认为，个人选择太小，无法影响一个全球性问题。他们回收一个瓶子，关掉一盏灯，然后得出结论：什么也没有改变。</p>
              <p>这个结论忽略了一个重点。个人行动并不是公共政策的替代品，而是让政策成为可能的社会压力的一部分。</p>
              <p>当人们改变习惯时，他们也改变了政府和公司眼中的“常态”。一个选择也许很小，但共同的预期可以推动整个系统。</p>
            </div>
          </div>
        </section>
        <div class="exam-footer">
          <button class="btn" data-route="reading" data-action="go-route">${icon(
            "arrowLeft",
          )}返回阅读</button>
          <span class="exam-stat">3 / 6 段</span>
          <button class="btn primary" data-action="next-paragraph">继续阅读${icon(
            "chevronRight",
          )}</button>
        </div>
      </div>
    `;
  }

  function renderProfilePage() {
    const notesCount = state.notes.filter((note) => !note.archived).length;
    return `
      <div class="page">
        ${renderPageHeader(
          "Profile",
          "我的学习空间",
          "记录所有输入与输出，看看坚持怎样一点点变成能力。",
          `<button class="btn" data-route="settings" data-action="go-route">${icon(
            "settings",
          )}设置</button>`,
        )}
        <section class="panel profile-header">
          <div class="profile-avatar">L</div>
          <div><h1>Leo</h1><p>CET-4 目标 500 分 · 已连续学习 12 天</p></div>
          <button class="btn soft" data-action="edit-profile">${icon(
            "edit",
          )}编辑资料</button>
        </section>
        <div class="profile-stats">
          ${[
            ["连续学习", "12 天"],
            ["总学习时间", "18.6 h"],
            ["单词量", state.words.length.toLocaleString("en-US")],
            ["阅读量", "42 篇"],
            ["口语次数", "67"],
            ["考试次数", "24"],
            ["笔记数量", notesCount],
          ]
            .map(
              ([label, value]) =>
                `<div class="profile-stat"><strong>${value}</strong><span>${label}</span></div>`,
            )
            .join("")}
        </div>
        <section class="profile-grid">
          <div class="panel panel-body">
            <div class="section-head"><div><h2>学习日历</h2><p>最近 5 周的学习活跃度</p></div><span class="tag">18.6 小时</span></div>
            <div class="calendar-grid">
              ${Array.from({ length: 35 }, (_, index) => {
                const level = [1, 2, 3, 0][index % 4];
                return `<span class="calendar-day ${
                  level ? `level-${level}` : ""
                }">${index + 1}</span>`;
              }).join("")}
            </div>
          </div>
          <div class="panel panel-body">
            <div class="section-head"><div><h2>学习成就</h2><p>3 个新成就已解锁</p></div></div>
            <div class="achievement-list">
              ${[
                ["保持 7 天连续学习", "已解锁", "flame"],
                ["完成 40 篇阅读", "已解锁", "book-open"],
                ["口语练习 60 次", "已解锁", "mic"],
              ]
                .map(
                  ([title, meta, iconName]) => `
                    <div class="achievement">
                      <span class="achievement-icon">${icon(iconName)}</span>
                      <div><strong>${title}</strong><span>${meta}</span></div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>
        </section>
        <section class="section">
          <div class="cards-grid">
            <a class="content-card" href="${hrefFor(
              "notes",
            )}" data-route="notes"><span class="task-icon">${icon(
              "bookmark",
            )}</span><h3>我的收藏</h3><p>${notesCount} 条笔记与 ${
              state.notes.filter((note) => note.favorite).length
            } 条收藏</p><div class="content-card-meta">${icon(
              "chevronRight",
            )}查看</div></a>
            <a class="content-card" href="${hrefFor(
              "reading/mine",
            )}" data-route="reading/mine"><span class="task-icon">${icon(
              "file",
            )}</span><h3>我的文章</h3><p>3 篇个人文章和材料</p><div class="content-card-meta">${icon(
              "chevronRight",
            )}查看</div></a>
            <a class="content-card" href="${hrefFor(
              "settings",
            )}" data-route="settings"><span class="task-icon">${icon(
              "settings",
            )}</span><h3>学习设置</h3><p>目标、提醒和隐私偏好</p><div class="content-card-meta">${icon(
              "chevronRight",
            )}查看</div></a>
          </div>
        </section>
      </div>
    `;
  }

  function renderSettingsPage() {
    return `
      <div class="page narrow">
        ${renderPageHeader(
          "Settings",
          "偏好设置",
          "调整学习目标、提醒方式和内容显示偏好。",
        )}
        <div class="cards-grid">
          <section class="content-card">
            <span class="task-icon">${icon("target")}</span><h3>学习目标</h3>
            <p>当前目标：CET-4 500 分</p><button class="btn small" data-action="setting-demo">修改目标</button>
          </section>
          <section class="content-card">
            <span class="task-icon">${icon("bell")}</span><h3>学习提醒</h3>
            <p>每天 20:00 提醒复习</p><button class="btn small" data-action="setting-demo">调整提醒</button>
          </section>
          <section class="content-card">
            <span class="task-icon">${icon("volume")}</span><h3>发音偏好</h3>
            <p>${
              state.speech.accent === "en-GB"
                ? "英式发音"
                : state.speech.accent === "en-US"
                  ? "美式发音"
                  : "自动选择英语口音"
            } · ${state.speech.rate.toFixed(2)} 倍速</p>
            <button class="btn small" data-action="open-speech-settings">修改偏好</button>
          </section>
          <section class="content-card">
            <span class="task-icon">${icon("shield")}</span><h3>数据与隐私</h3>
            <p>笔记保存在当前浏览器中</p><button class="btn small" data-action="setting-demo">管理数据</button>
          </section>
          <section class="content-card">
            <span class="task-icon">${icon("refresh")}</span><h3>功能自检</h3>
            <p>检查路由、资源、保存功能和核心数据</p><button class="btn small primary" data-action="run-diagnostics">开始检查</button>
          </section>
          <section class="content-card">
            <span class="task-icon">${icon("layers")}</span><h3>版本管理</h3>
            <p>当前版和旧版独立保存，不会直接覆盖</p><a class="btn small" href="${APP_BASE}/versions/" target="_blank" rel="noopener">查看版本</a>
          </section>
        </div>
      </div>
    `;
  }

  function renderHelpPage() {
    return `
      <div class="page narrow">
        ${renderPageHeader(
          "Help",
          "帮助与反馈",
          "遇到问题？先查看常见问题，或直接把问题反馈给 AI 助手。",
        )}
        <div class="cards-grid">
          ${[
            ["如何使用英语笔记？", "从学习内容点击“加入笔记”，或直接快速记录。"],
            ["AI 整理会覆盖原文吗？", "不会。整理结果会先展示预览，由你决定是否保存。"],
            ["复习时间如何安排？", "默认使用间隔复习，认识与不认识都会影响下次时间。"],
            ["如何导入文章或文献？", "进入“我的文章”，上传文本或文档后即可使用 AI 工具。"],
          ]
            .map(
              ([title, desc]) =>
                `<article class="content-card"><h3>${title}</h3><p>${desc}</p></article>`,
            )
            .join("")}
        </div>
        <div class="panel panel-body" style="margin-top:16px">
          <h2 style="font-size:18px">还有其他问题？</h2>
          <p style="color:var(--ink-muted);font-size:13px">打开右下角 AI 助手，描述你遇到的问题。它会结合当前页面给出建议。</p>
          <button class="btn primary" data-action="toggle-ai">${icon(
            "sparkles",
          )}联系 AI 助手</button>
        </div>
      </div>
    `;
  }

  function renderNotFound() {
    return `
      <div class="page narrow">
        <div class="empty-state">
          <div><span class="empty-icon">${icon("search")}</span><h3>没有找到这个页面</h3><p>返回首页继续今天的学习。</p><button class="btn primary" data-route="home" data-action="go-route">返回首页</button></div>
        </div>
      </div>
    `;
  }

  function bindPage(route) {
    if (route.startsWith("notes/") && route !== "notes/review") {
      const note = getRouteNote(route.split("/")[1]);
      const content = document.getElementById("editor-content");
      if (content) {
        content.addEventListener("mouseup", showSelectionToolbar);
        content.addEventListener("keyup", showSelectionToolbar);
      }
      if (note) {
        const title = document.getElementById("editor-title");
        if (title) title.focus({ preventScroll: true });
      }
    }
  }

  function getRouteNote(id) {
    return state.notes.find((note) => note.id === id);
  }

  function touchNote(note) {
    note.updatedAt = new Date().toISOString();
    scheduleSave();
  }

  function openModal(content, className = "") {
    const root = document.getElementById("portal-root");
    root.innerHTML = `<div class="modal-backdrop" data-dismiss="modal"><div class="modal ${className}" role="dialog" aria-modal="true">${content}</div></div>`;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    const root = document.getElementById("portal-root");
    root.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function renderSearchModal() {
    openModal(
      `
        <div class="search-modal">
          <div class="search-modal-input">
            ${icon("search")}
            <input id="global-search-input" autocomplete="off" placeholder="搜索单词、笔记、文章、文献、题目或错句…" />
            <button class="icon-button" data-action="close-modal" aria-label="关闭">${icon(
              "x",
            )}</button>
          </div>
          <div class="search-results" id="search-results">
            ${renderSearchResults("")}
          </div>
        </div>
      `,
      "wide",
    );
    window.setTimeout(
      () => document.getElementById("global-search-input")?.focus(),
      20,
    );
  }

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return `
        <div class="search-group-title">快捷入口</div>
        ${[
          ["notes", "我的英语笔记", "搜索全部笔记", "notebook"],
          ["study/words", "单词学习", "继续今日单词", "type"],
          ["reading/articles", "英文阅读", "打开推荐文章", "book-open"],
          ["reading/library", "英语书籍与资料", "搜索书籍和考试资料", "layers"],
          ["exams/mistakes", "错题本", "查看待复盘内容", "target"],
        ]
          .map(
            ([route, title, desc, iconName]) => `
              <button class="search-result" data-route="${route}" data-action="search-route">
                <span class="search-result-icon">${icon(iconName)}</span>
                <div><strong>${title}</strong><span>${desc}</span></div>
                ${icon("chevronRight")}
              </button>`,
          )
          .join("")}
        <div class="search-group-title">最近搜索</div>
        ${["universe", "CET-4 阅读", "get to", "环保"].map(
          (term) =>
            `<button class="search-result" data-action="fill-search" data-term="${term}"><span class="search-result-icon">${icon(
              "clock",
            )}</span><div><strong>${term}</strong><span>最近搜索</span></div></button>`,
        ).join("")}
      `;
    }

    const matchingNotes = state.notes.filter((note) =>
      [
        note.title,
        note.summary,
        stripHTML(note.body),
        categoryName(note.category),
        ...(note.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
    const matchingWords = state.words.filter((word) =>
      `${word.word} ${word.meaning} ${word.definition || ""} ${
        word.forms || ""
      } ${word.phonetic} ${word.deck} ${(word.tags || []).join(" ")}`
        .toLowerCase()
        .includes(normalized),
    );
    const matchingBooks = state.books.filter((book) =>
      `${book.title} ${book.author} ${book.publisher} ${book.description} ${book.tags.join(
        " ",
      )}`
        .toLowerCase()
        .includes(normalized),
    );

    const staticResults = [
      {
        title: "universe",
        desc: "宇宙 · 单词卡 · /ˈjuːnɪvɜːrs/",
        type: "单词",
        icon: "type",
        route: "study/words",
        terms: "universe 宇宙 单词",
      },
      {
        title: "Why Small Actions Still Matter",
        desc: "环境主题文章 · CET-4 阅读",
        type: "英文阅读",
        icon: "book-open",
        route: "reading/articles",
        terms: "environment action 环保 阅读",
      },
      {
        title: "Can Individual Action Reduce Carbon Emissions?",
        desc: "Environmental Policy Review · 2025",
        type: "英文文献",
        icon: "library",
        route: "reading/literature",
        terms: "carbon emissions 文献 环保",
      },
      {
        title: "CET-4 阅读 Q18",
        desc: "推断题 · 忽略了 however 后的转折",
        type: "错题",
        icon: "target",
        route: "exams/mistakes",
        terms: "CET-4 阅读 错题 universe",
      },
    ].filter((item) =>
      `${item.title} ${item.desc} ${item.type} ${item.terms}`
        .toLowerCase()
        .includes(normalized),
    );

    const noteGroups = {};
    matchingNotes.forEach((note) => {
      const key = categoryName(note.category);
      noteGroups[key] ||= [];
      noteGroups[key].push(note);
    });

    const hasResults =
      matchingNotes.length ||
      matchingWords.length ||
      matchingBooks.length ||
      staticResults.length;
    if (!hasResults) {
      return `
        <div class="empty-state" style="min-height:260px">
          <div><span class="empty-icon">${icon("search")}</span><h3>没有找到“${escapeHTML(
            query,
          )}”</h3><p>试试更短的关键词，或搜索中文释义。</p></div>
        </div>
      `;
    }

    return `
      ${Object.entries(noteGroups)
        .map(
          ([category, notes]) => `
            <div class="search-group-title">${escapeHTML(category)}</div>
            ${notes
              .slice(0, 5)
              .map(
                (note) => `
                  <button class="search-result" data-route="notes/${
                    note.id
                  }" data-action="search-route">
                    <span class="search-result-icon">${icon("notebook")}</span>
                    <div><strong>${highlightMatch(
                      note.title,
                      normalized,
                    )}</strong><span>${escapeHTML(
                      note.summary || stripHTML(note.body).slice(0, 80),
                    )}</span></div>
                    <small>${formatRelative(note.updatedAt)}</small>
                  </button>`,
              )
              .join("")}
          `,
        )
        .join("")}
      ${
        matchingWords.length
          ? `<div class="search-group-title">单词</div>${matchingWords
              .slice(0, 6)
              .map(
                (word) => `
                  <button class="search-result" data-action="search-route" data-route="study/words">
                    <span class="search-result-icon">${icon("type")}</span>
                    <div><strong>${highlightMatch(
                      word.word,
                      normalized,
                    )}</strong><span>${escapeHTML(
                      `${word.phonetic} · ${word.meaning}`,
                    )}</span></div>
                    <small>${escapeHTML(word.deck)}</small>
                  </button>`,
              )
              .join("")}`
          : ""
      }
      ${
        matchingBooks.length
          ? `<div class="search-group-title">英语书籍与资料</div>${matchingBooks
              .slice(0, 6)
              .map(
                (book) => `
                  <button class="search-result" data-action="search-route" data-route="reading/library">
                    <span class="search-result-icon">${icon("layers")}</span>
                    <div><strong>${highlightMatch(
                      book.title,
                      normalized,
                    )}</strong><span>${escapeHTML(
                      `${book.author} · ${book.level}`,
                    )}</span></div>
                    <small>${escapeHTML(book.category.toUpperCase())}</small>
                  </button>`,
              )
              .join("")}`
          : ""
      }
      ${
        staticResults.length
          ? `<div class="search-group-title">相关文章与学习内容</div>${staticResults
              .map(
                (item) => `
                  <button class="search-result" data-route="${
                    item.route
                  }" data-action="search-route">
                    <span class="search-result-icon">${icon(item.icon)}</span>
                    <div><strong>${highlightMatch(
                      item.title,
                      normalized,
                    )}</strong><span>${escapeHTML(item.desc)}</span></div>
                    <small>${item.type}</small>
                  </button>`,
              )
              .join("")}`
          : ""
      }
    `;
  }

  function highlightMatch(text, query) {
    const safe = escapeHTML(text);
    if (!query) return safe;
    const index = safe.toLowerCase().indexOf(query.toLowerCase());
    if (index < 0) return safe;
    const end = index + query.length;
    return `${safe.slice(0, index)}<mark style="background:#dfeaff;color:#2459d5;padding:0 2px;border-radius:3px">${safe.slice(
      index,
      end,
    )}</mark>${safe.slice(end)}`;
  }

  function createNote(overrides = {}) {
    const now = new Date().toISOString();
    const note = {
      id: uid("note"),
      title: "无标题笔记",
      summary: "把今天学到的内容记录下来。",
      body: "",
      category: "other",
      tags: [],
      updatedAt: now,
      createdAt: now,
      favorite: false,
      pinned: false,
      important: false,
      reviewAt: null,
      reviewCards: [],
      ...overrides,
    };
    state.notes.unshift(note);
    saveState();
    return note;
  }

  function newNote() {
    const note = createNote();
    navigate(`notes/${note.id}`);
    showToast("新笔记已创建，内容会自动保存。", "success");
  }

  function extractSummary(html) {
    const text = stripHTML(html);
    return text ? text.slice(0, 100) : "把今天学到的内容记录下来。";
  }

  function updateEditorNote() {
    const id = getRoute().split("/")[1];
    const note = getRouteNote(id);
    if (!note) return;
    const title = document.getElementById("editor-title");
    const content = document.getElementById("editor-content");
    if (title) note.title = title.value.trim() || "无标题笔记";
    if (content) {
      note.body = content.innerHTML;
      note.summary = extractSummary(note.body);
    }
    touchNote(note);
    const saveStateLabel = document.getElementById("save-state");
    if (saveStateLabel) {
      saveStateLabel.innerHTML = `${icon("clock")} 正在保存…`;
      window.setTimeout(() => {
        if (document.body.contains(saveStateLabel)) {
          saveStateLabel.innerHTML = `${icon("check")} 已保存到本地`;
        }
      }, 360);
    }
  }

  function showSelectionToolbar(event) {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    document.querySelector(".selection-toolbar")?.remove();
    if (!text || text.length < 2) return;
    const editor = document.getElementById("editor-content");
    if (!editor || !editor.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const toolbar = document.createElement("div");
    toolbar.className = "selection-toolbar";
    toolbar.style.left = `${Math.max(
      10,
      Math.min(window.innerWidth - 520, rect.left),
    )}px`;
    toolbar.style.top = `${Math.max(70, rect.top - 46)}px`;
    toolbar.innerHTML = [
      ["languages", "翻译", "translate"],
      ["sparkles", "解释", "explain"],
      ["volume", "朗读", "speak"],
      ["wand", "AI 改写", "rewrite"],
      ["heading", "分析语法", "grammar"],
      ["plus", "加入单词", "word"],
      ["notebook", "加入笔记", "note"],
      ["edit", "生成例句", "example"],
    ]
      .map(
        ([iconName, label, action]) =>
          `<button data-action="selection-tool" data-tool="${action}" data-text="${escapeHTML(
            text.slice(0, 300),
          )}">${icon(iconName)}${label}</button>`,
      )
      .join("");
    document.body.appendChild(toolbar);
    if (event) event.stopPropagation();
  }

  function renderQuickRecordModal() {
    openModal(`
      <div class="modal-header">
        <div><h2>快速记录</h2><p>先抓住内容，之后随时整理成完整笔记。</p></div>
        <button class="icon-button" data-action="close-modal">${icon("x")}</button>
      </div>
      <form data-form="quick-record">
        <div class="modal-body">
          <label class="field">
            <span class="field-label">标题</span>
            <input class="input" name="title" placeholder="例如：问路常用表达" />
          </label>
          <label class="field">
            <span class="field-label">内容</span>
            <textarea class="textarea" name="body" rows="7" placeholder="写下句子、单词、翻译或临时想法…"></textarea>
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-action="close-modal">取消</button>
          <button class="btn primary">${icon("plus")}保存笔记</button>
        </div>
      </form>
    `);
  }

  function renderAiOrganizeModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>AI 整理笔记</h2><p>把零散内容整理成标题、单词、例句、重点和总结。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <form data-form="ai-organize">
          <div class="modal-body">
            <label class="field">
              <span class="field-label">原始内容</span>
              <textarea class="textarea" name="source" rows="9" placeholder="universe 宇宙&#10;very large 非常大&#10;The universe is very large."></textarea>
            </label>
            <div style="display:flex;justify-content:space-between;gap:10px;margin-top:9px">
              <button type="button" class="btn ghost small" data-action="fill-organize-sample">填入示例</button>
              <span style="color:var(--ink-soft);font-size:11px">也可以粘贴课堂笔记或文章摘录</span>
            </div>
            <div id="organize-result"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">取消</button>
            <button class="btn primary">${icon("sparkles")}AI 整理</button>
          </div>
        </form>
      `,
      "wide",
    );
  }

  function organizeText(source) {
    const lines = source
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const firstEnglish = lines
      .flatMap((line) => line.match(/[A-Za-z][A-Za-z '-]{1,}/g) || [])
      .find((word) => !["very", "the", "and", "with", "from"].includes(word.toLowerCase()));
    const titleWord = (firstEnglish || "English Note").replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );
    const englishSentence =
      lines.find((line) => /[A-Za-z].*[.!?]$/.test(line)) ||
      lines.find((line) => /^[A-Za-z]/.test(line)) ||
      "";
    const pairs = lines.filter(
      (line) => /\s/.test(line) && !/[.!?]$/.test(line),
    );
    const primaryPair = pairs[0] || "";
    const phraseLine =
      pairs.find((line) => /[=＝]|[A-Za-z]+\s+[A-Za-z]+/.test(line)) ||
      pairs[1] ||
      "";
    const wordLine = primaryPair || lines[0] || titleWord;
    const grammarRule = englishSentence
      ? / is | are | was | were /i.test(englishSentence)
        ? "主系表结构：主语 + be 动词 + 描述信息，用于说明状态或特征。"
        : "核心句型：先找主语和谓语，再补充时间、地点或目的。"
      : "建议补充一个完整英文例句，用于观察真实语法结构。";
    const phrases = pairs.filter((line) =>
      /[A-Za-z]+\s+[A-Za-z]+/.test(line),
    );
    const body = `
      <h1>${escapeHTML(titleWord)}</h1>
      <h3>单词</h3>
      <p><strong>${escapeHTML(wordLine)}</strong></p>
      <h3>短语</h3>
      <p>${
        phrases.length
          ? phrases
              .slice(0, 3)
              .map((line) => escapeHTML(line))
              .join("<br>")
          : "暂未提取到固定短语，可继续补充搭配。"
      }</p>
      <h3>语法</h3>
      <p>${escapeHTML(grammarRule)}</p>
      <h3>例句</h3>
      <p class="english-text">${escapeHTML(
        englishSentence || "请补充一个完整英文例句。",
      )}</p>
      <h3>重点</h3>
      <p><strong>${escapeHTML(
        phraseLine || primaryPair || "重点内容",
      )}</strong></p>
      <h3>总结</h3>
      <p>这组内容包含 ${lines.length} 个信息点。建议先掌握核心单词、短语和例句，再安排一次复习。</p>
    `;
    return {
      title: titleWord,
      summary: stripHTML(body).slice(0, 100),
      body,
    };
  }

  function showOrganizeResult(source) {
    const resultRoot = document.getElementById("organize-result");
    const submit = document.querySelector('[data-form="ai-organize"] button.primary');
    if (!resultRoot || !submit) return;
    if (!source.trim()) {
      showToast("先输入一些需要整理的内容。");
      return;
    }
    resultRoot._organizeSource = source;
    submit.disabled = true;
    resultRoot.innerHTML = `<div class="ai-analysis"><div class="analysis-loading"><span class="spinner"></span><span>AI 正在整理笔记……</span></div></div>`;
    window.setTimeout(() => {
      try {
        const result = organizeText(source);
        resultRoot.dataset.ready = "true";
        resultRoot.innerHTML = `
          <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)">
            <div class="section-head"><div><h3 style="margin:0;font-size:15px">整理预览</h3><p>保存后会创建一篇新笔记</p></div><span class="tag">AI 已整理</span></div>
            <div class="editor-content" style="min-height:0;padding:16px;border:1px solid var(--line);border-radius:8px;background:var(--surface-muted)">${result.body}</div>
          </div>
        `;
        resultRoot._organizedResult = result;
        submit.disabled = false;
        submit.innerHTML = `${icon("check")}保存整理结果`;
      } catch {
        resultRoot.dataset.ready = "false";
        resultRoot.innerHTML = `
          <div class="empty-state" style="min-height:220px;margin-top:16px">
            <div>
              <span class="empty-icon">${icon("refresh")}</span>
              <h3>暂时无法完成处理，请稍后再试。</h3>
              <p>你的原始内容没有丢失，可以重新尝试整理。</p>
              <button type="button" class="btn primary" data-action="retry-organize">${icon(
                "refresh",
              )}重试</button>
            </div>
          </div>
        `;
        submit.disabled = false;
        submit.innerHTML = `${icon("sparkles")}AI 整理`;
      }
    }, 1100);
  }

  function renderCategoryModal(categoryId) {
    const category = state.categories.find((item) => item.id === categoryId);
    if (!category) return;
    const count = state.notes.filter(
      (note) => note.category === categoryId,
    ).length;
    openModal(`
      <div class="modal-header">
        <div><h2>管理分类</h2><p>${count} 条笔记使用此分类</p></div>
        <button class="icon-button" data-action="close-modal">${icon("x")}</button>
      </div>
      <form data-form="rename-category">
        <div class="modal-body">
          <label class="field">
            <span class="field-label">分类名称</span>
            <input class="input" name="name" value="${escapeHTML(
              category.name,
            )}" maxlength="18" />
          </label>
        </div>
        <div class="modal-footer" style="justify-content:space-between">
          <button type="button" class="btn danger" data-action="delete-category" data-category="${
            category.id
          }">${icon("trash")}删除分类</button>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn" data-action="close-modal">取消</button>
            <button class="btn primary">保存</button>
          </div>
        </div>
      </form>
    `, "small");
  }

  function renderWordPopover(word) {
    const entries = {
      individual: {
        phonetic: "/ˌɪndɪˈvɪdʒuəl/",
        meaning: "个人的；个体",
        sentence: "Individual action can create social change.",
      },
      recycle: {
        phonetic: "/ˌriːˈsaɪkl/",
        meaning: "回收利用",
        sentence: "We should recycle paper and glass.",
      },
      policy: {
        phonetic: "/ˈpɑːləsi/",
        meaning: "政策；方针",
        sentence: "The new policy supports clean energy.",
      },
      expectation: {
        phonetic: "/ˌekspekˈteɪʃn/",
        meaning: "预期；期望",
        sentence: "Shared expectations can change social norms.",
      },
    };
    const datasetWord = state.words.find(
      (item) => item.word.toLowerCase() === String(word).toLowerCase(),
    );
    const entry = entries[word] || {
      phonetic:
        datasetWord?.phoneticUS || datasetWord?.phonetic || "",
      meaning:
        datasetWord?.meaning || "阅读文章中的重点单词",
      sentence: `The word “${word}” appears in the current article.`,
    };
    openModal(
      `
        <div class="modal-header">
          <div><h2>${escapeHTML(word)}</h2><p>${escapeHTML(
            entry.phonetic || "阅读词汇",
          )}</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="analysis-result-section">
            <span>释义</span><strong>${escapeHTML(entry.meaning)}</strong>
          </div>
          <div class="analysis-result-section">
            <span>例句</span><p class="english-text">${escapeHTML(
              entry.sentence,
            )}</p>
          </div>
          <div class="editor-actions" style="margin-top:16px">
            <button class="btn small" data-action="speak-text" data-text="${escapeHTML(
              entry.sentence,
            )}">${icon("volume")}朗读</button>
            <button class="btn small" data-action="open-oxford" data-word="${escapeHTML(
              word,
            )}">${icon("book-open")}牛津词典</button>
            <button class="btn small soft" data-action="word-add-note" data-word="${escapeHTML(
              word,
            )}" data-meaning="${escapeHTML(entry.meaning)}" data-sentence="${escapeHTML(
              entry.sentence,
            )}">${icon("plus")}加入笔记</button>
          </div>
        </div>
      `,
      "small",
    );
  }

  function renderSpeechSettingsModal() {
    refreshSpeechVoices();
    const voices = getVoicesForAccent(state.speech.accent);
    const bestVoice = voices[0];
    openModal(
      `
        <div class="modal-header">
          <div><h2>英语朗读设置</h2><p>选择口音、语音和语速，设置会自动保存。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <span class="field-label">口音</span>
            <div class="speech-option-grid">
              ${[
                ["en-GB", "英式英语", "Oxford / British"],
                ["en-US", "美式英语", "American"],
                ["en-AU", "澳式英语", "Australian"],
                ["en", "自动", "系统最佳英语语音"],
              ]
                .map(
                  ([accent, label, note]) => `
                    <button class="speech-option ${
                      state.speech.accent === accent ? "active" : ""
                    }" data-action="set-speech-accent" data-accent="${accent}">
                      <strong>${label}</strong><span>${note}</span>
                    </button>`,
                )
                .join("")}
            </div>
          </div>
          <label class="field">
            <span class="field-label">系统语音</span>
            <select class="select" id="speech-voice-select" data-action="set-speech-voice">
              <option value="">自动选择最佳语音</option>
              ${voices
                .map(
                  (voice) => `
                    <option value="${escapeHTML(voice.voiceURI)}" ${
                      state.speech.voiceURI === voice.voiceURI ? "selected" : ""
                    }>${escapeHTML(voice.name)} · ${escapeHTML(
                      voice.lang,
                    )}</option>`,
                )
                .join("")}
            </select>
          </label>
          <div class="field">
            <span class="field-label">语音质量</span>
            <div class="speech-rate-row">
              <button class="course-chip ${
                state.speech.quality === "natural" ? "active" : ""
              }" data-action="set-speech-quality" data-quality="natural">高质量拟真优先</button>
              <button class="course-chip ${
                state.speech.quality === "system" ? "active" : ""
              }" data-action="set-speech-quality" data-quality="system">系统默认</button>
            </div>
            ${
              bestVoice
                ? `<p class="speech-help">当前推荐：${escapeHTML(
                    bestVoice.name,
                  )} · ${escapeHTML(bestVoice.lang)}</p>`
                : `<p class="speech-help">设备暂未返回可用英语语音。</p>`
            }
          </div>
          <div class="field">
            <span class="field-label">语速</span>
            <div class="speech-rate-row">
              ${[
                [0.72, "慢速"],
                [0.92, "清晰"],
                [1, "正常"],
                [1.15, "快速"],
              ]
                .map(
                  ([rate, label]) => `
                    <button class="course-chip ${
                      Math.abs(state.speech.rate - rate) < 0.02 ? "active" : ""
                    }" data-action="set-speech-rate" data-rate="${rate}">${label}</button>`,
                )
                .join("")}
            </div>
          </div>
          <div class="speech-preview">
            <span class="task-icon">${icon("volume")}</span>
            <div><strong>测试朗读</strong><p>The universe is very large and still expanding.</p></div>
            <button class="btn primary small" data-action="test-speech">${icon(
              "play",
            )}试听</button>
          </div>
          <p class="speech-help">朗读使用设备内置或浏览器提供的英语语音。若没有声音，请检查系统音量和浏览器语音权限。</p>
        </div>
      `,
      "wide",
    );
  }

  function openOxfordDictionary(word) {
    const value = String(word || "").trim();
    if (!value) return;
    const url = `https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(
      value.toLowerCase(),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function renderNoteTemplatesModal() {
    const templates = [
      {
        id: "word",
        title: "单词笔记",
        description: "单词、音标、释义、词形和例句",
        icon: "type",
      },
      {
        id: "grammar",
        title: "语法笔记",
        description: "结构、规则、例句和易错点",
        icon: "heading",
      },
      {
        id: "reading",
        title: "阅读笔记",
        description: "文章摘要、长难句、观点和生词",
        icon: "book-open",
      },
      {
        id: "mistake",
        title: "错题笔记",
        description: "错因、正确答案和同类题提醒",
        icon: "target",
      },
      {
        id: "essay",
        title: "作文笔记",
        description: "立场、论据、句型和修改记录",
        icon: "edit",
      },
      {
        id: "class",
        title: "课堂笔记",
        description: "课程重点、疑问和课后任务",
        icon: "notebook",
      },
    ];
    openModal(
      `
        <div class="modal-header">
          <div><h2>插入笔记模板</h2><p>选择结构后会插入到当前光标位置，不覆盖已有内容。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="note-template-grid">
            ${templates
              .map(
                (template) => `
                  <button class="note-template-card" data-action="insert-note-template" data-template="${
                    template.id
                  }">
                    <span class="task-icon">${icon(template.icon)}</span>
                    <strong>${template.title}</strong>
                    <small>${template.description}</small>
                  </button>`,
              )
              .join("")}
          </div>
        </div>
      `,
      "wide",
    );
  }

  function insertNoteTemplate(template) {
    const templates = {
      word:
        '<h2>单词</h2><p><strong>word</strong> /phonetic/</p><h3>释义</h3><p>中文释义</p><h3>词形变化</h3><p>过去式 / 过去分词 / 复数</p><h3>例句</h3><p class="english-text">Write an example sentence.</p><h3>我的记忆方法</h3><p></p>',
      grammar:
        "<h2>语法结构</h2><p><strong>Structure:</strong></p><h3>使用规则</h3><ul><li>规则一</li><li>规则二</li></ul><h3>例句</h3><p></p><h3>易错点</h3><p></p>",
      reading:
        "<h2>文章信息</h2><p>标题 / 来源 / 阅读时间</p><h3>核心观点</h3><p></p><h3>文章结构</h3><ol><li>Introduction</li><li>Main idea</li><li>Conclusion</li></ol><h3>生词与长难句</h3><p></p><h3>我的总结</h3><p></p>",
      mistake:
        "<h2>错题记录</h2><p>题目来源：</p><h3>我的错误答案</h3><p></p><h3>正确答案</h3><p></p><h3>错误原因</h3><p></p><h3>知识点</h3><p></p><h3>下次提醒</h3><p></p>",
      essay:
        "<h2>作文主题</h2><p></p><h3>中心立场</h3><p></p><h3>论证结构</h3><ol><li>观点一</li><li>观点二</li><li>让步与总结</li></ol><h3>高级句型</h3><p></p><h3>修改记录</h3><p></p>",
      class:
        "<h2>课堂主题</h2><p>日期 / 课程 / 老师</p><h3>重点内容</h3><ul><li></li></ul><h3>新词和短语</h3><p></p><h3>我的疑问</h3><p></p><h3>课后任务</h3><p></p>",
    };
    closeModal();
    const editor = document.getElementById("editor-content");
    if (!editor) return;
    editor.focus();
    document.execCommand("insertHTML", false, templates[template] || "");
    updateEditorNote();
  }

  function renderNoteSummaryModal() {
    const note = getRouteNote(getRoute().split("/")[1]);
    if (!note) return;
    const text = stripHTML(note.body);
    const headings = [...note.body.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi)]
      .map((match) => stripHTML(match[1]))
      .filter(Boolean)
      .slice(0, 6);
    const sentences = text
      .split(/[。！？.!?]+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 5);
    const summary =
      sentences.slice(0, 3).join("。") ||
      "这篇笔记还没有足够的正文内容，可以先补充重点和例句。";
    openModal(
      `
        <div class="modal-header">
          <div><h2>AI 笔记总结</h2><p>${escapeHTML(note.title)}</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="note-summary-card">
            <span class="field-label">内容总结</span>
            <p>${escapeHTML(summary)}</p>
          </div>
          <div class="note-summary-card">
            <span class="field-label">结构大纲</span>
            ${
              headings.length
                ? `<ul>${headings
                    .map((heading) => `<li>${escapeHTML(heading)}</li>`)
                    .join("")}</ul>`
                : "<p>建议添加标题、单词、例句和总结等结构。</p>"
            }
          </div>
          <div class="note-summary-card">
            <span class="field-label">复习建议</span>
            <p>把释义、例句和易错点分别设置复习时间，比一次性重复整篇笔记更有效。</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" data-action="close-modal">关闭</button>
          <button class="btn primary" data-action="insert-note-summary" data-summary="${escapeHTML(
            summary,
          )}">${icon("plus")}插入总结</button>
        </div>
      `,
      "small",
    );
  }

  function renderWordImportModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>添加单词</h2><p>创建后会自动进入词库并参与掌握度统计。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <form data-form="word-import">
          <div class="modal-body">
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">单词</span>
                <input class="input" name="word" required placeholder="例如：reinforce" />
              </label>
              <label class="field">
                <span class="field-label">词库</span>
                <select class="select" name="deck">
                  ${[
                    ...new Set([
                      "CET-4",
                      "CET-6",
                      "场景听力",
                      "学术英语",
                      ...state.words.map((word) => word.deck),
                    ]),
                  ]
                    .map(
                      (deck) => `<option value="${escapeHTML(deck)}">${escapeHTML(deck)}</option>`,
                    )
                    .join("")}
                </select>
              </label>
            </div>
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">音标</span>
                <input class="input" name="phonetic" placeholder="/rɪˈɪnfɔːrs/" />
              </label>
              <label class="field">
                <span class="field-label">词性</span>
                <input class="input" name="part" placeholder="verb" />
              </label>
            </div>
            <label class="field">
              <span class="field-label">中文释义</span>
              <input class="input" name="meaning" required placeholder="加强；强化" />
            </label>
            <label class="field">
              <span class="field-label">英文例句</span>
              <textarea class="textarea" name="example" rows="3" placeholder="The results reinforce the main conclusion."></textarea>
            </label>
            <label class="field">
              <span class="field-label">例句翻译</span>
              <input class="input" name="translation" placeholder="这些结果强化了主要结论。" />
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">取消</button>
            <button class="btn primary">${icon("plus")}添加到词库</button>
          </div>
        </form>
      `,
      "wide",
    );
  }

  function renderVocabTestModal() {
    const candidates = state.vocabTest.wordIds.length
      ? state.vocabTest.wordIds
          .map((id) => state.words.find((word) => word.id === id))
          .filter(Boolean)
      : [...state.words]
          .sort((a, b) => a.mastery - b.mastery || a.frequencyRank - b.frequencyRank)
          .slice(0, 20);
    if (!candidates.length) {
      showToast("词库为空，请先添加单词。");
      return;
    }
    if (state.vocabTest.index >= candidates.length) {
      const total = candidates.length;
      const score = state.vocabTest.score;
      state.vocabTest.active = false;
      openModal(
        `
          <div class="modal-header">
            <div><h2>测试完成</h2><p>本轮共测试 ${total} 个单词</p></div>
            <button class="icon-button" data-action="close-modal">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <div class="empty-state" style="min-height:270px">
              <div>
                <span class="empty-icon">${icon("award")}</span>
                <h3>${score} / ${total}</h3>
                <p>已认识的单词掌握度会提高；需要复习的单词会自动降低掌握度。</p>
                <button class="btn primary" data-action="restart-vocab-test">${icon(
                  "refresh",
                )}再测一次</button>
              </div>
            </div>
          </div>
        `,
        "small",
      );
      return;
    }
    const word = candidates[state.vocabTest.index];
    openModal(
      `
        <div class="modal-header">
          <div><h2>单词测试</h2><p>第 ${state.vocabTest.index + 1} / ${
            candidates.length
          } 个</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="vocab-test-card">
            <div class="eyebrow">${escapeHTML(word.deck)}</div>
            <h2>${escapeHTML(word.word)}</h2>
            <div class="phonetic">${escapeHTML(word.phonetic)}</div>
            <p>先回忆释义和例句，再选择你的掌握情况。</p>
            <button class="btn ghost" data-action="vocab-test-reveal">${icon(
              "eye",
            )}显示答案</button>
            <div class="vocab-test-answer hidden">
              <strong>${escapeHTML(word.meaning)}</strong>
              <p class="english-text">${escapeHTML(
                word.example ||
                  word.definition ||
                  `Review the meaning and usage of “${word.word}”.`,
              )}</p>
              ${
                word.translation
                  ? `<p>${escapeHTML(word.translation)}</p>`
                  : ""
              }
            </div>
          </div>
          <div class="editor-actions" style="margin-top:16px">
            <button class="btn danger" data-action="vocab-test-review" data-id="${
              word.id
            }">${icon("refresh")}我不认识</button>
            <button class="btn primary" data-action="vocab-test-known" data-id="${
              word.id
            }">${icon("check")}我认识</button>
          </div>
        </div>
      `,
      "small",
    );
  }

  function startTrainingMode(mode) {
    ensureDailyTraining();
    if (mode === "daily-words") {
      const dailyWords = [...state.words]
        .filter((word) => word.mastery === 0)
        .sort(
          (a, b) =>
            (a.frequencyRank || 10_000_000) -
            (b.frequencyRank || 10_000_000),
        )
        .slice(0, 50);
      state.dailyWordIds = dailyWords.map((word) => word.id);
      state.dailyCompletedIds = [];
      state.activeWordDeck = "全部词库";
      state.wordStatusFilter = "new";
      state.wordPage = 0;
      if (dailyWords[0]) state.activeWordId = dailyWords[0].id;
      saveState();
      openModal(
        `
          <div class="modal-header">
            <div><h2>今日 50 词</h2><p>按词频和考试价值排序</p></div>
            <button class="icon-button" data-action="close-modal">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <div class="daily-preview-list">
              ${dailyWords
                .slice(0, 12)
                .map(
                  (word, index) => `
                    <div class="daily-preview-item">
                      <span>${index + 1}</span>
                      <div><strong>${escapeHTML(
                        word.word,
                      )}</strong><small>${escapeHTML(
                        word.meaning,
                      )}</small></div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" data-action="close-modal">稍后</button>
            <button class="btn primary" data-action="begin-daily-words">${icon(
              "play",
            )}开始今日任务</button>
          </div>
        `,
        "wide",
      );
      return;
    }
    if (mode === "spelling") {
      const ids = [...state.words]
        .filter((word) => word.mastery < 80)
        .sort(
          (a, b) =>
            (a.frequencyRank || 10_000_000) -
              (b.frequencyRank || 10_000_000) ||
            a.mastery - b.mastery,
        )
        .slice(0, 20)
        .map((word) => word.id);
      state.vocabTest = {
        active: true,
        index: 0,
        score: 0,
        mode: "spelling",
        wordIds: ids,
        spellingCorrect: null,
      };
      renderSpellingTestModal();
      return;
    }

    let items = [];
    if (mode === "word-cards" || mode === "spaced-review") {
      const due =
        mode === "spaced-review"
          ? state.words.filter(
              (word) =>
                word.reviewAt &&
                new Date(word.reviewAt).getTime() <= Date.now(),
            )
          : [];
      items = (due.length
        ? due
        : [...state.words].sort(
            (a, b) =>
              a.mastery - b.mastery ||
              (a.frequencyRank || 10_000_000) -
                (b.frequencyRank || 10_000_000),
          )
      )
        .slice(0, mode === "word-cards" ? 12 : 10)
        .map((word) => word.id);
    } else if (mode === "listening-choice") {
      items = [...state.words]
        .sort(
          (a, b) =>
            (a.frequencyRank || 10_000_000) -
            (b.frequencyRank || 10_000_000),
        )
        .slice(0, 10)
        .map((word) => word.id);
    } else if (mode === "cloze") {
      items = CLOZE_EXAMPLES.map((item) => item.answer);
    } else if (mode === "shadowing") {
      items = SHADOWING_SENTENCES;
    }

    state.training.session = {
      mode,
      index: 0,
      score: 0,
      items,
      revealed: false,
      feedback: "",
    };
    renderTrainingSessionModal();
  }

  function trainingWord(item) {
    if (typeof item !== "string") return null;
    return state.words.find(
      (word) => word.id === item || word.word === item,
    );
  }

  function startListeningQuestion(word) {
    if (!word) return;
    speakText(word.word || word, null, null);
  }

  function completeTrainingTask(mode) {
    if (!state.training.completedTaskIds.includes(mode)) {
      state.training.completedTaskIds.push(mode);
    }
    saveState();
  }

  function renderTrainingSessionModal() {
    const session = state.training.session;
    if (session.index >= session.items.length) {
      completeTrainingTask(session.mode);
      const total = session.items.length;
      openModal(
        `
          <div class="modal-header">
            <div><h2>训练完成</h2><p>${trainingModeTitle(
              session.mode,
            )}</p></div>
            <button class="icon-button" data-action="close-modal">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <div class="empty-state" style="min-height:280px">
              <div>
                <span class="empty-icon">${icon("award")}</span>
                <h3>${session.score} / ${total}</h3>
                <p>训练结果已经写入单词掌握度和间隔复习计划。</p>
                <button class="btn primary" data-action="training-return">${icon(
                  "check",
                )}返回训练中心</button>
              </div>
            </div>
          </div>
        `,
        "small",
      );
      return;
    }

    const current = session.items[session.index];
    const word = trainingWord(current);
    let content = "";

    if (session.mode === "word-cards") {
      content = `
        <div class="flashcard ${session.revealed ? "flipped" : ""}">
          <div class="flashcard-inner">
            <div class="flashcard-face">
              <span class="flashcard-label">English Word</span>
              <h3>${escapeHTML(word.word)}</h3>
              <span class="phonetic">${escapeHTML(
                word.phoneticUS || word.phonetic,
              )}</span>
              <button class="btn small" data-action="training-speak">${icon(
                "volume",
              )}朗读</button>
            </div>
            <div class="flashcard-face back">
              <span class="flashcard-label">Meaning</span>
              <h3>${escapeHTML(word.meaning)}</h3>
              <p>${escapeHTML(
                word.example ||
                  word.definition ||
                  `Review ${word.word} in context.`,
              )}</p>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="btn danger" data-action="training-known" data-known="false">${icon(
            "refresh",
          )}需复习</button>
          <button class="btn soft" data-action="training-flip">${icon(
            "eye",
          )}${session.revealed ? "收起答案" : "查看答案"}</button>
          <button class="btn primary" data-action="training-known" data-known="true">${icon(
            "check",
          )}我认识</button>
        </div>
      `;
    } else if (session.mode === "listening-choice") {
      const meanings = state.words
        .filter(
          (item) =>
            item.id !== word.id &&
            item.meaning !== word.meaning,
        )
        .slice(session.index + 3, session.index + 6)
        .map((item) => item.meaning);
      const options = [word.meaning, ...meanings].sort(() =>
        Math.random() - 0.5,
      );
      content = `
        <div class="listening-training">
          <button class="mic-button" data-action="training-speak">${icon(
            "volume",
          )}</button>
          <h3>听音选择正确释义</h3>
          <div class="answer-list compact-options">
            ${options
              .map(
                (option) => `
                  <button class="answer-option" data-action="training-answer" data-answer="${escapeHTML(
                    option,
                  )}"><span>${escapeHTML(option)}</span></button>`,
              )
              .join("")}
          </div>
        </div>
      `;
      window.setTimeout(() => speakText(word.word), 120);
    } else if (session.mode === "cloze") {
      const example = CLOZE_EXAMPLES.find(
        (item) => item.answer === current,
      );
      const options = [
        example.answer,
        ...CLOZE_EXAMPLES.filter(
          (item) => item.answer !== example.answer,
        )
          .slice(session.index + 2, session.index + 5)
          .map((item) => item.answer),
      ].sort(() => Math.random() - 0.5);
      content = `
        <div class="cloze-stage">
          <div class="eyebrow">Fill in the blank</div>
          <h3>${escapeHTML(example.sentence)}</h3>
          <div class="answer-list compact-options">
            ${options
              .map(
                (option) => `
                  <button class="answer-option" data-action="training-answer" data-answer="${escapeHTML(
                    option,
                  )}"><span>${escapeHTML(option)}</span></button>`,
              )
              .join("")}
          </div>
        </div>
      `;
    } else if (session.mode === "shadowing") {
      content = `
        <div class="shadowing-stage">
          <span class="task-icon">${icon("mic")}</span>
          <h3>${escapeHTML(current)}</h3>
          <div class="speaking-controls">
            <button class="btn" data-action="training-speak">${icon(
              "volume",
            )}标准朗读</button>
            <button class="btn soft" data-action="toggle-shadowing">${icon(
              "mic",
            )}开始跟读</button>
          </div>
          <p>先完整听一遍，再模仿重音、停顿和语调。</p>
          <div class="editor-actions">
            <button class="btn danger" data-action="training-rating" data-rating="again">${icon(
              "refresh",
            )}再听一次</button>
            <button class="btn primary" data-action="training-rating" data-rating="good">${icon(
              "check",
            )}跟读完成</button>
          </div>
        </div>
      `;
    } else if (session.mode === "spaced-review") {
      content = `
        <div class="flashcard ${session.revealed ? "flipped" : ""}">
          <div class="flashcard-inner">
            <div class="flashcard-face">
              <span class="flashcard-label">间隔复习</span>
              <h3>${escapeHTML(word.word)}</h3>
              <p>${escapeHTML(word.phoneticUS || word.phonetic)}</p>
              <button class="btn small" data-action="training-speak">${icon(
                "volume",
              )}朗读</button>
            </div>
            <div class="flashcard-face back">
              <span class="flashcard-label">释义</span>
              <h3>${escapeHTML(word.meaning)}</h3>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="btn danger" data-action="training-rating" data-rating="again">${icon(
            "refresh",
          )}重来</button>
          <button class="btn" data-action="training-flip">${icon(
            "eye",
          )}${session.revealed ? "收起答案" : "查看答案"}</button>
          <button class="btn soft" data-action="training-rating" data-rating="hard">${icon(
            "clock",
          )}困难</button>
          <button class="btn primary" data-action="training-rating" data-rating="good">${icon(
            "check",
          )}掌握</button>
        </div>
      `;
    }

    openModal(
      `
        <div class="modal-header">
          <div><h2>${trainingModeTitle(
            session.mode,
          )}</h2><p>第 ${session.index + 1} / ${
            session.items.length
          } 项 · 已答对 ${session.score}</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          ${content}
          ${
            session.feedback
              ? `<div class="training-feedback ${
                  session.feedback === "correct" ? "correct" : "incorrect"
                }">${icon(
                  session.feedback === "correct" ? "check" : "refresh",
                )}${
                  session.feedback === "correct"
                    ? "回答正确"
                    : `答案：${escapeHTML(
                        word?.word || current,
                      )}`
                }</div>
                <button class="btn primary" style="width:100%;margin-top:12px" data-action="training-next">下一项${icon(
                  "chevronRight",
                )}</button>`
              : ""
          }
        </div>
      `,
      "wide",
    );
  }

  function trainingModeTitle(mode) {
    return {
      "word-cards": "单词卡片",
      "listening-choice": "听音选义",
      spelling: "拼写训练",
      cloze: "例句填空",
      shadowing: "发音跟读",
      "spaced-review": "间隔复习",
    }[mode] || "单词训练";
  }

  function advanceTraining() {
    state.training.session.index += 1;
    state.training.session.revealed = false;
    state.training.session.feedback = "";
    renderTrainingSessionModal();
  }

  function applyWordTrainingResult(word, correct, rating = "good") {
    if (!word) return;
    if (correct) {
      word.mastery = Math.min(100, word.mastery + 8);
      const intervals = { easy: 7, good: 3, hard: 1, again: 0 };
      const days = intervals[rating] ?? 3;
      word.reviewAt =
        days > 0
          ? new Date(Date.now() + days * 86400000).toISOString()
          : new Date(Date.now() + 10 * 60000).toISOString();
    } else {
      word.mastery = Math.max(0, word.mastery - 10);
      word.reviewAt = new Date(Date.now() + 10 * 60000).toISOString();
    }
    if (
      state.dailyWordIds.includes(word.id) &&
      !state.dailyCompletedIds.includes(word.id)
    ) {
      state.dailyCompletedIds.push(word.id);
    }
    saveState();
  }

  function shadowingSimilarity(target, transcript) {
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9'\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
    const expected = normalize(target);
    const actual = normalize(transcript);
    if (!expected.length || !actual.length) return 0;
    const used = new Set();
    let matches = 0;
    expected.forEach((word) => {
      const index = actual.findIndex(
        (candidate, candidateIndex) =>
          !used.has(candidateIndex) && candidate === word,
      );
      if (index >= 0) {
        used.add(index);
        matches += 1;
      }
    });
    const coverage = matches / expected.length;
    const lengthPenalty =
      Math.min(actual.length, expected.length) /
      Math.max(actual.length, expected.length);
    return Math.round((coverage * 0.8 + lengthPenalty * 0.2) * 100);
  }

  function startShadowingAttempt(targetText, button) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const stage = button.closest(".shadowing-stage, .passage-sentence");
    const existing = stage?.querySelector(".shadowing-feedback");
    existing?.remove();

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang =
        state.speech.accent === "en" ? "en-US" : state.speech.accent;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      button.classList.add("is-speaking");
      let completed = false;

      recognition.onresult = (event) => {
        completed = true;
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        const score = shadowingSimilarity(targetText, transcript);
        button.classList.remove("is-speaking");
        const feedback = document.createElement("div");
        feedback.className = "shadowing-feedback";
        feedback.innerHTML = `<strong>跟读完成度 ${score}%</strong><span>识别结果：${escapeHTML(
          transcript,
        )}</span>`;
        stage?.appendChild(feedback);
        state.training.session.score += score >= 70 ? 1 : 0;
        showToast(
          score >= 70
            ? "跟读识别正确，可以继续下一句。"
            : "已记录发音，再听一遍并模仿停顿和重音。",
          score >= 70 ? "success" : "info",
        );
      };
      recognition.onerror = () => {
        button.classList.remove("is-speaking");
        if (!completed) {
          showToast("浏览器语音识别不可用，可以使用标准朗读后自评。");
        }
      };
      recognition.onend = () => button.classList.remove("is-speaking");
      try {
        recognition.start();
        showToast("正在听……请朗读当前句子。");
      } catch {
        button.classList.remove("is-speaking");
        showToast("录音暂时无法启动，请检查麦克风权限。");
      }
      return;
    }

    button.classList.toggle("is-speaking");
    if (button.classList.contains("is-speaking")) {
      showToast("正在听……请跟随朗读。");
      window.setTimeout(() => {
        if (document.body.contains(button)) {
          button.classList.remove("is-speaking");
          showToast("跟读完成，请进行自评。", "success");
        }
      }, 1800);
    }
  }

  function renderSpellingTestModal() {
    const words = state.vocabTest.wordIds
      .map((id) => state.words.find((word) => word.id === id))
      .filter(Boolean);
    if (!words.length) {
      showToast("没有可用于拼写测试的单词。");
      return;
    }
    if (state.vocabTest.index >= words.length) {
      state.vocabTest.active = false;
      completeTrainingTask("spelling");
      const score = state.vocabTest.score;
      openModal(
        `
          <div class="modal-header">
            <div><h2>拼写测试完成</h2><p>本轮共测试 ${words.length} 个单词</p></div>
            <button class="icon-button" data-action="close-modal">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <div class="empty-state" style="min-height:270px">
              <div>
                <span class="empty-icon">${icon("edit")}</span>
                <h3>${score} / ${words.length}</h3>
                <p>拼写错误的单词已降低掌握度并安排后续复习。</p>
                <button class="btn primary" data-action="start-spelling-test">${icon(
                  "refresh",
                )}再测一次</button>
              </div>
            </div>
          </div>
        `,
        "small",
      );
      return;
    }
    const word = words[state.vocabTest.index];
    const isChecked = state.vocabTest.spellingCorrect !== null;
    openModal(
      `
        <div class="modal-header">
          <div><h2>拼写测试</h2><p>第 ${state.vocabTest.index + 1} / ${
            words.length
          } 个</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="vocab-test-card spelling-card">
            <div class="eyebrow">${escapeHTML(word.deck)}</div>
            <h2>${escapeHTML(word.meaning)}</h2>
            <p>${escapeHTML(
              word.definition || `请根据释义拼写这个英文单词。`,
            )}</p>
            ${
              isChecked
                ? `
                  <div class="spelling-result ${
                    state.vocabTest.spellingCorrect ? "correct" : "incorrect"
                  }">
                    ${icon(
                      state.vocabTest.spellingCorrect ? "check" : "x",
                    )}
                    <strong>${
                      state.vocabTest.spellingCorrect
                        ? "拼写正确"
                        : `正确答案：${escapeHTML(word.word)}`
                    }</strong>
                  </div>
                `
                : `<input class="input spelling-input" id="spelling-answer" autocomplete="off" autocapitalize="none" placeholder="输入英文单词" />`
            }
          </div>
          <div class="modal-footer" style="padding:16px 0 0;border:0">
            ${
              isChecked
                ? `<button class="btn primary" data-action="spelling-next">继续${icon(
                    "chevronRight",
                  )}</button>`
                : `<button class="btn primary" data-action="check-spelling">${icon(
                    "check",
                  )}检查拼写</button>`
            }
          </div>
        </div>
      `,
      "small",
    );
    if (!isChecked) {
      window.setTimeout(
        () => document.getElementById("spelling-answer")?.focus(),
        20,
      );
    }
  }

  function renderLiteratureImportModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>导入英文文献</h2><p>录入论文元数据和摘要，之后可在文献工作区阅读和分析。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <form data-form="literature-import">
          <div class="modal-body">
            <label class="field">
              <span class="field-label">论文标题</span>
              <input class="input" name="title" required placeholder="Paper title" />
            </label>
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">作者</span>
                <input class="input" name="authors" placeholder="A. Smith, L. Wang" />
              </label>
              <label class="field">
                <span class="field-label">期刊</span>
                <input class="input" name="journal" placeholder="Journal name" />
              </label>
            </div>
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">年份</span>
                <input class="input" name="year" inputmode="numeric" placeholder="2026" />
              </label>
              <label class="field">
                <span class="field-label">关键词</span>
                <input class="input" name="keywords" placeholder="learning, memory, English" />
              </label>
            </div>
            <label class="field">
              <span class="field-label">摘要</span>
              <textarea class="textarea" name="abstract" rows="7" placeholder="Paste the abstract here…"></textarea>
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">取消</button>
            <button class="btn primary">${icon("upload")}导入文献</button>
          </div>
        </form>
      `,
      "wide",
    );
  }

  function renderBookDetailModal(bookId) {
    const book = state.books.find((item) => item.id === bookId);
    if (!book) return;
    openModal(
      `
        <div class="modal-header">
          <div><h2>${escapeHTML(book.title)}</h2><p>${escapeHTML(
            book.author,
          )} · ${escapeHTML(book.publisher)}</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="book-detail-summary">
            <div class="resource-cover compact-cover" data-category="${
              book.category
            }">
              <span>${escapeHTML(book.category.toUpperCase())}</span>
              <strong>${escapeHTML(book.title)}</strong>
            </div>
            <div>
              <div class="note-tags">${book.tags
                .map(
                  (tag) => `<span class="tag">${escapeHTML(tag)}</span>`,
                )
                .join("")}</div>
              <p>${escapeHTML(book.description)}</p>
              <div class="content-card-meta">${book.exam
                .map((exam) => escapeHTML(exam))
                .join(" · ")} · ${book.units} ${
                  book.units > 1 ? "个学习单元" : "部工具书"
                }</div>
            </div>
          </div>
          <div class="progress-row" style="margin-top:20px">
            <span>学习进度<strong>${book.progress}%</strong></span>
            <div class="large-progress"><span style="width:${
              book.progress
            }%"></span></div>
          </div>
          <div class="learning-mode-grid">
            ${[
              ["词汇提取", "type"],
              ["章节学习", "calendar"],
              ["加入笔记", "notebook"],
              ["生成练习", "target"],
            ]
              .map(
                ([label, iconName]) =>
                  `<button class="learning-mode" data-action="book-tool" data-tool="${label}" data-id="${
                    book.id
                  }">${icon(iconName)}<span>${label}</span></button>`,
              )
              .join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" data-action="close-modal">关闭</button>
          <button class="btn primary" data-action="add-book-plan" data-id="${
            book.id
          }">${icon("calendar")}加入学习计划</button>
        </div>
      `,
      "wide",
    );
  }

  function renderResourceAddModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>添加英语资料</h2><p>录入书籍、教材或考试资料的分类信息。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <form data-form="resource-add">
          <div class="modal-body">
            <label class="field">
              <span class="field-label">资料名称</span>
              <input class="input" name="title" required placeholder="书名或资料名称" />
            </label>
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">作者/编者</span>
                <input class="input" name="author" placeholder="作者" />
              </label>
              <label class="field">
                <span class="field-label">分类</span>
                <select class="select" name="category">
                  ${[
                    ["vocabulary", "词汇书"],
                    ["grammar", "语法写作"],
                    ["course", "经典教材"],
                    ["cet4", "四级资料"],
                    ["cet6", "六级资料"],
                    ["ielts", "雅思资料"],
                    ["toefl", "托福资料"],
                    ["classic", "英文原著"],
                    ["nonfiction", "非虚构"],
                    ["reference", "工具书"],
                  ]
                    .map(
                      ([value, label]) =>
                        `<option value="${value}">${label}</option>`,
                    )
                    .join("")}
                </select>
              </label>
            </div>
            <div class="form-grid two">
              <label class="field">
                <span class="field-label">考试方向</span>
                <input class="input" name="exam" placeholder="CET-4 / IELTS / TOEFL" />
              </label>
              <label class="field">
                <span class="field-label">难度</span>
                <input class="input" name="level" placeholder="中级 / 高级" />
              </label>
            </div>
            <label class="field">
              <span class="field-label">说明</span>
              <textarea class="textarea" name="description" rows="3" placeholder="这份资料适合怎样学习？"></textarea>
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn" data-action="close-modal">取消</button>
            <button class="btn primary">${icon("plus")}添加资料</button>
          </div>
        </form>
      `,
      "wide",
    );
  }

  function renderResourcePlanModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>生成英语资料学习计划</h2><p>把词汇、教材、考试和原文阅读组合成一周计划。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="plan-timeline">
            ${[
              ["周一", "CET-4 核心词 30 个", "English Vocabulary in Use · 1 单元"],
              ["周二", "IELTS 学术阅读", "Cambridge IELTS · 1 篇"],
              ["周三", "TOEFL 学术词汇", "TOEFL Academic Vocabulary · 20 词"],
              ["周四", "语法与写作", "English Grammar in Use · 2 单元"],
              ["周五", "英文原著阅读", "Pride and Prejudice · 20 分钟"],
              ["周六", "四级专项训练", "CET-4 真题分类 · 阅读 2 篇"],
              ["周日", "复习与笔记整理", "完成错词、错题和阅读卡片"],
            ]
              .map(
                ([day, title, detail]) => `
                  <div class="plan-day">
                    <span>${day}</span>
                    <div><strong>${title}</strong><small>${detail}</small></div>
                  </div>`,
              )
              .join("")}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" data-action="close-modal">暂不生成</button>
          <button class="btn primary" data-action="accept-resource-plan">${icon(
            "check",
          )}加入学习计划</button>
        </div>
      `,
      "wide",
    );
  }

  function renderDiagnosticsModal() {
    openModal(
      `
        <div class="modal-header">
          <div><h2>网站功能自检</h2><p>检查页面资源、路由、本地数据和主要功能模块。</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="analysis-loading"><span class="spinner"></span><span>正在检查网站功能……</span></div>
          <div id="diagnostic-results" class="diagnostic-list"></div>
        </div>
        <div class="modal-footer">
          <button class="btn" data-action="close-modal">关闭</button>
          <button class="btn primary" data-action="run-diagnostics">${icon(
            "refresh",
          )}重新检查</button>
        </div>
      `,
      "wide",
    );

    window.setTimeout(async () => {
      const root = document.getElementById("diagnostic-results");
      if (!root) return;
      const results = [];
      const assetBase = `${APP_BASE}/assets`;
      const routeChecks = [
        ["首页路由", hrefFor("home")],
        ["笔记中心", hrefFor("notes")],
        ["单词工作区", hrefFor("study/words")],
        ["文献工作区", hrefFor("reading/literature")],
        ["论文详情", hrefFor("reading/literature/paper-carbon")],
        ["样式资源", `${assetBase}/css/styles.css`],
        ["脚本资源", `${assetBase}/js/app.js`],
        ["压缩词库", `${assetBase}/data/vocabulary.json.gz`],
        ["文章文献库", `${assetBase}/data/article-library.json.gz`],
        ["朗读短句库", `${assetBase}/data/speech-library.json.gz`],
        ["商务英语词库", `${assetBase}/data/business-vocabulary.json.gz`],
        ["汽车英语词库", `${assetBase}/data/automotive-vocabulary.json.gz`],
      ];

      if (location.protocol !== "file:") {
        const routeResults = await Promise.all(
          routeChecks.map(async ([label, path]) => {
            try {
              const response = await fetch(path, {
                method: "GET",
                cache: "no-store",
              });
              const isSpaFallback =
                response.status === 404 &&
                !path.includes("/assets/") &&
                /English Buddy/i.test(await response.text());
              return {
                label,
                ok: response.ok || isSpaFallback,
                detail: response.ok
                  ? "HTTP 200"
                  : isSpaFallback
                    ? "SPA 404 回退正常"
                    : `HTTP ${response.status}`,
              };
            } catch {
              return { label, ok: false, detail: "无法访问" };
            }
          }),
        );
        results.push(...routeResults);
      } else {
        results.push({
          label: "静态文件模式",
          ok: true,
          detail: "本地路由检查需要启动服务器",
        });
      }

      try {
        const probeKey = "__english_buddy_health__";
        localStorage.setItem(probeKey, "ok");
        const storageOk = localStorage.getItem(probeKey) === "ok";
        localStorage.removeItem(probeKey);
        results.push({
          label: "本地保存",
          ok: storageOk,
          detail: storageOk ? "读写正常" : "读写失败",
        });
      } catch {
        results.push({
          label: "本地保存",
          ok: false,
          detail: "浏览器禁止本地存储",
        });
      }

      results.push(
        {
          label: "笔记数据",
          ok: Array.isArray(state.notes),
          detail: `${state.notes.length} 条笔记`,
        },
        {
          label: "单词数据",
          ok: Array.isArray(state.words) && state.words.length >= 64000,
          detail: `${state.words.length} 个单词`,
        },
        {
          label: "文献数据",
          ok: Array.isArray(state.papers) && state.papers.length > 0,
          detail: `${state.papers.length} 篇文献`,
        },
        {
          label: "书籍资料",
          ok: Array.isArray(state.books) && state.books.length > 0,
          detail: `${state.books.length} 本资料`,
        },
        {
          label: "页面布局",
          ok:
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
          detail:
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1
              ? "无横向溢出"
              : "检测到横向溢出",
        },
      );

      const failed = results.filter((item) => !item.ok).length;
      root.innerHTML = `
        <div class="diagnostic-summary ${
          failed ? "has-error" : "is-healthy"
        }">
          ${icon(failed ? "refresh" : "check")}
          <div><strong>${
            failed
              ? `发现 ${failed} 项异常`
              : "网站功能检查全部通过"
          }</strong><span>${results.length} 项检查已完成</span></div>
        </div>
        ${results
          .map(
            (item) => `
              <div class="diagnostic-item">
                <span class="diagnostic-status ${
                  item.ok ? "ok" : "error"
                }">${icon(item.ok ? "check" : "x")}</span>
                <div><strong>${escapeHTML(item.label)}</strong><span>${escapeHTML(
                  item.detail,
                )}</span></div>
              </div>`,
          )
          .join("")}
      `;
      document.querySelector(".analysis-loading")?.remove();
    }, 420);
  }

  function renderScheduleModal(noteId) {
    const note = getRouteNote(noteId);
    if (!note) return;
    openModal(`
      <div class="modal-header">
        <div><h2>安排复习</h2><p>${escapeHTML(
          note.title,
        )}</p></div>
        <button class="icon-button" data-action="close-modal">${icon("x")}</button>
      </div>
      <div class="modal-body">
        <div class="cards-grid" style="grid-template-columns:repeat(2,1fr)">
          ${[
            ["今晚", 0],
            ["明天", 1],
            ["3 天后", 3],
            ["7 天后", 7],
          ]
            .map(
              ([label, days]) =>
                `<button class="btn" data-action="set-review-date" data-id="${note.id}" data-days="${days}">${icon(
                  "calendar",
                )}${label}</button>`,
            )
            .join("")}
        </div>
        <label class="field" style="margin-top:16px">
          <span class="field-label">自定义时间</span>
          <input class="input" type="datetime-local" id="custom-review-date" />
        </label>
        <button class="btn primary" style="width:100%;margin-top:12px" data-action="custom-review-date" data-id="${
          note.id
        }">${icon("check")}保存复习时间</button>
      </div>
    `, "small");
  }

  function openReview(noteId) {
    const note = getRouteNote(noteId) || state.notes[0];
    if (!note) {
      showToast("还没有可以复习的笔记。");
      return;
    }
    state.review.noteId = note.id;
    state.review.index = 0;
    state.review.flipped = false;
    state.review.known = 0;
    state.review.unknown = 0;
    renderReviewModal();
  }

  function renderReviewModal() {
    const note = getRouteNote(state.review.noteId);
    if (!note) return;
    const cards =
      note.reviewCards?.length > 0
        ? note.reviewCards
        : [
            {
              front: `What is the key idea of “${note.title}”?`,
              back: note.summary || stripHTML(note.body).slice(0, 120),
            },
          ];
    const index = Math.min(state.review.index, cards.length - 1);
    const card = cards[index];
    openModal(`
      <div class="modal-header">
        <div><h2>复习卡片</h2><p>${escapeHTML(
          note.title,
        )}</p></div>
        <button class="icon-button" data-action="close-modal">${icon("x")}</button>
      </div>
      <div class="modal-body">
        <div class="flashcard ${
          state.review.flipped ? "flipped" : ""
        }" data-action="flip-card">
          <div class="flashcard-inner">
            <div class="flashcard-face">
              <span class="flashcard-label">Question</span>
              <h3>${escapeHTML(card.front)}</h3>
              <span class="flashcard-hint">点击卡片查看答案</span>
            </div>
            <div class="flashcard-face back">
              <span class="flashcard-label">Answer</span>
              <h3>${escapeHTML(card.back)}</h3>
              <span class="flashcard-hint">你想起来了吗？</span>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <button class="btn small" data-action="review-prev">${icon(
            "chevronLeft",
          )}上一张</button>
          <span class="counter">${index + 1} / ${cards.length}</span>
          <button class="btn small" data-action="review-next">下一张${icon(
            "chevronRight",
          )}</button>
        </div>
        <div class="flashcard-controls">
          <button class="btn danger" data-action="review-unknown">${icon(
            "x",
          )}我不认识</button>
          <button class="btn soft" data-action="flip-card">${icon(
            "eye",
          )}查看答案</button>
          <button class="btn primary" data-action="review-known">${icon(
            "check",
          )}我认识</button>
        </div>
      </div>
    `, "small");
  }

  function completeReview(knew) {
    const note = getRouteNote(state.review.noteId);
    if (!note) return;
    const cards = note.reviewCards || [];
    if (knew) state.review.known += 1;
    else state.review.unknown += 1;
    if (!knew) {
      note.reviewAt = new Date(Date.now() + 86400000).toISOString();
      note.important = true;
    }
    const nextIndex = state.review.index + 1;
    if (nextIndex >= Math.max(cards.length, 1)) {
      const due = state.notes.filter(
        (item) =>
          item.reviewAt && new Date(item.reviewAt).getTime() <= Date.now(),
      );
      if (due.length > 1 && due[0]?.id === note.id) {
        state.review.noteId = due[1].id;
        state.review.index = 0;
        state.review.flipped = false;
        saveState();
        renderReviewModal();
        return;
      }
      note.reviewAt = null;
      saveState();
      closeModal();
      showToast(
        `本轮复习完成：认识 ${state.review.known} 张，待加强 ${state.review.unknown} 张。`,
        "success",
      );
      if (getRoute() === "notes/review") renderApp();
      return;
    }
    state.review.index = nextIndex;
    state.review.flipped = false;
    saveState();
    renderReviewModal();
  }

  function normalizeTranslationKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[。！？!?.,，、；;：:]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function localTranslation(value, direction) {
    const key = normalizeTranslationKey(value);
    if (!key) return "";
    if (TRANSLATION_DICTIONARY[key]) return TRANSLATION_DICTIONARY[key];
    const reverseKey = normalizeTranslationKey(
      Object.values(TRANSLATION_DICTIONARY).find(
        (translation) =>
          normalizeTranslationKey(translation) === key,
      ) || "",
    );
    if (reverseKey && TRANSLATION_DICTIONARY[reverseKey]) {
      return TRANSLATION_DICTIONARY[reverseKey];
    }
    if (direction === "zh-en") {
      return Object.entries(TRANSLATION_DICTIONARY).find(([, english]) =>
        key.includes(normalizeTranslationKey(english)),
      )?.[0] || "";
    }
    return Object.entries(TRANSLATION_DICTIONARY).find(([chinese]) =>
      key.includes(normalizeTranslationKey(chinese)),
    )?.[1] || "";
  }

  function decodeTranslationEntities(value) {
    const parser = new DOMParser();
    return parser.parseFromString(
      `<textarea>${String(value || "")}</textarea>`,
      "text/html",
    ).querySelector("textarea").value;
  }

  async function performTranslation(value, direction) {
    const text = String(value || "").trim();
    if (!text) {
      throw new Error("请输入需要翻译的内容。");
    }
    const local = localTranslation(text, direction);
    if (local) return local;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 9000);
    try {
      const pair = direction === "zh-en" ? "zh-CN|en-US" : "en-US|zh-CN";
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text,
        )}&langpair=${encodeURIComponent(pair)}`,
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error(`翻译服务返回 ${response.status}`);
      const payload = await response.json();
      const translated = payload?.responseData?.translatedText;
      if (!translated) throw new Error("没有获得翻译结果");
      return decodeTranslationEntities(translated);
    } catch (error) {
      throw new Error(
        error?.name === "AbortError"
          ? "翻译服务响应超时，请稍后重试。"
          : "暂时无法连接在线翻译，请检查网络后重试。",
      );
    } finally {
      window.clearTimeout(timer);
    }
  }

  function getReadingPassage(id) {
    return (
      READING_PASSAGES.find((passage) => passage.id === id) ||
      READING_PASSAGES[0]
    );
  }

  async function copyTextToClipboard(value) {
    const text = String(value || "");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    showToast("译文已复制。", "success");
  }

  function downloadTextFile(filename, content, type = "text/plain") {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function noteToMarkdown(note) {
    const body = String(note.body || "")
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
      .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
      .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return `# ${note.title}\n\n分类：${categoryName(
      note.category,
    )}\n\n标签：${(note.tags || []).join("、") || "无"}\n\n${body}\n`;
  }

  function renderAutomotiveTermModal(wordId) {
    const word = state.words.find((item) => item.id === wordId);
    if (!word) return;
    openModal(
      `
        <div class="modal-header">
          <div><h2>${escapeHTML(word.word)}</h2><p>${escapeHTML(
            word.businessCategory ||
              word.automotiveCategory ||
              "专业英语术语",
          )}</p></div>
          <button class="icon-button" data-action="close-modal">${icon("x")}</button>
        </div>
        <div class="modal-body">
          <div class="automotive-term-detail">
            <span class="field-label">中文术语</span>
            <h3>${escapeHTML(word.meaning)}</h3>
            <p>${escapeHTML(word.definition || "专业英语术语")}</p>
          </div>
          <div class="editor-actions" style="margin-top:18px">
            <button class="btn small" data-action="speak-text" data-text="${escapeHTML(
              word.word,
            )}">${icon("volume")}朗读术语</button>
            <button class="btn small soft" data-action="add-word-note" data-id="${
              word.id
            }">${icon("notebook")}加入笔记</button>
            <button class="btn small" data-action="mark-word-known" data-id="${
              word.id
            }">${icon("check")}已掌握</button>
            <button class="btn small" data-action="mark-word-review" data-id="${
              word.id
            }">${icon("refresh")}安排复习</button>
          </div>
        </div>
      `,
      "small",
    );
  }

  function handleAction(element, event) {
    const action = element.dataset.action;
    const id = element.dataset.id;
    const route = element.dataset.route;

    if (action === "close-modal") {
      closeModal();
      return;
    }
    if (action === "open-search") {
      renderSearchModal();
      return;
    }
    if (action === "fill-search") {
      const input = document.getElementById("global-search-input");
      if (input) {
        input.value = element.dataset.term;
        document.getElementById("search-results").innerHTML =
          renderSearchResults(element.dataset.term);
        input.focus();
      }
      return;
    }
    if (action === "search-route") {
      closeModal();
      navigate(route);
      return;
    }
    if (action === "toggle-nav") {
      const key = element.dataset.menu;
      state.menuOpen[key] = !state.menuOpen[key];
      saveState();
      renderApp();
      return;
    }
    if (action === "toggle-mobile-more") {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      renderApp();
      return;
    }
    if (action === "new-note") {
      newNote();
      return;
    }
    if (action === "random-note-review") {
      const notes = state.notes.filter((note) => !note.archived);
      if (!notes.length) {
        showToast("还没有可以回忆的笔记。");
        return;
      }
      const note = notes[Math.floor(Math.random() * notes.length)];
      navigate(`notes/${note.id}`);
      showToast(`今日回忆：${note.title}`);
      return;
    }
    if (action === "export-all-notes") {
      downloadTextFile(
        `english-buddy-notes-${todayKey()}.json`,
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            categories: state.categories,
            notes: state.notes,
          },
          null,
          2,
        ),
        "application/json",
      );
      showToast("全部笔记已导出。", "success");
      return;
    }
    if (action === "duplicate-note") {
      const source = getRouteNote(id);
      if (!source) return;
      const copy = createNote({
        ...source,
        id: uid("note"),
        title: `${source.title}（副本）`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      navigate(`notes/${copy.id}`);
      showToast("笔记已复制。", "success");
      return;
    }
    if (action === "export-note-markdown") {
      const note = getRouteNote(id);
      if (!note) return;
      downloadTextFile(
        `${note.title.replace(/[\\/:*?"<>|]/g, "-")}.md`,
        noteToMarkdown(note),
        "text/markdown",
      );
      showToast("Markdown 已导出。", "success");
      return;
    }
    if (action === "scroll-note-heading") {
      const headings = document.querySelectorAll(
        "#editor-content h1, #editor-content h2, #editor-content h3",
      );
      headings[Number(element.dataset.index || 0)]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (action === "open-note") {
      navigate(`notes/${id}`);
      return;
    }
    if (action === "set-category") {
      state.activeCategory = element.dataset.category;
      state.activeTag = null;
      renderApp();
      return;
    }
    if (action === "filter-tag") {
      event.stopPropagation();
      state.activeTag = element.dataset.tag;
      state.activeCategory = "all";
      renderApp();
      showToast(`正在查看标签“${element.dataset.tag}”。`);
      return;
    }
    if (action === "clear-tag-filter") {
      state.activeTag = null;
      renderApp();
      return;
    }
    if (action === "set-word-deck") {
      state.activeWordDeck = element.dataset.deck;
      state.wordQuery = "";
      state.wordPage = 0;
      const first = state.words.find(
        (word) =>
          state.activeWordDeck === "全部词库" ||
          word.deck === state.activeWordDeck,
      );
      if (first) state.activeWordId = first.id;
      renderApp();
      return;
    }
    if (action === "set-word-status") {
      state.wordStatusFilter = element.dataset.status;
      state.wordPage = 0;
      renderApp();
      return;
    }
    if (action === "filter-automotive") {
      state.automotiveCategory = element.dataset.filter;
      state.automotivePage = 0;
      renderApp();
      return;
    }
    if (
      action === "automotive-page-prev" ||
      action === "automotive-page-next"
    ) {
      state.automotivePage = Math.max(
        0,
        state.automotivePage + (action === "automotive-page-next" ? 1 : -1),
      );
      renderApp();
      return;
    }
    if (action === "open-automotive-term") {
      renderAutomotiveTermModal(id);
      return;
    }
    if (action === "start-automotive-training") {
      const words = state.words
        .filter((word) => word.deck === "汽车专业")
        .sort(
          (a, b) =>
            a.mastery - b.mastery ||
            String(a.automotiveCategory || "").localeCompare(
              String(b.automotiveCategory || ""),
            ),
        )
        .slice(0, 20);
      state.training.session = {
        mode: "word-cards",
        index: 0,
        score: 0,
        items: words.map((word) => word.id),
        revealed: false,
        feedback: "",
      };
      renderTrainingSessionModal();
      return;
    }
    if (action === "word-page-prev" || action === "word-page-next") {
      state.wordPage = Math.max(
        0,
        state.wordPage + (action === "word-page-next" ? 1 : -1),
      );
      renderApp();
      document
        .querySelector(".vocabulary-list-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "select-word") {
      state.activeWordId = id;
      renderApp();
      return;
    }
    if (action === "mark-word-known" || action === "mark-word-review") {
      const word = state.words.find((item) => item.id === id);
      if (word) {
        word.mastery =
          action === "mark-word-known"
            ? Math.min(100, word.mastery + 12)
            : Math.max(0, word.mastery - 12);
        word.reviewAt =
          action === "mark-word-review"
            ? new Date(Date.now() + 86400000).toISOString()
            : null;
        if (
          action === "mark-word-known" &&
          state.dailyWordIds.includes(word.id) &&
          !state.dailyCompletedIds.includes(word.id)
        ) {
          state.dailyCompletedIds.push(word.id);
        }
        saveState();
        renderApp();
        showToast(
          action === "mark-word-known"
            ? "掌握度已提高。"
            : "已加入明天复习。",
          "success",
        );
      }
      return;
    }
    if (action === "add-word-note") {
      const word = state.words.find((item) => item.id === id);
      if (!word) return;
      const note = createNote({
        title: `单词：${word.word}`,
        summary: `${word.phonetic} · ${word.meaning}`,
        body: `<h2>${escapeHTML(word.word)}</h2><p><strong>${escapeHTML(
          word.phonetic,
        )}</strong> · ${escapeHTML(word.part)}</p><h3>释义</h3><p>${escapeHTML(
          word.meaning,
        )}</p><h3>例句与释义</h3><p class="english-text">${escapeHTML(
          word.example || word.definition || `Learn ${word.word} in context.`,
        )}</p>${
          word.translation
            ? `<p>${escapeHTML(word.translation)}</p>`
            : ""
        }<p>来源：${escapeHTML(
          word.source,
        )}</p>`,
        category: "vocabulary",
        tags: ["词汇", ...(word.tags || [])],
        important: true,
      });
      word.noteId = note.id;
      saveState();
      renderApp();
      showToast("单词已加入英语笔记。", "success");
      return;
    }
    if (action === "open-word-import") {
      renderWordImportModal();
      return;
    }
    if (action === "start-training-mode") {
      startTrainingMode(element.dataset.mode);
      return;
    }
    if (action === "training-speak") {
      const session = state.training.session;
      const item = session.items[session.index];
      const word = trainingWord(item);
      const text =
        session.mode === "shadowing"
          ? item
          : word?.word || item;
      speakText(text, null, element);
      return;
    }
    if (action === "training-flip") {
      state.training.session.revealed =
        !state.training.session.revealed;
      renderTrainingSessionModal();
      return;
    }
    if (action === "training-answer") {
      const session = state.training.session;
      const item = session.items[session.index];
      const word = trainingWord(item);
      const answer = element.dataset.answer || "";
      let correct = false;
      if (session.mode === "listening-choice")
        correct = answer === word?.meaning;
      else if (session.mode === "cloze")
        correct = answer === item;
      if (correct) session.score += 1;
      session.feedback = correct ? "correct" : "incorrect";
      applyWordTrainingResult(word, correct);
      renderTrainingSessionModal();
      return;
    }
    if (action === "training-known") {
      const session = state.training.session;
      const word = trainingWord(session.items[session.index]);
      const known = element.dataset.known === "true";
      session.revealed = true;
      if (known) session.score += 1;
      session.feedback = known ? "correct" : "incorrect";
      applyWordTrainingResult(word, known);
      renderTrainingSessionModal();
      return;
    }
    if (action === "training-rating") {
      const session = state.training.session;
      if (session.mode === "shadowing") {
        const rating = element.dataset.rating;
        if (rating === "good") session.score += 1;
        session.feedback =
          rating === "good" ? "correct" : "incorrect";
        if (rating === "good") {
          completeTrainingTask("shadowing");
        }
        renderTrainingSessionModal();
        return;
      }
      const word = trainingWord(session.items[session.index]);
      const rating = element.dataset.rating || "good";
      const correct = rating !== "again";
      if (correct) session.score += 1;
      session.feedback = correct ? "correct" : "incorrect";
      session.revealed = true;
      applyWordTrainingResult(word, correct, rating);
      renderTrainingSessionModal();
      return;
    }
    if (action === "training-next") {
      advanceTraining();
      return;
    }
    if (action === "toggle-shadowing") {
      const session = state.training.session;
      startShadowingAttempt(session.items[session.index], element);
      return;
    }
    if (action === "training-return") {
      closeModal();
      navigate("study/training");
      return;
    }
    if (action === "start-daily-words") {
      const dailyWords = [...state.words]
        .filter((word) => word.mastery === 0)
        .sort(
          (a, b) =>
            (a.frequencyRank || 10_000_000) -
            (b.frequencyRank || 10_000_000),
        )
        .slice(0, 50);
      state.dailyWordIds = dailyWords.map((word) => word.id);
      state.dailyCompletedIds = [];
      state.activeWordDeck = "全部词库";
      state.wordStatusFilter = "new";
      state.wordPage = 0;
      if (dailyWords[0]) state.activeWordId = dailyWords[0].id;
      saveState();
      openModal(
        `
          <div class="modal-header">
            <div><h2>今日 50 词</h2><p>按词频和考试价值排序，优先完成高频新词。</p></div>
            <button class="icon-button" data-action="close-modal">${icon("x")}</button>
          </div>
          <div class="modal-body">
            <div class="daily-preview-list">
              ${dailyWords
                .slice(0, 12)
                .map(
                  (word, index) => `
                    <div class="daily-preview-item">
                      <span>${index + 1}</span>
                      <div><strong>${escapeHTML(
                        word.word,
                      )}</strong><small>${escapeHTML(
                        word.meaning,
                      )}</small></div>
                    </div>`,
                )
                .join("")}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" data-action="close-modal">稍后</button>
            <button class="btn primary" data-action="begin-daily-words">${icon(
              "play",
            )}开始今日任务</button>
          </div>
        `,
        "wide",
      );
      return;
    }
    if (action === "begin-daily-words") {
      closeModal();
      renderApp();
      document
        .querySelector(".vocabulary-study-bar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("今日 50 词任务已经开始。", "success");
      return;
    }
    if (action === "start-random-word") {
      const candidates =
        state.activeWordDeck === "全部词库"
          ? state.words
          : state.words.filter(
              (word) => word.deck === state.activeWordDeck,
            );
      const word =
        candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))];
      if (word) {
        state.activeWordId = word.id;
        state.wordQuery = "";
        state.wordPage = 0;
        renderApp();
        showToast(`随机学习：${word.word}`);
      }
      return;
    }
    if (action === "start-vocab-test" || action === "restart-vocab-test") {
      const ids = [...state.words]
        .sort(
          (a, b) =>
            a.mastery - b.mastery ||
            (a.frequencyRank || 10_000_000) -
              (b.frequencyRank || 10_000_000),
        )
        .slice(0, 20)
        .map((word) => word.id);
      state.vocabTest = {
        active: true,
        index: 0,
        score: 0,
        mode: "meaning",
        wordIds: ids,
        spellingCorrect: null,
      };
      renderVocabTestModal();
      return;
    }
    if (action === "start-spelling-test") {
      const ids = [...state.words]
        .filter((word) => word.mastery < 80)
        .sort(
          (a, b) =>
            (a.frequencyRank || 10_000_000) -
              (b.frequencyRank || 10_000_000) ||
            a.mastery - b.mastery,
        )
        .slice(0, 20)
        .map((word) => word.id);
      state.vocabTest = {
        active: true,
        index: 0,
        score: 0,
        mode: "spelling",
        wordIds: ids,
        spellingCorrect: null,
      };
      renderSpellingTestModal();
      return;
    }
    if (action === "check-spelling") {
      const id = state.vocabTest.wordIds[state.vocabTest.index];
      const word = state.words.find((item) => item.id === id);
      const answer =
        document.getElementById("spelling-answer")?.value.trim() || "";
      if (!word || !answer) {
        showToast("请先输入拼写答案。");
        return;
      }
      const correct =
        answer.toLowerCase().replace(/\s+/g, "") ===
        word.word.toLowerCase().replace(/\s+/g, "");
      state.vocabTest.spellingCorrect = correct;
      if (correct) {
        state.vocabTest.score += 1;
        word.mastery = Math.min(100, word.mastery + 15);
      } else {
        word.mastery = Math.max(0, word.mastery - 8);
        word.reviewAt = new Date(Date.now() + 86400000).toISOString();
      }
      saveState();
      renderSpellingTestModal();
      return;
    }
    if (action === "spelling-next") {
      state.vocabTest.index += 1;
      state.vocabTest.spellingCorrect = null;
      renderSpellingTestModal();
      return;
    }
    if (action === "vocab-test-reveal") {
      document
        .querySelector(".vocab-test-answer")
        ?.classList.remove("hidden");
      return;
    }
    if (action === "schedule-word-review") {
      const word = state.words.find((item) => item.id === id);
      if (word) {
        word.reviewAt = new Date(Date.now() + 86400000).toISOString();
        if (!state.dailyWordIds.includes(word.id))
          state.dailyWordIds.push(word.id);
        saveState();
        showToast("已加入今日学习任务。", "success");
      }
      return;
    }
    if (
      action === "vocab-test-known" ||
      action === "vocab-test-review"
    ) {
      const word = state.words.find((item) => item.id === id);
      if (word) {
        if (action === "vocab-test-known") {
          word.mastery = Math.min(100, word.mastery + 15);
          state.vocabTest.score += 1;
        } else {
          word.mastery = Math.max(0, word.mastery - 15);
          word.reviewAt = new Date(Date.now() + 86400000).toISOString();
        }
      }
      state.vocabTest.index += 1;
      saveState();
      renderVocabTestModal();
      return;
    }
    if (action === "show-category-create") {
      const form = document.querySelector(".category-create");
      form?.classList.toggle("open");
      form?.querySelector("input")?.focus();
      return;
    }
    if (action === "manage-category") {
      event.stopPropagation();
      renderCategoryModal(element.dataset.category);
      return;
    }
    if (action === "delete-category") {
      const categoryId = element.dataset.category;
      if (state.notes.some((note) => note.category === categoryId)) {
        state.notes.forEach((note) => {
          if (note.category === categoryId) note.category = "other";
        });
      }
      state.categories = state.categories.filter(
        (category) => category.id !== categoryId,
      );
      if (state.activeCategory === categoryId) state.activeCategory = "all";
      saveState();
      closeModal();
      renderApp();
      showToast("分类已删除，原有笔记已移至“其他”。", "success");
      return;
    }
    if (action === "show-all-notes") {
      state.activeCategory = "all";
      state.noteQuery = "";
      renderApp();
      return;
    }
    if (action === "toggle-favorite") {
      event.stopPropagation();
      const note = getRouteNote(id);
      if (note) {
        note.favorite = !note.favorite;
        touchNote(note);
        renderApp();
      }
      return;
    }
    if (action === "toggle-pin") {
      const note = getRouteNote(id);
      if (note) {
        note.pinned = !note.pinned;
        touchNote(note);
        renderApp();
      }
      return;
    }
    if (action === "open-quick-record") {
      renderQuickRecordModal();
      return;
    }
    if (action === "open-ai-organize") {
      renderAiOrganizeModal();
      return;
    }
    if (action === "fill-organize-sample") {
      const textarea = document.querySelector(
        '[data-form="ai-organize"] textarea',
      );
      if (textarea) {
        textarea.value =
          "universe 宇宙\nvery large 非常大\nThe universe is very large.";
        textarea.focus();
      }
      return;
    }
    if (action === "retry-organize") {
      const source =
        document.getElementById("organize-result")?._organizeSource || "";
      showOrganizeResult(source);
      return;
    }
    if (action === "generate-review") {
      openReview(id || state.notes[0]?.id);
      return;
    }
    if (action === "start-review") {
      const due = [...state.notes].sort((a, b) => {
        const aTime = a.reviewAt ? new Date(a.reviewAt).getTime() : Infinity;
        const bTime = b.reviewAt ? new Date(b.reviewAt).getTime() : Infinity;
        return aTime - bTime;
      });
      openReview(due[0]?.id);
      return;
    }
    if (action === "flip-card") {
      state.review.flipped = !state.review.flipped;
      document.querySelector(".flashcard")?.classList.toggle("flipped");
      return;
    }
    if (action === "review-next" || action === "review-prev") {
      const note = getRouteNote(state.review.noteId);
      const count = Math.max(note?.reviewCards?.length || 1, 1);
      state.review.index =
        action === "review-next"
          ? (state.review.index + 1) % count
          : (state.review.index - 1 + count) % count;
      state.review.flipped = false;
      renderReviewModal();
      return;
    }
    if (action === "review-known") {
      completeReview(true);
      return;
    }
    if (action === "review-unknown") {
      completeReview(false);
      return;
    }
    if (action === "editor-command") {
      const content = document.getElementById("editor-content");
      content?.focus();
      const rawCommand = element.dataset.command;
      if (rawCommand.startsWith("formatBlock:")) {
        document.execCommand(
          "formatBlock",
          false,
          rawCommand.split(":")[1],
        );
      } else if (rawCommand === "hiliteColor") {
        document.execCommand("hiliteColor", false, "#fff1a8");
      } else if (rawCommand === "h2") {
        document.execCommand("formatBlock", false, "<h2>");
      } else {
        document.execCommand(rawCommand, false);
      }
      updateEditorNote();
      return;
    }
    if (action === "open-note-templates") {
      renderNoteTemplatesModal();
      return;
    }
    if (action === "insert-note-template") {
      insertNoteTemplate(element.dataset.template);
      return;
    }
    if (action === "ai-note-summary") {
      renderNoteSummaryModal();
      return;
    }
    if (action === "insert-note-summary") {
      closeModal();
      const editor = document.getElementById("editor-content");
      if (editor) {
        editor.focus();
        document.execCommand(
          "insertHTML",
          false,
          `<h3>AI 总结</h3><p>${escapeHTML(
            element.dataset.summary || "",
          )}</p>`,
        );
        updateEditorNote();
      }
      return;
    }
    if (action === "insert-english-block") {
      const selectedText = window.getSelection()?.toString().trim() || "";
      document.getElementById("editor-content")?.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<div class="english-block"><div class="english-block-header">${icon(
          "languages",
        )}English Study Block</div><div class="english-block-row"><label>English</label><div class="block-text english-text" contenteditable="true">${escapeHTML(
          selectedText || "I want to improve my English.",
        )}</div></div><div class="english-block-row"><label>中文</label><div class="block-text" contenteditable="true">我想提高我的英语。</div></div><div class="english-block-row"><label>Notes</label><div class="block-text" contenteditable="true">improve = 提高</div></div></div><p><br></p>`,
      );
      updateEditorNote();
      return;
    }
    if (action === "insert-table") {
      document.getElementById("editor-content")?.focus();
      document.execCommand(
        "insertHTML",
        false,
        '<table><tbody><tr><th>English</th><th>中文</th></tr><tr><td>Example</td><td>例句</td></tr><tr><td>Meaning</td><td>释义</td></tr></tbody></table><p><br></p>',
      );
      updateEditorNote();
      return;
    }
    if (action === "insert-image") {
      document.getElementById("editor-image-input")?.click();
      return;
    }
    if (action === "remove-tag") {
      const note = getRouteNote(getRoute().split("/")[1]);
      if (note) {
        note.tags = note.tags.filter((tag) => tag !== element.dataset.tag);
        touchNote(note);
        renderApp();
      }
      return;
    }
    if (action === "ai-learn") {
      runAiLearn();
      return;
    }
    if (action === "schedule-review") {
      renderScheduleModal(id);
      return;
    }
    if (action === "set-review-date") {
      const note = getRouteNote(id);
      if (note) {
        const days = Number(element.dataset.days);
        const target = new Date();
        if (days === 0) target.setHours(20, 0, 0, 0);
        else target.setDate(target.getDate() + days);
        note.reviewAt = target.toISOString();
        touchNote(note);
        saveState();
        closeModal();
        showToast(`已安排 ${formatRelative(note.reviewAt)} 复习。`, "success");
      }
      return;
    }
    if (action === "custom-review-date") {
      const value = document.getElementById("custom-review-date")?.value;
      const note = getRouteNote(id);
      if (!value || !note) {
        showToast("请选择复习日期。");
        return;
      }
      note.reviewAt = new Date(value).toISOString();
      touchNote(note);
      saveState();
      closeModal();
      showToast("复习时间已保存。", "success");
      return;
    }
    if (action === "archive-note") {
      const note = getRouteNote(id);
      if (note) {
        note.archived = true;
        note.pinned = false;
        touchNote(note);
        closeModal();
        navigate("notes");
        showToast("笔记已归档。", "success");
      }
      return;
    }
    if (action === "restore-note") {
      const note = getRouteNote(id);
      if (note) {
        note.archived = false;
        touchNote(note);
        saveState();
        renderApp();
        showToast("笔记已恢复到全部笔记。", "success");
      }
      return;
    }
    if (action === "delete-note") {
      const note = getRouteNote(id);
      if (!note) return;
      openModal(
        `
          <div class="modal-header"><div><h2>删除这篇笔记？</h2><p>删除后无法恢复。</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body"><p style="margin:0;color:var(--ink-muted)">“${escapeHTML(
            note.title,
          )}”中的单词、例句和复习卡片也会一起删除。</p></div>
          <div class="modal-footer"><button class="btn" data-action="close-modal">取消</button><button class="btn danger" data-action="confirm-delete-note" data-id="${
            note.id
          }">${icon("trash")}确认删除</button></div>
        `,
        "small",
      );
      return;
    }
    if (action === "confirm-delete-note") {
      state.notes = state.notes.filter((note) => note.id !== id);
      saveState();
      closeModal();
      navigate("notes");
      showToast("笔记已删除。");
      return;
    }
    if (action === "selection-tool") {
      handleSelectionTool(
        element.dataset.tool,
        element.dataset.text || "",
      );
      return;
    }
    if (action === "word-popover") {
      renderWordPopover(element.dataset.word);
      return;
    }
    if (action === "word-add-note") {
      const word = element.dataset.word || "学习单词";
      const note = createNote({
        title: `阅读单词：${word}`,
        summary: `${word} · ${element.dataset.meaning || ""}`,
        body: `<h3>单词</h3><p><strong>${escapeHTML(
          word,
        )}</strong> = ${escapeHTML(
          element.dataset.meaning || "",
        )}</p><h3>例句</h3><p class="english-text">${escapeHTML(
          element.dataset.sentence || "",
        )}</p>`,
        category: "reading",
        tags: ["阅读", "生词", "文章联动"],
        important: true,
      });
      closeModal();
      showToast("阅读单词已加入笔记。", "success");
      if (getRoute() === "notes") renderApp();
      return note;
    }
    if (action === "open-oxford") {
      openOxfordDictionary(element.dataset.word);
      return;
    }
    if (action === "open-speech-settings") {
      renderSpeechSettingsModal();
      return;
    }
    if (action === "set-speech-accent") {
      state.speech.accent = element.dataset.accent;
      state.speech.voiceURI = "";
      saveState();
      renderSpeechSettingsModal();
      return;
    }
    if (action === "set-speech-rate") {
      state.speech.rate = Number(element.dataset.rate || 0.92);
      saveState();
      renderSpeechSettingsModal();
      return;
    }
    if (action === "set-speech-quality") {
      state.speech.quality = element.dataset.quality || "natural";
      saveState();
      renderSpeechSettingsModal();
      return;
    }
    if (action === "test-speech") {
      speakText(
        "The universe is very large and still expanding.",
        null,
        element,
      );
      return;
    }
    if (action === "speak-text") {
      speakText(
        element.dataset.text,
        element.dataset.rate ? Number(element.dataset.rate) : null,
        element,
      );
      return;
    }
    if (action === "add-demo-note") {
      addDemoNote(element.dataset.kind || "other");
      return;
    }
    if (action === "toggle-ai") {
      state.aiOpen = !state.aiOpen;
      if (!state.aiOpen) state.aiMessages = [];
      renderApp();
      return;
    }
    if (action === "close-ai") {
      state.aiOpen = false;
      state.aiMessages = [];
      renderApp();
      return;
    }
    if (action === "ai-suggestion") {
      sendAiMessage(element.dataset.text || "");
      return;
    }
    if (action === "notifications") {
      showToast("今晚 20:00 有 8 条英语笔记待复习。");
      return;
    }
    if (action === "continue-learning") {
      navigate("study/words");
      return;
    }
    if (action === "shadow-daily-text") {
      startShadowingAttempt(element.dataset.text || "", element);
      return;
    }
    if (action === "save-daily-content") {
      const item = DAILY_ENGLISH_CONTENT.find(
        (entry) =>
          normalizeTranslationKey(entry.english) ===
          normalizeTranslationKey(
            element.closest(".daily-english-card")?.querySelector("h2")
              ?.textContent || "",
          ),
      );
      if (!item) return;
      createNote({
        title: `每日英语：${item.type}`,
        summary: item.chinese,
        body: `<p class="english-text">${escapeHTML(
          item.english,
        )}</p><p>${escapeHTML(item.chinese)}</p><h3>重点</h3><p>${escapeHTML(
          item.note,
        )}</p>`,
        category: "speaking",
        tags: ["每日英语", item.type],
      });
      showToast("今日英语已加入笔记。", "success");
      return;
    }
    if (
      ["next-word", "previous-word", "next-step", "previous-step"].includes(
        action,
      )
    ) {
      showToast("进度已保存，下一项内容已准备好。", "success");
      return;
    }
    if (action === "review-word") {
      showToast("已加入明天复习。", "success");
      return;
    }
    if (action === "toggle-listening") {
      const button = element;
      button.classList.toggle("is-listening");
      if (button.classList.contains("is-listening")) {
        showToast("正在听……说完后会自动分析。");
        window.setTimeout(() => {
          button.classList.remove("is-listening");
          showToast("正在分析你的表达……");
        }, 2200);
      }
      return;
    }
    if (action === "toggle-translation") {
      const translation = document.querySelector(".dialog-translation");
      translation?.classList.toggle("hidden");
      return;
    }
    if (action === "repeat-dialog") {
      const text = document.querySelector(".dialog-bubble")?.textContent || "";
      speakText(text, 0.9);
      return;
    }
    if (action === "set-translation-direction") {
      state.translation.direction = element.dataset.direction;
      state.translation.output = "";
      state.translation.status = "idle";
      state.translation.error = "";
      saveState();
      renderApp();
      return;
    }
    if (action === "swap-translation-direction") {
      state.translation.direction =
        state.translation.direction === "zh-en" ? "en-zh" : "zh-en";
      state.translation.input =
        state.translation.output || state.translation.input;
      state.translation.output = "";
      state.translation.status = "idle";
      state.translation.error = "";
      saveState();
      renderApp();
      return;
    }
    if (action === "translate-submit") {
      const input = document.getElementById("translation-input");
      if (input) state.translation.input = input.value;
      const text = state.translation.input.trim();
      if (!text) {
        showToast("请先输入需要翻译的内容。");
        return;
      }
      state.translation.status = "loading";
      state.translation.error = "";
      renderApp();
      performTranslation(text, state.translation.direction)
        .then((translated) => {
          state.translation.output = translated;
          state.translation.status = "success";
          state.translation.history = [
            {
              input: text,
              output: translated,
              direction: state.translation.direction,
              createdAt: new Date().toISOString(),
            },
            ...state.translation.history.filter(
              (item) =>
                item.input !== text ||
                item.direction !== state.translation.direction,
            ),
          ].slice(0, 12);
          saveState();
          renderApp();
        })
        .catch((error) => {
          state.translation.status = "error";
          state.translation.error =
            error?.message || "暂时无法完成翻译，请稍后重试。";
          saveState();
          renderApp();
        });
      return;
    }
    if (action === "speak-translation-input") {
      speakText(
        state.translation.input,
        null,
        element,
        state.translation.direction === "en-zh" ? "en" : "zh",
      );
      return;
    }
    if (action === "speak-translation-output") {
      speakText(
        state.translation.output,
        null,
        element,
        state.translation.direction === "zh-en" ? "en" : "zh",
      );
      return;
    }
    if (action === "copy-translation") {
      copyTextToClipboard(state.translation.output);
      return;
    }
    if (action === "save-translation-note") {
      const note = createNote({
        title: `翻译笔记：${state.translation.input.slice(0, 28)}`,
        summary: state.translation.output.slice(0, 100),
        body: `<h3>原文</h3><p>${escapeHTML(
          state.translation.input,
        )}</p><h3>译文</h3><p class="english-text">${escapeHTML(
          state.translation.output,
        )}</p>`,
        category: "writing",
        tags: ["翻译", "中英互译"],
      });
      showToast("翻译已加入英语笔记。", "success");
      if (getRoute() === "notes") renderApp();
      return note;
    }
    if (action === "load-translation-history") {
      const item =
        state.translation.history[Number(element.dataset.index || 0)];
      if (item) {
        state.translation.direction = item.direction;
        state.translation.input = item.input;
        state.translation.output = item.output;
        state.translation.status = "success";
        state.translation.error = "";
        renderApp();
      }
      return;
    }
    if (action === "filter-passages") {
      state.translation.passageFilter = element.dataset.filter;
      const first = READING_PASSAGES.find(
        (passage) =>
          state.translation.passageFilter === "全部" ||
          passage.category === state.translation.passageFilter,
      );
      if (first) state.translation.activePassageId = first.id;
      saveState();
      renderApp();
      return;
    }
    if (action === "select-reading-passage") {
      state.translation.activePassageId = element.dataset.id;
      saveState();
      renderApp();
      return;
    }
    if (action === "speak-passage") {
      const passage = getReadingPassage(element.dataset.id);
      speakText(passage.english.join(" "), null, element, "en");
      return;
    }
    if (action === "shadow-passage") {
      const passage = getReadingPassage(element.dataset.id);
      startShadowingAttempt(passage.english.join(" "), element);
      return;
    }
    if (action === "shadow-text") {
      startShadowingAttempt(element.dataset.text || "", element);
      return;
    }
    if (action === "add-passage-note") {
      const passage = getReadingPassage(element.dataset.id);
      createNote({
        title: `朗读笔记：${passage.title}`,
        summary: `${passage.category} · ${passage.level} · ${passage.minutes} 分钟`,
        body: `<h2>${escapeHTML(
          passage.title,
        )}</h2>${passage.english
          .map(
            (sentence, index) =>
              `<p class="english-text">${escapeHTML(
                sentence,
              )}</p><p>${escapeHTML(passage.chinese[index] || "")}</p>`,
          )
          .join("")}`,
        category: "reading",
        tags: ["朗读", passage.category, "英语素材"],
        important: true,
      });
      showToast("朗读语料已加入笔记。", "success");
      return;
    }
    if (action === "clear-translation") {
      const input = document.getElementById("translation-input");
      if (input) {
        input.value = "";
        input.focus();
      }
      return;
    }
    if (action === "regenerate-plan") {
      showToast("AI 正在根据最近记录重新制定计划……");
      window.setTimeout(
        () => showToast("本周计划已更新。", "success"),
        1000,
      );
      return;
    }
    if (action === "select-answer") {
      document
        .querySelectorAll(".answer-option")
        .forEach((item) => item.classList.remove("selected"));
      element.classList.add("selected");
      const current = document.querySelector(".question-dot.current");
      current?.classList.add("answered");
      return;
    }
    if (action === "next-question" || action === "previous-question") {
      document
        .querySelectorAll(".question-dot")
        .forEach((item) => item.classList.remove("current"));
      const dots = [...document.querySelectorAll(".question-dot")];
      let index = dots.findIndex((item) => item.classList.contains("current"));
      index =
        action === "next-question"
          ? Math.min(dots.length - 1, index + 1)
          : Math.max(0, index - 1);
      dots[index]?.classList.add("current");
      return;
    }
    if (action === "submit-exam") {
      openModal(
        `
          <div class="modal-header"><div><h2>提交试卷？</h2><p>提交后才会显示答案和解析。</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body"><p style="margin:0;color:var(--ink-muted)">你还剩 17 道题未作答。考试结束后，错题会自动整理并支持加入笔记。</p></div>
          <div class="modal-footer"><button class="btn" data-action="close-modal">继续答题</button><button class="btn primary" data-action="confirm-submit-exam">提交并查看结果</button></div>
        `,
        "small",
      );
      return;
    }
    if (action === "confirm-submit-exam") {
      closeModal();
      showToast("考试已提交，正在生成成绩与错题分析……");
      return;
    }
    if (action === "exit-exam") {
      navigate("exams");
      return;
    }
    if (action === "reader-mode") {
      const container = document.getElementById("reading-dual");
      container?.classList.toggle(
        "show-translation",
        element.dataset.mode === "translation",
      );
      document.querySelectorAll('[data-action="reader-mode"]').forEach((btn) => {
        btn.classList.toggle("soft", btn === element);
      });
      return;
    }
    if (action === "next-paragraph") {
      showToast("已记录阅读位置。", "success");
      return;
    }
    if (action === "upload-document") {
      createNote({
        title: "新上传文章：环境保护与个人行动",
        summary: "个人文章 · 待整理",
        body: "<p>这是一篇刚刚上传的文章。你可以使用右侧 AI 工具进行翻译、总结、纠错、朗读、提取单词或生成题目。</p>",
        category: "reading",
        tags: ["我的文章", "待整理"],
      });
      showToast("文章已加入工作区。", "success");
      return;
    }
    if (action === "article-tool") {
      const tool = element.dataset.tool;
      if (tool === "加入笔记") {
        addDemoNote("reading");
      } else {
        showToast(`AI 正在${tool}……`);
        window.setTimeout(() => showToast(`${tool}已完成。`, "success"), 1000);
      }
      return;
    }
    if (action === "setting-demo" || action === "edit-profile") {
      showToast("设置面板已准备，后续可接入账号同步。");
      return;
    }
    if (action === "filter-literature") {
      state.literatureFilter = element.dataset.filter;
      renderApp();
      return;
    }
    if (action === "filter-literature-exam") {
      state.literatureExamFilter = element.dataset.filter;
      renderApp();
      return;
    }
    if (action === "start-literature-search") {
      const input = document.getElementById("literature-search");
      input?.focus();
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (action === "open-literature-import") {
      renderLiteratureImportModal();
      return;
    }
    if (action === "toggle-paper-save") {
      const paper = state.papers.find((item) => item.id === id);
      if (paper) {
        paper.saved = !paper.saved;
        saveState();
        renderApp();
        showToast(paper.saved ? "文献已收藏。" : "已取消收藏。", "success");
      }
      return;
    }
    if (action === "paper-keyword") {
      renderWordPopover(element.dataset.word);
      return;
    }
    if (action === "complete-paper-reading") {
      const paper = state.papers.find((item) => item.id === id);
      if (paper) {
        paper.progress = 100;
        saveState();
        renderApp();
        showToast("已标记为完成阅读。", "success");
      }
      return;
    }
    if (action === "literature-tool") {
      handleLiteratureTool(element.dataset.tool, element.dataset.id);
      return;
    }
    if (action === "filter-books") {
      state.bookFilter = element.dataset.filter;
      renderApp();
      return;
    }
    if (action === "retry-article-library") {
      articleLibraryError = "";
      articleLibrary = [];
      articleLibraryLoading = false;
      ensureArticleLibrary();
      renderApp();
      return;
    }
    if (action === "retry-speech-library") {
      speechLibraryError = "";
      speechLibrary = [];
      speechLibraryLoading = false;
      ensureSpeechLibrary();
      renderApp();
      return;
    }
    if (action === "retry-business-library") {
      businessLibraryError = "";
      businessLibraryLoading = false;
      ensureBusinessLibrary();
      renderApp();
      return;
    }
    if (action === "filter-business") {
      state.businessCategory = element.dataset.category;
      state.businessPage = 0;
      renderApp();
      return;
    }
    if (action === "business-page-prev" || action === "business-page-next") {
      state.businessPage = Math.max(
        0,
        state.businessPage + (action === "business-page-next" ? 1 : -1),
      );
      renderApp();
      return;
    }
    if (action === "open-business-term") {
      renderAutomotiveTermModal(id);
      return;
    }
    if (action === "start-business-training") {
      const words = [...businessLibrary]
        .sort(
          (a, b) =>
            a.mastery - b.mastery ||
            String(a.word).localeCompare(String(b.word)),
        )
        .slice(0, 20);
      state.training.session = {
        mode: "word-cards",
        index: 0,
        score: 0,
        items: words.map((word) => word.id),
        revealed: false,
        feedback: "",
      };
      renderTrainingSessionModal();
      return;
    }
    if (action === "filter-speech-category") {
      state.speechCategory = element.dataset.category;
      state.speechPage = 0;
      renderApp();
      return;
    }
    if (action === "filter-speech-level") {
      state.speechLevel = element.dataset.level;
      state.speechPage = 0;
      renderApp();
      return;
    }
    if (action === "speech-page-prev" || action === "speech-page-next") {
      state.speechPage = Math.max(
        0,
        state.speechPage + (action === "speech-page-next" ? 1 : -1),
      );
      renderApp();
      document
        .querySelector(".speech-toolbar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "random-speech-item") {
      if (!speechLibrary.length) {
        ensureSpeechLibrary();
        return;
      }
      const item =
        speechLibrary[Math.floor(Math.random() * speechLibrary.length)];
      state.activeSpeechId = item.id;
      state.speechQuery = "";
      state.speechCategory = "全部";
      state.speechLevel = "全部";
      state.speechPage = Math.floor(
        speechLibrary.findIndex((entry) => entry.id === item.id) / 80,
      );
      renderApp();
      window.setTimeout(() => {
        document
          .querySelector(".speech-library-card")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    if (action === "toggle-speech-save") {
      if (state.speechSavedIds.includes(id)) {
        state.speechSavedIds = state.speechSavedIds.filter(
          (item) => item !== id,
        );
      } else {
        state.speechSavedIds.push(id);
      }
      saveState();
      renderApp();
      showToast(
        state.speechSavedIds.includes(id)
          ? "朗读内容已收藏。"
          : "已取消收藏。",
        "success",
      );
      return;
    }
    if (action === "add-speech-note") {
      const item = speechLibrary.find((entry) => entry.id === id);
      if (!item) return;
      createNote({
        title: `朗读短句：${item.word}`,
        summary: item.chinese,
        body: `<p class="english-text">${escapeHTML(
          item.english,
        )}</p><p>${escapeHTML(item.chinese)}</p><h3>关键词</h3><p><strong>${escapeHTML(
          item.word,
        )}</strong> = ${escapeHTML(item.meaning)}</p>`,
        category: "speaking",
        tags: ["朗读短句", item.category, item.deck],
      });
      showToast("朗读短句已加入笔记。", "success");
      return;
    }
    if (action === "filter-collection-type") {
      state.collectionType = element.dataset.type;
      state.collectionPage = 0;
      renderApp();
      return;
    }
    if (action === "filter-collection-category") {
      state.collectionCategory = element.dataset.category;
      state.collectionPage = 0;
      renderApp();
      return;
    }
    if (
      action === "collection-page-prev" ||
      action === "collection-page-next"
    ) {
      state.collectionPage = Math.max(
        0,
        state.collectionPage + (action === "collection-page-next" ? 1 : -1),
      );
      renderApp();
      document
        .querySelector(".collection-toolbar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "open-collection") {
      state.activeCollectionId = id;
      navigate(`reading/collection/${id}`);
      return;
    }
    if (action === "random-collection") {
      if (!articleLibrary.length) {
        ensureArticleLibrary();
        return;
      }
      const item =
        articleLibrary[Math.floor(Math.random() * articleLibrary.length)];
      navigate(`reading/collection/${item.id}`);
      return;
    }
    if (action === "toggle-collection-save") {
      if (state.collectionFavorites.includes(id)) {
        state.collectionFavorites = state.collectionFavorites.filter(
          (item) => item !== id,
        );
      } else {
        state.collectionFavorites.push(id);
      }
      saveState();
      renderApp();
      showToast(
        state.collectionFavorites.includes(id)
          ? "内容已收藏。"
          : "已取消收藏。",
        "success",
      );
      return;
    }
    if (action === "complete-collection") {
      state.collectionProgress[id] = 100;
      saveState();
      renderApp();
      showToast("已标记完成阅读。", "success");
      return;
    }
    if (action === "add-collection-note") {
      const article =
        articleLibrary.find((item) => item.id === id) ||
        articleLibrary.find(
          (item) => item.id === state.activeCollectionId,
        );
      if (!article) return;
      createNote({
        title: `阅读笔记：${article.title}`,
        summary: article.summary,
        body: `<h2>${escapeHTML(
          article.title,
        )}</h2><p>${escapeHTML(article.sourceType)} · ${escapeHTML(
          article.category,
        )} · ${article.level}</p><h3>英文摘要</h3><p class="english-text">${escapeHTML(
          article.abstract,
        )}</p><h3>内容摘要</h3><p>${escapeHTML(
          article.summary,
        )}</p><h3>关键词</h3><p>${article.keywords
          .map((keyword) => escapeHTML(keyword))
          .join(" · ")}</p>`,
        category: "reading",
        tags: ["文章文献库", article.category, ...article.exam],
      });
      showToast("内容已加入英语笔记。", "success");
      return;
    }
    if (action === "toggle-book-save") {
      const book = state.books.find((item) => item.id === id);
      if (book) {
        book.saved = !book.saved;
        saveState();
        renderApp();
        showToast(book.saved ? "资料已收藏。" : "已取消收藏。", "success");
      }
      return;
    }
    if (action === "open-book") {
      renderBookDetailModal(id);
      return;
    }
    if (action === "add-book-plan") {
      const book = state.books.find((item) => item.id === id);
      if (book) {
        book.saved = true;
        book.progress = Math.min(100, book.progress + 5);
        saveState();
        closeModal();
        if (getRoute() === "reading/library") renderApp();
        showToast(`“${book.title}”已加入学习计划。`, "success");
      }
      return;
    }
    if (action === "open-resource-add") {
      renderResourceAddModal();
      return;
    }
    if (action === "open-resource-plan") {
      renderResourcePlanModal();
      return;
    }
    if (action === "accept-resource-plan") {
      state.books.forEach((book) => {
        if (book.saved) book.progress = Math.min(100, book.progress + 2);
      });
      saveState();
      closeModal();
      showToast("一周资料学习计划已加入。", "success");
      return;
    }
    if (action === "book-tool") {
      handleBookTool(element.dataset.tool, element.dataset.id);
      return;
    }
    if (action === "run-diagnostics") {
      renderDiagnosticsModal();
      return;
    }
    if (action === "reload-page") {
      location.reload();
      return;
    }
    if (action === "go-route") {
      navigate(route);
      return;
    }
  }

  function handleSelectionTool(tool, text) {
    document.querySelector(".selection-toolbar")?.remove();
    const actions = {
      translate: "翻译",
      explain: "解释",
      rewrite: "改写",
      grammar: "语法分析",
      example: "例句生成",
    };
    if (tool === "speak") {
      speakText(text);
      return;
    }
    if (tool === "word") {
      addDemoNote("vocabulary", {
        title: `单词：${text.split(/\s+/).slice(0, 3).join(" ")}`,
        body: `<p class="english-text">${escapeHTML(
          text,
        )}</p><p>来自笔记中的选中内容。</p>`,
        tags: ["选中内容", "单词"],
      });
      return;
    }
    if (tool === "note") {
      addDemoNote("speaking", {
        title: "重点句子",
        body: `<p class="english-text">${escapeHTML(
          text,
        )}</p><p>已从笔记中选中并保存。</p>`,
        tags: ["重点句子"],
      });
      return;
    }
    showToast(`AI 正在${actions[tool] || "处理"}……`);
    window.setTimeout(
      () => showToast(`${actions[tool] || "处理"}完成，已显示在 AI 助手。`, "success"),
      900,
    );
    state.aiOpen = true;
    state.aiMessages.push({
      role: "assistant",
      text: `“${text.slice(
        0,
        80,
      )}”已经分析完成。我可以继续帮你翻译、提取短语或生成练习。`,
    });
    renderApp();
  }

  function refreshSpeechVoices() {
    if (!("speechSynthesis" in window)) {
      speechVoices = [];
      return [];
    }
    speechVoices = window.speechSynthesis
      .getVoices();
    return speechVoices;
  }

  function waitForSpeechVoices(timeout = 700) {
    const current = refreshSpeechVoices();
    if (current.length || !("speechSynthesis" in window)) {
      return Promise.resolve(current);
    }
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve(refreshSpeechVoices());
      };
      const timer = window.setTimeout(finish, timeout);
      const previous = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = () => {
        window.clearTimeout(timer);
        if (typeof previous === "function") previous();
        finish();
      };
    });
  }

  function voiceScore(voice, accent) {
    const lang = (voice.lang || "").toLowerCase();
    const name = (voice.name || "").toLowerCase();
    let score = 0;
    if (lang === accent.toLowerCase()) score += 100;
    else if (accent !== "en" && lang.startsWith(accent.toLowerCase()))
      score += 80;
    else if (lang.startsWith("en-gb")) score += 60;
    else if (lang.startsWith("en-us")) score += 55;
    else if (lang.startsWith("en")) score += 30;

    const preferredNames =
      accent === "en-GB"
        ? ["serena", "kate", "daniel", "oliver", "uk english", "british"]
        : accent === "en-US"
          ? ["samantha", "ava", "alex", "allison", "us english", "american"]
          : accent === "en-AU"
            ? ["karen", "matilda", "australian"]
            : accent === "zh"
              ? ["tingting", "meijia", "sinji", "chinese"]
            : [];
    preferredNames.forEach((preferred, index) => {
      if (name.includes(preferred)) score += 50 - index;
    });
    const highQualityNames = [
      "natural",
      "neural",
      "premium",
      "enhanced",
      "siri",
      "google",
      "microsoft",
      "aria",
      "jenny",
      "sonia",
      "ryan",
      "libby",
    ];
    if (state.speech.quality === "natural") {
      highQualityNames.forEach((quality) => {
        if (name.includes(quality)) score += 80;
      });
      if (!voice.localService) score += 18;
    }
    const noveltyNames = [
      "bad news",
      "bahh",
      "bells",
      "boing",
      "bubbles",
      "cellos",
      "wobble",
      "albert",
    ];
    if (noveltyNames.some((novelty) => name.includes(novelty))) score -= 200;
    if (name.includes("compact") || name.includes("default")) score -= 15;
    return score;
  }

  function getVoicesForAccent(accent) {
    const voices = refreshSpeechVoices();
    const filtered =
      accent === "en"
        ? voices.filter((voice) => /^en(?:-|$)/i.test(voice.lang || ""))
        : accent === "zh"
          ? voices.filter((voice) => /^zh(?:-|$)/i.test(voice.lang || ""))
          : voices.filter((voice) =>
              (voice.lang || "")
                .toLowerCase()
                .startsWith(accent.toLowerCase()),
            );
    return [...filtered].sort(
      (a, b) =>
        voiceScore(b, accent) - voiceScore(a, accent) ||
        a.name.localeCompare(b.name),
    );
  }

  function speakText(
    text,
    requestedRate = null,
    button = null,
    language = "en",
  ) {
    const value = String(text || "").trim();
    if (!value) return;
    if (
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ) {
      showToast("当前浏览器暂不支持英语朗读。");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();
    button?.classList.add("is-speaking");

    return waitForSpeechVoices().then((voices) => {
      const selectedVoice =
        (language === "zh"
          ? voices.filter((voice) => /^zh(?:-|$)/i.test(voice.lang || ""))
          : voices
        ).find(
          (voice) => voice.voiceURI === state.speech.voiceURI,
        ) ||
        (language === "zh"
          ? getVoicesForAccent("zh")[0]
          : getVoicesForAccent(state.speech.accent)[0]) ||
        voices.find((voice) =>
          language === "zh"
            ? /^zh(?:-|$)/i.test(voice.lang || "")
            : /^en(?:-|$)/i.test(voice.lang || ""),
        ) ||
        null;
      const rate = Math.min(
        1.5,
        Math.max(
          0.5,
          Number.isFinite(requestedRate)
            ? requestedRate
            : state.speech.rate || 0.92,
        ),
      );
      const chunks = (
        value.match(/[^.!?]+[.!?]+(?:["'])?|[^.!?]+$/g) || [value]
      )
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .reduce((result, sentence) => {
          const previous = result[result.length - 1];
          if (previous && previous.length + sentence.length < 240) {
            result[result.length - 1] = `${previous} ${sentence}`;
          } else {
            result.push(sentence);
          }
          return result;
        }, []);

      return new Promise((resolve) => {
        const cleanup = () => {
          button?.classList.remove("is-speaking");
          resolve();
        };
        const createUtterance = (voice, chunk) => {
          const utterance = new SpeechSynthesisUtterance(chunk);
          utterance.lang =
            language === "zh"
              ? "zh-CN"
              : state.speech.accent === "en"
                ? "en-US"
                : state.speech.accent;
          utterance.rate = rate;
          utterance.pitch = 1;
          utterance.volume = 1;
          if (voice) utterance.voice = voice;
          return utterance;
        };
        const playChunk = (index, voice, retried = false) => {
          if (index >= chunks.length) {
            cleanup();
            return;
          }
          const utterance = createUtterance(voice, chunks[index]);
          utterance.onend = () => playChunk(index + 1, selectedVoice, false);
          utterance.onerror = (event) => {
            if (event.error === "canceled" || event.error === "interrupted") {
              cleanup();
              return;
            }
            if (!retried) {
              const fallbackVoice =
                voices.find((candidate) => candidate !== voice) || null;
              window.setTimeout(
                () => playChunk(index, fallbackVoice, true),
                180,
              );
              return;
            }
            cleanup();
            showToast("英语朗读暂时失败，请检查浏览器语音权限后重试。");
          };
          synth.speak(utterance);
        };
        playChunk(0, selectedVoice);
      });
    });
  }

  function handleLiteratureTool(tool, paperId) {
    const paper =
      state.papers.find((item) => item.id === paperId) ||
      state.papers.find((item) => item.id === state.activePaperId);
    if (!paper) return;

    if (tool === "加入笔记") {
      createNote({
        title: `文献笔记：${paper.title}`,
        summary: `${paper.journal} ${paper.year} · ${paper.keywords.join(
          " / ",
        )}`,
        body: `<h2>${escapeHTML(paper.title)}</h2><p>${escapeHTML(
          paper.authors,
        )} · ${escapeHTML(paper.journal)} · ${paper.year}</p><h3>摘要</h3><p>${escapeHTML(
          paper.abstract,
        )}</p><h3>关键词</h3><p>${paper.keywords
          .map((keyword) => escapeHTML(keyword))
          .join(" · ")}</p><h3>阅读结论</h3><p>待补充。</p>`,
        category: "literature",
        tags: ["文献", ...paper.keywords.slice(0, 3)],
        important: true,
      });
      showToast("文献已加入英语笔记。", "success");
      return;
    }

    if (tool === "生成摘要") {
      openModal(
        `
          <div class="modal-header"><div><h2>AI 摘要</h2><p>${escapeHTML(
            paper.title,
          )}</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body">
            <div class="paper-summary-result">
              <div class="analysis-result-section"><span>研究问题</span><p>个人行为与公共政策如何共同影响碳排放？</p></div>
              <div class="analysis-result-section"><span>核心结论</span><p>${escapeHTML(
                paper.abstract,
              )}</p></div>
              <div class="analysis-result-section"><span>阅读提示</span><p>重点区分直接效果与社会规范带来的间接影响。</p></div>
            </div>
          </div>
        `,
        "small",
      );
      return;
    }

    if (tool === "提取专业词汇") {
      let added = 0;
      paper.keywords.slice(0, 4).forEach((keyword) => {
        if (!state.words.some((word) => word.word === keyword)) {
          state.words.push({
            id: uid("word"),
            word: keyword,
            phonetic: "",
            part: "phrase",
            meaning: "文献关键词，请结合上下文整理释义",
            example: paper.abstract,
            translation: "来自英文文献摘要。",
            deck: "学术英语",
            mastery: 0,
            tags: ["文献", "专业词汇"],
            source: paper.title,
            reviewAt: new Date(Date.now() + 86400000).toISOString(),
          });
          added += 1;
        }
      });
      saveState();
      showToast(
        added
          ? `已提取 ${added} 个专业词汇到“学术英语”词库。`
          : "这些关键词已经在词库中。",
        "success",
      );
      return;
    }

    if (tool === "生成阅读理解题") {
      openModal(
        `
          <div class="modal-header"><div><h2>文献阅读理解</h2><p>根据论文摘要生成</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body">
            <div class="question-text">1. What relationship does the paper describe between individual action and public policy?</div>
            <div class="analysis-result-section"><span>参考方向</span><p>两者不是替代关系，而是可以相互促进。</p></div>
            <div class="question-text" style="margin-top:20px">2. Why can consistent individual behavior matter?</div>
            <div class="analysis-result-section"><span>参考方向</span><p>它会改变政府和企业眼中的社会常态。</p></div>
          </div>
        `,
        "small",
      );
      return;
    }

    if (tool === "生成引用") {
      const citation = `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}.`;
      openModal(
        `
          <div class="modal-header"><div><h2>生成引用</h2><p>可直接用于论文或作业</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body"><blockquote class="editor-content" style="min-height:0;padding:16px;border-left:3px solid var(--accent);background:var(--surface-blue)">${escapeHTML(
            citation,
          )}</blockquote></div>
        `,
        "small",
      );
      return;
    }

    showToast(`AI 正在完成“${tool}”……`);
    window.setTimeout(() => showToast(`${tool}已完成。`, "success"), 850);
  }

  function handleBookTool(tool, bookId) {
    const book = state.books.find((item) => item.id === bookId);
    if (!book) return;
    if (tool === "加入笔记") {
      createNote({
        title: `资料笔记：${book.title}`,
        summary: `${book.author} · ${book.level} · ${book.tags.join(" / ")}`,
        body: `<h2>${escapeHTML(book.title)}</h2><p>${escapeHTML(
          book.author,
        )} · ${escapeHTML(book.publisher)}</p><h3>资料简介</h3><p>${escapeHTML(
          book.description,
        )}</p><h3>学习计划</h3><p>共 ${book.units} 个学习单元，当前进度 ${
          book.progress
        }%。</p>`,
        category: "literature",
        tags: ["资料笔记", ...book.tags.slice(0, 3)],
        important: true,
      });
      showToast("资料已加入英语笔记。", "success");
      return;
    }
    if (tool === "词汇提取") {
      const matching = state.words.filter((word) =>
        book.exam.includes("通用")
          ? true
          : word.tags.some((tag) => book.exam.includes(tag)) ||
            word.deck.includes(book.exam[0] || ""),
      );
      openModal(
        `
          <div class="modal-header"><div><h2>词汇提取</h2><p>${escapeHTML(
            book.title,
          )}</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body">
            <p style="color:var(--ink-muted);font-size:13px">根据资料分类匹配到 ${
              matching.length
            } 个已有单词，可在单词工作区继续学习。</p>
            <div class="vocabulary-list">${matching
              .slice(0, 8)
              .map(
                (word) => `
                  <div class="vocabulary-item">
                    <span><strong>${escapeHTML(
                      word.word,
                    )}</strong><small>${escapeHTML(
                      word.phonetic,
                    )}</small></span>
                    <span class="vocabulary-meaning">${escapeHTML(
                      word.meaning,
                    )}</span>
                    <span class="mastery-pill low">${word.mastery}%</span>
                  </div>`,
              )
              .join("")}</div>
          </div>
          <div class="modal-footer"><button class="btn primary" data-action="go-route" data-route="study/words">${icon(
            "type",
          )}进入单词工作区</button></div>
        `,
        "wide",
      );
      return;
    }
    if (tool === "章节学习") {
      book.progress = Math.min(100, book.progress + 3);
      saveState();
      closeModal();
      renderApp();
      showToast("章节进度已更新。", "success");
      return;
    }
    if (tool === "生成练习") {
      openModal(
        `
          <div class="modal-header"><div><h2>资料练习</h2><p>${escapeHTML(
            book.title,
          )}</p></div><button class="icon-button" data-action="close-modal">${icon(
            "x",
          )}</button></div>
          <div class="modal-body">
            <div class="question-text">请根据资料主题完成以下任务：</div>
            <ol style="color:var(--ink-muted);line-height:1.9">
              <li>提取 5 个高频词并写出英文例句。</li>
              <li>用资料主题完成一段 80 词英文总结。</li>
              <li>挑出 3 个长难句并分析句子结构。</li>
            </ol>
          </div>
        `,
        "small",
      );
      return;
    }
    showToast(`${tool}已完成。`, "success");
  }

  function addDemoNote(kind, overrides = {}) {
    const map = {
      vocabulary: {
        title: "Universe：宇宙与尺度",
        body: "<p><strong>universe</strong> 宇宙</p><p><strong>very large</strong> 非常大</p><p class=\"english-text\">The universe is very large.</p>",
        category: "vocabulary",
        tags: ["词汇", "宇宙"],
        important: true,
      },
      listening: {
        title: "听力场景：校园注册",
        body: "<p><strong>registration</strong> 注册 / <strong>deadline</strong> 截止日期</p><p>注意 registration office 中 t 的弱读。</p>",
        category: "listening",
        tags: ["听力", "校园"],
      },
      speaking: {
        title: "口语：How do I get to…?",
        body: "<p><strong>get to</strong> = 到达</p><p class=\"english-text\">How do I get to the station?</p><p>我怎么去车站？</p>",
        category: "speaking",
        tags: ["口语", "问路"],
      },
      translation: {
        title: "翻译练习：improve my English",
        body: "<p class=\"english-text\">I’d like to improve my English.</p><p>我想提高我的英语。</p>",
        category: "writing",
        tags: ["翻译", "句式"],
      },
      reading: {
        title: "阅读笔记：Why Small Actions Still Matter",
        body: "<p>个人行动与公共政策不是替代关系，而是相互促进。</p><p><strong>reinforce</strong> = 加强；促进</p>",
        category: "reading",
        tags: ["阅读", "环保"],
        important: true,
      },
      mistake: {
        title: "错题：推断题中的转折词",
        body: "<p>CET-4 阅读 Q18 错因：忽略 <strong>however</strong> 后的作者态度转折。</p><p>加入复习：转折后通常是强调重点。</p>",
        category: "exam",
        tags: ["错题", "CET-4", "阅读"],
        important: true,
      },
    };
    const base = map[kind] || {
      title: "新的学习笔记",
      body: "<p>从学习内容加入的笔记。</p>",
      category: state.categories.some((item) => item.id === kind)
        ? kind
        : "other",
      tags: ["学习记录"],
    };
    const note = createNote({ ...base, ...overrides });
    showToast("已加入英语笔记。", "success");
    if (getRoute() === "notes") renderApp();
    return note;
  }

  function runAiLearn() {
    const input = document.getElementById("english-ai-input");
    const result = document.getElementById("ai-analysis");
    const value = input?.value.trim() || "";
    if (!value || !result) {
      showToast("先输入一句英语。");
      input?.focus();
      return;
    }
    result.innerHTML = `<div class="ai-analysis"><div class="analysis-loading"><span class="spinner"></span><span>AI 正在分析……</span></div></div>`;
    window.setTimeout(() => {
      const isStation = /station/i.test(value);
      const sentence = escapeHTML(value);
      result.innerHTML = `
        <div class="ai-analysis">
          <div class="analysis-result">
            <div class="analysis-result-section"><span>中文翻译</span><strong>${
              isStation ? "我怎么去车站？" : "我想提高我的英语。"
            }</strong></div>
            <div class="analysis-result-section"><span>重点短语</span><strong>${
              isStation ? "get to = 到达" : "improve = 提高"
            }</strong></div>
            <div class="analysis-result-section"><span>语法结构</span><p>${
              isStation
                ? "How do I + 动词原形…? 用于询问完成某事的方法。"
                : "want / would like to + 动词原形，表达愿望。"
            }</p></div>
            <div class="analysis-result-section"><span>使用场景</span><p>${
              isStation ? "向陌生人问路" : "谈论个人学习目标"
            }</p></div>
            <div class="analysis-result-section"><span>更自然表达</span><p>${
              isStation
                ? "Could you tell me how to get to the station?"
                : "I’m working on improving my English."
            }</p></div>
          </div>
          <div class="editor-actions" style="margin-top:13px">
            <button class="btn small soft" data-action="analysis-add" data-type="word">${icon(
              "plus",
            )}加入单词</button>
            <button class="btn small" data-action="analysis-add" data-type="mistake">${icon(
              "target",
            )}加入错题</button>
            <button class="btn small" data-action="analysis-add" data-type="review">${icon(
              "clock",
            )}加入复习</button>
            <button class="btn small" data-action="analysis-translate">${icon(
              "languages",
            )}翻译</button>
            <button class="btn small" data-action="speak-text" data-text="${sentence}">${icon(
              "volume",
            )}朗读</button>
          </div>
        </div>
      `;
    }, 1100);
  }

  function sendAiMessage(text) {
    if (!text.trim()) return;
    state.aiMessages.push({ role: "user", text: text.trim() });
    renderApp();
    window.setTimeout(() => {
      const route = getRoute();
      let reply =
        "我建议先把内容转成一句可复述的英文，再提取一个短语和一个例句。";
      if (/计划/.test(text)) {
        reply =
          "今天建议安排：20 个单词、1 组听力、1 篇短文和 10 分钟口语，总计约 28 分钟。";
      } else if (/整理/.test(text) || route.startsWith("notes")) {
        reply =
          "可以。选中笔记内容后点击“AI 改写”，我会保留原意并整理为标题、重点、单词、例句和总结。";
      } else if (/练习/.test(text)) {
        reply =
          "已为你生成 3 道练习：1 道选词填空、1 道翻译、1 道口语替换练习。";
      }
      state.aiMessages.push({ role: "assistant", text: reply });
      renderApp();
    }, 720);
  }

  document.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");
    if (actionElement) {
      if (actionElement.dataset.action === "analysis-add") {
        const type = actionElement.dataset.type;
        if (type === "review") {
          const note = getRouteNote(getRoute().split("/")[1]);
          if (note) {
            note.reviewAt = new Date(Date.now() + 86400000).toISOString();
            touchNote(note);
          }
          showToast("已加入明天复习。", "success");
        } else {
          addDemoNote(type === "mistake" ? "mistake" : "vocabulary");
        }
        return;
      }
      if (actionElement.dataset.action === "analysis-translate") {
        showToast("译文已保留，可随时复制到笔记中。", "success");
        return;
      }
      handleAction(actionElement, event);
      return;
    }

    const routeElement = event.target.closest("[data-route]");
    if (routeElement) {
      event.preventDefault();
      navigate(routeElement.dataset.route);
      return;
    }

    const backdrop = event.target.closest(".modal-backdrop");
    if (backdrop && event.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    const type = form.dataset.form;
    if (!type) return;
    event.preventDefault();
    const data = new FormData(form);

    if (type === "create-category") {
      const name = String(data.get("category") || "").trim();
      if (!name) return;
      state.categories.push({ id: uid("category"), name, icon: "folder" });
      saveState();
      renderApp();
      showToast("分类已创建。", "success");
      return;
    }
    if (type === "add-tag") {
      const tag = String(data.get("tag") || "").trim();
      const note = getRouteNote(getRoute().split("/")[1]);
      if (tag && note) {
        note.tags ||= [];
        if (!note.tags.includes(tag)) note.tags.push(tag);
        touchNote(note);
        renderApp();
      }
      return;
    }
    if (type === "word-import") {
      const wordValue = String(data.get("word") || "").trim();
      const meaning = String(data.get("meaning") || "").trim();
      if (!wordValue || !meaning) {
        showToast("单词和中文释义不能为空。");
        return;
      }
      const word = {
        id: uid("word"),
        word: wordValue,
        phonetic: String(data.get("phonetic") || "").trim(),
        part: String(data.get("part") || "").trim() || "word",
        meaning,
        example:
          String(data.get("example") || "").trim() ||
          `This is an example sentence with ${wordValue}.`,
        translation:
          String(data.get("translation") || "").trim() ||
          "请补充例句翻译。",
        deck: String(data.get("deck") || "学术英语"),
        mastery: 0,
        tags: ["自建词库"],
        source: "手动添加",
        reviewAt: new Date(Date.now() + 86400000).toISOString(),
      };
      state.words.unshift(word);
      state.activeWordId = word.id;
      state.activeWordDeck = word.deck;
      saveState();
      closeModal();
      renderApp();
      showToast("单词已加入词库。", "success");
      return;
    }
    if (type === "literature-import") {
      const title = String(data.get("title") || "").trim();
      if (!title) {
        showToast("论文标题不能为空。");
        return;
      }
      const abstract =
        String(data.get("abstract") || "").trim() ||
        "暂未提供摘要，可在阅读工作区中继续补充。";
      const paper = {
        id: uid("paper"),
        title,
        authors:
          String(data.get("authors") || "").trim() || "作者待补充",
        journal:
          String(data.get("journal") || "").trim() || "未指定期刊",
        year: String(data.get("year") || "").trim() || "2026",
        abstract,
        keywords: String(data.get("keywords") || "")
          .split(/[,，]+/)
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 8),
        saved: true,
        progress: 0,
        citations: 0,
        sections: [["Imported content", abstract]],
      };
      state.papers.unshift(paper);
      state.activePaperId = paper.id;
      saveState();
      closeModal();
      navigate(`reading/literature/${paper.id}`);
      showToast("文献已导入。", "success");
      return;
    }
    if (type === "resource-add") {
      const title = String(data.get("title") || "").trim();
      if (!title) {
        showToast("资料名称不能为空。");
        return;
      }
      const book = {
        id: uid("book"),
        title,
        author:
          String(data.get("author") || "").trim() || "作者待补充",
        publisher: "用户添加",
        category: String(data.get("category") || "reference"),
        exam: String(data.get("exam") || "通用")
          .split(/[,，/]+/)
          .map((item) => item.trim())
          .filter(Boolean),
        level: String(data.get("level") || "").trim() || "全阶段",
        description:
          String(data.get("description") || "").trim() ||
          "用户添加的英语学习资料。",
        tags: ["自建资料"],
        saved: true,
        progress: 0,
        units: 1,
      };
      state.books.unshift(book);
      state.activeBookId = book.id;
      saveState();
      closeModal();
      if (getRoute() !== "reading/library") navigate("reading/library");
      else renderApp();
      showToast("资料已添加。", "success");
      return;
    }
    if (type === "quick-record") {
      const title = String(data.get("title") || "").trim() || "快速记录";
      const bodyText = String(data.get("body") || "").trim();
      const note = createNote({
        title,
        body: bodyText
          .split(/\n+/)
          .filter(Boolean)
          .map((line) => `<p>${escapeHTML(line)}</p>`)
          .join(""),
        summary: bodyText.slice(0, 100) || "快速记录",
        tags: ["快速记录"],
      });
      closeModal();
      navigate(`notes/${note.id}`);
      showToast("快速记录已保存。", "success");
      return;
    }
    if (type === "ai-organize") {
      const resultRoot = document.getElementById("organize-result");
      if (resultRoot?.dataset.ready === "true" && resultRoot._organizedResult) {
        const note = createNote({
          ...resultRoot._organizedResult,
          category: "other",
          tags: ["AI 整理"],
        });
        closeModal();
        navigate(`notes/${note.id}`);
        showToast("AI 整理结果已保存为新笔记。", "success");
      } else {
        showOrganizeResult(String(data.get("source") || ""));
      }
      return;
    }
    if (type === "rename-category") {
      const currentRoute = document;
      const categoryId = document.querySelector(
        '[data-action="delete-category"]',
      )?.dataset.category;
      const category = state.categories.find(
        (item) => item.id === categoryId,
      );
      const name = String(data.get("name") || "").trim();
      if (category && name) {
        category.name = name;
        saveState();
        closeModal();
        renderApp();
        showToast("分类名称已更新。", "success");
      }
      return;
    }
    if (type === "ai-message") {
      const input = form.querySelector("input[name='message']");
      sendAiMessage(input?.value || "");
      input.value = "";
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (
      target.id === "editor-title" ||
      target.id === "editor-content" ||
      target.closest("#editor-content")
    ) {
      updateEditorNote();
      return;
    }
    if (target.id === "global-search-input") {
      const result = document.getElementById("search-results");
      if (result) result.innerHTML = renderSearchResults(target.value);
      return;
    }
    if (target.id === "notes-search") {
      state.noteQuery = target.value;
      window.clearTimeout(target._filterTimer);
      target._filterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("notes-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 260);
    }
    if (target.id === "word-search") {
      state.wordQuery = target.value;
      state.wordPage = 0;
      window.clearTimeout(target._wordFilterTimer);
      target._wordFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("word-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "literature-search") {
      state.literatureQuery = target.value;
      window.clearTimeout(target._literatureFilterTimer);
      target._literatureFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("literature-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "book-search") {
      state.bookQuery = target.value;
      window.clearTimeout(target._bookFilterTimer);
      target._bookFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("book-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "translation-input") {
      state.translation.input = target.value;
      scheduleSave();
    }
    if (target.id === "automotive-search") {
      state.automotiveQuery = target.value;
      state.automotivePage = 0;
      window.clearTimeout(target._automotiveFilterTimer);
      target._automotiveFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("automotive-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "collection-search") {
      state.collectionQuery = target.value;
      state.collectionPage = 0;
      window.clearTimeout(target._collectionFilterTimer);
      target._collectionFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("collection-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "speech-search") {
      state.speechQuery = target.value;
      state.speechPage = 0;
      window.clearTimeout(target._speechFilterTimer);
      target._speechFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("speech-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
    if (target.id === "business-search") {
      state.businessQuery = target.value;
      state.businessPage = 0;
      window.clearTimeout(target._businessFilterTimer);
      target._businessFilterTimer = window.setTimeout(() => {
        const position = target.selectionStart || target.value.length;
        renderApp();
        const next = document.getElementById("business-search");
        if (next) {
          next.focus();
          next.setSelectionRange(position, position);
        }
      }, 220);
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "note-category") {
      const note = getRouteNote(getRoute().split("/")[1]);
      if (note) {
        note.category = target.value;
        touchNote(note);
        showToast("分类已更新。", "success");
      }
    }
    if (target.id === "speech-voice-select") {
      state.speech.voiceURI = target.value;
      saveState();
      showToast("朗读语音已更新。", "success");
    }
    if (target.id === "editor-image-input" && target.files?.[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("editor-content")?.focus();
        document.execCommand(
          "insertHTML",
          false,
          `<img src="${reader.result}" alt="${escapeHTML(file.name)}" /><p><br></p>`,
        );
        updateEditorNote();
      };
      reader.readAsDataURL(file);
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      renderSearchModal();
      return;
    }
    if (event.key === "Escape") {
      document.querySelector(".selection-toolbar")?.remove();
      if (document.querySelector(".modal-backdrop")) closeModal();
      else if (state.aiOpen) {
        state.aiOpen = false;
        state.aiMessages = [];
        renderApp();
      }
    }
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target.matches(".note-card[data-action='open-note']")
    ) {
      event.preventDefault();
      navigate(`notes/${event.target.dataset.id}`);
    }
  });

  document.addEventListener("mousedown", (event) => {
    if (
      !event.target.closest(".selection-toolbar") &&
      !event.target.closest("#editor-content")
    ) {
      document.querySelector(".selection-toolbar")?.remove();
    }
  });

  window.addEventListener("popstate", renderApp);
  window.addEventListener("hashchange", renderApp);

  window.addEventListener("beforeunload", () => {
    if (saveTimer) saveState();
  });

  window.addEventListener("error", (event) => {
    console.error("Unhandled website error:", event.error || event.message);
    showToast("页面遇到异常，已保留当前学习数据。可在设置中运行功能自检。");
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    showToast("操作暂时无法完成，请稍后重试。");
  });

  async function bootstrap() {
    let mainVocabulary = [];
    let businessVocabulary = [];
    let automotive = [];
    try {
      mainVocabulary = await window.ENGLISH_BUDDY_VOCABULARY_READY;
    } catch (error) {
      console.error("Vocabulary data failed to load:", error);
      showToast(
        "完整词库暂时无法加载，已进入基础词库模式。刷新页面可重试。",
      );
    }
    try {
      businessVocabulary =
        await window.ENGLISH_BUDDY_BUSINESS_LIBRARY_READY;
    } catch (error) {
      console.error("Business vocabulary failed to load:", error);
    }
    try {
      automotive =
        await window.ENGLISH_BUDDY_AUTOMOTIVE_VOCABULARY_READY;
    } catch (error) {
      console.error("Automotive vocabulary failed to load:", error);
    }
    businessLibrary = Array.isArray(businessVocabulary)
      ? businessVocabulary
      : [];
    BUILTIN_VOCABULARY = [
      ...mainVocabulary,
      ...businessLibrary,
      ...automotive,
    ];
    BUILTIN_WORD_IDS = new Set(
      BUILTIN_VOCABULARY.map((word) => word.id),
    );
    initializeState();
    renderApp();
  }

  bootstrap();
})();
