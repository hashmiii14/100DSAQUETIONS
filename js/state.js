// State Management & Persistence for DSAProblems.site
const STORAGE_KEYS = {
  DONE: 'dsaproblems_done_v3',
  ATTEMPTED: 'dsaproblems_attempted_v3',
  BOOKMARKED: 'dsaproblems_bookmarked_v3',
  NOTES: 'dsaproblems_notes_v3',
  REVISION: 'dsaproblems_revision_v3',
  STREAK: 'dsaproblems_streak_v3',
  THEME: 'dsaproblems_theme_v3'
};

class AppState {
  constructor() {
    this.done = this.loadSet(STORAGE_KEYS.DONE);
    this.attempted = this.loadSet(STORAGE_KEYS.ATTEMPTED);
    this.bookmarked = this.loadSet(STORAGE_KEYS.BOOKMARKED);
    this.notes = this.loadObj(STORAGE_KEYS.NOTES);
    this.revisionQueue = this.loadObj(STORAGE_KEYS.REVISION); // { pid: { nextDue: timestamp, intervalDays: 1, status: 'due' } }
    this.streakData = this.loadObj(STORAGE_KEYS.STREAK, { current: 1, max: 1, lastDate: new Date().toDateString() });
    this.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';

    this.checkAndUpdateStreak();
  }

  mapToCanonicalId(id) {
    id = Number(id);
    if (isNaN(id) || id <= 0) return 1;
    if (id <= 100) return id;
    return ((id - 1) % 100) + 1;
  }

  loadSet(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return new Set();
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return new Set();
      const migrated = data
        .map(n => Number(n))
        .filter(n => typeof n === 'number' && !isNaN(n) && n > 0)
        .map(n => this.mapToCanonicalId(n));
      const canonicalSet = new Set(migrated);
      // Persist migrated canonical data back to localStorage
      this.saveSet(key, canonicalSet);
      return canonicalSet;
    } catch (_) {
      return new Set();
    }
  }

  saveSet(key, set) {
    localStorage.setItem(key, JSON.stringify([...set]));
  }

  loadObj(key, defaultVal = {}) {
    try {
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
    localStorage.setItem(key, JSON.stringify(obj));
  }

  toggleDone(pid) {
    pid = Number(pid);
    if (this.done.has(pid)) {
      this.done.delete(pid);
      this.removeFromRevision(pid);
    } else {
      this.done.add(pid);
      this.attempted.add(pid);
      this.scheduleRevision(pid, 1); // 1-day initial review
      this.checkAndUpdateStreak();
    }
    this.saveSet(STORAGE_KEYS.DONE, this.done);
    this.saveSet(STORAGE_KEYS.ATTEMPTED, this.attempted);
    return this.done.has(pid);
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

  scheduleRevision(pid, days) {
    pid = Number(pid);
    const now = Date.now();
    const nextDue = now + days * 24 * 60 * 60 * 1000;
    this.revisionQueue[pid] = {
      pid,
      nextDue,
      intervalDays: days,
      scheduledAt: now
    };
    this.saveObj(STORAGE_KEYS.REVISION, this.revisionQueue);
  }

  updateRevisionStatus(pid, rating) {
    // rating: 'know' | 'review' | 'forgot'
    pid = Number(pid);
    const item = this.revisionQueue[pid] || { intervalDays: 1 };
    let nextInterval = 1;
    if (rating === 'know') {
      const intervals = [1, 3, 7, 14, 30];
      const curIdx = intervals.indexOf(item.intervalDays);
      nextInterval = curIdx !== -1 && curIdx < intervals.length - 1 ? intervals[curIdx + 1] : 30;
    } else if (rating === 'review') {
      nextInterval = 3;
    } else {
      nextInterval = 1;
    }
    this.scheduleRevision(pid, nextInterval);
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
    this.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}

const state = new AppState();
if (typeof module !== 'undefined') module.exports = state;
