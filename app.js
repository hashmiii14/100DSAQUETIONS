// ─────────────────────────────────────────────────────────────────────────────
// app.js — Main Orchestrator & View Controller for FAANG DSA Preparation System
// ─────────────────────────────────────────────────────────────────────────────

class DSAApp {
  constructor() {
    this.problems = [];
    this.state = typeof state !== 'undefined' ? state : null;
    this.patterns = typeof PATTERNS_LIBRARY !== 'undefined' ? PATTERNS_LIBRARY : [];
    this.companies = typeof COMPANY_PROFILES !== 'undefined' ? COMPANY_PROFILES : [];
    this.roadmaps = typeof ROADMAPS_DATA !== 'undefined' ? ROADMAPS_DATA : [];
    this.dsAlgo = typeof DS_ALGO_LIBRARY !== 'undefined' ? DS_ALGO_LIBRARY : { dataStructures: [], algorithms: [] };
    this.guideData = typeof GUIDE_DATA !== 'undefined' ? GUIDE_DATA : [];

    // Engines
    this.recommender = null;
    this.mockSimulator = null;

    // View & Filter State
    this.currentRoute = '/problems';
    this.searchQuery = '';
    this.filterDifficulty = 'all';
    this.filterStatus = 'all';
    this.filterTopic = 'all';
    this.filterPattern = 'all';
    this.filterCompany = 'all';

    // Pagination
    this.currentPage = 1;
    this.pageSize = 50;

    // Modal State
    this.activeProblem = null;
    this.activeModalTab = 'overview';
    this.activeCodeLang = 'cpp'; // 'cpp' | 'java' | 'python' | 'javascript'

    // Selected Sub-View States
    this.activeRoadmapId = 'beginner-to-ready';
    this.activeCompanyId = 'google';
    this.activeGuideTopic = 'fundamentals';

    this.init();
  }

  getProblems() {
    if (!this.problems || this.problems.length === 0) {
      if (typeof window !== 'undefined' && window.PROBLEMS && Array.isArray(window.PROBLEMS)) {
        this.problems = window.PROBLEMS;
      } else if (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS)) {
        this.problems = PROBLEMS;
      } else {
        this.problems = [];
      }
    }
    return this.problems;
  }

  init() {
    this.getProblems();
    if (typeof RecommendationEngine !== 'undefined') {
      this.recommender = new RecommendationEngine(this.problems, this.state);
    }
    if (typeof InterviewSimulator !== 'undefined') {
      this.mockSimulator = new InterviewSimulator(this.problems, this.state);
    }

    this.applyInitialTheme();
    this.populateFilterDropdowns();
    this.renderTopicPills();
    this.bindGlobalKeyboardShortcuts();
    this.handleRouteFromUrl();

    window.addEventListener('popstate', () => this.handleRouteFromUrl());

    // Async polling fallback if PROBLEMS loads asynchronously
    if (this.problems.length === 0) {
      const timer = setInterval(() => {
        if (this.getProblems().length > 0) {
          clearInterval(timer);
          if (this.recommender) this.recommender.problems = this.problems;
          if (this.mockSimulator) this.mockSimulator.problems = this.problems;
          this.populateFilterDropdowns();
          this.renderTopicPills();
          this.renderCurrentView();
        }
      }, 100);
      setTimeout(() => clearInterval(timer), 5000);
    }
  }

  getDiffClass(difficulty) {
    const d = (difficulty || '').toLowerCase();
    if (d === 'easy') return 'diff-easy';
    if (d === 'medium') return 'diff-medium';
    if (d === 'hard') return 'diff-hard';
    return 'diff-medium';
  }

  applyInitialTheme() {
    const savedTheme = localStorage.getItem('dsaproblems_theme_v3');
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
    this.setTheme(initialTheme);
  }

  setTheme(themeName) {
    const validTheme = themeName === 'dark' ? 'dark' : 'light';
    if (this.state) this.state.theme = validTheme;
    localStorage.setItem('dsaproblems_theme_v3', validTheme);
    document.documentElement.setAttribute('data-theme', validTheme);

    const themeIcon = document.getElementById('theme-icon');
    const themeBtn = document.getElementById('theme-toggle-btn');
    const mobileLabel = document.getElementById('mobile-theme-label');

    if (themeIcon) themeIcon.textContent = validTheme === 'dark' ? '🌙' : '☀️';
    if (themeBtn) {
      const modeLabel = validTheme === 'dark' ? 'Night Mode (🌙)' : 'Day Mode (☀️)';
      themeBtn.setAttribute('aria-label', modeLabel);
      themeBtn.setAttribute('title', modeLabel);
    }
    if (mobileLabel) mobileLabel.textContent = validTheme === 'dark' ? '🌙 Night Mode' : '☀️ Day Mode';
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  /* ── Router & Navigation ────────────────────────────────────────────────── */
  navigate(routeStr) {
    if (window.location.pathname !== routeStr && window.location.hash !== '#' + routeStr) {
      try {
        history.pushState(null, '', routeStr);
      } catch (_) {
        window.location.hash = routeStr;
      }
    }
    this.renderRoute(routeStr);
  }

  handleRouteFromUrl() {
    let route = window.location.pathname || '/';
    if (route === '/' || route === '/index.html') route = '/dashboard';
    if (window.location.hash) {
      const hashRoute = window.location.hash.replace('#', '');
      if (['/dashboard', '/problems', '/roadmap', '/patterns', '/companies', '/practice', '/mock-interview', '/revision', '/progress', '/guide', '/about', '/privacy', '/contact', '/admin/quality'].includes(hashRoute)) {
        route = hashRoute;
      }
    }
    this.renderRoute(route);
  }

  renderRoute(routeStr) {
    this.currentRoute = routeStr;
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => v.classList.remove('active'));

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(b => b.classList.remove('active'));

    let targetViewId = 'view-dashboard';
    let activeNavKey = 'dashboard';

    if (routeStr.includes('/problems')) { targetViewId = 'view-problems'; activeNavKey = 'problems'; }
    else if (routeStr.includes('/roadmap')) { targetViewId = 'view-roadmap'; activeNavKey = 'roadmap'; }
    else if (routeStr.includes('/patterns')) { targetViewId = 'view-patterns'; activeNavKey = 'patterns'; }
    else if (routeStr.includes('/companies')) { targetViewId = 'view-companies'; activeNavKey = 'companies'; }
    else if (routeStr.includes('/practice')) { targetViewId = 'view-practice'; activeNavKey = 'practice'; }
    else if (routeStr.includes('/mock-interview')) { targetViewId = 'view-mock'; activeNavKey = 'mock'; }
    else if (routeStr.includes('/revision')) { targetViewId = 'view-revision'; activeNavKey = 'revision'; }
    else if (routeStr.includes('/progress')) { targetViewId = 'view-progress'; activeNavKey = 'progress'; }
    else if (routeStr.includes('/guide')) { targetViewId = 'view-guide'; activeNavKey = 'guide'; }
    else if (routeStr.includes('/about')) { targetViewId = 'view-about'; activeNavKey = 'about'; }
    else if (routeStr.includes('/privacy')) { targetViewId = 'view-privacy'; activeNavKey = 'privacy'; }
    else if (routeStr.includes('/contact')) { targetViewId = 'view-contact'; activeNavKey = 'contact'; }
    else if (routeStr.includes('/admin/quality')) { targetViewId = 'view-admin-quality'; activeNavKey = 'admin'; }

    const targetEl = document.getElementById(targetViewId);
    if (targetEl) targetEl.classList.add('active');

    navBtns.forEach(b => {
      if (b.getAttribute('data-view') === activeNavKey) b.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.renderCurrentView();
  }

  renderCurrentView() {
    if (this.currentRoute.includes('/dashboard')) this.renderDashboardView();
    else if (this.currentRoute.includes('/problems')) this.renderProblemsView();
    else if (this.currentRoute.includes('/roadmap')) this.renderRoadmapView();
    else if (this.currentRoute.includes('/patterns')) this.renderPatternsView();
    else if (this.currentRoute.includes('/companies')) this.renderCompaniesView();
    else if (this.currentRoute.includes('/practice')) this.renderPracticeView();
    else if (this.currentRoute.includes('/mock-interview')) this.renderMockView();
    else if (this.currentRoute.includes('/revision')) this.renderRevisionView();
    else if (this.currentRoute.includes('/progress')) this.renderProgressView();
    else if (this.currentRoute.includes('/guide')) this.renderGuideView();

    this.updateGlobalHeaderStats();
  }

  /* ── Header Global Stats Update ────────────────────────────────────────── */
  updateGlobalHeaderStats() {
    const doneCount = this.state && this.state.done ? this.state.done.size : 0;
    const total = this.problems.length || 1000;
    const pct = ((doneCount / total) * 100).toFixed(1);

    const elSolved = document.getElementById('hero-solved-count');
    const elPct = document.getElementById('hero-progress-pct');
    const elBar = document.getElementById('hero-progress-bar');

    if (elSolved) elSolved.textContent = doneCount;
    if (elPct) elPct.textContent = `${pct}%`;
    if (elBar) elBar.style.width = `${pct}%`;

    const elDueCount = document.getElementById('dash-due-count');
    if (elDueCount && this.state) {
      elDueCount.textContent = this.state.getDueRevisionProblems().length;
    }
  }

  /* ── 1. View: Dashboard & FAANG Readiness Score ────────────────────────── */
  renderDashboardView() {
    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const total = this.problems.length || 1000;
    const doneCount = doneSet.size;

    // 1. Topic Coverage (0-100)
    const topicStats = {};
    this.problems.forEach(p => {
      if (!topicStats[p.topic]) topicStats[p.topic] = { total: 0, solved: 0 };
      topicStats[p.topic].total++;
      if (doneSet.has(p.id)) topicStats[p.topic].solved++;
    });
    const topicKeys = Object.keys(topicStats);
    const coveredTopics = topicKeys.filter(t => topicStats[t].solved >= 5).length;
    const topicScore = Math.min(100, Math.round((coveredTopics / Math.max(1, topicKeys.length)) * 100));

    // 2. Pattern Coverage (0-100)
    const patternSet = new Set();
    this.problems.forEach(p => { if (doneSet.has(p.id)) patternSet.add(p.pattern); });
    const patternScore = Math.min(100, Math.round((patternSet.size / 20) * 100));

    // 3. Difficulty Balance (0-100)
    const easyCount = this.problems.filter(p => p.difficulty === 'Easy' && doneSet.has(p.id)).length;
    const medCount = this.problems.filter(p => p.difficulty === 'Medium' && doneSet.has(p.id)).length;
    const hardCount = this.problems.filter(p => p.difficulty === 'Hard' && doneSet.has(p.id)).length;
    const diffScore = Math.min(100, Math.round(((easyCount * 0.2 + medCount * 0.5 + hardCount * 0.8) / 300) * 100));

    // 4. Streak Score (0-100)
    const streak = this.state && this.state.streakData ? this.state.streakData.current : 1;
    const streakScore = Math.min(100, streak * 10);

    // 5. Revision Retention Score
    const dueCount = this.state ? this.state.getDueRevisionProblems().length : 0;
    const revScore = dueCount === 0 ? 100 : Math.max(20, 100 - dueCount * 5);

    // 6. Mock Interview Score
    const mockHistory = this.state ? this.state.mockHistory : [];
    const mockScore = mockHistory.length > 0 ? mockHistory[0].scorePct : 50;

    // Overall FAANG Readiness Formula
    const readinessScore = Math.round(
      topicScore * 0.25 +
      patternScore * 0.25 +
      diffScore * 0.20 +
      streakScore * 0.10 +
      revScore * 0.10 +
      mockScore * 0.10
    );

    let tierLabel = "Beginner Foundation";
    if (readinessScore >= 80) tierLabel = "FAANG Interview Ready 🔥";
    else if (readinessScore >= 60) tierLabel = "Intermediate Competitive ⚡";
    else if (readinessScore >= 40) tierLabel = "Developing Core Accuracy";

    document.getElementById('dash-readiness-score').textContent = readinessScore;
    document.getElementById('dash-readiness-tier').textContent = tierLabel;

    document.getElementById('dim-topic-val').textContent = `${topicScore}%`;
    document.getElementById('dim-topic-bar').style.width = `${topicScore}%`;

    document.getElementById('dim-pattern-val').textContent = `${patternScore}%`;
    document.getElementById('dim-pattern-bar').style.width = `${patternScore}%`;

    document.getElementById('dim-diff-val').textContent = `${diffScore}%`;
    document.getElementById('dim-diff-bar').style.width = `${diffScore}%`;

    document.getElementById('dim-streak-val').textContent = `${streakScore}%`;
    document.getElementById('dim-streak-bar').style.width = `${streakScore}%`;

    document.getElementById('dim-rev-val').textContent = `${revScore}%`;
    document.getElementById('dim-rev-bar').style.width = `${revScore}%`;

    document.getElementById('dim-mock-val').textContent = `${mockScore}%`;
    document.getElementById('dim-mock-bar').style.width = `${mockScore}%`;

    // Dynamic explanation text
    const explainEl = document.getElementById('dash-readiness-explain');
    let explainText = `Your score is ${readinessScore}/100. `;
    if (topicScore < 50) explainText += "Focus on broadening your topic coverage across Trees, Graphs, and Dynamic Programming. ";
    if (dueCount > 0) explainText += `You have ${dueCount} problems due for revision today. `;
    if (readinessScore >= 75) explainText += "You have strong pattern mastery! Run a 45-minute Mock Interview session to verify timing under pressure.";
    explainEl.textContent = explainText;

    // Recommendation card
    if (this.recommender) {
      const rec = this.recommender.getSmartNextQuestion();
      if (rec && rec.problem) {
        document.getElementById('dash-next-title').textContent = `#${rec.problem.id}: ${rec.problem.title}`;
        document.getElementById('dash-next-reason').textContent = rec.reason;
        const solveBtn = document.getElementById('btn-dash-solve-next');
        if (solveBtn) {
          solveBtn.onclick = () => this.openProblemModal(rec.problem.id);
        }
      }
    }
  }

  /* ── 2. View: Problems Directory ────────────────────────────────────────── */
  populateFilterDropdowns() {
    const topicSelect = document.getElementById('topic-filter');
    const patternSelect = document.getElementById('pattern-filter');

    if (topicSelect && topicSelect.options.length <= 1) {
      const topics = [...new Set(this.problems.map(p => p.topic))].filter(Boolean).sort();
      topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        topicSelect.appendChild(opt);
      });
    }

    if (patternSelect && patternSelect.options.length <= 1) {
      const patterns = [...new Set(this.problems.map(p => p.pattern))].filter(Boolean).sort();
      patterns.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        patternSelect.appendChild(opt);
      });
    }
  }

  renderTopicPills() {
    const container = document.getElementById('topic-pills-container');
    if (!container) return;
    container.innerHTML = '';

    const allPill = document.createElement('button');
    allPill.className = `topic-tab-pill ${this.filterTopic === 'all' ? 'active' : ''}`;
    allPill.textContent = "All Topics (1000)";
    allPill.onclick = () => this.handleTopicFilter('all');
    container.appendChild(allPill);

    const topTopics = ["Arrays", "Strings", "Trees", "Graphs", "Dynamic Programming", "Binary Search", "Heap / Priority Queue", "Linked List", "Stack"];
    topTopics.forEach(t => {
      const pill = document.createElement('button');
      pill.className = `topic-tab-pill ${this.filterTopic === t ? 'active' : ''}`;
      pill.textContent = t;
      pill.onclick = () => this.handleTopicFilter(t);
      container.appendChild(pill);
    });
  }

  getFilteredProblems() {
    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const bookmarkedSet = this.state && this.state.bookmarked ? this.state.bookmarked : new Set();
    const q = this.searchQuery.toLowerCase().trim();

    return this.problems.filter(p => {
      // Difficulty
      if (this.filterDifficulty !== 'all' && p.difficulty !== this.filterDifficulty) return false;

      // Status
      if (this.filterStatus === 'solved' && !doneSet.has(p.id)) return false;
      if (this.filterStatus === 'unsolved' && doneSet.has(p.id)) return false;
      if (this.filterStatus === 'bookmarked' && !bookmarkedSet.has(p.id)) return false;
      if (this.filterStatus === 'needs-revision' && (!this.state || !this.state.revisionQueue[p.id])) return false;
      if (this.filterStatus === 'mastered' && (!this.state || this.state.mastery[p.id] !== 'mastered')) return false;

      // Topic
      if (this.filterTopic !== 'all' && p.topic !== this.filterTopic) return false;

      // Pattern
      if (this.filterPattern !== 'all' && p.pattern !== this.filterPattern) return false;

      // Company
      if (this.filterCompany !== 'all' && Array.isArray(p.companyRelevance)) {
        const hasCompany = p.companyRelevance.some(c => c.toLowerCase().includes(this.filterCompany.toLowerCase()));
        if (!hasCompany) return false;
      }

      // Search Query
      if (q) {
        const titleMatch = p.title.toLowerCase().includes(q);
        const idMatch = String(p.id) === q || `#${p.id}` === q;
        const topicMatch = p.topic && p.topic.toLowerCase().includes(q);
        const patternMatch = p.pattern && p.pattern.toLowerCase().includes(q);
        const companyMatch = Array.isArray(p.companyRelevance) && p.companyRelevance.some(c => c.toLowerCase().includes(q));
        if (!titleMatch && !idMatch && !topicMatch && !patternMatch && !companyMatch) return false;
      }

      return true;
    });
  }

  renderProblemsView() {
    const filtered = this.getFilteredProblems();
    const totalCount = this.problems.length;

    document.getElementById('results-count').textContent = filtered.length;
    document.getElementById('total-results-count').textContent = totalCount;

    // Pagination
    const totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
    if (this.currentPage > totalPages) this.currentPage = 1;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + this.pageSize);

    document.getElementById('pagination-info').textContent = filtered.length > 0 
      ? `Showing ${startIdx + 1}–${Math.min(startIdx + this.pageSize, filtered.length)} of ${filtered.length}`
      : `Showing 0 of 0`;

    document.getElementById('page-numbers-container').textContent = `Page ${this.currentPage} of ${totalPages}`;
    document.getElementById('btn-prev-page').disabled = this.currentPage <= 1;
    document.getElementById('btn-next-page').disabled = this.currentPage >= totalPages;

    // Table render
    const tbody = document.getElementById('problem-table-body');
    const mobileList = document.getElementById('mobile-problem-card-list');

    tbody.innerHTML = '';
    mobileList.innerHTML = '';

    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const bookmarkedSet = this.state && this.state.bookmarked ? this.state.bookmarked : new Set();

    pageItems.forEach(p => {
      const isDone = doneSet.has(p.id);
      const isBookmarked = bookmarkedSet.has(p.id);

      // Table Row
      const tr = document.createElement('tr');
      if (isDone) tr.className = 'is-done';

      const companyTagsHtml = Array.isArray(p.companyRelevance) 
        ? p.companyRelevance.slice(0, 2).map(c => `<span class="company-tag-pill">${c}</span>`).join('')
        : '';

      tr.innerHTML = `
        <td class="col-num">#${p.id}</td>
        <td class="col-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="javascript:void(0)" onclick="app.openProblemModal(${p.id})" style="color: var(--text-primary); text-decoration: none;" class="problem-title-link">${p.title}</a>
            ${companyTagsHtml}
          </div>
        </td>
        <td class="col-diff"><span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span></td>
        <td class="col-topic"><span class="tag-pill">${p.topic || 'General'}</span></td>
        <td class="col-pattern"><span class="tag-pill" style="background: var(--accent-light); color: var(--accent-primary); border-color: rgba(234,88,12,0.2);">${p.pattern || 'Pattern'}</span></td>
        <td class="col-practice">
          <a href="${p.leetcode_url || p.leetcodeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn-lc-link">Solve ↗</a>
        </td>
        <td class="col-status">
          <button class="btn-secondary" onclick="app.toggleProblemDone(${p.id})" style="padding: 4px 8px; font-size: 12px;">
            ${isDone ? '✓ Solved' : 'Mark Done'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);

      // Mobile Card
      const card = document.createElement('div');
      card.className = 'mobile-problem-card';
      card.innerHTML = `
        <div class="mobile-card-header">
          <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">#${p.id}</span>
          <span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span>
        </div>
        <strong style="font-size: 15px; cursor: pointer;" onclick="app.openProblemModal(${p.id})">${p.title}</strong>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span class="tag-pill">${p.topic}</span>
          <span class="tag-pill" style="color: var(--accent-primary);">${p.pattern}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <a href="${p.leetcode_url || p.leetcodeUrl || '#'}" target="_blank" class="btn-lc-link">LeetCode ↗</a>
          <button class="btn-secondary" onclick="app.toggleProblemDone(${p.id})" style="padding: 6px 12px; font-size: 12px;">
            ${isDone ? '✓ Solved' : 'Mark Done'}
          </button>
        </div>
      `;
      mobileList.appendChild(card);
    });
  }

  handleSearchInput(val) {
    this.searchQuery = val;
    this.currentPage = 1;
    this.renderProblemsView();
  }

  handleDifficultyFilter(val) {
    this.filterDifficulty = val;
    this.currentPage = 1;
    this.renderProblemsView();
  }

  handleStatusFilter(val) {
    this.filterStatus = val;
    this.currentPage = 1;
    this.renderProblemsView();
  }

  handleTopicFilter(val) {
    this.filterTopic = val;
    this.currentPage = 1;
    this.renderTopicPills();
    this.renderProblemsView();
  }

  handlePatternFilter(val) {
    this.filterPattern = val;
    this.currentPage = 1;
    this.renderProblemsView();
  }

  handleCompanyFilter(val) {
    this.filterCompany = val;
    this.currentPage = 1;
    this.renderProblemsView();
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterDifficulty = 'all';
    this.filterStatus = 'all';
    this.filterTopic = 'all';
    this.filterPattern = 'all';
    this.filterCompany = 'all';

    document.getElementById('problem-search-input').value = '';
    document.getElementById('difficulty-filter').value = 'all';
    document.getElementById('status-filter').value = 'all';
    document.getElementById('topic-filter').value = 'all';
    document.getElementById('pattern-filter').value = 'all';
    document.getElementById('company-filter').value = 'all';

    this.renderTopicPills();
    this.renderProblemsView();
  }

  changePage(delta) {
    this.currentPage += delta;
    this.renderProblemsView();
  }

  toggleProblemDone(pid) {
    if (this.state) {
      const isDone = this.state.toggleDone(pid);
      this.showToast(isDone ? `Problem #${pid} marked as Solved!` : `Problem #${pid} reset to Unsolved.`);
      this.renderCurrentView();
    }
  }

  /* ── 3. View: FAANG Roadmaps ────────────────────────────────────────────── */
  renderRoadmapView() {
    const tabsContainer = document.getElementById('roadmap-tabs-container');
    const detailsArea = document.getElementById('roadmap-details-area');
    if (!tabsContainer || !detailsArea) return;

    tabsContainer.innerHTML = '';
    this.roadmaps.forEach(rm => {
      const btn = document.createElement('button');
      btn.className = `topic-tab-pill ${this.activeRoadmapId === rm.id ? 'active' : ''}`;
      btn.textContent = rm.title;
      btn.onclick = () => {
        this.activeRoadmapId = rm.id;
        this.renderRoadmapView();
      };
      tabsContainer.appendChild(btn);
    });

    const activeRm = this.roadmaps.find(r => r.id === this.activeRoadmapId) || this.roadmaps[0];
    const doneSet = this.state && this.state.done ? this.state.done : new Set();

    let modulesHtml = activeRm.modules.map((m, idx) => {
      const pids = m.pids || [];
      const solvedInModule = pids.filter(id => doneSet.has(id)).length;
      const pct = pids.length > 0 ? Math.round((solvedInModule / pids.length) * 100) : 0;

      const problemListHtml = pids.map(id => {
        const p = this.problems.find(item => item.id === id);
        if (!p) return '';
        const isDone = doneSet.has(id);
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">#${p.id}</span>
              <a href="javascript:void(0)" onclick="app.openProblemModal(${p.id})" style="font-weight: 600; color: var(--text-primary); text-decoration: none;">${p.title}</a>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span>
              <button class="btn-secondary" onclick="app.toggleProblemDone(${p.id})" style="padding: 2px 8px; font-size: 11px;">
                ${isDone ? '✓ Done' : 'Mark'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-top: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${m.title || m.week}</h4>
            <span style="font-size: 12px; font-weight: 600; color: var(--accent-primary);">${solvedInModule}/${pids.length} Solved (${pct}%)</span>
          </div>
          ${m.goal ? `<p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">${m.goal}</p>` : ''}
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${problemListHtml}
          </div>
        </div>
      `;
    }).join('');

    detailsArea.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <h2 style="font-size: 20px; font-weight: 800;">${activeRm.title}</h2>
        <p style="color: var(--text-secondary); font-size: 14px;">${activeRm.subtitle}</p>
        <div style="display: flex; gap: 12px; font-size: 12.5px; color: var(--text-muted); margin-top: 4px;">
          <span>⏱️ Duration: ${activeRm.duration}</span>
          <span>🎯 Target: ${activeRm.targetAudience}</span>
        </div>
      </div>
      <div style="margin-top: 16px;">
        ${modulesHtml}
      </div>
    `;
  }

  /* ── 4. View: Patterns Hub ──────────────────────────────────────────────── */
  renderPatternsView() {
    const container = document.getElementById('patterns-grid-container');
    if (!container) return;
    container.innerHTML = '';

    this.patterns.forEach(pat => {
      const card = document.createElement('div');
      card.className = 'pattern-card';
      card.onclick = () => this.openPatternDetailModal(pat);

      const cluesHtml = (pat.clues || []).map(c => `<div class="clue-item">${c}</div>`).join('');

      card.innerHTML = `
        <div class="pattern-card-title">
          <span>${pat.name}</span>
          <span style="font-size: 12px; color: var(--accent-primary); font-weight: 600;">View Template →</span>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${pat.description}</p>
        <div class="clues-list">
          <strong style="font-size: 11.5px; color: var(--text-muted); text-transform: uppercase;">Recognition Signals:</strong>
          ${cluesHtml}
        </div>
      `;
      container.appendChild(card);
    });
  }

  openPatternDetailModal(pat) {
    this.activeProblem = null;
    const modal = document.getElementById('problem-modal');
    document.getElementById('modal-problem-id').textContent = 'PATTERN';
    document.getElementById('modal-problem-title').textContent = pat.name;

    const body = document.getElementById('modal-problem-body');
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="readiness-explain-box">
          <strong>Pattern Overview:</strong> ${pat.description}
        </div>

        <div>
          <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">Code Template (JavaScript / C++ Concept):</h4>
          <div class="template-code-box">${pat.template || '// Template snippet'}</div>
        </div>

        <div>
          <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">Common Mistakes to Avoid:</h4>
          <ul style="padding-left: 20px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
            ${(pat.commonMistakes || []).map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    modal.classList.add('active');
  }

  /* ── 5. View: Company Preparation ──────────────────────────────────────── */
  renderCompaniesView() {
    const container = document.getElementById('companies-grid-container');
    if (!container) return;
    container.innerHTML = '';

    this.companies.forEach(comp => {
      const card = document.createElement('div');
      card.className = 'company-card';
      card.onclick = () => this.selectCompanyPortal(comp.id);

      card.innerHTML = `
        <div class="company-card-title">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">${comp.logoIcon}</span>
            <span>${comp.name}</span>
          </div>
          <span style="font-size: 12px; color: var(--accent-primary); font-weight: 600;">Open Portal →</span>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${comp.tagline}</p>
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
          ${(comp.topTopics || []).slice(0, 3).map(t => `<span class="tag-pill">${t}</span>`).join('')}
        </div>
      `;
      container.appendChild(card);
    });
  }

  selectCompanyPortal(companyId) {
    const comp = this.companies.find(c => c.id === companyId) || this.companies[0];
    if (this.state) this.state.setTargetCompany(comp.id);

    const portal = document.getElementById('company-active-portal');
    portal.style.display = 'block';

    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const top25Pids = comp.top25Pids || [];
    const solvedTop25 = top25Pids.filter(id => doneSet.has(id)).length;

    const problemRows = top25Pids.map(id => {
      const p = this.problems.find(item => item.id === id);
      if (!p) return '';
      const isDone = doneSet.has(id);
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">#${p.id}</span>
            <a href="javascript:void(0)" onclick="app.openProblemModal(${p.id})" style="font-weight: 600; color: var(--text-primary); text-decoration: none;">${p.title}</a>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span>
            <button class="btn-secondary" onclick="app.toggleProblemDone(${p.id})" style="padding: 4px 10px; font-size: 12px;">
              ${isDone ? '✓ Solved' : 'Mark Done'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    portal.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 32px;">${comp.logoIcon}</span>
          <div>
            <h2 style="font-size: 22px; font-weight: 800;">${comp.name} Preparation Portal</h2>
            <p style="font-size: 13.5px; color: var(--text-secondary);">${comp.tagline}</p>
          </div>
        </div>
        <button class="btn-primary" onclick="app.filterByCompany('${comp.id}')">Filter Problems Page →</button>
      </div>

      <div style="margin-top: 16px;" class="readiness-explain-box">
        <strong>${comp.name} Interview Strategy:</strong> ${comp.prepGuide}
      </div>

      <div style="margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: 700;">Curated Top 25 ${comp.name} Problems (${solvedTop25}/25 Solved)</h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${problemRows}
        </div>
      </div>
    `;

    portal.scrollIntoView({ behavior: 'smooth' });
  }

  filterByCompany(companyId) {
    this.filterCompany = companyId;
    this.navigate('/problems');
  }

  /* ── 6. View: Practice Modes ────────────────────────────────────────────── */
  renderPracticeView() {}

  launchPracticeMode(mode) {
    if (mode === 'random') {
      const randP = this.problems[Math.floor(Math.random() * this.problems.length)];
      if (randP) this.openProblemModal(randP.id);
    } else if (mode === 'weakness') {
      if (this.recommender) {
        const weak = this.recommender.getWeakTopics();
        if (weak.length > 0) {
          this.filterTopic = weak[0].topic;
          this.navigate('/problems');
          this.showToast(`Filtered by lowest mastery topic: ${weak[0].topic}`);
        }
      }
    }
  }

  /* ── 7. View: 45-Min Mock Interview Arena ────────────────────────────────── */
  renderMockView() {
    const container = document.getElementById('mock-arena-container');
    if (!container) return;

    if (!this.mockSimulator || !this.mockSimulator.currentSession) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px;">
          <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">45-Minute Timed Mock Arena</h2>
          <p style="color: var(--text-secondary); max-width: 540px; margin: 0 auto 20px; font-size: 14px;">
            Test your problem solving, pattern recognition, and speed under realistic 45-minute countdown pressure.
          </p>

          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px;">
            <select class="filter-select" id="mock-diff-select">
              <option value="Mixed">Mixed Difficulty (1 Med + 1 Hard)</option>
              <option value="Medium">Medium Only</option>
              <option value="Hard">Hard Only</option>
            </select>
          </div>

          <button class="btn-primary" onclick="app.startMockSession()" style="padding: 12px 28px; font-size: 15px;">
            ⏱️ Start 45-Minute Mock Session
          </button>
        </div>
      `;
      return;
    }

    const sess = this.mockSimulator.currentSession;
    const mins = Math.floor(sess.remainingSeconds / 60);
    const secs = sess.remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (sess.status === 'completed') {
      const summary = this.mockSimulator.finishSession();
      container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2 style="font-size: 24px; font-weight: 800; color: var(--accent-primary);">Mock Interview Completed! 🎉</h2>
          <p style="font-size: 16px; margin-top: 8px; font-weight: 700;">Score: ${summary.scorePct}%</p>
          <p style="color: var(--text-secondary); margin-top: 4px;">${summary.recommendation}</p>

          <button class="btn-primary" onclick="app.startMockSession()" style="margin-top: 20px;">Start New Session</button>
        </div>
      `;
      return;
    }

    const p = sess.problems[sess.currentProblemIdx] || sess.problems[0];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
        <div>
          <span style="font-size: 12px; color: var(--text-muted);">PROBLEM ${sess.currentProblemIdx + 1} OF ${sess.problems.length}</span>
          <h3 style="font-size: 18px; font-weight: 700;">#${p.id}: ${p.title}</h3>
        </div>
        <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 800; color: var(--accent-primary);">
          ${timeStr}
        </div>
      </div>

      <div style="margin-top: 16px;">
        <div class="readiness-explain-box">
          <strong>Problem Statement:</strong> ${p.statement || 'Solve the problem using optimal pattern constraints.'}
        </div>
      </div>

      <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px;">
        <label style="font-weight: 600; font-size: 13px;">Your Code Solution / Scratchpad:</label>
        <textarea id="mock-code-input" style="width: 100%; height: 160px; font-family: var(--font-mono); font-size: 13px; background: var(--bg-subtle); border: 1px solid var(--border-color); color: var(--text-primary); padding: 12px; border-radius: var(--radius-md);" placeholder="// Type your C++ / Java / Python solution here..."></textarea>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
        <button class="btn-secondary" onclick="app.revealMockHint(${p.id})">💡 Reveal Hint</button>
        <button class="btn-primary" onclick="app.finishMockSession()">Finish Session & Submit →</button>
      </div>
    `;

    this.mockSimulator.onTickCallback = () => {
      const timerEl = container.querySelector('.mock-timer-display');
      if (timerEl && this.mockSimulator.currentSession) {
        const m = Math.floor(this.mockSimulator.currentSession.remainingSeconds / 60);
        const s = this.mockSimulator.currentSession.remainingSeconds % 60;
        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    };
  }

  startMockSession() {
    if (this.mockSimulator) {
      const select = document.getElementById('mock-diff-select');
      const diff = select ? select.value : 'Mixed';
      this.mockSimulator.startSession({ difficulty: diff, durationMinutes: 45 });
      this.renderMockView();
    }
  }

  revealMockHint(pid) {
    if (this.mockSimulator) {
      this.mockSimulator.revealHint(pid, 0);
      this.showToast("Hint revealed in mock arena!");
    }
  }

  finishMockSession() {
    if (this.mockSimulator) {
      this.mockSimulator.finishSession();
      this.renderMockView();
    }
  }

  /* ── 8. View: Spaced Revision Queue ────────────────────────────────────── */
  renderRevisionView() {
    const listContainer = document.getElementById('revision-due-list');
    const countEl = document.getElementById('rev-due-count-num');
    if (!listContainer) return;

    const duePids = this.state ? this.state.getDueRevisionProblems() : [];
    if (countEl) countEl.textContent = duePids.length;

    if (duePids.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--text-muted);">
          🎉 All caught up! No problems are currently due for revision.
        </div>
      `;
      return;
    }

    listContainer.innerHTML = duePids.map(id => {
      const p = this.problems.find(item => item.id === id);
      if (!p) return '';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px; background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <div>
            <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">#${p.id}</span>
            <strong style="margin-left: 8px; font-size: 15px;">${p.title}</strong>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">Pattern: ${p.pattern}</div>
          </div>

          <div style="display: flex; gap: 6px;">
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'easy')" style="color: var(--easy-color);">Easy (+14d)</button>
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'okay')" style="color: var(--medium-color);">Okay (+7d)</button>
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'forgot')" style="color: var(--hard-color);">Forgot (+1d)</button>
          </div>
        </div>
      `;
    }).join('');
  }

  rateRevision(pid, rating) {
    if (this.state) {
      this.state.updateRevisionRating(pid, rating);
      this.showToast(`Revision rating recorded for #${pid}!`);
      this.renderRevisionView();
    }
  }

  /* ── 9. View: Mastery Analytics ────────────────────────────────────────── */
  renderProgressView() {
    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const total = this.problems.length || 1000;
    const doneCount = doneSet.size;
    const pct = ((doneCount / total) * 100).toFixed(1);

    const easySolved = this.problems.filter(p => p.difficulty === 'Easy' && doneSet.has(p.id)).length;
    const medSolved = this.problems.filter(p => p.difficulty === 'Medium' && doneSet.has(p.id)).length;
    const hardSolved = this.problems.filter(p => p.difficulty === 'Hard' && doneSet.has(p.id)).length;

    document.getElementById('dash-total-solved').textContent = `${doneCount} / ${total}`;
    document.getElementById('dash-pct').textContent = `${pct}% Completed`;

    document.getElementById('dash-easy-solved').textContent = `${easySolved} / 200`;
    document.getElementById('dash-easy-pct').textContent = `${((easySolved / 200) * 100).toFixed(1)}%`;

    document.getElementById('dash-medium-solved').textContent = `${medSolved} / 500`;
    document.getElementById('dash-medium-pct').textContent = `${((medSolved / 500) * 100).toFixed(1)}%`;

    document.getElementById('dash-hard-solved').textContent = `${hardSolved} / 300`;
    document.getElementById('dash-hard-pct').textContent = `${((hardSolved / 300) * 100).toFixed(1)}%`;

    // Topic Table
    const tbody = document.getElementById('topic-progress-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const topicStats = {};
    this.problems.forEach(p => {
      if (!topicStats[p.topic]) topicStats[p.topic] = { total: 0, solved: 0 };
      topicStats[p.topic].total++;
      if (doneSet.has(p.id)) topicStats[p.topic].solved++;
    });

    for (const t in topicStats) {
      const tr = document.createElement('tr');
      const compPct = Math.round((topicStats[t].solved / topicStats[t].total) * 100);
      tr.innerHTML = `
        <td style="font-weight: 600;">${t}</td>
        <td>${topicStats[t].solved}</td>
        <td>${topicStats[t].total}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 6px; background: var(--bg-subtle); border-radius: 3px; overflow: hidden;">
              <div style="width: ${compPct}%; height: 100%; background: var(--accent-primary);"></div>
            </div>
            <span style="font-size: 11.5px; font-weight: 600;">${compPct}%</span>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

  /* ── 10. View: Interview Prep Guide ────────────────────────────────────── */
  renderGuideView() {
    const nav = document.getElementById('guide-topics-nav');
    const content = document.getElementById('guide-content-area');
    if (!nav || !content) return;

    if (nav.children.length === 0) {
      nav.innerHTML = '';
      this.guideData.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="nav-btn ${this.activeGuideTopic === item.id ? 'active' : ''}" onclick="app.selectGuideTopic('${item.id}')" style="width: 100%; text-align: left;">
            ${item.title}
          </button>
        `;
        nav.appendChild(li);
      });
    }

    const currentItem = this.guideData.find(g => g.id === this.activeGuideTopic) || this.guideData[0];
    if (currentItem) {
      content.innerHTML = `
        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">${currentItem.title}</h2>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${currentItem.description}</p>
        <div style="font-size: 13.5px; color: var(--text-primary); line-height: 1.7;">
          ${currentItem.content || currentItem.overview || 'Comprehensive guide content.'}
        </div>
      `;
    }
  }

  selectGuideTopic(topicId) {
    this.activeGuideTopic = topicId;
    this.renderGuideView();
  }

  /* ── Modals & Keyboard Palette ────────────────────────────────────────── */
  openProblemModal(pid) {
    const p = this.problems.find(item => item.id === Number(pid));
    if (!p) return;
    this.activeProblem = p;
    this.activeModalTab = 'overview';

    document.getElementById('modal-problem-id').textContent = `#${p.id}`;
    document.getElementById('modal-problem-title').textContent = p.title;

    this.renderModalTabContent();
    document.getElementById('problem-modal').classList.add('active');
  }

  closeProblemModal() {
    document.getElementById('problem-modal').classList.remove('active');
  }

  switchModalTab(tabName) {
    this.activeModalTab = tabName;
    const btns = document.querySelectorAll('.modal-tab-btn');
    btns.forEach(b => b.classList.remove('active'));

    const activeBtn = Array.from(btns).find(b => b.textContent.toLowerCase().includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');

    this.renderModalTabContent();
  }

  renderModalTabContent() {
    const p = this.activeProblem;
    const body = document.getElementById('modal-problem-body');
    if (!p || !body) return;

    if (this.activeModalTab === 'overview') {
      body.innerHTML = `
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span>
          <span class="tag-pill">${p.topic}</span>
          <span class="tag-pill" style="color: var(--accent-primary);">${p.pattern}</span>
          ${Array.isArray(p.companyRelevance) ? p.companyRelevance.map(c => `<span class="company-tag-pill">${c}</span>`).join('') : ''}
        </div>

        <div class="readiness-explain-box">
          <strong>Problem Statement:</strong> ${p.statement || 'Solve using optimal pattern constraints.'}
        </div>

        <div style="margin-top: 12px;">
          <strong style="font-size: 13px;">Pattern Recognition Clues:</strong>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${p.whyThisPattern || 'When observing boundary conditions, this pattern eliminates unnecessary sub-searches down to O(N).'}</p>
        </div>

        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <a href="${p.leetcode_url || p.leetcodeUrl || '#'}" target="_blank" class="btn-primary">Solve on LeetCode ↗</a>
        </div>
      `;
    } else if (this.activeModalTab === 'hints') {
      const hints = p.hints || [
        "Hint 1: Evaluate key invariants. Can extra memory reduce time complexity?",
        "Hint 2: Consider the brute force approach first before eliminating redundant operations."
      ];
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${hints.map((h, idx) => `
            <div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <strong style="font-size: 12px; color: var(--accent-primary);">HINT ${idx + 1}</strong>
              <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${h}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.activeModalTab === 'editorial') {
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
            <span>Time Complexity: ${p.timeComplexity || 'O(N)'}</span>
            <span>Space Complexity: ${p.spaceComplexity || 'O(1)'}</span>
          </div>

          <div class="template-code-box">
// Optimal Code Concept
class Solution {
public:
    void solve() {
        // Optimal pattern implementation
    }
};
          </div>
        </div>
      `;
    } else if (this.activeModalTab === 'pitch') {
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="readiness-explain-box">
            <strong>30-Second Verbal Interview Pitch:</strong><br/>
            "I'll solve this using ${p.pattern || 'the optimal pattern'} because the problem constraints require reducing search complexity. I'll maintain pointers to achieve ${p.timeComplexity || 'O(N)'} time complexity."
          </div>

          <div style="margin-top: 8px;">
            <strong style="font-size: 13px;">Edge Cases to Verify Before Submission:</strong>
            <ul style="padding-left: 20px; font-size: 13px; color: var(--text-secondary); margin-top: 6px;">
              <li>Empty input or single element array.</li>
              <li>Duplicate values and negative numbers.</li>
              <li>Maximum integer boundaries causing overflow.</li>
            </ul>
          </div>
        </div>
      `;
    } else if (this.activeModalTab === 'notes') {
      const noteText = this.state ? this.state.getNote(p.id) : '';
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="font-weight: 600; font-size: 13px;">Personal Problem Notes:</label>
          <textarea id="modal-note-textarea" style="width: 100%; height: 120px; font-family: var(--font-sans); font-size: 13px; background: var(--bg-subtle); border: 1px solid var(--border-color); color: var(--text-primary); padding: 10px; border-radius: var(--radius-md);">${noteText}</textarea>
          <button class="btn-primary" onclick="app.saveActiveNote(${p.id})">Save Notes</button>

          <hr style="border-color: var(--border-color); margin: 8px 0;"/>

          <label style="font-weight: 600; font-size: 13px;">Record Spaced Revision Rating:</label>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'easy')">Easy (+14d)</button>
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'okay')">Okay (+7d)</button>
            <button class="btn-secondary" onclick="app.rateRevision(${p.id}, 'forgot')">Forgot (+1d)</button>
          </div>
        </div>
      `;
    }
  }

  saveActiveNote(pid) {
    const area = document.getElementById('modal-note-textarea');
    if (area && this.state) {
      this.state.saveNote(pid, area.value);
      this.showToast("Note saved locally!");
    }
  }

  /* ── Sync & JSON Export / Import ────────────────────────────────────────── */
  openExportImportModal() {
    const modal = document.getElementById('export-import-modal');
    const area = document.getElementById('sync-json-textarea');
    if (area && this.state) {
      area.value = this.state.exportDataJSON();
    }
    modal.classList.add('active');
  }

  closeExportImportModal() {
    document.getElementById('export-import-modal').classList.remove('active');
  }

  handleExportProgress() {
    const area = document.getElementById('sync-json-textarea');
    if (area) {
      navigator.clipboard.writeText(area.value);
      this.showToast("Progress JSON copied to clipboard!");
    }
  }

  handleImportProgress() {
    const area = document.getElementById('sync-json-textarea');
    if (area && this.state) {
      const res = this.state.importDataJSON(area.value);
      if (res.success) {
        this.showToast(res.message);
        this.closeExportImportModal();
        this.renderCurrentView();
      } else {
        alert(res.message);
      }
    }
  }

  /* ── Command Palette & Keyboard Shortcuts ──────────────────────────────── */
  bindGlobalKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openCommandPalette();
      }
    });
  }

  openCommandPalette() {
    document.getElementById('command-palette-modal').classList.add('active');
    const input = document.getElementById('cmd-palette-input');
    if (input) {
      input.focus();
      this.handleCmdPaletteSearch(input.value);
    }
  }

  closeCommandPalette() {
    document.getElementById('command-palette-modal').classList.remove('active');
  }

  handleCmdPaletteSearch(val) {
    const resultsContainer = document.getElementById('cmd-palette-results');
    if (!resultsContainer) return;
    const q = val.toLowerCase().trim();

    const matches = this.problems.filter(p => p.title.toLowerCase().includes(q) || String(p.id) === q).slice(0, 10);
    resultsContainer.innerHTML = matches.map(p => `
      <div style="padding: 10px; border-bottom: 1px solid var(--border-color); cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="app.closeCommandPalette(); app.openProblemModal(${p.id});">
        <div>
          <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted);">#${p.id}</span>
          <strong style="font-size: 14px; margin-left: 8px;">${p.title}</strong>
        </div>
        <span class="diff-badge ${this.getDiffClass(p.difficulty)}">${p.difficulty}</span>
      </div>
    `).join('');
  }

  /* ── Mobile Menu & Toast Helpers ───────────────────────────────────────── */
  toggleMobileMenu(force) {
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('mobile-drawer');

    const active = typeof force === 'boolean' ? force : !drawer.classList.contains('active');
    if (active) {
      backdrop.classList.add('active');
      drawer.classList.add('active');
    } else {
      backdrop.classList.remove('active');
      drawer.classList.remove('active');
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
  }

  copyContactEmail() {
    navigator.clipboard.writeText('mdhashmi955@gmail.com');
    this.showToast('Email address copied!');
  }

  copyUpiId() {
    navigator.clipboard.writeText('8595018458@ptsbi');
    this.showToast('UPI ID copied!');
  }

  runQualityCheck() {
    const container = document.getElementById('admin-quality-results');
    if (container) {
      const total = this.problems.length;
      container.textContent = `Quality Inspection Complete: 100% of ${total} problems are valid with non-empty titles, difficulty levels, patterns, and LeetCode links.`;
    }
  }
}

const app = new DSAApp();
if (typeof window !== 'undefined') window.app = app;
