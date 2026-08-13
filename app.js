// ─────────────────────────────────────────────────────────────────────────────
// app.js — Main Orchestrator & View Controller for DSAProblems.site
// ─────────────────────────────────────────────────────────────────────────────

class DSAApp {
  constructor() {
    this.problems = typeof PROBLEMS !== 'undefined' ? PROBLEMS : [];
    this.patterns = typeof PATTERNS_LIBRARY !== 'undefined' ? PATTERNS_LIBRARY : [];
    this.dsAlgo = typeof DS_ALGO_LIBRARY !== 'undefined' ? DS_ALGO_LIBRARY : { dataStructures: [], algorithms: [] };

    this.state = typeof state !== 'undefined' ? state : null;
    this.recommender = typeof RecommendationEngine !== 'undefined' ? new RecommendationEngine(this.problems, this.state) : null;

    // View & Filter state
    this.currentView = 'explorer';
    this.searchQuery = '';
    this.filterDifficulty = 'all';
    this.filterTopic = 'all';
    this.filterPattern = 'all';
    this.filterStatus = 'all';
    this.filterStage = 'all';

    // Pagination
    this.currentPage = 1;
    this.pageSize = 50;

    // Modal state
    this.activeModalProblem = null;
    this.activeSolutionTab = 'optimal'; // 'optimal' | 'brute'
    this.activeLang = 'cpp'; // 'cpp' | 'java' | 'python' | 'javascript'

    this.init();
  }

  init() {
    this.readUrlParams();
    this.bindEvents();
    this.renderNav();
    this.renderExplorer();
    this.renderDashboard();
  }

  readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('difficulty')) this.filterDifficulty = params.get('difficulty');
    if (params.has('topic')) this.filterTopic = params.get('topic');
    if (params.has('pattern')) this.filterPattern = params.get('pattern');
    if (params.has('stage')) this.filterStage = params.get('stage');
    if (params.has('search')) this.searchQuery = params.get('search');
    if (params.has('view')) this.currentView = params.get('view');

    if (this.searchQuery) {
      const searchInp = document.getElementById('search-input');
      if (searchInp) searchInp.value = this.searchQuery;
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
    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
        this.closeMobileDrawer();
      });
    });

    // Mobile Drawer Toggle & Backdrop
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

    // Search input
    const searchInp = document.getElementById('search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.currentPage = 1;
        this.updateUrlParams();
        this.renderExplorer();
      });
    }

    // Filter Chips & Selects
    document.querySelectorAll('.filter-group .chip-btn').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const parent = e.target.closest('.filter-group');
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeMobileDrawer();
        this.closeLegalModal();
      }
    });

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

    const modalBookm    const copyCodeBtn = document.getElementById('modal-copy-code-btn');
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

    if (linkAbout) linkAbout.addEventListener('click', (e) => { e.preventDefault(); this.switchView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (linkPrivacy) linkPrivacy.addEventListener('click', (e) => { e.preventDefault(); this.switchView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (linkTerms) linkTerms.addEventListener('click', (e) => { e.preventDefault(); this.openLegalModal('Terms of Service', '<p><strong>Terms of Service:</strong> By using DSAProblems.site, you agree to access our content for educational purposes. Content and solutions are curated to assist technical learning. Third-party trademarks (e.g. LeetCode) belong to their respective owners.</p>'); });
    if (linkContact) linkContact.addEventListener('click', (e) => { e.preventDefault(); this.switchView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (legalCloseBtn) legalCloseBtn.addEventListener('click', () => this.closeLegalModal());
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
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const messageEl = document.getElementById('contact-message');

    const name = nameEl ? nameEl.value : '';
    const email = emailEl ? emailEl.value : '';
    const subject = subjectEl ? subjectEl.value : '';
    const message = messageEl ? messageEl.value : '';

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

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    this.updateUrlParams();

    if (viewName === 'dashboard') this.renderDashboard();
  }

  getFilteredProblems() {
    return this.problems.filter(p => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchId = String(p.id).includes(q);
        const matchTopic = p.topic.toLowerCase().includes(q);
        const matchPattern = p.pattern.toLowerCase().includes(q);
        const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(q));

        if (!matchTitle && !matchId && !matchTopic && !matchPattern && !matchTag) return false;
      }

      if (this.filterDifficulty !== 'all') {
        if (p.difficulty.toLowerCase() !== this.filterDifficulty.toLowerCase()) return false;
      }

      if (this.filterStage !== 'all') {
        const pStage = p.stage || p.curriculumStage || '';
        if (pStage !== this.filterStage) return false;
      }

      if (this.filterTopic !== 'all') {
        if (p.topic.toLowerCase() !== this.filterTopic.toLowerCase()) return false;
      }

      if (this.filterPattern !== 'all') {
        if (!p.pattern.toLowerCase().includes(this.filterPattern.toLowerCase())) return false;
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
    if (this.state) this.state.toggleDone(pid);
    this.renderExplorer();
    this.renderDashboard();
  }

  toggleBookmark(pid, event) {
    if (event) event.stopPropagation();
    if (this.state) this.state.toggleBookmark(pid);
    this.renderExplorer();
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
    const nextId = Math.min(1000, Math.max(1, currentId + direction));
    this.openProblemModal(nextId);
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

    const totalEl = document.getElementById('dash-solved-total');
    if (totalEl) totalEl.textContent = `${solved} / ${total}`;
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
