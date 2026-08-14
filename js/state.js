// ─────────────────────────────────────────────────────────────────────────────
// js/state.js — State Management & Persistence for DSAProblems.site (ProgressStore)
// Handles guest local storage, spaced repetition, mastery tracking, and JSON sync
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  DONE: 'dsaproblems_done_v3',
  ATTEMPTED: 'dsaproblems_attempted_v3',
  MASTERY: 'dsaproblems_mastery_v3', // { pid: 'not-started' | 'attempted' | 'solved' | 'needs-revision' | 'repeated-success' | 'mastered' }
  BOOKMARKED: 'dsaproblems_bookmarked_v3',
  NOTES: 'dsaproblems_notes_v3',
  REVISION: 'dsaproblems_revision_v3',
  STREAK: 'dsaproblems_streak_v3',
  THEME: 'dsaproblems_theme_v3',
  TARGET_COMPANY: 'dsaproblems_target_company_v3',
  MOCK_HISTORY: 'dsaproblems_mock_history_v3'
};

class AppState {
  constructor() {
    this.done = this.loadSet(STORAGE_KEYS.DONE);
    this.attempted = this.loadSet(STORAGE_KEYS.ATTEMPTED);
    this.mastery = this.loadObj(STORAGE_KEYS.MASTERY);
    this.bookmarked = this.loadSet(STORAGE_KEYS.BOOKMARKED);
    this.notes = this.loadObj(STORAGE_KEYS.NOTES);
    this.revisionQueue = this.loadObj(STORAGE_KEYS.REVISION);
    this.streakData = this.loadObj(STORAGE_KEYS.STREAK, { current: 1, max: 1, lastDate: new Date().toDateString() });
    this.theme = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.THEME) : null) || 'dark';
    this.targetCompany = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TARGET_COMPANY) : null) || 'all';
    this.mockHistory = this.loadArray(STORAGE_KEYS.MOCK_HISTORY);

    this.checkAndUpdateStreak();
  }

  mapToCanonicalId(id) {
    id = Number(id);
    if (isNaN(id) || id <= 0) return 1;
    if (id <= 1000) return id;
    return ((id - 1) % 1000) + 1;
  }

  loadSet(key) {
    try {
      if (typeof localStorage === 'undefined') return new Set();
      const raw = localStorage.getItem(key);
      if (!raw) return new Set();
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return new Set();
      const migrated = data
        .map(n => Number(n))
        .filter(n => typeof n === 'number' && !isNaN(n) && n > 0)
        .map(n => this.mapToCanonicalId(n));
      const canonicalSet = new Set(migrated);
      this.saveSet(key, canonicalSet);
      return canonicalSet;
    } catch (_) {
      return new Set();
    }
  }

  saveSet(key, set) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify([...set]));
    }
  }

  loadObj(key, defaultVal = {}) {
    try {
      if (typeof localStorage === 'undefined') return defaultVal;
      const raw = localStorage.getItem(key);
      if (!raw) return defaultVal;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return defaultVal;

      const canonicalObj = {};
      for (const k in parsed) {
        const numK = Number(k);
        if (!isNaN(numK) && numK > 0) {
          const canonicalId = this.mapToCanonicalId(numK);
          if (typeof parsed[k] === 'object' && parsed[k] !== null && parsed[k].pid) {
            canonicalObj[canonicalId] = { ...parsed[k], pid: canonicalId };
          } else {
            canonicalObj[canonicalId] = parsed[k];
          }
        } else {
          canonicalObj[k] = parsed[k];
        }
      }
      return canonicalObj;
    } catch (_) {
      return defaultVal;
    }
  }

  saveObj(key, obj) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(obj));
    }
  }

  loadArray(key) {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  /* ── Status & Mastery Actions ───────────────────────────────────────────── */
  toggleDone(pid) {
    pid = Number(pid);
    if (this.done.has(pid)) {
      this.done.delete(pid);
      delete this.mastery[pid];
      this.removeFromRevision(pid);
    } else {
      this.done.add(pid);
      this.attempted.add(pid);
      this.mastery[pid] = 'solved';
      this.scheduleRevision(pid, 1); // 1 day initial review
      this.checkAndUpdateStreak();
    }
    this.saveSet(STORAGE_KEYS.DONE, this.done);
    this.saveSet(STORAGE_KEYS.ATTEMPTED, this.attempted);
    this.saveObj(STORAGE_KEYS.MASTERY, this.mastery);
    return this.done.has(pid);
  }

  setMasteryStatus(pid, status) {
    pid = Number(pid);
    // status: 'not-started' | 'attempted' | 'solved' | 'needs-revision' | 'repeated-success' | 'mastered'
    if (status === 'not-started') {
      this.done.delete(pid);
      this.attempted.delete(pid);
      delete this.mastery[pid];
      this.removeFromRevision(pid);
    } else {
      this.attempted.add(pid);
      if (['solved', 'repeated-success', 'mastered'].includes(status)) {
        this.done.add(pid);
      } else {
        this.done.delete(pid);
      }
      this.mastery[pid] = status;
    }
    this.saveSet(STORAGE_KEYS.DONE, this.done);
    this.saveSet(STORAGE_KEYS.ATTEMPTED, this.attempted);
    this.saveObj(STORAGE_KEYS.MASTERY, this.mastery);
  }

  getMasteryStatus(pid) {
    pid = Number(pid);
    if (this.mastery[pid]) return this.mastery[pid];
    if (this.done.has(pid)) return 'solved';
    if (this.attempted.has(pid)) return 'attempted';
    return 'not-started';
  }

  toggleBookmark(pid) {
    pid = Number(pid);
    if (this.bookmarked.has(pid)) {
      this.bookmarked.delete(pid);
    } else {
      this.bookmarked.add(pid);
    }
    this.saveSet(STORAGE_KEYS.BOOKMARKED, this.bookmarked);
    return this.bookmarked.has(pid);
  }

  saveNote(pid, noteText) {
    pid = Number(pid);
    if (!noteText.trim()) {
      delete this.notes[pid];
    } else {
      this.notes[pid] = noteText;
    }
    this.saveObj(STORAGE_KEYS.NOTES, this.notes);
  }

  getNote(pid) {
    return this.notes[Number(pid)] || '';
  }

  /* ── Spaced Repetition (SRS) ────────────────────────────────────────────── */
  scheduleRevision(pid, days) {
    pid = Number(pid);
    const now = Date.now();
    const nextDue = now + days * 24 * 60 * 60 * 1000;
    this.revisionQueue[pid] = {
      pid,
      nextDue,
      intervalDays: days,
      scheduledAt: now,
      reviewCount: (this.revisionQueue[pid]?.reviewCount || 0) + 1
    };
    this.saveObj(STORAGE_KEYS.REVISION, this.revisionQueue);
  }

  updateRevisionRating(pid, rating) {
    // rating: 'easy' (+14d) | 'okay' (+7d) | 'hard' (+3d) | 'forgot' (+1d)
    pid = Number(pid);
    let days = 1;
    if (rating === 'easy') {
      days = 14;
      this.mastery[pid] = 'mastered';
    } else if (rating === 'okay') {
      days = 7;
      this.mastery[pid] = 'repeated-success';
    } else if (rating === 'hard') {
      days = 3;
      this.mastery[pid] = 'solved';
    } else {
      days = 1;
      this.mastery[pid] = 'needs-revision';
    }
    this.saveObj(STORAGE_KEYS.MASTERY, this.mastery);
    this.scheduleRevision(pid, days);
  }

  removeFromRevision(pid) {
    delete this.revisionQueue[Number(pid)];
    this.saveObj(STORAGE_KEYS.REVISION, this.revisionQueue);
  }

  getDueRevisionProblems() {
    const now = Date.now();
    const due = [];
    for (const pid in this.revisionQueue) {
      if (this.revisionQueue[pid].nextDue <= now) {
        due.push(Number(pid));
      }
    }
    return due;
  }

  /* ── Mock Interview & Target Company ──────────────────────────────────── */
  setTargetCompany(companyId) {
    this.targetCompany = companyId || 'all';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TARGET_COMPANY, this.targetCompany);
    }
  }

  recordMockSession(sessionResult) {
    if (!sessionResult) return;
    this.mockHistory.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      scorePct: sessionResult.scorePct || 0,
      difficulty: sessionResult.difficulty || 'Mixed',
      timeSpentSeconds: sessionResult.timeSpentSeconds || 0,
      attemptedCount: sessionResult.attemptedCount || 0,
      totalCount: sessionResult.totalCount || 3,
      dimensions: sessionResult.dimensions || {
        problemSolving: 3,
        patternRecognition: 3,
        coding: 3,
        complexity: 3,
        testing: 3,
        communication: 3
      }
    });
    // Keep last 20 sessions
    if (this.mockHistory.length > 20) this.mockHistory.pop();
    this.saveObj(STORAGE_KEYS.MOCK_HISTORY, this.mockHistory);
  }

  checkAndUpdateStreak() {
    const today = new Date().toDateString();
    if (this.streakData.lastDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (this.streakData.lastDate === yesterday) {
      this.streakData.current += 1;
    } else {
      this.streakData.current = 1;
    }
    this.streakData.max = Math.max(this.streakData.max, this.streakData.current);
    this.streakData.lastDate = today;
    this.saveObj(STORAGE_KEYS.STREAK, this.streakData);
  }

  setTheme(theme) {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    this.theme = validTheme;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, validTheme);
    }
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', validTheme);
    }
  }

  /* ── JSON Export & Import ────────────────────────────────────────────────── */
  exportDataJSON() {
    const exportObject = {
      version: "3.0",
      exportedAt: new Date().toISOString(),
      done: [...this.done],
      attempted: [...this.attempted],
      mastery: this.mastery,
      bookmarked: [...this.bookmarked],
      notes: this.notes,
      revisionQueue: this.revisionQueue,
      streakData: this.streakData,
      targetCompany: this.targetCompany,
      mockHistory: this.mockHistory
    };
    return JSON.stringify(exportObject, null, 2);
  }

  importDataJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') throw new Error("Invalid JSON structure");

      if (Array.isArray(data.done)) {
        this.done = new Set(data.done.map(n => this.mapToCanonicalId(n)));
        this.saveSet(STORAGE_KEYS.DONE, this.done);
      }
      if (Array.isArray(data.attempted)) {
        this.attempted = new Set(data.attempted.map(n => this.mapToCanonicalId(n)));
        this.saveSet(STORAGE_KEYS.ATTEMPTED, this.attempted);
      }
      if (Array.isArray(data.bookmarked)) {
        this.bookmarked = new Set(data.bookmarked.map(n => this.mapToCanonicalId(n)));
        this.saveSet(STORAGE_KEYS.BOOKMARKED, this.bookmarked);
      }
      if (data.mastery && typeof data.mastery === 'object') {
        this.mastery = data.mastery;
        this.saveObj(STORAGE_KEYS.MASTERY, this.mastery);
      }
      if (data.notes && typeof data.notes === 'object') {
        this.notes = data.notes;
        this.saveObj(STORAGE_KEYS.NOTES, this.notes);
      }
      if (data.revisionQueue && typeof data.revisionQueue === 'object') {
        this.revisionQueue = data.revisionQueue;
        this.saveObj(STORAGE_KEYS.REVISION, this.revisionQueue);
      }
      if (data.mockHistory && Array.isArray(data.mockHistory)) {
        this.mockHistory = data.mockHistory;
        this.saveObj(STORAGE_KEYS.MOCK_HISTORY, this.mockHistory);
      }
      return { success: true, message: "Progress imported successfully!" };
    } catch (e) {
      return { success: false, message: "Import failed: " + e.message };
    }
  }
}

const state = new AppState();
if (typeof module !== 'undefined') module.exports = state;
