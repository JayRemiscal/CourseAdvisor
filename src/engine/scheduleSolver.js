/**
 * CourseAdvisor Schedule Solver & Reasoning Engine
 * Document ID: ARCH-2026-v2.1 Section 3 & Section 8
 * 
 * Combines Backward Chaining topological tiers with Mamdani Fuzzy constraints.
 * Generates transparent reasoning cards explaining each placement.
 */

import { BackwardChainingEngine } from "./backwardChaining";
import { MamdaniFuzzyEngine } from "./fuzzyInference";

export class ScheduleSolver {
  constructor(courseCatalog) {
    this.catalog = courseCatalog;
    this.catalogMap = new Map(courseCatalog.map(c => [c.id, c]));
    this.backwardChaining = new BackwardChainingEngine(courseCatalog);
    this.fuzzyEngine = new MamdaniFuzzyEngine();
  }

  /**
   * Solves and generates full semester schedule with fuzzy stress scoring
   * 
   * @param {Object} options
   * @param {string | string[]} options.targetCourseIds - Chosen goals/capstone
   * @param {string[]} options.completedCourseIds - Passed transcript courses
   * @param {Object} options.confidenceScores - Foundational subject ratings { math, coding, systems, theory }
   * @param {number} options.maxAllowedSemesters - Number of terms available
   * @param {Map<string, string[]> | null} options.customOverrides - Optional graph overrides
   */
  generateSchedule({
    targetCourseIds,
    completedCourseIds = [],
    confidenceScores = { math: 7, coding: 8, systems: 6, theory: 6 },
    maxAllowedSemesters = 6,
    customOverrides = null
  }) {
    // 1. Run Backward Chaining Engine
    const graphResult = this.backwardChaining.solvePrerequisites(
      targetCourseIds,
      completedCourseIds,
      customOverrides
    );

    if (!graphResult.success) {
      return {
        success: false,
        error: graphResult.error,
        cyclePath: graphResult.cyclePath,
        message: graphResult.message
      };
    }

    const { requiredCourses, tierGroups, criticalPathLength, criticalPathChain } = graphResult;

    // Check Unsatisfiable Goal / Critical Path constraint (Spec Section 9)
    const isExtendedTermRequired = criticalPathLength > maxAllowedSemesters;

    // Calculate baseline subject confidence average
    const scores = Object.values(confidenceScores).filter(v => typeof v === "number");
    const avgConfidence = scores.length > 0 
      ? Math.round((scores.reduce((sum, val) => sum + val, 0) / scores.length) * 10) / 10 
      : 6;

    // 2. Distribute required courses across semesters
    // Group courses by their topological tiers while respecting prerequisite order and credit caps
    const totalTiers = Object.keys(tierGroups).length;
    const semesterCount = Math.max(criticalPathLength, maxAllowedSemesters);
    const semesters = [];

    for (let s = 0; s < semesterCount; s++) {
      semesters.push({
        termIndex: s + 1,
        termName: `Term ${s + 1}`,
        season: s % 2 === 0 ? "Fall" : "Spring",
        courses: [],
        totalCredits: 0,
        averageDifficulty: 0,
        stressResult: null,
        reasoningNotes: []
      });
    }

    // Map to track in which semester each course is scheduled
    const scheduledTermMap = new Map();
    // Pre-populate with completed courses as being in "Term 0" (already passed)
    completedCourseIds.forEach(id => {
      scheduledTermMap.set(id, 0);
    });

    const getPrereqs = (courseId) => {
      if (customOverrides && customOverrides.has(courseId)) {
        return customOverrides.get(courseId);
      }
      const course = this.catalogMap.get(courseId);
      return course ? course.prerequisites : [];
    };

    // Sort remaining courses by tier, then by downstream dependent count (critical bottleneck first)
    const sortedCourses = [...requiredCourses].sort((a, b) => {
      const tierA = graphResult.tierMap[a.id] ?? 0;
      const tierB = graphResult.tierMap[b.id] ?? 0;
      if (tierA !== tierB) return tierA - tierB;
      // Secondary: higher difficulty first or more dependents first
      return b.difficulty - a.difficulty;
    });

    // Greedily schedule courses into the earliest valid semester that hasn't exceeded credit limit
    for (const course of sortedCourses) {
      const prereqs = getPrereqs(course.id);
      
      // Determine earliest valid term: must be strictly > max term of all prerequisites
      let earliestTerm = 1;
      for (const pId of prereqs) {
        if (scheduledTermMap.has(pId)) {
          const pTerm = scheduledTermMap.get(pId);
          earliestTerm = Math.max(earliestTerm, pTerm + 1);
        }
      }

      // Calculate subject specific confidence for this course
      const subjectConf = confidenceScores[course.category] || avgConfidence;
      
      // Run Fuzzy Inference for this subject load
      const fuzzyAssessment = this.fuzzyEngine.evaluate(subjectConf, course.difficulty);
      const targetCreditCap = fuzzyAssessment.maxCredits;

      // Find best available term starting from earliestTerm
      let placed = false;
      for (let t = earliestTerm - 1; t < semesters.length; t++) {
        const sem = semesters[t];
        // If adding this course does not exceed cap (or if it's the only way to satisfy tier)
        if (sem.totalCredits + course.credits <= targetCreditCap || sem.courses.length === 0) {
          sem.courses.push(course);
          sem.totalCredits += course.credits;
          scheduledTermMap.set(course.id, t + 1);
          placed = true;
          break;
        }
      }

      // If all existing semesters are too packed, push to a newly appended semester
      if (!placed) {
        const newTermIdx = semesters.length + 1;
        const newSem = {
          termIndex: newTermIdx,
          termName: `Term ${newTermIdx}`,
          season: newTermIdx % 2 === 1 ? "Fall" : "Spring",
          courses: [course],
          totalCredits: course.credits,
          averageDifficulty: course.difficulty,
          stressResult: null,
          reasoningNotes: []
        };
        semesters.push(newSem);
        scheduledTermMap.set(course.id, newTermIdx);
      }
    }

    // 3. Post-Process Semesters: Calculate Crisp Fuzzy Stress for Each Term
    let maxOverallStress = 0;
    let totalScheduleCredits = 0;

    semesters.forEach(sem => {
      totalScheduleCredits += sem.totalCredits;
      if (sem.courses.length === 0) {
        sem.averageDifficulty = 0;
        sem.stressResult = {
          stressScore: 10,
          status: "balanced",
          statusLabel: "Light / Available",
          statusColor: "#10b981",
          maxCredits: 18,
          activeRules: []
        };
        return;
      }

      // Term difficulty is weighted by course credits
      const totalWeightedDiff = sem.courses.reduce((sum, c) => sum + (c.difficulty * c.credits), 0);
      sem.averageDifficulty = Math.round((totalWeightedDiff / sem.totalCredits) * 10) / 10;

      // Term confidence is weighted by student confidence in each course's subject area
      const totalWeightedConf = sem.courses.reduce((sum, c) => {
        const conf = confidenceScores[c.category] || avgConfidence;
        return sum + (conf * c.credits);
      }, 0);
      const semConfidence = Math.round((totalWeightedConf / sem.totalCredits) * 10) / 10;

      // Mamdani Fuzzy System Evaluation
      const fuzzyTerm = this.fuzzyEngine.evaluate(semConfidence, sem.averageDifficulty);
      sem.stressResult = fuzzyTerm;
      maxOverallStress = Math.max(maxOverallStress, fuzzyTerm.stressScore);

      // Generate Transparent Reasoning Cards (Spec Section 8)
      sem.courses.forEach(course => {
        const downstreamUnlocked = this.getDownstreamDependents(course.id, requiredCourses);
        const cardReason = this.buildReasoningCard({
          course,
          termIndex: sem.termIndex,
          totalTerms: semesters.length,
          downstreamUnlocked,
          confidence: confidenceScores[course.category] || avgConfidence,
          fuzzyTerm
        });
        sem.reasoningNotes.push(cardReason);
      });
    });

    // Remove trailing empty semesters beyond the active plan, keeping at least critical path
    while (semesters.length > Math.max(criticalPathLength, 2) && semesters[semesters.length - 1].courses.length === 0) {
      semesters.pop();
    }

    return {
      success: true,
      semesters,
      requiredCourses,
      totalScheduleCredits,
      criticalPathLength,
      criticalPathChain,
      isExtendedTermRequired,
      scheduledTermMap: Object.fromEntries(scheduledTermMap),
      maxOverallStress: Math.round(maxOverallStress * 10) / 10,
      unsatisfiableWarning: isExtendedTermRequired ? {
        title: "Extended Term Required",
        message: `Your selected target goals have a Critical Path Length of ${criticalPathLength} consecutive prerequisite levels, but your target timeline was set to ${maxAllowedSemesters} semesters. We have auto-scaled the roadmap to ${semesters.length} terms to prevent academic overload and prerequisite violations.`,
        criticalPathLength,
        maxAllowedSemesters
      } : null
    };
  }

  /**
   * Find direct downstream dependents for reasoning
   */
  getDownstreamDependents(courseId, allRequired) {
    return allRequired.filter(c => c.prerequisites && c.prerequisites.includes(courseId));
  }

  /**
   * Builds human-readable Transparent Reasoning Card for course placement
   */
  buildReasoningCard({ course, termIndex, totalTerms, downstreamUnlocked, confidence, fuzzyTerm }) {
    let unlockText = "";
    if (downstreamUnlocked.length > 0) {
      const names = downstreamUnlocked.slice(0, 2).map(c => c.code).join(" and ");
      unlockText = `Placed in Term ${termIndex} to unlock essential downstream sequence (${names}${downstreamUnlocked.length > 2 ? ` +${downstreamUnlocked.length - 2} more` : ""}).`;
    } else if (termIndex === totalTerms) {
      unlockText = `Scheduled in final Term ${termIndex} as terminal capstone milestone.`;
    } else {
      unlockText = `Scheduled in Term ${termIndex} to satisfy core degree distribution requirements.`;
    }

    let confidenceNote = "";
    if (confidence <= 4) {
      confidenceNote = `Subject confidence is low (${confidence}/10). Pacing calibrated with Mamdani credit cap (${fuzzyTerm.maxCredits} hrs).`;
    } else if (confidence >= 8) {
      confidenceNote = `Strong confidence (${confidence}/10) enables aggressive progression.`;
    } else {
      confidenceNote = `Moderate confidence balanced against course difficulty ${course.difficulty}/10.`;
    }

    return {
      courseId: course.id,
      courseCode: course.code,
      title: course.title,
      termIndex,
      unlockText,
      confidenceNote,
      difficulty: course.difficulty,
      stressStatus: fuzzyTerm.status
    };
  }

  /**
   * Verifies schedule integrity and checks for prerequisite violations
   */
  validateCustomPlacement(semesters) {
    const termMap = new Map();
    semesters.forEach(s => {
      s.courses.forEach(c => termMap.set(c.id, s.termIndex));
    });

    const violations = [];
    semesters.forEach(s => {
      s.courses.forEach(c => {
        const prereqs = c.prerequisites || [];
        for (const pId of prereqs) {
          if (termMap.has(pId)) {
            const pTerm = termMap.get(pId);
            if (pTerm >= s.termIndex) {
              const prereqCourse = this.catalogMap.get(pId);
              violations.push({
                course: c,
                prerequisite: prereqCourse || { code: pId, title: pId },
                currentTerm: s.termIndex,
                prereqTerm: pTerm,
                message: `${c.code} is in Term ${s.termIndex}, but prerequisite ${prereqCourse?.code || pId} is in Term ${pTerm} (must be strictly earlier).`
              });
            }
          }
        }
      });
    });

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
