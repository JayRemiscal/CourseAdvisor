/**
 * CourseAdvisor Backward Chaining Prerequisite Graph Engine
 * Document ID: ARCH-2026-v2.1 Section 3.1
 * 
 * Implements:
 * 1. Goal Node Identification ($V_{target}$)
 * 2. Recursive Stack Traversal (skipping completed transcript courses)
 * 3. Strict Cycle Detection (DFS with active recursion stack & Tarjan's concepts)
 * 4. Topological Tier Assignment (Tier 0: independent, Tier N: requires Tier N-1)
 * 5. Critical Path Calculation & Unsatisfiable Goal Detection
 */

export class BackwardChainingEngine {
  constructor(courseCatalog) {
    this.catalog = new Map();
    courseCatalog.forEach(course => {
      this.catalog.set(course.id, course);
    });
  }

  /**
   * Detects cycles in the provided prerequisite graph using DFS 3-color marking.
   * Prevents stack overflow and alerts user cleanly.
   */
  detectCycles(targetCourseId, customEdges = null) {
    // 0: unvisited, 1: currently in recursion stack (gray), 2: fully evaluated (black)
    const state = new Map();
    const parentMap = new Map();
    let cycleFound = null;

    const getPrereqs = (courseId) => {
      if (customEdges && customEdges.has(courseId)) {
        return customEdges.get(courseId);
      }
      const course = this.catalog.get(courseId);
      return course ? course.prerequisites : [];
    };

    const dfs = (node, path) => {
      state.set(node, 1);
      path.push(node);

      const prereqs = getPrereqs(node);
      for (const prereqId of prereqs) {
        if (!this.catalog.has(prereqId)) continue;

        const pState = state.get(prereqId) || 0;
        if (pState === 1) {
          // Cycle found!
          const cycleStartIdx = path.indexOf(prereqId);
          cycleFound = [...path.slice(cycleStartIdx), prereqId];
          return true;
        }

        if (pState === 0) {
          parentMap.set(prereqId, node);
          if (dfs(prereqId, path)) return true;
        }
      }

      path.pop();
      state.set(node, 2);
      return false;
    }

    if (targetCourseId) {
      dfs(targetCourseId, []);
    } else {
      // Check full catalog
      for (const courseId of this.catalog.keys()) {
        if ((state.get(courseId) || 0) === 0) {
          if (dfs(courseId, [])) break;
        }
      }
    }

    return {
      hasCycle: cycleFound !== null,
      cyclePath: cycleFound
    };
  }

  /**
   * Backward Chaining Algorithm
   * Traverses backward from target node(s), collecting all uncompleted prerequisites.
   * 
   * @param {string | string[]} targetCourseIds - Target goal course id(s)
   * @param {Set<string> | Array<string>} completedCourseIds - Already satisfied transcript courses
   * @param {Map<string, string[]> | null} customOverrides - Optional custom prerequisite graph overrides
   */
  solvePrerequisites(targetCourseIds, completedCourseIds = [], customOverrides = null) {
    const targets = Array.isArray(targetCourseIds) ? targetCourseIds : [targetCourseIds];
    const completedSet = new Set(completedCourseIds);

    // Step 1: Cycle Detection on the candidate subgraph
    for (const targetId of targets) {
      const cycleCheck = this.detectCycles(targetId, customOverrides);
      if (cycleCheck.hasCycle) {
        return {
          success: false,
          error: "CIRCULAR_DEPENDENCY_DETECTED",
          cyclePath: cycleCheck.cyclePath,
          message: `Circular prerequisite loop detected: ${cycleCheck.cyclePath.join(" → ")}. Traversal halted to prevent recursion failure.`
        };
      }
    }

    const getPrereqs = (courseId) => {
      if (customOverrides && customOverrides.has(courseId)) {
        return customOverrides.get(courseId);
      }
      const course = this.catalog.get(courseId);
      return course ? course.prerequisites : [];
    };

    // Step 2: Recursive Stack Traversal (Backward Chaining)
    // Gather all ancestor courses required to achieve targets, skipping completed ones
    const requiredSet = new Set();
    const traversalStack = [...targets];
    const visited = new Set();

    while (traversalStack.length > 0) {
      const currentId = traversalStack.pop();
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const course = this.catalog.get(currentId);
      if (!course) continue;

      // If already satisfied in transcript, do not require taking it again,
      // but its own completed state is already satisfied.
      if (completedSet.has(currentId)) {
        continue;
      }

      requiredSet.add(currentId);

      const prereqs = getPrereqs(currentId);
      for (const prereqId of prereqs) {
        if (!completedSet.has(prereqId)) {
          traversalStack.push(prereqId);
        }
      }
    }

    // Step 3: Topological Tier Assignment
    // Tier 0: Courses with 0 remaining uncompleted prerequisites.
    // Tier N: Courses whose uncompleted prerequisites are all in Tier < N.
    const tierMap = new Map();
    const inDegreeMap = new Map();
    const adjMap = new Map(); // prereq -> dependent courses

    requiredSet.forEach(cId => {
      adjMap.set(cId, []);
      inDegreeMap.set(cId, 0);
    });

    requiredSet.forEach(cId => {
      const prereqs = getPrereqs(cId).filter(p => requiredSet.has(p));
      inDegreeMap.set(cId, prereqs.length);
      prereqs.forEach(p => {
        adjMap.get(p).push(cId);
      });
    });

    // Kahn's based layer assignment
    const queue = [];
    requiredSet.forEach(cId => {
      if (inDegreeMap.get(cId) === 0) {
        queue.push({ id: cId, tier: 0 });
        tierMap.set(cId, 0);
      }
    });

    const tierGroups = {};
    let maxTier = 0;

    const tempInDegree = new Map(inDegreeMap);

    while (queue.length > 0) {
      const { id, tier } = queue.shift();
      if (!tierGroups[tier]) tierGroups[tier] = [];
      tierGroups[tier].push(this.catalog.get(id));
      maxTier = Math.max(maxTier, tier);

      const dependents = adjMap.get(id) || [];
      for (const depId of dependents) {
        const currentDeg = tempInDegree.get(depId) - 1;
        tempInDegree.set(depId, currentDeg);

        const currentTier = tierMap.get(depId) || 0;
        tierMap.set(depId, Math.max(currentTier, tier + 1));

        if (currentDeg === 0) {
          queue.push({ id: depId, tier: tierMap.get(depId) });
        }
      }
    }

    // Critical Path Length (minimum number of consecutive semesters required)
    const criticalPathLength = requiredSet.size === 0 ? 0 : maxTier + 1;

    // Detailed dependency chains
    const dependencyChains = this.computeCriticalChain(targets, completedSet, getPrereqs);

    return {
      success: true,
      requiredCourses: Array.from(requiredSet).map(id => this.catalog.get(id)),
      tierMap: Object.fromEntries(tierMap),
      tierGroups,
      criticalPathLength,
      criticalPathChain: dependencyChains,
      targetCourses: targets.map(id => this.catalog.get(id))
    };
  }

  /**
   * Computes the longest prerequisite chain leading to any target
   */
  computeCriticalChain(targets, completedSet, getPrereqs) {
    let longestPath = [];

    const findLongest = (node, path) => {
      const nextPath = [node, ...path];
      const prereqs = getPrereqs(node).filter(p => !completedSet.has(p) && this.catalog.has(p));
      
      if (prereqs.length === 0) {
        if (nextPath.length > longestPath.length) {
          longestPath = nextPath;
        }
        return;
      }

      for (const p of prereqs) {
        findLongest(p, nextPath);
      }
    };

    targets.forEach(t => findLongest(t, []));
    return longestPath.map(id => this.catalog.get(id));
  }
}
