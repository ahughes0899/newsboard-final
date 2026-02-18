// ============================================================
// NewsBoard PWA — vanilla JS, no build step required
// ============================================================

const SOURCES_DEFAULT = [
  { id: 'bbc',        name: 'BBC News',    category: 'World News',         color: '#BB1919', icon: '🌍', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml&count=15' },
  { id: 'techcrunch', name: 'TechCrunch',  category: 'Tech & Science',     color: '#0A8F08', icon: '⚡', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F&count=15' },
  { id: 'bloomberg',  name: 'Bloomberg',   category: 'Finance & Markets',  color: '#1A56DB', icon: '📈', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.bloomberg.com%2Fheadlines%2Ftechnology%2Frss&count=15' },
];

const EXTRA_SOURCES = [
  { id: 'reuters',  name: 'Reuters',       category: 'World News',     color: '#E03E1A', icon: '📰', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.reuters.com%2Freuters%2FtopNews.rss&count=15' },
  { id: 'verge',    name: 'The Verge',     category: 'Tech & Science', color: '#7C3AED', icon: '💻', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.theverge.com%2Frss%2Findex.xml&count=15' },
  { id: 'cnbc',     name: 'CNBC',          category: 'Finance',        color: '#0066CC', icon: '💹', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.cnbc.com%2Fid%2F100003114%2Fdevice%2Frss%2Frss.html&count=15' },
  { id: 'ars',      name: 'Ars Technica',  category: 'Tech & Science', color: '#D55C00', icon: '🔬', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.arstechnica.com%2Farstechnica%2Findex&count=15' },
  { id: 'guardian', name: 'The Guardian',  category: 'World News',     color: '#1C6B3A', icon: '🗞️', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.theguardian.com%2Fworld%2Frss&count=15' },
  { id: 'wsj',      name: 'WSJ Markets',   category: 'Finance',        color: '#CC1C2E', icon: '📊', rss: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.a.dj.com%2Frss%2FRSSMarketsMain.xml&count=15' },
];

// ---- State ----
let state = {
  columns: ['bbc', 'techcrunch', 'bloomberg'],
  sources: Object.fromEntries(SOURCES_DEFAULT.map(s => [s.id, s])),
  articles: {},
  loading: {},
  errors: {},
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
    // Merge saved sources (may include custom ones)
    if (s.sources) {
      state.sources = { ...Object.fromEntries(SOURCES_DEFAULT.map(x => [x.id, x])), ...s.sources };
    }
  } catch(e) {}
}

// ---- RSS Fetching ----
async function fetchFeed(sourceId) {
  const src = state.sources[sourceId];
  if (!src || !src.rss) return;
  state.loading[sourceId] = true;
  state.errors[sourceId] = null;
  render();
  try {
    const res = await fetch(src.rss);
    const data = await res.json();
    if (data.status === 'ok' && data.items) {
      state.articles[sourceId] = data.items.map((item, i) => ({
        id: i,
        title: item.title || 'Untitled',
        summary: item.description ? item.description.replace(/<[^>]+>/g, '').slice(0, 140) + '…' : '',
        time: timeAgo(new Date(item.pubDate)),
        url: item.link || '#',
      }));
    } else {
      state.errors[sourceId] = 'Could not load feed';
      state.articles[sourceId] = [];
    }
  } catch(e) {
    state.errors[sourceId] = 'Network error';
    state.articles[sourceId] = [];
  }
  state.loading[sourceId] = false;
  render();
}

function fetchAll() {
  state.refreshing = true;
  state.lastRefresh = Date.now();
  render();
  Promise.all(state.columns.map(id => fetchFeed(id))).then(() => {
    state.refreshing = false;
    render();
  });
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
      const isError = state.errors[cid];
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
          ${isLoading ? buildSkeletons() : ''}
          ${isError && !isLoading ? `<div style="padding:20px;text-align:center;color:#94a3b8;font-size:12px;">⚠️ ${isError}<br><button data-retry="${cid}" style="margin-top:8px;font-size:11px;background:#f1f5f9;border:none;border-radius:8px;padding:5px 12px;cursor:pointer;color:#64748b;">Retry</button></div>` : ''}
          ${!isLoading && !isError && arts.length === 0 ? `<div style="padding:30px;text-align:center;color:#94a3b8;font-size:12px;">No articles yet</div>` : ''}
          ${!isLoading ? arts.map(a => buildArticleCard(a, cid, src.color)).join('') : ''}
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
      {label:'Push Notifications', desc:'Breaking news alerts', icon:'🔔', key:'notifs', def:true},
      {label:'Auto-Refresh', desc:'Every 15 minutes', icon:'🔄', key:'autorefresh', def:true},
      {label:'Open links in app', desc:'Stay within NewsBoard', icon:'🔗', key:'inapp', def:false},
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

    <p style="font-size:10px;color:#64748b;text-align:center;margin-top:16px;">NewsBoard v1.0 · Personal Edition</p>
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
  const available = [...EXTRA_SOURCES, ...SOURCES_DEFAULT].filter(s => !state.columns.includes(s.id));
  return `
  <div id="modal-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:50;display:flex;align-items:flex-end;backdrop-filter:blur(4px);">
    <div style="background:white;border-radius:20px 20px 0 0;width:100%;padding:20px 16px 32px;max-height:75%;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:16px;font-weight:800;color:#0f172a;">Add News Source</span>
        <button id="btn-close-modal" style="font-size:22px;background:none;border:none;cursor:pointer;color:#94a3b8;line-height:1;">×</button>
      </div>
      <p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Suggested Sources</p>
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
      <p style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:14px 0 8px;">Custom RSS Feed</p>
      <div style="display:flex;gap:8px;">
        <input id="custom-rss-input" placeholder="https://example.com/feed.xml"
          style="flex:1;font-size:12px;border:1px solid #e2e8f0;border-radius:10px;padding:9px 12px;color:#0f172a;outline:none;background:white;-webkit-appearance:none;" />
        <button id="btn-add-custom" style="background:#2563eb;color:white;border:none;border-radius:10px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;">Add</button>
      </div>
    </div>
  </div>`;
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- Events ----
function attachEvents() {
  // Header buttons
  document.getElementById('btn-search')?.addEventListener('click', () => {
    state.showSearch = !state.showSearch;
    if (!state.showSearch) state.search = '';
    render();
    if (state.showSearch) document.getElementById('search-input')?.focus();
  });
  document.getElementById('btn-refresh')?.addEventListener('click', fetchAll);
  document.getElementById('btn-add')?.addEventListener('click', () => { state.showAdd = true; render(); });
  document.getElementById('btn-add2')?.addEventListener('click', () => { state.showAdd = true; render(); });
  document.getElementById('btn-add3')?.addEventListener('click', () => { state.showAdd = true; render(); });

  // Search
  document.getElementById('search-input')?.addEventListener('input', e => {
    state.search = e.target.value;
    render();
    document.getElementById('search-input')?.focus();
  });

  // Tabs
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.addEventListener('click', () => { state.tab = el.dataset.tab; render(); });
  });

  // Column collapse
  document.querySelectorAll('[data-collapse]').forEach(el => {
    el.addEventListener('click', () => {
      const cid = el.dataset.collapse;
      state.collapsed[cid] = !state.collapsed[cid];
      saveState(); render();
    });
  });

  // Reorder (home)
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

  // Settings reorder/remove
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

  // Save articles
  document.querySelectorAll('[data-save]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const key = el.dataset.save;
      state.saved[key] = !state.saved[key];
      saveState(); render();
    });
  });

  // Retry
  document.querySelectorAll('[data-retry]').forEach(el => {
    el.addEventListener('click', () => fetchFeed(el.dataset.retry));
  });

  // Prefs toggles
  document.querySelectorAll('[data-pref]').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.pref;
      const cur = localStorage.getItem('pref_'+key);
      const val = cur === null ? false : cur !== 'true';
      localStorage.setItem('pref_'+key, val);
      render();
    });
  });

  // Modal
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
        fetchFeed(sid);
      }
    });
  });

  document.getElementById('btn-add-custom')?.addEventListener('click', () => {
    const input = document.getElementById('custom-rss-input');
    const url = input?.value?.trim();
    if (!url) return;
    const id = 'custom_' + Date.now();
    const hostname = url.replace(/https?:\/\//, '').split('/')[0];
    const src = {
      id, name: hostname, category: 'Custom', color: '#7c3aed', icon: '📄',
      rss: `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=15`
    };
    state.sources[id] = src;
    state.columns.push(id);
    saveState();
    state.showAdd = false;
    render();
    fetchFeed(id);
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

// ---- Auto refresh every 15 min ----
setInterval(() => {
  const autoRefresh = localStorage.getItem('pref_autorefresh');
  if (autoRefresh === null || autoRefresh === 'true') fetchAll();
}, 15 * 60 * 1000);

// ---- Boot ----
loadState();
render();
fetchAll();
