// ─────────────────────────────────────────────────────────────────────────────
// js/recommendation.js — Adaptive Multi-Factor "Next Best Problem" Engine
// Sourced by: Prerequisites, Weak Patterns, Target Company, SRS Due, and Difficulty Curve
// ─────────────────────────────────────────────────────────────────────────────

class RecommendationEngine {
  constructor(problems, appState) {
    this.problems = problems || [];
    this.state = appState || null;
  }

  getSmartNextQuestion(lastSolvedPid = null) {
    if (!this.problems || this.problems.length === 0) {
      return { problem: null, reason: "No problems available." };
    }

    const doneSet = this.state && this.state.done ? this.state.done : new Set();
    const duePids = this.state && this.state.getDueRevisionProblems ? this.state.getDueRevisionProblems() : [];
    const targetCompany = this.state && this.state.targetCompany ? this.state.targetCompany : 'all';

    // 1. If revision is due, prioritize revision!
    if (duePids.length > 0) {
      const dueProblem = this.problems.find(p => p.id === duePids[0]);
      if (dueProblem) {
        return {
          problem: dueProblem,
          reason: `Spaced Revision Due: You solved this problem earlier and it is scheduled for review today to reinforce memory retention.`
        };
      }
    }

    // 2. Filter candidate unsolved problems
    const candidatePool = this.problems.filter(p => !doneSet.has(p.id));

    if (candidatePool.length === 0) {
      return {
        problem: this.problems[0],
        reason: "Congratulations! You have completed all 1,000 problems! Time to run mock interviews & revision sessions."
      };
    }

    // 3. Score candidates based on multi-factor formula
    let bestCandidate = candidatePool[0];
    let maxScore = -Infinity;
    let bestReason = "Next recommended problem in sequence.";

    const weakTopics = this.getWeakTopics();
    const weakTopicNames = new Set(weakTopics.map(w => w.topic));

    candidatePool.forEach(p => {
      let score = 0;
      let reasonParts = [];

      // Pattern continuity after last solved problem
      if (lastSolvedPid) {
        const lastP = this.problems.find(item => item.id === Number(lastSolvedPid));
        if (lastP && p.pattern === lastP.pattern) {
          score += 40;
          reasonParts.push(`Builds directly on pattern '${p.pattern}' from your last solved problem.`);
        }
      }

      // Weak topic coverage bonus
      if (weakTopicNames.has(p.topic)) {
        score += 30;
        reasonParts.push(`Targets your weak topic '${p.topic}' (<50% mastery).`);
      }

      // Target company match bonus
      if (targetCompany !== 'all' && Array.isArray(p.companyRelevance)) {
        const match = p.companyRelevance.some(c => c.toLowerCase().includes(targetCompany.toLowerCase()));
        if (match) {
          score += 25;
          reasonParts.push(`Frequently asked in ${targetCompany.toUpperCase()} technical interviews.`);
        }
      }

      // Difficulty balance bonus: Easy -> Medium progression
      const solvedEasy = this.problems.filter(item => item.difficulty === 'Easy' && doneSet.has(item.id)).length;
      if (solvedEasy < 50 && p.difficulty === 'Easy') {
        score += 20;
        reasonParts.push(`Constructs easy foundational accuracy.`);
      } else if (solvedEasy >= 50 && p.difficulty === 'Medium') {
        score += 15;
        reasonParts.push(`Optimal Medium difficulty progression for FAANG core rounds.`);
      }

      // Priority / Must-Know bonus
      if (p.isMustKnow || p.patternDefining) {
        score += 10;
        reasonParts.push(`Pattern-defining must-know problem.`);
      }

      // Penalize missing prerequisites
      if (Array.isArray(p.prerequisites)) {
        const missingPrereqs = p.prerequisites.filter(id => !doneSet.has(id));
        if (missingPrereqs.length > 0) {
          score -= 50;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestCandidate = p;
        bestReason = reasonParts.length > 0 ? reasonParts.join(' ') : `Recommended problem #${p.id} in ${p.topic}.`;
      }
    });

    return {
      problem: bestCandidate,
      reason: bestReason
    };
  }

  getPrerequisites(pid) {
    const p = this.problems.find(item => item.id === Number(pid));
    if (!p || !p.prerequisites || !Array.isArray(p.prerequisites)) return [];
    return p.prerequisites.map(id => this.problems.find(item => item.id === id)).filter(Boolean);
  }

  getWeakTopics() {
    const topicStats = {};
    const doneSet = (this.state && this.state.done) ? this.state.done : new Set();
    this.problems.forEach(p => {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { total: 0, solved: 0 };
      }
      topicStats[p.topic].total += 1;
      if (doneSet.has(p.id)) {
        topicStats[p.topic].solved += 1;
      }
    });

    const weak = [];
    for (const t in topicStats) {
      const pct = Math.round((topicStats[t].solved / topicStats[t].total) * 100);
      if (topicStats[t].solved >= 0 && pct < 50) {
        weak.push({ topic: t, solved: topicStats[t].solved, total: topicStats[t].total, pct });
      }
    }
    return weak.sort((a, b) => a.pct - b.pct);
  }
}

if (typeof module !== 'undefined') module.exports = RecommendationEngine;
