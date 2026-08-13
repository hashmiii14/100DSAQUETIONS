// Duplicate Prevention & Quality Control Engine for DSAProblems.site

class DSADuplicateChecker {
  constructor(existingProblems = []) {
    this.existingProblems = existingProblems;
  }

  setProblems(problems) {
    this.existingProblems = problems;
  }

  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  calculateJaccardSimilarity(textA, textB) {
    const tokensA = new Set(this.normalizeText(textA).split(' ').filter(t => t.length > 2));
    const tokensB = new Set(this.normalizeText(textB).split(' ').filter(t => t.length > 2));
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let intersection = 0;
    tokensA.forEach(t => {
      if (tokensB.has(t)) intersection++;
    });

    const union = new Set([...tokensA, ...tokensB]).size;
    return union === 0 ? 0 : (intersection / union);
  }

  calculateLevenshteinSimilarity(str1, str2) {
    const s1 = this.normalizeText(str1);
    const s2 = this.normalizeText(str2);
    if (s1 === s2) return 1.0;
    if (!s1.length || !s2.length) return 0.0;

    const track = Array(s2.length + 1).fill(null).map(() =>
      Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator,
        );
      }
    }
    const distance = track[s2.length][s1.length];
    const maxLen = Math.max(s1.length, s2.length);
    return maxLen === 0 ? 1.0 : (1.0 - (distance / maxLen));
  }

  checkDuplicate(candidate) {
    const candTitle = candidate.title || '';
    const candSlug = candidate.slug || '';
    const candStatement = candidate.statement || candidate.description || '';
    const candPattern = candidate.pattern || '';

    const normCandTitle = this.normalizeText(candTitle);
    const normCandSlug = this.normalizeText(candSlug);

    let highestScore = 0;
    let bestMatch = null;
    let matchReason = '';
    let matchLevel = '';

    for (const existing of this.existingProblems) {
      const exTitle = existing.title || '';
      const exSlug = existing.slug || '';
      const exStatement = existing.statement || existing.description || '';
      const exPattern = existing.pattern || '';

      const normExTitle = this.normalizeText(exTitle);
      const normExSlug = this.normalizeText(exSlug);

      // Level 1: Exact Match
      if (normCandTitle === normExTitle || (normCandSlug && normCandSlug === normExSlug)) {
        highestScore = 100;
        bestMatch = existing;
        matchReason = `Exact match found on title/slug with Canonical #${existing.id} (${existing.title}).`;
        matchLevel = 'Level 1 — Exact';
        break;
      }

      // Level 2: Normalized Title & Statement Similarity
      const titleLevSim = this.calculateLevenshteinSimilarity(candTitle, exTitle);
      const titleJaccSim = this.calculateJaccardSimilarity(candTitle, exTitle);
      const stmtJaccSim = this.calculateJaccardSimilarity(candStatement, exStatement);

      const titleSimScore = Math.max(titleLevSim, titleJaccSim) * 100;

      if (titleSimScore >= 95) {
        highestScore = Math.max(highestScore, titleSimScore);
        bestMatch = existing;
        matchReason = `Normalized title match (${Math.round(titleSimScore)}%) with Canonical #${existing.id} (${existing.title}).`;
        matchLevel = 'Level 2 — Normalized';
        break;
      }

      // Level 3: Semantic Problem Similarity
      let semanticScore = (titleSimScore * 0.5) + (stmtJaccSim * 50);
      if (candPattern && exPattern && this.normalizeText(candPattern) === this.normalizeText(exPattern)) {
        semanticScore += 10;
      }
      semanticScore = Math.min(99, semanticScore);

      if (semanticScore > highestScore) {
        highestScore = semanticScore;
        bestMatch = existing;
        matchReason = `Semantic problem similarity match (${Math.round(semanticScore)}%) with Canonical #${existing.id} (${existing.title}). Both ask for ${exPattern || exTitle}.`;
        matchLevel = 'Level 3 — Semantic';
      }
    }

    const roundedScore = Math.round(highestScore);
    let status = 'APPROVED';
    let isDuplicate = false;

    if (roundedScore >= 95) {
      status = 'BLOCK_INSERT';
      isDuplicate = true;
    } else if (roundedScore >= 85) {
      status = 'MANUAL_REVIEW_REQUIRED';
      isDuplicate = true;
    } else if (roundedScore >= 70) {
      status = 'FLAG_FOR_REVIEW';
      isDuplicate = false;
    }

    return {
      isDuplicate,
      score: roundedScore,
      status,
      matchLevel: bestMatch ? matchLevel : 'None',
      matchedProblem: bestMatch,
      reason: bestMatch ? matchReason : 'No significant duplicate detected. Question is distinct.'
    };
  }
}

if (typeof module !== 'undefined') {
  module.exports = DSADuplicateChecker;
}
