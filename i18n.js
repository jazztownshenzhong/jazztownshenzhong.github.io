/**
 * JazzTown 全站中英文双语切换引擎 (i18n)
 * 支持右上角 中文 / EN 一键切换，localStorage 持久化记忆
 */
(function () {
  const STORAGE_KEY = 'jazztown_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'zh';

  // 1. 注入右上角语言切换按钮样式
  const style = document.createElement('style');
  style.textContent = `
    .nav-lang-item {
      display: flex;
      align-items: center;
      margin-left: 8px;
    }
    .lang-switch-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(13, 27, 61, 0.75);
      border: 1px solid rgba(157, 184, 232, 0.35);
      border-radius: 20px;
      padding: 5px 12px;
      color: #c9d9f6;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.22s ease;
      font-family: inherit;
      letter-spacing: 0.04em;
    }
    .lang-switch-btn:hover {
      border-color: #ffcc66;
      color: #ffffff;
      background: rgba(22, 40, 80, 0.9);
      box-shadow: 0 2px 12px rgba(255, 204, 102, 0.2);
    }
    .lang-switch-btn .lang-opt {
      opacity: 0.55;
      transition: opacity 0.2s, color 0.2s;
    }
    .lang-switch-btn .lang-opt.active {
      opacity: 1;
      color: #ffcc66;
    }
    .lang-switch-btn .lang-sep {
      opacity: 0.35;
      font-weight: 400;
    }
    @media (max-width: 768px) {
      .nav-lang-item {
        margin-left: 0;
        margin-top: 12px;
      }
      .lang-switch-btn {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
    /* 英文模式下隐藏纯中文流派介绍框，保留 English 框 */
    body.lang-en .lang-box.wenyan,
    body.lang-en .lang-box.modern {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // 2. 全站双语字典
  const DICT = {
    // 导航栏
    'nav.vision_intro': { zh: '社团愿景与介绍', en: 'Vision & Intro' },
    'nav.vision': { zh: '社团愿景', en: 'Club Vision' },
    'nav.intro': { zh: '社团介绍', en: 'About Us' },
    'nav.classes': { zh: '社课记录', en: 'Club Classes' },
    'nav.study': { zh: '爵士乐学习', en: 'Jazz Study' },
    'nav.shares': { zh: '爵士乐内容分享', en: 'Jazz Shares' },
    'nav.genres': { zh: '爵士乐流派知识学习', en: 'Genres & History' },
    'nav.theory': { zh: '互动爵士乐理速查', en: 'Theory Lab' },
    'nav.lore': { zh: '黑话、轶事与标准曲', en: 'Lore & Standards' },

    // 首页 index.html
    'home.badge': { zh: '深圳中学 · SHENZHEN MIDDLE SCHOOL', en: 'SHENZHEN MIDDLE SCHOOL · JAZZ CLUB' },
    'home.title': { zh: '深圳中学 JazzTown 爵士乐俱乐部', en: 'Shenzhen Middle School JazzTown Club' },
    'home.subtitle': {
      zh: '在切分与即兴之间，寻找自由与灵魂的共鸣。',
      en: 'Finding freedom and soulful resonance between syncopation and improvisation.'
    },
    'home.cta_vision': { zh: '探索社团愿景', en: 'Explore Our Vision' },
    'home.cta_study': { zh: '进入爵士学习', en: 'Start Learning Jazz' },

    // 社团愿景 vision.html
    'vision.title': { zh: '社团愿景', en: 'Club Vision' },
    'vision.sub': { zh: 'OUR VISION & PHILOSOPHY', en: 'OUR VISION & PHILOSOPHY' },

    // 社团介绍 intro.html
    'intro.title': { zh: '社团介绍', en: 'About JazzTown' },
    'intro.overview_title': { zh: '社团概况', en: 'Club Overview' },
    'intro.members_title': { zh: '人员介绍', en: 'Club Members' },

    // 社课记录 classes.html
    'classes.title': { zh: '社课记录', en: 'Club Classes & Archives' },

    // 内容分享 shares.html
    'shares.title': { zh: '爵士乐内容分享', en: 'Jazz Music & Artist Profiles' },

    // 流派学习 genres.html
    'genres.title': { zh: '爵士乐流派知识学习', en: 'Jazz Genres, Theory & Culture' },
    'genres.qnav1': { zh: '专栏一：爵士大师志', en: '1. Musician Profiles' },
    'genres.qnav2': { zh: '专栏二：主流爵士乐流派简介', en: '2. Mainstream Genres' },
    'genres.qnav3': { zh: '专栏三：小流派爵士乐', en: '3. Sub-genres' },
    'genres.qnav4': { zh: '专栏四：爵士乐影响', en: '4. Jazz Influences' },
    'genres.qnav5': { zh: '专栏五：互动爵士乐理速查卡', en: '5. Interactive Theory Lab' },
    'genres.qnav6': { zh: '专栏六：黑话、轶事与标准曲', en: '6. Lore, Jargon & Standards' },

    'genres.col1_title': { zh: '专栏一：爵士大师志 (Musician Profiles)', en: 'Column 1: Jazz Musician Profiles' },
    'genres.col2_title': { zh: '专栏二：主流爵士乐流派简介 (Mainstream Jazz Genres)', en: 'Column 2: Mainstream Jazz Genres' },
    'genres.col3_title': { zh: '专栏三：小流派爵士乐 (Jazz Sub-genres & Crossovers)', en: 'Column 3: Jazz Sub-genres & Crossovers' },
    'genres.col4_title': { zh: '专栏四：爵士乐影响 (The Influence of Jazz)', en: 'Column 4: The Influence of Jazz' },
    'genres.col5_title': { zh: '专栏五：互动爵士乐理速查卡 (Interactive Jazz Theory Cheat Sheet)', en: 'Column 5: Interactive Jazz Theory Cheat Sheet' },
    'genres.col6_title': { zh: '专栏六：爵士黑话、大师轶事与标准曲速查指南 (Lore, Jargon & Standards)', en: 'Column 6: Jazz Lore, Jargon & Standards' },

    // 乐理速查卡 theory.html & genres.html#column-5
    'theory.title': { zh: '互动爵士乐理速查卡', en: 'Interactive Jazz Theory Cheat Sheet' },
    'theory.hero_title': { zh: '核心爵士和声 · 即兴调式与原声试听速查', en: 'Core Jazz Harmony, Modes & Live Audio Lab' },
    'theory.tab1': { zh: '🎹 核心 ii - V - I 走向速查', en: '🎹 ii - V - I Progressions' },
    'theory.tab2': { zh: '⚡ 三全音替代原理 (Tritone Sub)', en: '⚡ Tritone Substitution' },
    'theory.tab3': { zh: '🎼 爵士必修核心调式 (Modes)', en: '🎼 Essential Jazz Modes' },
    'theory.tab4': { zh: '📚 常用爵士和弦构成与引伸音', en: '📚 Jazz Chord Formulas' },
    'theory.play_251': { zh: '连续试听整个 ii - V - I 走向 (Play Progression)', en: '▶ Play Full ii - V - I Progression' },
    'theory.hint_251': { zh: '💡 提示：点击上方任意单个和弦卡片可单独试听发音', en: '💡 Tip: Click any single chord card above to audition it' },

    // 专栏六选项卡
    'lore.tab1': { zh: '🎷 1. 爵士黑话与排练场防翻车指南', en: '🎷 1. Jazz Jargon & Stage Etiquette' },
    'lore.tab2': { zh: '✨ 2. 大师奇闻轶事与随机金句录', en: '✨ 2. Legends Trivia & Random Quotes' },
    'lore.tab3': { zh: '🗺️ 3. 爵士标准曲通关雷达指南 (Standards)', en: '🗺️ 3. Jazz Standards Roadmap' }
  };

  // 3. 在导航栏右上角注入切换按钮
  function injectLangButton() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks || document.getElementById('langSwitchBtn')) return;

    const li = document.createElement('li');
    li.className = 'nav-item nav-lang-item';
    li.innerHTML = `
      <button type="button" class="lang-switch-btn" id="langSwitchBtn" aria-label="Switch Language / 切换语言">
        <span class="lang-opt" data-lang="zh">中</span>
        <span class="lang-sep">/</span>
        <span class="lang-opt" data-lang="en">EN</span>
      </button>
    `;
    navLinks.appendChild(li);

    document.getElementById('langSwitchBtn').addEventListener('click', () => {
      const nextLang = currentLang === 'zh' ? 'en' : 'zh';
      setLanguage(nextLang);
    });
  }

  // 4. 应用语言切换
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    if (lang === 'en') {
      document.body.classList.add('lang-en');
    } else {
      document.body.classList.remove('lang-en');
    }

    // 更新按钮高亮状态
    const btn = document.getElementById('langSwitchBtn');
    if (btn) {
      btn.querySelectorAll('.lang-opt').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang') === lang);
      });
    }

    // 翻译所有带有 data-i18n 的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (DICT[key] && DICT[key][lang]) {
        // 如果元素内部包含子元素（如箭头 span），只替换文本节点或使用特定处理
        const arrow = el.querySelector('.dropdown-arrow');
        if (arrow) {
          el.childNodes[0].nodeValue = DICT[key][lang] + ' ';
        } else {
          el.textContent = DICT[key][lang];
        }
      }
    });
  }

  // 5. 初始化
  function init() {
    injectLangButton();
    setLanguage(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
