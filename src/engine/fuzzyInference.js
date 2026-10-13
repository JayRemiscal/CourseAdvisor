/**
 * CourseAdvisor Mamdani Fuzzy Inference System
 * Document ID: ARCH-2026-v2.1 Section 3.2
 * 
 * Translates crisp student confidence [1, 10] and subject difficulty [1, 10]
 * through Fuzzification → Rule Evaluation (AND/Mamdani Min) → Centroid Defuzzification
 * 
 * Outputs:
 * - Crisp Max Recommended Credit Hours (12 to 18 hrs)
 * - Crisp Predicted Stress Index (0 to 100%)
 * - Active firing rules and linguistic membership distributions
 */

export class MamdaniFuzzyEngine {
  constructor() {
    // Membership function shapes
  }

  // Triangular membership function: peak at b, 0 at a and c
  triangular(x, a, b, c) {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);
    return (c - x) / (c - b);
  }

  // Trapezoidal membership function: flat top between b and c, 0 below a and above d
  trapezoidal(x, a, b, c, d) {
    if (x <= a || x >= d) return 0;
    if (x >= b && x <= c) return 1;
    if (x < b) return (x - a) / (b - a);
    return (d - x) / (d - c);
  }

  /**
   * 1. Fuzzification
   * Converts crisp inputs into linguistic variable memberships [0, 1]
   */
  fuzzifyConfidence(c) {
    const val = Math.max(1, Math.min(10, c));
    return {
      low: this.trapezoidal(val, 0, 1, 3.0, 5.0),
      medium: this.triangular(val, 3.5, 5.5, 7.5),
      high: this.trapezoidal(val, 6.0, 8.0, 10, 11)
    };
  }

  fuzzifyDifficulty(d) {
    const val = Math.max(1, Math.min(10, d));
    return {
      easy: this.trapezoidal(val, 0, 1, 3.0, 5.0),
      moderate: this.triangular(val, 3.5, 5.5, 7.5),
      hard: this.trapezoidal(val, 6.0, 8.0, 10, 11)
    };
  }

  // Output stress membership definitions over universe [0, 100]
  stressMembership(riskLevel, stress) {
    switch (riskLevel) {
      case "very_low":
        return this.trapezoidal(stress, -5, 0, 10, 25);
      case "low":
        return this.triangular(stress, 15, 30, 45);
      case "moderate":
        return this.triangular(stress, 35, 50, 65);
      case "high":
        return this.triangular(stress, 55, 70, 85);
      case "very_high":
        return this.trapezoidal(stress, 75, 85, 100, 105);
      default:
        return 0;
    }
  }

  // Output credits membership definitions over universe [12, 18]
  creditMembership(creditTier, credits) {
    switch (creditTier) {
      case "minimal": // 12-13
        return this.trapezoidal(credits, 11, 12, 13, 14);
      case "reduced": // 14-15
        return this.triangular(credits, 13, 14.5, 16);
      case "standard": // 15-16
        return this.triangular(credits, 14.5, 16, 17.5);
      case "accelerated": // 17-18
        return this.trapezoidal(credits, 16, 17.5, 18, 19);
      default:
        return 0;
    }
  }

  /**
   * 2. Rule Evaluation
   * Evaluates the 9 canonical fuzzy inference rules
   * Mamdani AND inference: strength = min(membershipConfidence, membershipDifficulty)
   */
  evaluateRules(confidence, difficulty) {
    const confFuzzy = this.fuzzifyConfidence(confidence);
    const diffFuzzy = this.fuzzifyDifficulty(difficulty);

    const rules = [
      // Rule 1: Low Confidence + Hard Difficulty -> Very High Risk, Minimal Credits
      {
        id: "R1",
        name: "Low Conf & Hard Diff",
        conf: "low",
        diff: "hard",
        stressOut: "very_high",
        creditOut: "minimal",
        weight: Math.min(confFuzzy.low, diffFuzzy.hard),
        explanation: "Low confidence paired with high subject difficulty creates severe cognitive strain."
      },
      // Rule 2: Low Confidence + Moderate Difficulty -> High Risk, Reduced Credits
      {
        id: "R2",
        name: "Low Conf & Moderate Diff",
        conf: "low",
        diff: "moderate",
        stressOut: "high",
        creditOut: "minimal",
        weight: Math.min(confFuzzy.low, diffFuzzy.moderate),
        explanation: "Uncertain foundations in moderate subjects still present significant risk of burnout."
      },
      // Rule 3: Low Confidence + Easy Difficulty -> Moderate Risk, Reduced Credits
      {
        id: "R3",
        name: "Low Conf & Easy Diff",
        conf: "low",
        diff: "easy",
        stressOut: "moderate",
        creditOut: "reduced",
        weight: Math.min(confFuzzy.low, diffFuzzy.easy),
        explanation: "Introductory pace allows building confidence while maintaining manageable load."
      },
      // Rule 4: Medium Confidence + Hard Difficulty -> High Risk, Reduced Credits
      {
        id: "R4",
        name: "Medium Conf & Hard Diff",
        conf: "medium",
        diff: "hard",
        stressOut: "high",
        creditOut: "reduced",
        weight: Math.min(confFuzzy.medium, diffFuzzy.hard),
        explanation: "Rigorous coursework tests average confidence; caution recommended on total credit volume."
      },
      // Rule 5: Medium Confidence + Moderate Difficulty -> Moderate Risk, Standard Credits
      {
        id: "R5",
        name: "Medium Conf & Moderate Diff",
        conf: "medium",
        diff: "moderate",
        stressOut: "moderate",
        creditOut: "standard",
        weight: Math.min(confFuzzy.medium, diffFuzzy.moderate),
        explanation: "Balanced academic zone suitable for standard full-time graduation track."
      },
      // Rule 6: Medium Confidence + Easy Difficulty -> Low Risk, Standard Credits
      {
        id: "R6",
        name: "Medium Conf & Easy Diff",
        conf: "medium",
        diff: "easy",
        stressOut: "low",
        creditOut: "standard",
        weight: Math.min(confFuzzy.medium, diffFuzzy.easy),
        explanation: "Comfortable coursework velocity allowing room for extracurriculars or project work."
      },
      // Rule 7: High Confidence + Hard Difficulty -> Moderate Risk, Standard/Accelerated Credits
      {
        id: "R7",
        name: "High Conf & Hard Diff",
        conf: "high",
        diff: "hard",
        stressOut: "moderate",
        creditOut: "standard",
        weight: Math.min(confFuzzy.high, diffFuzzy.hard),
        explanation: "Strong student confidence offsets steep course difficulty."
      },
      // Rule 8: High Confidence + Moderate Difficulty -> Low Risk, Accelerated Credits
      {
        id: "R8",
        name: "High Conf & Moderate Diff",
        conf: "high",
        diff: "moderate",
        stressOut: "low",
        creditOut: "accelerated",
        weight: Math.min(confFuzzy.high, diffFuzzy.moderate),
        explanation: "Optimal high-throughput performance window; student is well equipped to accelerate."
      },
      // Rule 9: High Confidence + Easy Difficulty -> Very Low Risk, Accelerated Credits
      {
        id: "R9",
        name: "High Conf & Easy Diff",
        conf: "high",
        diff: "easy",
        stressOut: "very_low",
        creditOut: "accelerated",
        weight: Math.min(confFuzzy.high, diffFuzzy.easy),
        explanation: "Effortless mastery zone; student can carry maximum institutional credit limit."
      }
    ];

    return { rules, confFuzzy, diffFuzzy };
  }

  /**
   * 3. Centroid Defuzzification (Center of Gravity)
   * Integrates aggregated output curves to compute crisp values
   */
  evaluate(confidence, difficulty) {
    const { rules, confFuzzy, diffFuzzy } = this.evaluateRules(confidence, difficulty);

    // Centroid Defuzzification for Stress Index (Universe: 0 to 100)
    let stressNum = 0;
    let stressDenom = 0;
    const stressSteps = 200;
    const stressMin = 0;
    const stressMax = 100;
    const stressDelta = (stressMax - stressMin) / stressSteps;

    for (let i = 0; i <= stressSteps; i++) {
      const x = stressMin + i * stressDelta;
      // Mamdani aggregation (MAX of rule implications)
      let aggregatedMu = 0;
      for (const rule of rules) {
        if (rule.weight > 0) {
          const muOut = Math.min(rule.weight, this.stressMembership(rule.stressOut, x));
          if (muOut > aggregatedMu) aggregatedMu = muOut;
        }
      }
      stressNum += x * aggregatedMu;
      stressDenom += aggregatedMu;
    }

    const stressScore = stressDenom > 0 ? (stressNum / stressDenom) : 50;

    // Centroid Defuzzification for Max Credits (Universe: 12 to 18)
    let creditNum = 0;
    let creditDenom = 0;
    const creditSteps = 120;
    const creditMin = 12;
    const creditMax = 18;
    const creditDelta = (creditMax - creditMin) / creditSteps;

    for (let i = 0; i <= creditSteps; i++) {
      const c = creditMin + i * creditDelta;
      let aggregatedMu = 0;
      for (const rule of rules) {
        if (rule.weight > 0) {
          const muOut = Math.min(rule.weight, this.creditMembership(rule.creditOut, c));
          if (muOut > aggregatedMu) aggregatedMu = muOut;
        }
      }
      creditNum += c * aggregatedMu;
      creditDenom += aggregatedMu;
    }

    const rawCredits = creditDenom > 0 ? (creditNum / creditDenom) : 15;
    // Round to standard integer bounds (12, 13, 14, 15, 16, 17, 18)
    const maxCredits = Math.max(12, Math.min(18, Math.round(rawCredits)));

    // Categorize stress level status
    let status = "balanced"; // green
    let statusLabel = "Balanced";
    let statusColor = "#10b981"; // green

    if (stressScore > 70) {
      status = "overload";
      statusLabel = "Overload Risk";
      statusColor = "#ef4444"; // red
    } else if (stressScore > 40) {
      status = "challenging";
      statusLabel = "Challenging";
      statusColor = "#f59e0b"; // amber
    }

    // Identify primary active rule
    const activeRules = rules
      .filter(r => r.weight > 0.05)
      .sort((a, b) => b.weight - a.weight);

    return {
      confidenceInput: confidence,
      difficultyInput: difficulty,
      confFuzzy,
      diffFuzzy,
      stressScore: Math.round(stressScore * 10) / 10,
      maxCredits,
      rawCredits: Math.round(rawCredits * 10) / 10,
      status,
      statusLabel,
      statusColor,
      activeRules,
      dominantRule: activeRules[0] || rules[4]
    };
  }
}
