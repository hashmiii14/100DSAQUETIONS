// ─────────────────────────────────────────────────────────────────────────────
// js/interview_mode.js — Timed 45-Minute Mock Interview Simulation Arena
// Structured 4-phase interview loop with progressive hints & self-assessment
// ─────────────────────────────────────────────────────────────────────────────

class InterviewSimulator {
  constructor(problems, appState) {
    this.problems = problems || [];
    this.state = appState || null;
    this.currentSession = null;
    this.timerInterval = null;
    this.onTickCallback = null;
  }

  getPhases() {
    return [
      { id: 1, name: "1. Problem Understanding & Constraints", durationSeconds: 300, desc: "Clarify inputs, edge constraints, and return requirements aloud with the interviewer." },
      { id: 2, name: "2. Approach & Bottleneck Optimization", durationSeconds: 600, desc: "State the brute-force approach, identify the bottleneck, and pitch the optimal pattern." },
      { id: 3, name: "3. Code Implementation", durationSeconds: 1200, desc: "Write clean, modular code with descriptive variable names and proper boundary handling." },
      { id: 4, name: "4. Dry Run, Edge Cases & Complexity", durationSeconds: 600, desc: "Trace through test cases, verify edge boundaries, and state Big-O Time & Space complexity." }
    ];
  }

  startSession(config = { difficulty: 'Mixed', durationMinutes: 45 }) {
    let pool = this.problems;
    if (config.difficulty && config.difficulty !== 'Mixed') {
      pool = this.problems.filter(p => p.difficulty === config.difficulty);
    }

    if (pool.length === 0) pool = this.problems;

    // Pick 2 representative problems (1 Medium + 1 Hard or 2 Mediums)
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    const totalSecs = (config.durationMinutes || 45) * 60;

    this.currentSession = {
      id: Date.now(),
      startTime: Date.now(),
      totalDurationSeconds: totalSecs,
      remainingSeconds: totalSecs,
      difficulty: config.difficulty || 'Mixed',
      problems: selected,
      currentProblemIdx: 0,
      currentPhaseIdx: 0,
      userNotes: {},
      revealedHints: {},
      status: 'active',
      dimensions: {
        problemSolving: 4,
        patternRecognition: 4,
        coding: 4,
        complexity: 4,
        testing: 3,
        communication: 4
      }
    };

    this.startTimer();
    return this.currentSession;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.currentSession || this.currentSession.status !== 'active') {
        clearInterval(this.timerInterval);
        return;
      }
      this.currentSession.remainingSeconds -= 1;
      if (this.currentSession.remainingSeconds <= 0) {
        this.currentSession.remainingSeconds = 0;
        this.currentSession.status = 'timed_out';
        clearInterval(this.timerInterval);
      }
      if (typeof this.onTickCallback === 'function') {
        this.onTickCallback(this.currentSession);
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  resumeTimer() {
    if (this.currentSession && this.currentSession.status === 'active') {
      this.startTimer();
    }
  }

  revealHint(problemId, hintIdx) {
    if (!this.currentSession) return;
    if (!this.currentSession.revealedHints[problemId]) {
      this.currentSession.revealedHints[problemId] = [];
    }
    if (!this.currentSession.revealedHints[problemId].includes(hintIdx)) {
      this.currentSession.revealedHints[problemId].push(hintIdx);
    }
  }

  saveNote(problemId, noteText) {
    if (!this.currentSession) return;
    this.currentSession.userNotes[problemId] = noteText;
  }

  finishSession(evalRatings = null) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (!this.currentSession) return null;

    this.currentSession.status = 'completed';
    this.currentSession.endTime = Date.now();
    const timeSpent = Math.round((this.currentSession.endTime - this.currentSession.startTime) / 1000);

    if (evalRatings) {
      this.currentSession.dimensions = { ...this.currentSession.dimensions, ...evalRatings };
    }

    const dims = this.currentSession.dimensions;
    const avgScore = Math.round(((dims.problemSolving + dims.patternRecognition + dims.coding + dims.complexity + dims.testing + dims.communication) / 30) * 100);

    const summaryReport = {
      sessionId: this.currentSession.id,
      problems: this.currentSession.problems,
      difficulty: this.currentSession.difficulty,
      timeSpentSeconds: timeSpent,
      attemptedCount: Object.keys(this.currentSession.userNotes).length,
      totalCount: this.currentSession.problems.length,
      scorePct: avgScore,
      dimensions: dims,
      recommendation: avgScore >= 75 
        ? "FAANG Ready! Excellent performance across pattern recognition, time complexity analysis, and edge case coverage."
        : "Needs targeted practice. Focus on dry-running edge cases and explaining bottlenecks aloud before coding."
    };

    if (this.state && typeof this.state.recordMockSession === 'function') {
      this.state.recordMockSession(summaryReport);
    }

    return summaryReport;
  }
}

if (typeof module !== 'undefined') module.exports = InterviewSimulator;
