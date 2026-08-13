// ─────────────────────────────────────────────────────────────────────────────
// app.js — Main Orchestrator & View Controller for DSAProblems.site
// ─────────────────────────────────────────────────────────────────────────────

class DSAApp {
  constructor() {
    this.problems = this.getProblems();
    this.patterns = (typeof window !== 'undefined' && window.PATTERNS_LIBRARY) ? window.PATTERNS_LIBRARY : (typeof PATTERNS_LIBRARY !== 'undefined' ? PATTERNS_LIBRARY : []);
    this.dsAlgo = (typeof window !== 'undefined' && window.DS_ALGO_LIBRARY) ? window.DS_ALGO_LIBRARY : (typeof DS_ALGO_LIBRARY !== 'undefined' ? DS_ALGO_LIBRARY : { dataStructures: [], algorithms: [] });

    this.state = typeof state !== 'undefined' ? state : null;
    this.recommender = typeof RecommendationEngine !== 'undefined' ? new RecommendationEngine(this.getProblems(), this.state) : null;

    // View & Filter state
    this.currentView = 'explorer';
    this.searchQuery = '';
    this.filterDifficulty = 'all';
    this.filterTopic = 'all';
    this.filterPattern = 'all';
    this.filterStatus = 'all';
    this.filterStage = 'all';

    // Sheet specific filters
    this.sheetSearchQuery = '';
    this.sheetFilterDifficulty = 'all';
    this.expandedAccordions = new Set(); // Stores expanded stage/topic keys

    // Pagination
    this.currentPage = 1;
    this.pageSize = 50;

    // Modal state
    this.activeModalProblem = null;
    this.activeSolutionTab = 'optimal'; // 'optimal' | 'brute'
    this.activeLang = 'cpp'; // 'cpp' | 'java' | 'python' | 'javascript'

    // Rate limiting & contact
    this.lastContactSubmit = 0;

    this.init();
  }

  getProblems() {
    if (!this.problems || this.problems.length === 0) {
      if (typeof window !== 'undefined' && window.PROBLEMS && Array.isArray(window.PROBLEMS) && window.PROBLEMS.length > 0) {
        this.problems = window.PROBLEMS;
      } else if (typeof PROBLEMS !== 'undefined' && Array.isArray(PROBLEMS) && PROBLEMS.length > 0) {
        this.problems = PROBLEMS;
      } else {
        this.problems = [];
      }
    }
    return this.problems;
  }

  init() {
    this.getProblems();
    this.readUrlParams();
    this.applyInitialTheme();
    this.bindEvents();
    this.bindGlobalKeyboardShortcuts();
    this.renderNav();
    this.renderSidebar();
    this.switchView(this.currentView);
    this.renderExplorer();
    this.renderDashboard();
    this.renderSheet();

    // Fallback polling for async dataset loading
    if (!this.problems || this.problems.length === 0) {
      const pollTimer = setInterval(() => {
        if (this.getProblems().length > 0) {
          clearInterval(pollTimer);
          if (this.recommender) this.recommender.problems = this.problems;
          this.renderNav();
          this.renderSidebar();
          this.renderExplorer();
          this.renderDashboard();
          this.renderSheet();
        }
      }, 100);
      setTimeout(() => clearInterval(pollTimer), 5000);
    }
  }

  applyInitialTheme() {
    const savedTheme = (this.state && this.state.theme) ? this.state.theme : (localStorage.getItem('dsaproblems_theme_v3') || 'dark');
    this.setTheme(savedTheme, false);
  }

  setTheme(themeName, showToastMsg = true) {
    if (this.state && typeof this.state.setTheme === 'function') {
      this.state.setTheme(themeName);
    } else {
      localStorage.setItem('dsaproblems_theme_v3', themeName);
      document.documentElement.setAttribute('data-theme', themeName);
    }

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = themeName === 'dark' ? '🌙' : '☀️';
    }

    if (showToastMsg) {
      this.showToast(`Switched to ${themeName === 'dark' ? 'Dark' : 'Light'} Mode 🎨`);
    }
  }

  toggleTheme() {
    const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = curTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme, true);
  }

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('difficulty')) this.filterDifficulty = params.get('difficulty');
    if (params.has('topic')) this.filterTopic = params.get('topic');
    if (params.has('pattern')) this.filterPattern = params.get('pattern');
    if (params.has('stage')) this.filterStage = params.get('stage');
    if (params.has('search')) this.searchQuery = (params.get('search') || '').slice(0, 100);
    
    if (params.has('view')) {
      const allowedViews = ['sheet', 'explorer', 'topics', 'patterns', 'companies', 'bookmarks', 'daily', 'revision', 'dashboard', 'guide', 'settings', 'about', 'privacy', 'contact'];
      const requestedView = params.get('view');
      if (allowedViews.includes(requestedView)) {
        this.currentView = requestedView;
      }
    }

    if (this.searchQuery) {
      const searchInp = document.getElementById('search-input');
      if (searchInp) searchInp.value = this.searchQuery;
    }

    let targetPid = null;
    if (params.has('p')) {
      targetPid = Number(params.get('p'));
    } else if (params.has('slug')) {
      const targetSlug = params.get('slug').toLowerCase();
      const pMatch = this.getProblems().find(p => p.slug === targetSlug);
      if (pMatch) targetPid = pMatch.id;
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash.startsWith('problem-')) {
        targetPid = Number(hash.replace('problem-', ''));
      } else {
        const pMatch = this.getProblems().find(p => p.slug === hash);
        if (pMatch) targetPid = pMatch.id;
      }
    }

    if (targetPid && !isNaN(targetPid)) {
      setTimeout(() => {
        this.openProblemModal(targetPid);
      }, 150);
    }
  }

  updateUrlParams() {
    const params = new URLSearchParams();
    if (this.filterDifficulty !== 'all') params.set('difficulty', this.filterDifficulty);
    if (this.filterTopic !== 'all') params.set('topic', this.filterTopic);
    if (this.filterPattern !== 'all') params.set('pattern', this.filterPattern);
    if (this.filterStage !== 'all') params.set('stage', this.filterStage);
    if (this.searchQuery) params.set('search', this.searchQuery);
    if (this.currentView !== 'explorer') params.set('view', this.currentView);

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  bindEvents() {
    // Topbar & Sidebar nav buttons
    document.querySelectorAll('.nav-btn, .sidebar-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        if (view) {
          this.switchView(view);
          this.closeMobileDrawer();
        }
      });
    });

    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const backdrop = document.getElementById('drawer-backdrop');

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => this.openMobileDrawer());
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', () => this.closeMobileDrawer());
    if (backdrop) backdrop.addEventListener('click', () => this.closeMobileDrawer());

    // Hero CTAs
    const beginnerBtn = document.getElementById('btn-beginner');
    if (beginnerBtn) beginnerBtn.addEventListener('click', () => this.switchView('guide'));

    const dashQuickBtn = document.getElementById('btn-dash-quick');
    if (dashQuickBtn) dashQuickBtn.addEventListener('click', () => this.switchView('dashboard'));

    // Explorer Search Input
    const searchInp = document.getElementById('search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    }

    // Explorer Filter Chips & Selects
    document.querySelectorAll('.filter-group .chip-btn').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const parent = e.target.closest('.filter-group');
        if (!parent || !parent.dataset.filterType) return;

        const filterType = parent.dataset.filterType;
        const val = e.target.dataset.val;

        parent.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');

        if (filterType === 'difficulty') this.filterDifficulty = val;
        if (filterType === 'status') this.filterStatus = val;

        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    });

    const stageSelect = document.getElementById('select-stage');
    if (stageSelect) {
      stageSelect.addEventListener('change', (e) => {
        this.filterStage = e.target.value;
        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    }

    const topicSelect = document.getElementById('select-topic');
    if (topicSelect) {
      topicSelect.addEventListener('change', (e) => {
        this.filterTopic = e.target.value;
        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    }

    const patternSelect = document.getElementById('select-pattern');
    if (patternSelect) {
      patternSelect.addEventListener('change', (e) => {
        this.filterPattern = e.target.value;
        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    }

    const clearBtn = document.getElementById('btn-clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.resetFilters());
    }

    // Modal Events
    const closeModalBtn = document.getElementById('modal-close-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeModal());

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }

    const prevBtn = document.getElementById('modal-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateModal(-1));

    const nextBtn = document.getElementById('modal-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateModal(1));

    const modalSolvedBtn = document.getElementById('modal-toggle-solved-btn');
    if (modalSolvedBtn) {
      modalSolvedBtn.addEventListener('click', () => {
        if (this.activeModalProblem) {
          this.toggleDone(this.activeModalProblem.id);
          this.updateModalActions();
        }
      });
    }

    const modalBookmarkBtn = document.getElementById('modal-toggle-bookmark-btn');
    if (modalBookmarkBtn) {
      modalBookmarkBtn.addEventListener('click', () => {
        if (this.activeModalProblem) {
          this.toggleBookmark(this.activeModalProblem.id);
          this.updateModalActions();
        }
      });
    }

    const copyCodeBtn = document.getElementById('modal-copy-code-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        const codeText = document.getElementById('sol-code-display').textContent;
        this.copyToClipboard(codeText).then(() => {
          copyCodeBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyCodeBtn.textContent = '📋 Copy Code'; }, 2000);
        }).catch(() => {
          copyCodeBtn.textContent = '✓ Copied!';
          setTimeout(() => { copyCodeBtn.textContent = '📋 Copy Code'; }, 2000);
        });
      });
    }

    // Solution Tabs
    const optTab = document.getElementById('sol-tab-optimal');
    const bruteTab = document.getElementById('sol-tab-brute');
    if (optTab) {
      optTab.addEventListener('click', () => {
        this.activeSolutionTab = 'optimal';
        optTab.classList.add('active');
        if (bruteTab) bruteTab.classList.remove('active');
        this.updateModalSolutionView();
      });
    }
    if (bruteTab) {
      bruteTab.addEventListener('click', () => {
        this.activeSolutionTab = 'brute';
        bruteTab.classList.add('active');
        if (optTab) optTab.classList.remove('active');
        this.updateModalSolutionView();
      });
    }

    // Language Buttons
    ['cpp', 'java', 'python', 'js'].forEach(langKey => {
      const btn = document.getElementById(`lang-btn-${langKey}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.activeLang = langKey === 'js' ? 'javascript' : langKey;
          ['cpp', 'java', 'python', 'js'].forEach(l => {
            const b = document.getElementById(`lang-btn-${l}`);
            if (b) b.classList.toggle('active', l === langKey);
          });
          this.updateModalSolutionView();
        });
      }
    });

    // Legal / Trust Links
    const linkAbout = document.getElementById('link-about');
    const linkPrivacy = document.getElementById('link-privacy');
    const linkTerms = document.getElementById('link-terms');
    const linkContact = document.getElementById('link-contact');
    const legalCloseBtn = document.getElementById('legal-modal-close-btn');

    if (linkAbout) linkAbout.addEventListener('click', (e) => { e.preventDefault(); this.switchView('about'); if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (linkPrivacy) linkPrivacy.addEventListener('click', (e) => { e.preventDefault(); this.switchView('privacy'); if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (linkTerms) linkTerms.addEventListener('click', (e) => { e.preventDefault(); this.openLegalModal('Terms of Service', '<p><strong>Terms of Service:</strong> By using DSAProblems.site, you agree to access our content for educational purposes. Content and solutions are curated to assist technical learning. Third-party trademarks (e.g. LeetCode) belong to their respective owners.</p>'); });
    if (linkContact) linkContact.addEventListener('click', (e) => { e.preventDefault(); this.switchView('contact'); if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (legalCloseBtn) legalCloseBtn.addEventListener('click', () => this.closeLegalModal());
  }

  bindGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K for Command Search Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.openCommandPalette();
        return;
      }

      if (e.key === 'Escape') {
        this.closeModal();
        this.closeCommandPalette();
        this.closeMobileDrawer();
        this.closeLegalModal();
      }
    });

    const cmdOverlay = document.getElementById('modal-command-palette');
    if (cmdOverlay) {
      cmdOverlay.addEventListener('click', (e) => {
        if (e.target === cmdOverlay) this.closeCommandPalette();
      });
    }
  }

  openCommandPalette() {
    const palette = document.getElementById('modal-command-palette');
    const input = document.getElementById('command-search-input');
    if (palette) {
      palette.classList.add('open');
      if (input) {
        input.value = '';
        input.focus();
        this.handleCommandSearch('');
      }
    }
  }

  closeCommandPalette() {
    const palette = document.getElementById('modal-command-palette');
    if (palette) palette.classList.remove('open');
  }

  handleCommandSearch(query) {
    const q = (query || '').toLowerCase().trim();
    const resultsContainer = document.getElementById('command-results-list');
    if (!resultsContainer) return;

    const problems = this.getProblems();
    const matches = problems.filter(p => {
      if (!q) return true;
      return (
        String(p.id).includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q)
      );
    }).slice(0, 15); // Show top 15 matches

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">No problems found matching "${this.escapeHtml(q)}"</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="command-item" onclick="app.closeCommandPalette(); app.openProblemModal(${p.id});">
        <div>
          <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted); margin-right: 8px;">#${String(p.id).padStart(3, '0')}</span>
          <strong style="color: var(--text-primary);">${this.escapeHtml(p.title)}</strong>
          <span style="font-size: 11px; color: var(--text-muted); margin-left: 8px;">(${this.escapeHtml(p.topic)})</span>
        </div>
        <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
      </div>
    `).join('');
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.remove) {
          toast.remove();
        } else if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 2500);
  }

  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  handleContactFormSubmit() {
    const now = Date.now();
    if (this.lastContactSubmit && (now - this.lastContactSubmit < 10000)) {
      const statusMsg = document.getElementById('contact-status-msg');
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = 'rgba(245, 158, 11, 0.15)';
        statusMsg.style.color = '#f59e0b';
        statusMsg.style.border = '1px solid #f59e0b';
        statusMsg.innerHTML = `<strong>⚠️ Rate Limit Exceeded:</strong> Please wait a few seconds before submitting another message.`;
      }
      return;
    }

    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const messageEl = document.getElementById('contact-message');

    const name = nameEl ? nameEl.value.trim().slice(0, 100) : '';
    const email = emailEl ? emailEl.value.trim().slice(0, 100) : '';
    const subject = subjectEl ? subjectEl.value.trim().slice(0, 150) : '';
    const message = messageEl ? messageEl.value.trim().slice(0, 2000) : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      const statusMsg = document.getElementById('contact-status-msg');
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
        statusMsg.style.color = 'var(--hard)';
        statusMsg.style.border = '1px solid var(--hard)';
        statusMsg.innerHTML = `<strong>⚠️ Invalid Email Address!</strong> Please enter a valid email address.`;
      }
      return;
    }

    this.lastContactSubmit = now;
    const mailtoUrl = `mailto:mdhashmi955@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoUrl;

    const statusMsg = document.getElementById('contact-status-msg');
    if (statusMsg) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = 'rgba(16, 185, 129, 0.15)';
      statusMsg.style.color = 'var(--easy)';
      statusMsg.style.border = '1px solid var(--easy)';
      statusMsg.innerHTML = `<strong>✓ Mail client launched!</strong> If your mail app did not open automatically, please send your email directly to <a href="mailto:mdhashmi955@gmail.com" style="color: var(--accent); font-weight: bold;">mdhashmi955@gmail.com</a>.`;
    }
  }

  openLegalModal(title, bodyHtml) {
    document.getElementById('legal-modal-title').textContent = title;
    document.getElementById('legal-modal-body').innerHTML = bodyHtml;
    document.getElementById('legal-modal-overlay').classList.add('open');
  }

  closeLegalModal() {
    const overlay = document.getElementById('legal-modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }

  openMobileDrawer() {
    document.getElementById('mobile-drawer').classList.add('open');
    document.getElementById('drawer-backdrop').classList.add('open');
  }

  closeMobileDrawer() {
    document.getElementById('mobile-drawer').classList.remove('open');
    document.getElementById('drawer-backdrop').classList.remove('open');
  }

  filterByTopicAndSwitch(topicName) {
    this.resetFilters();
    this.filterTopic = topicName;
    const topicSelect = document.getElementById('select-topic');
    if (topicSelect) topicSelect.value = topicName;

    this.switchView('explorer');
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterDifficulty = 'all';
    this.filterTopic = 'all';
    this.filterPattern = 'all';
    this.filterStatus = 'all';
    this.filterStage = 'all';

    const searchInp = document.getElementById('search-input');
    if (searchInp) searchInp.value = '';

    document.querySelectorAll('.filter-group .chip-btn').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.filter-group[data-filter-type="difficulty"] .chip-btn[data-val="all"]').forEach(c => c.classList.add('active'));
    document.querySelectorAll('.filter-group[data-filter-type="status"] .chip-btn[data-val="all"]').forEach(c => c.classList.add('active'));

    const stageSelect = document.getElementById('select-stage');
    if (stageSelect) stageSelect.value = 'all';

    const topicSelect = document.getElementById('select-topic');
    if (topicSelect) topicSelect.value = 'all';

    const patternSelect = document.getElementById('select-pattern');
    if (patternSelect) patternSelect.value = 'all';

    this.currentPage = 1;
    this.updateUrlParams();
    this.renderExplorer();
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active tab buttons in topbar and sidebar
    document.querySelectorAll('.nav-btn, .sidebar-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    this.updateUrlParams();

    // Render targeted view modules dynamically
    if (viewName === 'sheet') this.renderSheet();
    if (viewName === 'dashboard') this.renderDashboard();
    if (viewName === 'topics') this.renderTopics();
    if (viewName === 'patterns') this.renderPatterns();
    if (viewName === 'companies') this.renderCompanies();
    if (viewName === 'bookmarks') this.renderBookmarks();
    if (viewName === 'daily') this.renderDaily();
    if (viewName === 'revision') this.renderRevision();

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  renderSidebar() {
    const solvedCountEl = document.getElementById('sidebar-solved-count');
    if (solvedCountEl) {
      const solved = this.state && this.state.done ? this.state.done.size : 0;
      solvedCountEl.textContent = `${solved}/1000`;
    }

    const bmCountEl = document.getElementById('sidebar-bookmark-count');
    if (bmCountEl) {
      const bm = this.state && this.state.bookmarked ? this.state.bookmarked.size : 0;
      bmCountEl.textContent = `${bm}`;
    }

    const streakCountEl = document.getElementById('header-streak-count');
    if (streakCountEl && this.state && this.state.streakData) {
      streakCountEl.textContent = this.state.streakData.current || 1;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     DSA Sheet View Renderer (Namaste DSA Sheet UX)
     ───────────────────────────────────────────────────────────────────────── */
  renderSheet() {
    const container = document.getElementById('sheet-accordions');
    if (!container) return;

    const problems = this.getProblems();
    if (!problems || problems.length === 0) return;

    // Group problems by Curriculum Stage & Topic
    const stages = {};
    problems.forEach(p => {
      const stageName = p.phase || p.stage || p.curriculumStage || 'Core Curriculum';
      const topicName = p.topic || 'General DSA';

      if (!stages[stageName]) stages[stageName] = {};
      if (!stages[stageName][topicName]) stages[stageName][topicName] = [];

      // Filter by sheet search and difficulty
      if (this.sheetSearchQuery) {
        const q = this.sheetSearchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchPattern = p.pattern.toLowerCase().includes(q);
        if (!matchTitle && !matchPattern) return;
      }

      if (this.sheetFilterDifficulty !== 'all') {
        if (p.difficulty.toLowerCase() !== this.sheetFilterDifficulty.toLowerCase()) return;
      }

      stages[stageName][topicName].push(p);
    });

    let html = '';
    let accordionIndex = 0;

    for (const stageName in stages) {
      for (const topicName in stages[stageName]) {
        const topicProblems = stages[stageName][topicName];
        if (topicProblems.length === 0) continue;

        accordionIndex++;
        const accordionKey = `acc-${accordionIndex}`;
        const isOpen = this.expandedAccordions.has(accordionKey) || accordionIndex === 1; // First default open

        const solvedCount = topicProblems.filter(p => this.state && this.state.done.has(p.id)).length;
        const totalCount = topicProblems.length;
        const pct = Math.round((solvedCount / totalCount) * 100);

        let rowsHtml = '';
        topicProblems.forEach(p => {
          const isDone = this.state && this.state.done ? this.state.done.has(p.id) : false;
          const isStarred = this.state && this.state.bookmarked ? this.state.bookmarked.has(p.id) : false;
          const numStr = String(p.id).padStart(3, '0');
          const diffClass = p.difficulty.toLowerCase();

          rowsHtml += `
            <tr class="problem-row ${isDone ? 'done' : ''}">
              <td style="width: 45px;"><input type="checkbox" class="action-cb" ${isDone ? 'checked' : ''} onchange="app.toggleDone(${p.id}, event)"></td>
              <td class="col-num">#${numStr}</td>
              <td class="col-title"><span class="q-title-link" onclick="app.openProblemModal(${p.id})">${this.escapeHtml(p.title)}</span></td>
              <td><span class="badge badge-${diffClass}">${p.difficulty}</span></td>
              <td><span class="pattern-tag">${this.escapeHtml(p.pattern)}</span></td>
              <td><a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" class="leetcode-btn" onclick="event.stopPropagation();">Practice ↗</a></td>
              <td style="width: 50px;"><button class="star-btn ${isStarred ? 'starred' : ''}" onclick="app.toggleBookmark(${p.id}, event)">★</button></td>
            </tr>
          `;
        });

        html += `
          <div class="topic-accordion ${isOpen ? 'open' : ''}" id="${accordionKey}">
            <div class="accordion-header" onclick="app.toggleAccordion('${accordionKey}')">
              <div class="accordion-title-group">
                <span class="accordion-icon">►</span>
                <span class="accordion-title">${this.escapeHtml(stageName)} — ${this.escapeHtml(topicName)}</span>
              </div>
              <div class="accordion-progress-group">
                <span class="accordion-count">${solvedCount} / ${totalCount} completed</span>
                <div class="mini-progress-bar">
                  <div class="mini-progress-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
            </div>
            <div class="accordion-content">
              <table class="problem-table">
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
    }

    if (!html) {
      container.innerHTML = `<div class="card" style="text-align:center; padding: 40px; color: var(--text-secondary);">No problems match your current search/filter criteria.</div>`;
      return;
    }

    container.innerHTML = html;
  }

  toggleAccordion(key) {
    const acc = document.getElementById(key);
    if (!acc) return;

    if (acc.classList.contains('open')) {
      acc.classList.remove('open');
      this.expandedAccordions.delete(key);
    } else {
      acc.classList.add('open');
      this.expandedAccordions.add(key);
    }
  }

  toggleExpandAllAccordions() {
    const accordions = document.querySelectorAll('.topic-accordion');
    const anyClosed = Array.from(accordions).some(a => !a.classList.contains('open'));

    accordions.forEach(a => {
      if (anyClosed) {
        a.classList.add('open');
        this.expandedAccordions.add(a.id);
      } else {
        a.classList.remove('open');
        this.expandedAccordions.delete(a.id);
      }
    });

    const btn = document.getElementById('btn-toggle-accordions');
    if (btn) btn.textContent = anyClosed ? 'Collapse All Accordions' : 'Expand All Accordions';
  }

  handleSheetSearch(query) {
    this.sheetSearchQuery = query;
    this.renderSheet();
  }

  filterSheetByDifficulty(diff, btnEl) {
    this.sheetFilterDifficulty = diff;
    const parent = document.getElementById('sheet-diff-filters');
    if (parent) {
      parent.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
    }
    if (btnEl) btnEl.classList.add('active');
    this.renderSheet();
  }

  continueLastProblem() {
    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const nextUnsolved = this.getProblems().find(p => !doneSet.has(p.id));
    if (nextUnsolved) {
      this.openProblemModal(nextUnsolved.id);
    } else {
      this.openProblemModal(1);
    }
  }

  openRandomProblem() {
    const problems = this.getProblems();
    if (problems.length === 0) return;
    const randomIdx = Math.floor(Math.random() * problems.length);
    this.openProblemModal(problems[randomIdx].id);
    this.showToast(`🎲 Opened random problem: #${problems[randomIdx].id} ${problems[randomIdx].title}`);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Discovery Views (Topics, Patterns, Companies, Bookmarks, Daily, Revision)
     ───────────────────────────────────────────────────────────────────────── */
  renderTopics() {
    const container = document.getElementById('topics-grid-container');
    if (!container) return;

    const topicsMap = {};
    this.getProblems().forEach(p => {
      if (!topicsMap[p.topic]) topicsMap[p.topic] = { total: 0, solved: 0 };
      topicsMap[p.topic].total++;
      if (this.state && this.state.done.has(p.id)) topicsMap[p.topic].solved++;
    });

    container.innerHTML = Object.keys(topicsMap).map(t => {
      const item = topicsMap[t];
      const pct = Math.round((item.solved / item.total) * 100);
      return `
        <div class="card">
          <h3>${this.escapeHtml(t)}</h3>
          <p style="font-size: 12.5px; color: var(--text-secondary); mb-2;">${item.solved} of ${item.total} problems completed</p>
          <div class="progress-bar-lg" style="margin-bottom: 14px;">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <button class="btn-primary" style="font-size: 12px; width: 100%;" onclick="app.filterByTopicAndSwitch('${this.escapeHtml(t)}')">Practice Topic (${pct}%) →</button>
        </div>
      `;
    }).join('');
  }

  renderPatterns() {
    const container = document.getElementById('patterns-grid-container');
    if (!container) return;

    container.innerHTML = this.patterns.map(pt => `
      <div class="card">
        <div>
          <h3>🔄 ${this.escapeHtml(pt.name)}</h3>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">${this.escapeHtml(pt.description)}</p>
          <div style="background: var(--bg-elevated); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 11.5px; margin-bottom: 12px;">
            <strong>Signals:</strong> ${pt.clues ? pt.clues.map(c => this.escapeHtml(c)).join(' • ') : 'Standard pattern.'}
          </div>
        </div>
        <button class="btn-secondary" style="font-size: 12px; width: 100%;" onclick="app.filterByPatternAndSwitch('${this.escapeHtml(pt.name)}')">Practice Pattern →</button>
      </div>
    `).join('');
  }

  filterByPatternAndSwitch(patternName) {
    this.resetFilters();
    this.filterPattern = patternName;
    const patternSelect = document.getElementById('select-pattern');
    if (patternSelect) patternSelect.value = patternName;
    this.switchView('explorer');
  }

  renderCompanies() {
    const container = document.getElementById('companies-grid-container');
    if (!container) return;

    const companies = [
      { name: 'Google', icon: '🌐', count: 245 },
      { name: 'Amazon', icon: '📦', count: 320 },
      { name: 'Meta', icon: '♾️', count: 198 },
      { name: 'Microsoft', icon: '🪟', count: 215 },
      { name: 'Uber', icon: '🚗', count: 142 },
      { name: 'Adobe', icon: '🅰️', count: 110 },
      { name: 'Apple', icon: '🍎', count: 165 }
    ];

    container.innerHTML = companies.map(c => `
      <div class="card">
        <div>
          <h3>${c.icon} ${c.name}</h3>
          <p style="font-size: 13px; color: var(--text-secondary);">${c.count}+ recurring interview questions tagged for ${c.name}.</p>
        </div>
        <button class="btn-secondary" style="font-size: 12px; width: 100%; margin-top: 10px;" onclick="app.filterByCompany('${c.name}')">Filter ${c.name} Questions →</button>
      </div>
    `).join('');
  }

  filterByCompany(companyName) {
    this.resetFilters();
    this.searchQuery = companyName;
    const searchInp = document.getElementById('search-input');
    if (searchInp) searchInp.value = companyName;
    this.switchView('explorer');
  }

  renderBookmarks() {
    const container = document.getElementById('bookmarks-list-container');
    if (!container) return;

    const bmSet = this.state && this.state.bookmarked ? this.state.bookmarked : new Set();
    const bmProblems = this.getProblems().filter(p => bmSet.has(p.id));

    if (bmProblems.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h3>No Bookmarked Problems Yet</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Save important problems while practicing to review them later.</p>
          <button class="btn-primary" style="margin: 0 auto; display: inline-flex;" onclick="app.switchView('sheet')">Browse DSA Sheet →</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="problem-table-wrapper">
        <table class="problem-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th>Problem Title</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${bmProblems.map(p => `
              <tr class="problem-row">
                <td class="col-num">#${String(p.id).padStart(3, '0')}</td>
                <td class="col-title"><span class="q-title-link" onclick="app.openProblemModal(${p.id})">${this.escapeHtml(p.title)}</span></td>
                <td><span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span></td>
                <td><span class="topic-tag">${this.escapeHtml(p.topic)}</span></td>
                <td><button class="star-btn starred" onclick="app.toggleBookmark(${p.id}, event); app.renderBookmarks();">★</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderDaily() {
    const container = document.getElementById('daily-list-container');
    if (!container) return;

    // Pick 5 deterministic daily problems based on date
    const today = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);

    const problems = this.getProblems();
    const dailyItems = [];
    for (let i = 0; i < 5; i++) {
      const idx = (seed * 13 + i * 37) % problems.length;
      dailyItems.push(problems[idx]);
    }

    container.innerHTML = dailyItems.map((p, idx) => {
      const isDone = this.state && this.state.done ? this.state.done.has(p.id) : false;
      return `
        <div class="card ${isDone ? 'done' : ''}">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 4px;">DAY CHALLENGE #${idx + 1}</div>
            <h3>#${String(p.id).padStart(3, '0')} ${this.escapeHtml(p.title)}</h3>
            <span class="badge badge-${p.difficulty.toLowerCase()}" style="margin-bottom: 8px;">${p.difficulty}</span>
            <p style="font-size: 12.5px; color: var(--text-secondary);">${this.escapeHtml(p.topic)} • ${this.escapeHtml(p.pattern)}</p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 12px;">
            <button class="btn-primary" style="font-size: 12px; flex: 1;" onclick="app.openProblemModal(${p.id})">Solve Challenge →</button>
            <input type="checkbox" class="action-cb" ${isDone ? 'checked' : ''} onchange="app.toggleDone(${p.id}, event); app.renderDaily();">
          </div>
        </div>
      `;
    }).join('');
  }

  renderRevision() {
    const container = document.getElementById('revision-container');
    if (!container) return;

    const dueIds = this.state && typeof this.state.getDueRevisionProblems === 'function' ? this.state.getDueRevisionProblems() : [];
    const dueProblems = this.getProblems().filter(p => dueIds.includes(p.id));

    if (dueProblems.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <h3>🎉 No Revision Problems Due Today!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">Keep solving new problems on the DSA Sheet to automatically queue revision cards.</p>
          <button class="btn-primary" style="margin: 0 auto; display: inline-flex;" onclick="app.switchView('sheet')">Return to DSA Sheet →</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid-cards">
        ${dueProblems.map(p => `
          <div class="card">
            <div>
              <h3>#${String(p.id).padStart(3, '0')} ${this.escapeHtml(p.title)}</h3>
              <span class="badge badge-${p.difficulty.toLowerCase()}" style="margin-bottom: 8px;">${p.difficulty}</span>
              <p style="font-size: 12.5px; color: var(--text-secondary);">${this.escapeHtml(p.topic)}</p>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap;">
              <button class="chip-btn easy" style="flex: 1;" onclick="app.rateRevision(${p.id}, 'know')">Know (30d)</button>
              <button class="chip-btn medium" style="flex: 1;" onclick="app.rateRevision(${p.id}, 'review')">Review (3d)</button>
              <button class="chip-btn hard" style="flex: 1;" onclick="app.rateRevision(${p.id}, 'forgot')">Forgot (1d)</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  rateRevision(pid, rating) {
    if (this.state && typeof this.state.updateRevisionStatus === 'function') {
      this.state.updateRevisionStatus(pid, rating);
    }
    this.renderRevision();
    this.showToast(`Updated revision queue for #${pid} 👍`);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     JSON Export / Import Data Management
     ───────────────────────────────────────────────────────────────────────── */
  exportProgressData() {
    const exportObj = {
      version: 'v3',
      exportedAt: new Date().toISOString(),
      done: this.state && this.state.done ? [...this.state.done] : [],
      bookmarked: this.state && this.state.bookmarked ? [...this.state.bookmarked] : [],
      notes: this.state && this.state.notes ? this.state.notes : {},
      streakData: this.state && this.state.streakData ? this.state.streakData : {},
      theme: this.state ? this.state.theme : 'dark'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dsaproblems_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('💾 Progress backup downloaded successfully!');
  }

  importProgressData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && Array.isArray(parsed.done)) {
          if (this.state) {
            this.state.done = new Set(parsed.done);
            this.state.bookmarked = new Set(parsed.bookmarked || []);
            this.state.notes = parsed.notes || {};
            this.state.saveSet('dsaproblems_done_v3', this.state.done);
            this.state.saveSet('dsaproblems_bookmarked_v3', this.state.bookmarked);
            this.state.saveObj('dsaproblems_notes_v3', this.state.notes);
          }
          this.renderSidebar();
          this.renderExplorer();
          this.renderDashboard();
          this.renderSheet();
          this.showToast('✓ Progress imported successfully!');
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  }

  resetAllProgress() {
    if (confirm('Are you sure you want to reset all local progress, bookmarks, and notes? This action cannot be undone.')) {
      if (this.state) {
        this.state.done.clear();
        this.state.bookmarked.clear();
        this.state.notes = {};
        localStorage.removeItem('dsaproblems_done_v3');
        localStorage.removeItem('dsaproblems_bookmarked_v3');
        localStorage.removeItem('dsaproblems_notes_v3');
      }
      this.renderSidebar();
      this.renderExplorer();
      this.renderDashboard();
      this.renderSheet();
      this.showToast('🗑️ All local progress reset.');
    }
  }

  setPreferredLanguage(lang) {
    this.activeLang = lang;
    this.showToast(`Preferred code language set to ${lang.toUpperCase()} 💻`);
  }

  /* ─────────────────────────────────────────────────────────────────────────
     Explorer Core Table & Pagination
     ───────────────────────────────────────────────────────────────────────── */
  getFilteredProblems() {
    const problems = this.getProblems();
    if (!Array.isArray(problems)) return [];

    return problems.filter(p => {
      if (!p || typeof p !== 'object') return false;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const title = (p.title || '').toLowerCase();
        const topic = (p.topic || '').toLowerCase();
        const pattern = (p.pattern || '').toLowerCase();
        const matchTitle = title.includes(q);
        const matchId = String(p.id || '').includes(q);
        const matchTopic = topic.includes(q);
        const matchPattern = pattern.includes(q);
        const matchTag = p.tags && Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q));

        if (!matchTitle && !matchId && !matchTopic && !matchPattern && !matchTag) return false;
      }

      if (this.filterDifficulty !== 'all') {
        const diff = (p.difficulty || '').toLowerCase();
        if (diff !== this.filterDifficulty.toLowerCase()) return false;
      }

      if (this.filterStage !== 'all') {
        const pStage = p.stage || p.curriculumStage || '';
        if (pStage !== this.filterStage) return false;
      }

      if (this.filterTopic !== 'all') {
        const topic = (p.topic || '').toLowerCase();
        if (topic !== this.filterTopic.toLowerCase()) return false;
      }

      if (this.filterPattern !== 'all') {
        const pattern = (p.pattern || '').toLowerCase();
        if (!pattern.includes(this.filterPattern.toLowerCase())) return false;
      }

      if (this.filterStatus !== 'all') {
        const hasDone = this.state && this.state.done ? this.state.done.has(p.id) : false;
        const hasStarred = this.state && this.state.bookmarked ? this.state.bookmarked.has(p.id) : false;
        if (this.filterStatus === 'solved' && !hasDone) return false;
        if (this.filterStatus === 'unsolved' && hasDone) return false;
        if (this.filterStatus === 'bookmarked' && !hasStarred) return false;
      }

      return true;
    });
  }

  renderNav() {
    const topicSelect = document.getElementById('select-topic');
    if (topicSelect && topicSelect.children.length <= 1) {
      const topics = [...new Set(this.problems.map(p => p.topic))];
      topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        if (this.filterTopic === t) opt.selected = true;
        topicSelect.appendChild(opt);
      });
    }

    const patternSelect = document.getElementById('select-pattern');
    if (patternSelect && patternSelect.children.length <= 1) {
      const patterns = [...new Set(this.problems.map(p => p.pattern))];
      patterns.forEach(pt => {
        const opt = document.createElement('option');
        opt.value = pt;
        opt.textContent = pt;
        if (this.filterPattern === pt) opt.selected = true;
        patternSelect.appendChild(opt);
      });
    }
  }

  renderExplorer() {
    const filtered = this.getFilteredProblems();
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / this.pageSize) || 1;

    if (this.currentPage > totalPages) this.currentPage = totalPages;
    if (this.currentPage < 1) this.currentPage = 1;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + this.pageSize);

    const infoEl = document.getElementById('table-results-info');
    if (infoEl) {
      infoEl.textContent = `Showing ${totalFiltered === 0 ? 0 : startIdx + 1}–${Math.min(startIdx + this.pageSize, totalFiltered)} of ${totalFiltered} problems`;
    }

    const tbody = document.getElementById('problem-tbody');
    const mobileCardList = document.getElementById('mobile-problem-card-list');

    if (pageItems.length === 0) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--text-secondary);">No problems match your current filter criteria.</td></tr>`;
      if (mobileCardList) mobileCardList.innerHTML = `<div class="card" style="text-align:center; padding: 30px; color: var(--text-secondary);">No problems match your criteria.</div>`;
      this.renderPagination(0, 1);
      return;
    }

    let tableHtml = '';
    let mobileHtml = '';

    pageItems.forEach(p => {
      const isDone = this.state && this.state.done ? this.state.done.has(p.id) : false;
      const isStarred = this.state && this.state.bookmarked ? this.state.bookmarked.has(p.id) : false;
      const numStr = String(p.id).padStart(3, '0');
      const diffClass = p.difficulty.toLowerCase();

      const leetcodeLinkHtml = `<a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" class="leetcode-btn" onclick="event.stopPropagation();">Solve on LeetCode ↗</a>`;

      tableHtml += `<tr class="problem-row ${isDone ? 'done' : ''}" data-id="${p.id}">
        <td class="col-num">#${numStr}</td>
        <td class="col-title">
          <span class="q-title-link" onclick="app.openProblemModal(${p.id})">${this.escapeHtml(p.title)}</span>
        </td>
        <td><span class="badge badge-${diffClass}">${p.difficulty}</span></td>
        <td>
          <span class="topic-tag">${this.escapeHtml(p.topic)}</span>
          <span class="pattern-tag">${this.escapeHtml(p.pattern)}</span>
        </td>
        <td>${leetcodeLinkHtml}</td>
        <td style="display: flex; gap: 10px; align-items: center;">
          <input type="checkbox" class="action-cb" ${isDone ? 'checked' : ''} onchange="app.toggleDone(${p.id}, event)" title="Mark Solved">
          <button class="star-btn ${isStarred ? 'starred' : ''}" onclick="app.toggleBookmark(${p.id}, event)" title="Bookmark">★</button>
        </td>
      </tr>`;

      mobileHtml += `<div class="mobile-q-card ${isDone ? 'done' : ''}">
        <div class="mobile-q-top">
          <span style="font-family:var(--font-mono); font-weight:700; color:var(--text-muted);">#${numStr}</span>
          <span class="badge badge-${diffClass}">${p.difficulty}</span>
        </div>
        <div class="mobile-q-title" onclick="app.openProblemModal(${p.id})">${this.escapeHtml(p.title)}</div>
        <div style="font-size:11px; display:flex; gap:4px; flex-wrap:wrap;">
          <span class="topic-tag">${this.escapeHtml(p.topic)}</span>
          <span class="pattern-tag">${this.escapeHtml(p.pattern)}</span>
        </div>
        <div class="mobile-q-bottom">
          ${leetcodeLinkHtml}
          <div style="display:flex; gap:10px; align-items:center;">
            <input type="checkbox" class="action-cb" ${isDone ? 'checked' : ''} onchange="app.toggleDone(${p.id}, event)">
            <button class="star-btn ${isStarred ? 'starred' : ''}" onclick="app.toggleBookmark(${p.id}, event)">★</button>
            <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="app.openProblemModal(${p.id})">Open →</button>
          </div>
        </div>
      </div>`;
    });

    if (tbody) tbody.innerHTML = tableHtml;
    if (mobileCardList) mobileCardList.innerHTML = mobileHtml;

    this.renderPagination(totalPages, this.currentPage);
  }

  renderPagination(totalPages, currentPage) {
    const prevBtn = document.getElementById('page-prev');
    const nextBtn = document.getElementById('page-next');
    const infoPage = document.getElementById('page-info');

    if (prevBtn) {
      prevBtn.disabled = currentPage <= 1;
      prevBtn.onclick = () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderExplorer();
        }
      };
    }

    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
      nextBtn.onclick = () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderExplorer();
        }
      };
    }

    if (infoPage) {
      infoPage.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    }
  }

  toggleDone(pid, event) {
    if (event) event.stopPropagation();
    let isNowDone = false;
    if (this.state) isNowDone = this.state.toggleDone(pid);
    
    this.renderSidebar();
    this.renderExplorer();
    this.renderDashboard();
    this.renderSheet();

    this.showToast(isNowDone ? `Marked #${pid} as Solved ✓` : `Unmarked #${pid}`);
  }

  toggleBookmark(pid, event) {
    if (event) event.stopPropagation();
    let isNowStarred = false;
    if (this.state) isNowStarred = this.state.toggleBookmark(pid);

    this.renderSidebar();
    this.renderExplorer();

    this.showToast(isNowStarred ? `Added #${pid} to Bookmarks ★` : `Removed #${pid} from Bookmarks`);
  }

  openProblemModal(pid) {
    const p = this.problems.find(item => item.id === pid);
    if (!p) return;

    this.activeModalProblem = p;
    this.activeSolutionTab = 'optimal';
    this.activeLang = 'cpp';

    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    document.getElementById('modal-pid').textContent = `#${String(p.id).padStart(3, '0')}`;
    document.getElementById('modal-title').textContent = p.title;

    const diffBadge = document.getElementById('modal-diff');
    diffBadge.className = `badge badge-${p.difficulty.toLowerCase()}`;
    diffBadge.textContent = p.difficulty;

    document.getElementById('modal-topic').textContent = `${p.topic} • ${p.pattern}`;

    const learnObjEl = document.getElementById('modal-learning-obj');
    if (learnObjEl) learnObjEl.textContent = p.learningObjective || `Master ${p.pattern} techniques.`;

    const whyPatternEl = document.getElementById('modal-why-pattern');
    if (whyPatternEl) whyPatternEl.textContent = p.whyThisPattern || `Recognize ${p.pattern} when constraints require O(N) execution.`;

    document.getElementById('modal-statement').textContent = p.statement;

    const lcBtnHtml = `<a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size:12px; text-decoration:none;">Solve on LeetCode ↗</a>`;

    const lcContainer = document.getElementById('modal-leetcode-container');
    if (lcContainer) lcContainer.innerHTML = lcBtnHtml;

    const lcToolbarContainer = document.getElementById('modal-leetcode-toolbar-container');
    if (lcToolbarContainer) lcToolbarContainer.innerHTML = lcBtnHtml;

    document.getElementById('modal-constraints').innerHTML = p.constraints.map(c => `<li>${this.escapeHtml(c)}</li>`).join('');

    document.getElementById('modal-examples').innerHTML = p.examples.map((ex, idx) => `
      <div style="background: var(--bg-elevated); border-radius: var(--radius); padding: 10px; margin-top: 6px;">
        <strong>Example ${idx + 1}:</strong><br>
        <code>Input: ${this.escapeHtml(ex.input)}</code><br>
        <code>Output: ${this.escapeHtml(ex.output)}</code><br>
        <span style="font-size: 12px; color: var(--text-secondary);">${this.escapeHtml(ex.explanation)}</span>
      </div>
    `).join('');

    document.getElementById('modal-hints').innerHTML = p.hints.map((h, idx) => `
      <details class="hint-box">
        <summary style="font-weight: 600; cursor: pointer; color: var(--accent);">💡 Hint ${idx + 1} (Click to Reveal)</summary>
        <p style="margin-top: 6px; color: var(--text-secondary);">${this.escapeHtml(h)}</p>
      </details>
    `).join('');

    this.updateModalSolutionView();
    this.updateModalActions();

    document.getElementById('modal-edge-cases').innerHTML = p.edgeCases.map(e => `<li>${this.escapeHtml(e)}</li>`).join('');
    document.getElementById('modal-mistakes').innerHTML = p.commonMistakes.map(m => `<li>${this.escapeHtml(m)}</li>`).join('');

    const noteArea = document.getElementById('modal-note-area');
    if (noteArea) {
      noteArea.value = this.state ? this.state.getNote(p.id) : '';
      noteArea.oninput = (e) => {
        if (this.state) this.state.saveNote(p.id, e.target.value);
      };
    }

    overlay.classList.add('open');
  }

  updateModalActions() {
    if (!this.activeModalProblem) return;
    const pid = this.activeModalProblem.id;

    const solvedBtn = document.getElementById('modal-toggle-solved-btn');
    if (solvedBtn) {
      const isDone = this.state && this.state.done ? this.state.done.has(pid) : false;
      solvedBtn.textContent = isDone ? '✓ Solved (Click to Unmark)' : 'Mark Solved ✓';
      solvedBtn.style.color = isDone ? 'var(--easy)' : 'var(--text-primary)';
    }

    const bookmarkBtn = document.getElementById('modal-toggle-bookmark-btn');
    if (bookmarkBtn) {
      const isStarred = this.state && this.state.bookmarked ? this.state.bookmarked.has(pid) : false;
      bookmarkBtn.textContent = isStarred ? 'Bookmarked ★' : 'Bookmark ★';
      bookmarkBtn.style.color = isStarred ? '#f59e0b' : 'var(--text-primary)';
    }
  }

  navigateModal(direction) {
    if (!this.activeModalProblem) return;
    const currentId = this.activeModalProblem.id;
    const maxId = this.problems.length || 1000;
    const nextId = Math.min(maxId, Math.max(1, currentId + direction));
    this.openProblemModal(nextId);
  }

  checkQuestionDuplicate(title, statement) {
    if (typeof DSADuplicateChecker === 'undefined') {
      return { isDuplicate: false, score: 0, status: 'APPROVED', reason: 'Checker engine not loaded.' };
    }
    const checker = new DSADuplicateChecker(this.getProblems());
    return checker.checkDuplicate({ title, statement });
  }

  updateModalSolutionView() {
    const p = this.activeModalProblem;
    if (!p) return;

    const solData = this.activeSolutionTab === 'optimal' ? p.optimalSolution : p.bruteForce;
    if (!solData) return;

    document.getElementById('sol-intuition').textContent = solData.intuition;
    document.getElementById('sol-complexity').textContent = `Time Complexity: ${solData.timeComplexity} | Space Complexity: ${solData.spaceComplexity}`;

    const langMap = { 'cpp': 'cpp', 'java': 'java', 'python': 'python', 'javascript': 'javascript' };
    const targetLang = langMap[this.activeLang] || 'cpp';
    const codeContent = solData.code[targetLang] || solData.code['cpp'] || '// Solution code';
    document.getElementById('sol-code-display').textContent = codeContent;
  }

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('open');
    this.activeModalProblem = null;
  }

  renderDashboard() {
    const total = this.problems.length; // 1000
    const solved = this.state && this.state.done ? this.state.done.size : 0;
    const easyTotal = this.problems.filter(p => p.difficulty === 'Easy').length;
    const medTotal = this.problems.filter(p => p.difficulty === 'Medium').length;
    const hardTotal = this.problems.filter(p => p.difficulty === 'Hard').length;

    const easySolved = this.problems.filter(p => p.difficulty === 'Easy' && this.state && this.state.done.has(p.id)).length;
    const medSolved = this.problems.filter(p => p.difficulty === 'Medium' && this.state && this.state.done.has(p.id)).length;
    const hardSolved = this.problems.filter(p => p.difficulty === 'Hard' && this.state && this.state.done.has(p.id)).length;

    const pct = Math.round((solved / total) * 100);

    const totalEl = document.getElementById('dash-solved-total');
    if (totalEl) totalEl.textContent = `${solved} / ${total}`;

    const fillEl = document.getElementById('dash-solved-fill');
    if (fillEl) fillEl.style.width = `${pct}%`;

    const easyEl = document.getElementById('dash-easy-count');
    if (easyEl) easyEl.textContent = `${easySolved} / ${easyTotal}`;
    const medEl = document.getElementById('dash-med-count');
    if (medEl) medEl.textContent = `${medSolved} / ${medTotal}`;
    const hardEl = document.getElementById('dash-hard-count');
    if (hardEl) hardEl.textContent = `${hardSolved} / ${hardTotal}`;

    const nextRec = this.recommender ? this.recommender.getSmartNextQuestion() : null;
    const recContainer = document.getElementById('dash-recommendation');
    if (recContainer && nextRec && nextRec.problem) {
      const p = nextRec.problem;
      recContainer.innerHTML = `
        <div class="card" style="border-left: 4px solid var(--accent);">
          <h3 style="margin-bottom: 4px;">Smart Recommended Question: #${String(p.id).padStart(3, '0')} ${this.escapeHtml(p.title)}</h3>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">${this.escapeHtml(nextRec.reason)}</p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${p.leetcodeUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size: 12px; text-decoration: none;">Solve on LeetCode ↗</a>
            <button class="btn-secondary" style="font-size: 12px;" onclick="app.openProblemModal(${p.id})">Open Question Workspace →</button>
          </div>
        </div>
      `;
    }
  }

  escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
}

// Global initialization
let app = null;
document.addEventListener('DOMContentLoaded', () => {
  app = new DSAApp();
});
if (typeof module !== 'undefined') module.exports = DSAApp;
