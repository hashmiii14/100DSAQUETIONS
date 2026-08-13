// Smart Recommendation Engine for DSAProblems.site
class RecommendationEngine {
  constructor(problems, appState) {
    this.problems = problems;
    this.state = appState;
  }

  getSmartNextQuestion(lastSolvedPid = null) {
    if (lastSolvedPid) {
      const lastP = this.problems.find(p => p.id === Number(lastSolvedPid));
      if (lastP) {
        // Recommend a direct next variant or same pattern problem if available
        const patternMatches = this.problems.filter(
          p => p.pattern === lastP.pattern && !this.state.done.has(p.id)
        );
        if (patternMatches.length > 0) {
          return {
            problem: patternMatches[0],
            reason: `Recommended next problem matching the pattern '${lastP.pattern}'.`
          };
        }
      }
    }

    # Find first unsolved problem in sequential curriculum order
    const nextUnsolved = this.problems.find(p => !this.state.done.has(p.id));
    if (nextUnsolved) {
      return {
        problem: nextUnsolved,
        reason: `Recommended next problem in Phase '${nextUnsolved.phase}'.`
      };
    }

    return {
      problem: this.problems[0],
      reason: "Congratulations! You have completed all 1000 problems! Time for revision."
    };
  }

  getPrerequisites(pid) {
    const p = this.problems.find(item => item.id === Number(pid));
    if (!p || !p.prerequisites) return [];
    return p.prerequisites.map(id => this.problems.find(item => item.id === id)).filter(Boolean);
  }

  getWeakTopics() {
    const topicStats = {};
    this.problems.forEach(p => {
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { total: 0, solved: 0 };
      }
      topicStats[p.topic].total += 1;
      if (this.state.done.has(p.id)) {
        topicStats[p.topic].solved += 1;
      }
    });

    const weak = [];
    for (const t in topicStats) {
      const pct = Math.round((topicStats[t].solved / topicStats[t].total) * 100);
      if (topicStats[t].solved > 0 && pct < 50) {
        weak.push({ topic: t, solved: topicStats[t].solved, total: topicStats[t].total, pct });
      }
    }
    return weak.sort((a, b) => a.pct - b.pct);
  }
}

if (typeof module !== 'undefined') module.exports = RecommendationEngine;
