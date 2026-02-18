// ============================================================
// NewsBoard PWA — With sample news data
// ============================================================

const SOURCES_DEFAULT = [
  { id: 'bbc',        name: 'BBC News',    category: 'World News',         color: '#BB1919', icon: '🌍' },
  { id: 'techcrunch', name: 'TechCrunch',  category: 'Tech & Science',     color: '#0A8F08', icon: '⚡' },
  { id: 'bloomberg',  name: 'Bloomberg',   category: 'Finance & Markets',  color: '#1A56DB', icon: '📈' },
];

const EXTRA_SOURCES = [
  { id: 'reuters',    name: 'Reuters',       category: 'World News',     color: '#E03E1A', icon: '📰' },
  { id: 'verge',      name: 'The Verge',     category: 'Tech & Science', color: '#7C3AED', icon: '💻' },
  { id: 'ars',        name: 'Ars Technica',  category: 'Tech & Science', color: '#D55C00', icon: '🔬' },
  { id: 'hackernews', name: 'Hacker News',   category: 'Tech & Science', color: '#FF6600', icon: '💡' },
  { id: 'wired',      name: 'WIRED',         category: 'Tech & Science', color: '#000000', icon: '🔌' },
];

// Sample news articles
const SAMPLE_ARTICLES = {
  bbc: [
    { title: 'Global Climate Summit Reaches Historic Agreement', summary: 'World leaders have agreed to accelerate carbon reduction targets, marking a significant shift in international climate policy ahead of the 2030 deadline.', url: 'https://www.bbc.com/news' },
    { title: 'Economic Recovery Shows Stronger Than Expected Growth', summary: 'Latest quarterly data reveals major economies are growing faster than predicted, with employment rates reaching pre-pandemic levels in several nations.', url: 'https://www.bbc.com/news' },
    { title: 'New Medical Breakthrough in Cancer Treatment', summary: 'Researchers announce promising results from Phase III clinical trials using a novel immunotherapy approach, showing significant improvement in patient outcomes.', url: 'https://www.bbc.com/news' },
    { title: 'Space Agency Announces Plans for Lunar Base', summary: 'International space agencies unveil collaborative plans to establish a permanent human presence on the Moon by 2030, with initial construction set to begin next year.', url: 'https://www.bbc.com/news' },
    { title: 'Education Reform Passes in Major Countries', summary: 'Sweeping changes to educational systems approved across multiple nations, focusing on digital literacy and climate science in core curricula.', url: 'https://www.bbc.com/news' },
  ],
  techcrunch: [
    { title: 'AI Startup Secures $150M Series B Funding', summary: 'The machine learning company plans to expand its enterprise platform to new markets, focusing on healthcare and financial services automation.', url: 'https://techcrunch.com' },
    { title: 'Apple Unveils Next-Generation Chip Architecture', summary: 'Tech giant reveals groundbreaking processor design promising 40% performance improvement while reducing power consumption by 30%.', url: 'https://techcrunch.com' },
    { title: 'Quantum Computing Breakthrough Achieved', summary: 'Scientists demonstrate quantum advantage in practical applications, bringing the technology closer to commercial viability for complex problem-solving.', url: 'https://techcrunch.com' },
    { title: 'Electric Vehicle Sales Surge Past Expectations', summary: 'Industry data shows EV adoption accelerating globally, with new models and improved charging infrastructure driving consumer confidence.', url: 'https://techcrunch.com' },
    { title: 'Cybersecurity Firm Exposes Major Vulnerability', summary: 'Security researchers discover critical flaw affecting millions of devices, prompting urgent patch releases from major manufacturers.', url: 'https://techcrunch.com' },
  ],
  bloomberg: [
    { title: 'Markets Rally on Strong Corporate Earnings', summary: 'Major indices climb to new highs as S&P 500 companies report quarterly results exceeding analyst expectations across multiple sectors.', url: 'https://www.bloomberg.com' },
    { title: 'Federal Reserve Hints at Policy Adjustment', summary: 'Central bank officials signal potential changes to monetary policy in upcoming meetings, citing improved economic indicators and inflation trends.', url: 'https://www.bloomberg.com' },
    { title: 'Cryptocurrency Market Cap Reaches New Milestone', summary: 'Digital asset markets surge following institutional adoption announcements, with Bitcoin and Ethereum leading gains amid regulatory clarity.', url: 'https://www.bloomberg.com' },
    { title: 'Oil Prices Stabilize After OPEC+ Decision', summary: 'Energy markets respond to production agreement, with crude oil finding support around key technical levels as supply concerns ease.', url: 'https://www.bloomberg.com' },
    { title: 'Tech Giants Announce Major Acquisitions', summary: 'Industry consolidation continues as leading technology companies pursue strategic deals, with several multi-billion dollar transactions announced this week.', url: 'https://www.bloomberg.com' },
  ],
  reuters: [
    { title: 'International Trade Agreement Signed', summary: 'Major economies formalize new trade pact expected to boost cross-border commerce and reduce tariff barriers across key industries.', url: 'https://www.reuters.com' },
    { title: 'Renewable Energy Investment Hits Record High', summary: 'Global spending on clean energy projects reaches unprecedented levels, with solar and wind installations outpacing fossil fuel investments.', url: 'https://www.reuters.com' },
    { title: 'UN Security Council Addresses Regional Tensions', summary: 'Members convene emergency session to discuss diplomatic solutions, emphasizing international cooperation and conflict prevention.', url: 'https://www.reuters.com' },
  ],
  verge: [
    { title: 'New Gaming Console Generation Announced', summary: 'Major platform holders reveal next-gen hardware featuring advanced ray tracing, AI-powered graphics, and backwards compatibility.', url: 'https://www.theverge.com' },
    { title: 'Streaming Service Launches Ad-Free Premium Tier', summary: 'Popular platform introduces enhanced subscription option with exclusive content and higher quality streams to compete in crowded market.', url: 'https://www.theverge.com' },
    { title: 'Smartphone Manufacturer Unveils Foldable Display', summary: 'Latest innovation showcases improved durability and larger screen real estate, addressing previous generation concerns.', url: 'https://www.theverge.com' },
  ],
  ars: [
    { title: 'New Programming Language Gains Developer Adoption', summary: 'Open-source language designed for systems programming shows promise with memory safety features and performance benchmarks.', url: 'https://arstechnica.com' },
    { title: 'Researchers Achieve Fusion Energy Breakthrough', summary: 'Experimental reactor demonstrates net energy gain for sustained period, marking significant milestone toward commercial fusion power.', url: 'https://arstechnica.com' },
    { title: 'Privacy-Focused Browser Updates Tracking Protection', summary: 'Latest release includes enhanced anti-fingerprinting technology and improved defenses against third-party tracking mechanisms.', url: 'https://arstechnica.com' },
  ],
  hackernews: [
    { title: 'Show HN: Open Source Alternative to Popular SaaS', summary: 'Community-driven project offers self-hosted solution with feature parity, gaining traction among privacy-conscious users.', url: 'https://news.ycombinator.com' },
    { title: 'Analysis: The State of Web Performance in 2026', summary: 'Comprehensive study reveals trends in page load times, framework choices, and optimization techniques across top websites.', url: 'https://news.ycombinator.com' },
    { title: 'Ask HN: Best Practices for Remote Team Management', summary: 'Discussion thread explores effective strategies for distributed teams, covering communication tools and productivity metrics.', url: 'https://news.ycombinator.com' },
  ],
  wired: [
    { title: 'The Future of Urban Mobility: A Deep Dive', summary: 'Investigation into emerging transportation technologies reshaping cities, from autonomous vehicles to hyperloop systems.', url: 'https://www.wired.com' },
    { title: 'Social Media Platforms Face New Regulations', summary: 'Governments worldwide introduce legislation targeting content moderation, data privacy, and algorithmic transparency.', url: 'https://www.wired.com' },
    { title: 'Inside the Race to Build Humanoid Robots', summary: 'Profile of companies developing advanced robotics for manufacturing, healthcare, and consumer applications.', url: 'https://www.wired.com' },
  ],
};

// ---- State ----
let state = {
  columns: ['bbc', 'techcrunch', 'bloomberg'],
  sources: Object.fromEntries(SOURCES_DEFAULT.map(s => [s.id, s])),
  articles: {},
  loading: {},
  saved: {},
  collapsed: {},
  tab: 'home',
  search: '',
  showSearch: false,
  showAdd: false,
  lastRefresh: Date.now(),
  refreshing: false,
};

// ---- Persistence ----
function saveState() {
  try {
    localStorage.setItem('newsboard_state', JSON.stringify({
      columns: state.columns,
      sources: state.sources,
      saved: state.saved,
      collapsed: state.collapsed,
    }));
  } catch(e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('newsboard_state');
    if (!raw) return;
    const s = JSON.parse(raw);
    state.columns = s.columns || state.columns;
    state.saved = s.saved || {};
    state.collapsed = s.collapsed || {};
    if (s.sources) {
      state.sources = { ...Object.fromEntries(SOURCES_DEFAULT.map(x => [x.id, x])), ...s.sources };
    }
  } catch(e) {}
}

// ---- Load sample articles ----
function loadArticles(sourceId) {
  const src = state.sources[sourceId];
  if (!src) return;
  
  state.loading[sourceId] = true;
  render();
  
  // Simulate loading delay
  setTimeout(() => {
    const sampleArts = SAMPLE_ARTICLES[sourceId] || SAMPLE_ARTICLES.bbc.slice(0, 3);
    const now = Date.now();
    
    state.articles[sourceId] = sampleArts.map((art, i) => ({
      id: i,
      title: art.title,
      summary: art.summary,
      time: timeAgo(new Date(now - i * 1200000)), // Stagger by 20 min
      url: art.url,
    }));
    
    state.loading[sourceId] = false;
    render();
  }, 500); // Half second delay to show loading state
}

function loadAll() {
  state.refreshing = true;
  state.lastRefresh = Date.now();
  render();
  
  state.columns.forEach(id => loadArticles(id));
  
  setTimeout(() => {
    state.refreshing = false;
    render();
  }, 800);
}

function timeAgo(date) {
  if (isNaN(date)) return '';
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function lastRefreshText() {
  const diff = Math.floor((Date.now() - state.lastRefresh) / 1000);
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff/60)}m ago`;
}

// ---- Render ----
function render() {
  const app = document.getElementById('app');
  app.innerHTML = buildHTML();
  attachEvents();
}

function buildHTML() {
  const savedCount = Object.values(state.saved).filter(Boolean).length;
  return `
<div style="height:100%;display:flex;flex-direction:column;background:#0f172a;max-width:430px;margin:0 auto;position:relative;">

  <!-- Status bar safe area -->
  <div style="height:env(safe-area-inset-top,44px);background:#0f172a;flex-shrink:0;"></div>

  <!-- Header -->
  <div style="background:#0f172a;padding:8px 16px 10px;flex-shrink:0;">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:24px;font-weight:900;color:#f8fafc;letter-spacing:-0.5px;">NewsBoard</div>
        <div style="font-size:10px;color:#64748b;margin-top:1px;">Updated ${lastRefreshText()}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button id="btn-search" style="${iconBtnStyle('#1e293b')}">🔍</button>
        <button id="btn-refresh" style="${iconBtnStyle('#1e293b')} ${state.refreshing ? 'animation:spin 0.8s linear infinite;' : ''}">↻</button>
        <button id="btn-add" style="${iconBtnStyle('#2563eb', true)}">+</button>
      </div>
    </div>
    ${state.showSearch ? `
    <div style="margin-top:10px;">
      <input id="search-input" value="${escHtml(state.search)}" placeholder="Search all articles…"
        style="width:100%;font-size:14px;background:#1e293b;border:none;border-radius:12px;padding:10px 14px;color:#f8fafc;outline:none;-webkit-appearance:none;"
        autocomplete="off" />
    </div>` : ''}
  </div>

  <!-- Search overlay -->
  ${state.showSearch && state.search ? buildSearchResults() : ''}

  <!-- Tab content -->
  <div style="flex:1;overflow:hidden;background:#f8fafc;border-radius:20px 20px 0 0;display:flex;flex-direction:column;">
    ${state.tab === 'home' ? buildHomeTab() : ''}
    ${state.tab === 'saved' ? buildSavedTab() : ''}
    ${state.tab === 'settings' ? buildSettingsTab() : ''}
  </div>

  <!-- Bottom nav -->
  <div style="background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;flex-shrink:0;padding-bottom:env(safe-area-inset-bottom,16px);">
    ${[
      {id:'home', icon:'📰', label:'Feed'},
      {id:'saved', icon:'🔖', label:'Saved', badge: savedCount},
      {id:'settings', icon:'⚙️', label:'Manage'},
    ].map(t => `
    <button data-tab="${t.id}" style="flex:1;display:flex;flex-direction:column;align-items:center;padding:10px 0 6px;background:none;border:none;cursor:pointer;position:relative;">
      <span style="font-size:20px;">${t.icon}</span>
      <span style="font-size:10px;font-weight:600;color:${state.tab===t.id?'#2563eb':'#94a3b8'};margin-top:3px;">${t.label}</span>
      ${t.badge ? `<span style="position:absolute;top:7px;right:22%;background:#ef4444;color:white;font-size:9px;font-weight:700;border-radius:10px;padding:1px 5px;">${t.badge}</span>` : ''}
      ${state.tab===t.id ? `<div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:24px;height:3px;background:#2563eb;border-radius:2px;"></div>` : ''}
    </button>`).join('')}
  </div>

  <!-- Add modal -->
  ${state.showAdd ? buildAddModal() : ''}
</div>
`;
}

function iconBtnStyle(bg, primary=false) {
  return `width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;background:${bg};font-size:${primary?'20px':'15px'};color:${primary?'white':'#94a3b8'};font-weight:${primary?'700':'400'};display:inline-flex;align-items:center;justify-content:center;box-shadow:${primary?'0 2px 8px rgba(37,99,235,0.4)':'none'};`;
}

function buildHomeTab() {
  if (state.columns.length === 0) return `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#94a3b8;">
      <div style="font-size:52px;">📰</div>
      <div style="font-size:15px;font-weight:600;">No sources added</div>
      <button id="btn-add2" style="background:#2563eb;color:white;border:none;border-radius:14px;padding:10px 22px;font-size:14px;font-weight:600;cursor:pointer;">Add a source</button>
    </div>`;

  const colWidth = state.columns.length === 1 ? '100%' : state.columns.length === 2 ? '50%' : '55%';

  return `
  <div style="display:flex;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
    ${state.columns.map((cid, idx) => {
      const src = state.sources[cid];
      if (!src) return '';
      const arts = state.articles[cid] || [];
      const isLoading = state.loading[cid];
      const isCollapsed = state.collapsed[cid];

      return `
      <div style="flex-shrink:0;width:${colWidth};scroll-snap-align:start;display:flex;flex-direction:column;border-right:1px solid #e2e8f0;background:white;">
        <!-- Column header -->
        <div style="padding:10px 12px;border-bottom:2px solid ${src.color};background:${src.color}12;display:flex;align-items:center;gap:7px;flex-shrink:0;position:sticky;top:0;z-index:5;">
          <span style="font-size:17px;">${src.icon}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:12px;font-weight:800;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(src.name)}</div>
            <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">${escHtml(src.category)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="background:${src.color};color:white;font-size:9px;font-weight:700;padding:2px 6px;border-radius:20px;">${arts.length}</span>
            <button data-collapse="${cid}" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:13px;padding:2px 4px;">${isCollapsed ? '▸' : '▾'}</button>
          </div>
        </div>
        <!-- Reorder bar -->
        <div style="display:flex;align-items:center;padding:3px 8px;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0;">
          <button data-move-left="${idx}" ${idx===0?'disabled':''} style="font-size:11px;background:none;border:none;cursor:pointer;color:${idx===0?'#e2e8f0':'#94a3b8'};padding:2px 5px;">←</button>
          <button data-move-right="${idx}" ${idx===state.columns.length-1?'disabled':''} style="font-size:11px;background:none;border:none;cursor:pointer;color:${idx===state.columns.length-1?'#e2e8f0':'#94a3b8'};padding:2px 5px;">→</button>
          <div style="flex:1;"></div>
          <button data-remove="${cid}" style="font-size:10px;background:none;border:none;cursor:pointer;color:#fca5a5;padding:2px 4px;">✕</button>
        </div>
        <!-- Articles -->
        ${!isCollapsed ? `
        <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;">
          ${isLoading ? buildSkeletons() : arts.map(a => buildArticleCard(a, cid, src.color)).join('')}
        </div>` : `
        <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;color:#cbd5e1;">
          <span style="font-size:28px;">${src.icon}</span>
          <span style="font-size:10px;">Collapsed</span>
        </div>`}
      </div>`;
    }).join('')}
  </div>`;
}

function buildArticleCard(article, sourceId, color) {
  const isSaved = !!state.saved[`${sourceId}-${article.id}`];
  return `
  <a href="${escHtml(article.url)}" target="_blank" rel="noopener"
     style="display:block;padding:12px 14px;border-bottom:1px solid #f0f0f0;text-decoration:none;background:white;-webkit-touch-callout:none;">
    <div style="display:flex;align-items:flex-start;gap:8px;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:12.5px;font-weight:600;color:#0f172a;line-height:1.4;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(article.title)}</p>
        <p style="font-size:11px;color:#94a3b8;line-height:1.4;margin:0 0 5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escHtml(article.summary)}</p>
        <span style="font-size:10px;color:#cbd5e1;">${escHtml(article.time)}</span>
      </div>
      <button data-save="${sourceId}-${article.id}"
        onclick="event.preventDefault();event.stopPropagation();"
        style="flex-shrink:0;background:none;border:none;cursor:pointer;font-size:15px;color:${isSaved ? color : '#cbd5e1'};padding:2px;margin-top:1px;transition:color 0.2s;">🔖</button>
    </div>
  </a>`;
}

function buildSkeletons() {
  return Array(5).fill(0).map(() => `
  <div style="padding:14px 16px;border-bottom:1px solid #f0f0f0;">
    <div style="height:12px;background:#e8e8e8;border-radius:6px;width:100%;margin-bottom:6px;animation:pulse 1.5s ease-in-out infinite;"></div>
    <div style="height:11px;background:#e8e8e8;border-radius:6px;width:75%;margin-bottom:6px;animation:pulse 1.5s ease-in-out infinite;"></div>
    <div style="height:10px;background:#efefef;border-radius:6px;width:30%;animation:pulse 1.5s ease-in-out infinite;"></div>
  </div>`).join('');
}

function buildSavedTab() {
  const items = Object.entries(state.saved).filter(([,v])=>v).map(([k]) => {
    const [sid, aid] = k.split('-');
    const arts = state.articles[sid] || [];
    const art = arts.find(a => a.id === parseInt(aid));
    const src = state.sources[sid];
    return art && src ? {article: art, source: src} : null;
  }).filter(Boolean);

  return `
  <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:white;">
    <div style="padding:10px 14px;font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #f0f0f0;">
      ${items.length} Saved Article${items.length !== 1 ? 's' : ''}
    </div>
    ${items.length === 0 ? `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 20px;color:#cbd5e1;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🔖</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:4px;">No saved articles yet</div>
      <div style="font-size:12px;">Tap the bookmark icon on any article</div>
    </div>` :
    items.map(({article, source: src}) => `
      <div style="padding:4px 14px 0;display:flex;align-items:center;gap:5px;background:white;">
        <div style="width:6px;height:6px;border-radius:50%;background:${src.color};"></div>
        <span style="font-size:10px;color:${src.color};font-weight:700;">${escHtml(src.name)}</span>
      </div>
      ${buildArticleCard(article, src.id, src.color)}
    `).join('')}
  </div>`;
}

function buildSettingsTab() {
  return `
  <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#f8fafc;padding:14px;">
    <p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Active Columns</p>
    ${state.columns.map((cid, idx) => {
      const src = state.sources[cid];
      if (!src) return '';
      return `
      <div style="display:flex;align-items:center;gap:10px;background:white;border-radius:14px;padding:11px 13px;margin-bottom:7px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="width:8px;height:8px;border-radius:50%;background:${src.color};flex-shrink:0;"></div>
        <span style="font-size:17px;">${src.icon}</span>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(src.name)}</div>
          <div style="font-size:10px;color:#94a3b8;">${escHtml(src.category)}</div>
        </div>
        <div style="display:flex;gap:2px;">
          <button data-settings-left="${idx}" ${idx===0?'disabled':''} style="font-size:12px;background:none;border:none;cursor:pointer;color:${idx===0?'#e2e8f0':'#94a3b8'};padding:3px 5px;">↑</button>
          <button data-settings-right="${idx}" ${idx===state.columns.length-1?'disabled':''} style="font-size:12px;background:none;border:none;cursor:pointer;color:${idx===state.columns.length-1?'#e2e8f0':'#94a3b8'};padding:3px 5px;">↓</button>
          <button data-settings-remove="${cid}" style="font-size:11px;background:none;border:none;cursor:pointer;color:#fca5a5;padding:3px 5px;">✕</button>
        </div>
      </div>`;
    }).join('')}
    <button id="btn-add3" style="width:100%;border:2px dashed #93c5fd;border-radius:14px;padding:11px;background:transparent;color:#3b82f6;font-size:13px;font-weight:600;cursor:pointer;margin-bottom:20px;">+ Add Source</button>

    <p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Display</p>
    ${[
      {label:'Auto-Refresh', desc:'Reload articles on app open', icon:'🔄', key:'autorefresh', def:true},
      {label:'Compact View', desc:'Show more articles at once', icon:'📋', key:'compact', def:false},
    ].map(pref => {
      const val = localStorage.getItem('pref_'+pref.key);
      const on = val === null ? pref.def : val === 'true';
      return `
      <div style="display:flex;align-items:center;gap:10px;background:white;border-radius:14px;padding:11px 13px;margin-bottom:7px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <span style="font-size:18px;">${pref.icon}</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;color:#0f172a;">${pref.label}</div>
          <div style="font-size:10px;color:#94a3b8;">${pref.desc}</div>
        </div>
        <button data-pref="${pref.key}" style="width:44px;height:26px;border-radius:13px;border:none;cursor:pointer;background:${on?'#2563eb':'#cbd5e1'};padding:0 3px;display:flex;align-items:center;transition:background 0.2s;">
          <div style="width:20px;height:20px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${on?'translateX(18px)':'translateX(0)'};"></div>
        </button>
      </div>`;
    }).join('')}

    <p style="font-size:10px;color:#64748b;text-align:center;margin-top:16px;">NewsBoard v1.0 · Sample Data Mode</p>
    <p style="font-size:9px;color:#94a3b8;text-align:center;margin-top:4px;">Articles refresh with realistic sample content</p>
  </div>`;
}

function buildSearchResults() {
  const q = state.search.toLowerCase();
  const results = state.columns.flatMap(cid => {
    const src = state.sources[cid];
    const arts = state.articles[cid] || [];
    return arts.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q))
               .map(a => ({...a, source: src, sourceId: cid}));
  });

  return `
  <div style="position:absolute;top:${state.showSearch?'115px':'0'};left:0;right:0;bottom:0;background:white;z-index:20;overflow-y:auto;-webkit-overflow-scrolling:touch;">
    <div style="padding:8px 14px;font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #f0f0f0;">
      ${results.length} result${results.length!==1?'s':''} for "${escHtml(state.search)}"
    </div>
    ${results.length === 0 ? `<div style="text-align:center;padding:50px;color:#94a3b8;"><div style="font-size:40px;margin-bottom:10px;">🔍</div><div style="font-size:13px;">No articles found</div></div>` :
    results.map(a => `
      <div style="padding:4px 14px 0;background:white;">
        <div style="display:flex;align-items:center;gap:4px;">
          <div style="width:6px;height:6px;border-radius:50%;background:${a.source.color};"></div>
          <span style="font-size:10px;color:${a.source.color};font-weight:700;">${escHtml(a.source.name)}</span>
        </div>
      </div>
      ${buildArticleCard(a, a.sourceId, a.source.color)}
    `).join('')}
  </div>`;
}

function buildAddModal() {
  const available = [...EXTRA_SOURCES].filter(s => !state.columns.includes(s.id));
  return `
  <div id="modal-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:50;display:flex;align-items:flex-end;backdrop-filter:blur(4px);">
    <div style="background:white;border-radius:20px 20px 0 0;width:100%;padding:20px 16px 32px;max-height:75%;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:16px;font-weight:800;color:#0f172a;">Add News Source</span>
        <button id="btn-close-modal" style="font-size:22px;background:none;border:none;cursor:pointer;color:#94a3b8;line-height:1;">×</button>
      </div>
      <p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Available Sources</p>
      ${available.map(s => `
      <button data-add-source="${s.id}" style="width:100%;display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:6px;background:white;cursor:pointer;text-align:left;">
        <span style="font-size:19px;">${s.icon}</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:700;color:#0f172a;">${escHtml(s.name)}</div>
          <div style="font-size:10px;color:#94a3b8;">${escHtml(s.category)}</div>
        </div>
        <span style="color:#2563eb;font-weight:700;font-size:18px;">+</span>
      </button>`).join('')}
      ${available.length === 0 ? `<p style="text-align:center;color:#94a3b8;font-size:13px;padding:10px;">All available sources added!</p>` : ''}
      
      <p style="font-size:9px;color:#94a3b8;text-align:center;margin-top:14px;font-style:italic;">Sample data mode - articles are generated for demonstration</p>
    </div>
  </div>`;
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- Events ----
function attachEvents() {
  document.getElementById('btn-search')?.addEventListener('click', () => {
    state.showSearch = !state.showSearch;
    if (!state.showSearch) state.search = '';
    render();
    if (state.showSearch) document.getElementById('search-input')?.focus();
  });
  document.getElementById('btn-refresh')?.addEventListener('click', loadAll);
  document.getElementById('btn-add')?.addEventListener('click', () => { state.showAdd = true; render(); });
  document.getElementById('btn-add2')?.addEventListener('click', () => { state.showAdd = true; render(); });
  document.getElementById('btn-add3')?.addEventListener('click', () => { state.showAdd = true; render(); });

  document.getElementById('search-input')?.addEventListener('input', e => {
    state.search = e.target.value;
    render();
    document.getElementById('search-input')?.focus();
  });

  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', () => { state.tab = el.dataset.tab; render(); });
  });

  document.querySelectorAll('[data-collapse]').forEach(el => {
    el.addEventListener('click', () => {
      const cid = el.dataset.collapse;
      state.collapsed[cid] = !state.collapsed[cid];
      saveState(); render();
    });
  });

  document.querySelectorAll('[data-move-left]').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.moveLeft);
      if (i > 0) { const a=[...state.columns]; [a[i-1],a[i]]=[a[i],a[i-1]]; state.columns=a; saveState(); render(); }
    });
  });
  document.querySelectorAll('[data-move-right]').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.moveRight);
      if (i < state.columns.length-1) { const a=[...state.columns]; [a[i],a[i+1]]=[a[i+1],a[i]]; state.columns=a; saveState(); render(); }
    });
  });
  document.querySelectorAll('[data-remove]').forEach(el => {
    el.addEventListener('click', () => {
      state.columns = state.columns.filter(c => c !== el.dataset.remove);
      saveState(); render();
    });
  });

  document.querySelectorAll('[data-settings-left]').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.settingsLeft);
      if (i > 0) { const a=[...state.columns]; [a[i-1],a[i]]=[a[i],a[i-1]]; state.columns=a; saveState(); render(); }
    });
  });
  document.querySelectorAll('[data-settings-right]').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.settingsRight);
      if (i < state.columns.length-1) { const a=[...state.columns]; [a[i],a[i+1]]=[a[i+1],a[i]]; state.columns=a; saveState(); render(); }
    });
  });
  document.querySelectorAll('[data-settings-remove]').forEach(el => {
    el.addEventListener('click', () => {
      state.columns = state.columns.filter(c => c !== el.dataset.settingsRemove);
      saveState(); render();
    });
  });

  document.querySelectorAll('[data-save]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const key = el.dataset.save;
      state.saved[key] = !state.saved[key];
      saveState(); render();
    });
  });

  document.querySelectorAll('[data-pref]').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.pref;
      const cur = localStorage.getItem('pref_'+key);
      const val = cur === null ? false : cur !== 'true';
      localStorage.setItem('pref_'+key, val);
      render();
    });
  });

  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') { state.showAdd = false; render(); }
  });
  document.getElementById('btn-close-modal')?.addEventListener('click', () => { state.showAdd = false; render(); });

  document.querySelectorAll('[data-add-source]').forEach(el => {
    el.addEventListener('click', () => {
      const sid = el.dataset.addSource;
      const src = [...EXTRA_SOURCES, ...SOURCES_DEFAULT].find(s => s.id === sid);
      if (src && !state.columns.includes(sid)) {
        state.sources[sid] = src;
        state.columns.push(sid);
        saveState();
        state.showAdd = false;
        render();
        loadArticles(sid);
      }
    });
  });
}

// ---- CSS animations ----
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes spin { to{transform:rotate(360deg)} }
  ::-webkit-scrollbar { display: none; }
  * { -webkit-tap-highlight-color: transparent; }
  a { -webkit-user-select: none; user-select: none; }
`;
document.head.appendChild(style);

// ---- Service Worker ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ---- Boot ----
loadState();
render();
loadAll();
