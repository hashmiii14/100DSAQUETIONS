// Mock Interview Simulation Engine for DSAProblems.site
class InterviewSimulator {
  constructor(problems) {
    this.problems = problems;
    this.currentSession = null;
    this.timerInterval = null;
  }

  startSession(config = { difficulty: 'Mixed', durationMinutes: 45 }) {
    let pool = this.problems;
    if (config.difficulty !== 'Mixed') {
      pool = this.problems.filter(p => p.difficulty === config.difficulty);
    }

    // Pick 3 representative problems for the session
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    this.currentSession = {
      startTime: Date.now(),
      durationSeconds: config.durationMinutes * 60,
      remainingSeconds: config.durationMinutes * 60,
      problems: selected,
      answers: {},
      status: 'active'
    };

    return this.currentSession;
  }

  submitAnswer(problemId, userCode) {
    if (!this.currentSession) return;
    this.currentSession.answers[problemId] = userCode;
  }

  finishSession() {
    if (!this.currentSession) return null;
    this.currentSession.status = 'completed';
    this.currentSession.endTime = Date.now();
    const timeSpent = Math.round((this.currentSession.endTime - this.currentSession.startTime) / 1000);

    const attemptedCount = Object.keys(this.currentSession.answers).length;
    const score = Math.round((attemptedCount / this.currentSession.problems.length) * 100);

    return {
      problems: this.currentSession.problems,
      timeSpentSeconds: timeSpent,
      attemptedCount,
      totalCount: this.currentSession.problems.length,
      scorePct: score,
      recommendation: score >= 66 ? "Strong performance! You are interview-ready for this tier." : "Needs practice. Focus on pattern recognition and speed."
    };
  }
}

if (typeof module !== 'undefined') module.exports = InterviewSimulator;
