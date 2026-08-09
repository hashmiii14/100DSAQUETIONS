// ─────────────────────────────────────────────────────────────────────────────
// app.js — All functionality: render, search, filter, progress, navigation
// Depends on: data.js (PROBLEMS, TOPIC_ORDER, TOPIC_IDS)
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'dsa100_v2_done';

// ── State ─────────────────────────────────────────────────────────────────────
let activeFilter = 'all';  // 'all' | 'easy' | 'medium' | 'hard' | 'done' | 'pending'
let searchQuery  = '';
let done         = new Set();

// ── Persistence ───────────────────────────────────────────────────────────────
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    done = new Set((JSON.parse(raw) || []).map(Number));
  } catch (_) { done = new Set(); }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
}

// ── Filter logic ──────────────────────────────────────────────────────────────
function getFiltered() {
  return PROBLEMS.filter(p => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.topic.toLowerCase().includes(q) &&
        !p.difficulty.toLowerCase().includes(q) &&
        !String(p.id).includes(q)
      ) return false;
    }
    // Difficulty / status filter
    switch (activeFilter) {
      case 'easy':    return p.difficulty === 'Easy';
      case 'medium':  return p.difficulty === 'Medium';
      case 'hard':    return p.difficulty === 'Hard';
      case 'done':    return done.has(p.id);
      case 'pending': return !done.has(p.id);
      default:        return true;
    }
  });
}

// ── HTML builders ─────────────────────────────────────────────────────────────
function extLinkIcon() {
  return `<svg class="ext-icon" width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
    <path fill-rule="evenodd" d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"/>
  </svg>`;
}

function buildRow(p) {
  const isDone     = done.has(p.id);
  const diffClass  = p.difficulty.toLowerCase();
  const numStr     = String(p.id).padStart(2, '0');
  return `<tr class="q-row${isDone ? ' row-done' : ''}" data-id="${p.id}">
    <td class="col-num">${numStr}</td>
    <td class="col-problem">
      <a class="q-link" href="${p.url}" target="_blank" rel="noopener noreferrer" title="Open ${p.title} on LeetCode">
        ${escHtml(p.title)}${extLinkIcon()}
      </a>
    </td>
    <td class="col-diff">
      <span class="diff-badge diff-${diffClass}">${p.difficulty}</span>
    </td>
    <td class="col-done">
      <input type="checkbox" class="done-cb" data-id="${p.id}"${isDone ? ' checked' : ''}
             aria-label="Mark ${escHtml(p.title)} as done">
    </td>
  </tr>`;
}

function buildSection(topic, problems) {
  const topicId  = TOPIC_IDS[topic];
  const doneCnt  = problems.filter(p => done.has(p.id)).length;
  const allDone  = doneCnt === problems.length;
  return `<section class="topic-section" id="topic-${topicId}">
    <div class="topic-header">
      <span class="topic-name">${escHtml(topic)}</span>
      <span class="topic-count-badge">${problems.length} problems</span>
      <span class="topic-done-badge${allDone ? ' all-done' : ''}" id="tdone-${topicId}">
        ${doneCnt}/${problems.length}
      </span>
    </div>
    <table class="q-table">
      <thead>
        <tr>
          <th class="col-num">#</th>
          <th class="col-problem">Problem</th>
          <th class="col-diff">Difficulty</th>
          <th class="col-done">Done</th>
        </tr>
      </thead>
      <tbody>${problems.map(buildRow).join('')}</tbody>
    </table>
  </section>`;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const filtered = getFiltered();
  const container   = document.getElementById('questions-container');
  const emptyState  = document.getElementById('empty-state');
  const resultsInfo = document.getElementById('results-info');

  updateProgress();
  updateTopicNavActive();

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'flex';
    resultsInfo.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';

  const isFiltering = searchQuery || activeFilter !== 'all';
  if (isFiltering) {
    resultsInfo.style.display = 'block';
    resultsInfo.textContent = `Showing ${filtered.length} of 100 questions`;
  } else {
    resultsInfo.style.display = 'none';
  }

  // Group by topic (preserve canonical order)
  const byTopic = {};
  TOPIC_ORDER.forEach(t => { byTopic[t] = []; });
  filtered.forEach(p => { if (byTopic[p.topic]) byTopic[p.topic].push(p); });

  let html = '';
  TOPIC_ORDER.forEach(topic => {
    if (byTopic[topic].length > 0) {
      html += buildSection(topic, byTopic[topic]);
    }
  });
  container.innerHTML = html;

  // Attach checkbox listeners via delegation
  container.addEventListener('change', onCheckboxChange);
}

// ── Progress ──────────────────────────────────────────────────────────────────
function updateProgress() {
  const solved = done.size;
  const pct    = Math.round((solved / 100) * 100);
  document.getElementById('solved-count').textContent = solved;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent  = pct + '%';
}

function updateTopicDoneBadge(topicId, section) {
  const s    = section || document.getElementById('topic-' + topicId);
  if (!s) return;
  const cbs  = s.querySelectorAll('.done-cb');
  const chkd = s.querySelectorAll('.done-cb:checked');
  const el   = document.getElementById('tdone-' + topicId);
  if (!el) return;
  el.textContent = `${chkd.length}/${cbs.length}`;
  el.className   = 'topic-done-badge' + (chkd.length === cbs.length ? ' all-done' : '');
}

// ── Checkbox handler ──────────────────────────────────────────────────────────
function onCheckboxChange(e) {
  if (!e.target.classList.contains('done-cb')) return;
  const id  = Number(e.target.dataset.id);
  const row = e.target.closest('tr');
  if (e.target.checked) {
    done.add(id);
    row.classList.add('row-done');
  } else {
    done.delete(id);
    row.classList.remove('row-done');
  }
  saveProgress();
  updateProgress();
  const section = e.target.closest('.topic-section');
  if (section) {
    const topicId = section.id.replace('topic-', '');
    updateTopicDoneBadge(topicId, section);
  }
}

// ── Topic nav active state ────────────────────────────────────────────────────
function updateTopicNavActive() {
  // Highlight topic nav link based on scroll position (after render)
  requestAnimationFrame(() => {
    const links = document.querySelectorAll('.topic-link');
    links.forEach(l => l.classList.remove('active'));
    // Activate first visible section's link
    const sections = document.querySelectorAll('.topic-section');
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top < 250) {
        const id = sec.id.replace('topic-', '');
        const link = document.querySelector(`.topic-link[data-id="${id}"]`);
        if (link) {
          document.querySelectorAll('.topic-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    }
  });
}

// ── Search ────────────────────────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  searchClear.style.display = searchQuery ? 'block' : 'none';
  render();
});

searchClear.addEventListener('click', clearSearch);

function clearSearch() {
  searchInput.value = '';
  searchQuery = '';
  searchClear.style.display = 'none';
  render();
}
window.clearSearch = clearSearch;

// ── Filters ───────────────────────────────────────────────────────────────────
document.getElementById('filter-group').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  render();
});

// ── Topic navigation ──────────────────────────────────────────────────────────
document.querySelectorAll('.topic-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const topicId = link.dataset.id;
    // Clear search + filters so the section is visible
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    activeFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    render();
    // Scroll after render
    setTimeout(() => {
      const target = document.getElementById('topic-' + topicId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });
});

// Highlight active topic link on scroll
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const links = document.querySelectorAll('.topic-link');
    const sections = document.querySelectorAll('.topic-section');
    let activeSectionId = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 210) activeSectionId = sec.id.replace('topic-', '');
    });
    links.forEach(l => l.classList.remove('active'));
    if (activeSectionId) {
      const activeLink = document.querySelector(`.topic-link[data-id="${activeSectionId}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }, 50);
}, { passive: true });

// ── Reset ─────────────────────────────────────────────────────────────────────
document.getElementById('reset-btn').addEventListener('click', () => {
  if (!confirm(
    'Reset all progress?\n\n' +
    'This will clear all 100 completed checkboxes.\n' +
    'This action cannot be undone.'
  )) return;
  done.clear();
  saveProgress();
  render();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
loadProgress();
render();
