import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { COURSE_CATALOG, CAREER_TRACKS } from "./data/courses";
import { ScheduleSolver } from "./engine/scheduleSolver";
import { MamdaniFuzzyEngine } from "./engine/fuzzyInference";
import { Header } from "./components/Header";
import { GoalSelector } from "./components/GoalSelector";
import { ConfidenceSliders } from "./components/ConfidenceSliders";
import { SemesterPlanBoard } from "./components/SemesterPlanBoard";
import { PrerequisiteGraphView } from "./components/PrerequisiteGraphView";
import { TranscriptManager } from "./components/TranscriptManager";
import { CatalogBrowser } from "./components/CatalogBrowser";
import { FuzzyInspectorModal } from "./components/FuzzyInspectorModal";
import { SystemFlowchartModal } from "./components/SystemFlowchartModal";
import { 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Flame,
  HelpCircle
} from "lucide-react";
import "./styles/theme.css";

const STORAGE_KEY = "courseadvisor_state_v1";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState("planner");

  // Core Student Configuration State
  const [selectedTrackId, setSelectedTrackId] = useState("ai_ml");
  const [targetCourseId, setTargetCourseId] = useState("CS480");
  const [completedCourseIds, setCompletedCourseIds] = useState(["MATH101", "CS101"]);
  const [confidenceScores, setConfidenceScores] = useState({
    coding: 8,
    math: 7,
    systems: 6,
    theory: 6
  });
  const [maxAllowedSemesters, setMaxAllowedSemesters] = useState(6);

  // Edge-case cycle simulation state
  const [isCycleSimulated, setIsCycleSimulated] = useState(false);

  // Modals
  const [isFuzzyModalOpen, setIsFuzzyModalOpen] = useState(false);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);
  const [detailedFuzzyData, setDetailedFuzzyData] = useState(null);

  // Engines
  const solver = useMemo(() => new ScheduleSolver(COURSE_CATALOG), []);
  const fuzzyEngine = useMemo(() => new MamdaniFuzzyEngine(), []);

  // Cycle Overrides simulation map
  const customOverrides = useMemo(() => {
    if (!isCycleSimulated) return null;
    // Inject a loop: CS101 requires CS102, CS102 requires CS101
    const map = new Map();
    map.set("CS101", ["CS102"]);
    map.set("CS102", ["CS101"]);
    return map;
  }, [isCycleSimulated]);

  // Load initial state from LocalStorage (Offline-First principle)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedTrackId) setSelectedTrackId(parsed.selectedTrackId);
        if (parsed.targetCourseId) setTargetCourseId(parsed.targetCourseId);
        if (parsed.completedCourseIds) setCompletedCourseIds(parsed.completedCourseIds);
        if (parsed.confidenceScores) setConfidenceScores(parsed.confidenceScores);
        if (parsed.maxAllowedSemesters) setMaxAllowedSemesters(parsed.maxAllowedSemesters);
      }
    } catch (e) {
      console.warn("Failed to read from local storage", e);
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedTrackId,
        targetCourseId,
        completedCourseIds,
        confidenceScores,
        maxAllowedSemesters
      }));
    } catch (e) {
      console.warn("Failed to persist to local storage", e);
    }
  }, [selectedTrackId, targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters]);

  // Execute Graph Traversal & Fuzzy Workload Engine
  const scheduleResult = useMemo(() => {
    return solver.generateSchedule({
      targetCourseIds: [targetCourseId],
      completedCourseIds,
      confidenceScores,
      maxAllowedSemesters,
      customOverrides
    });
  }, [solver, targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides]);

  // Handle Track Selection
  const handleSelectTrack = (track) => {
    setSelectedTrackId(track.id);
    setTargetCourseId(track.targetGoalCourseId);
  };

  // Handle Custom Target Course Selection
  const handleSelectTargetCourse = (courseId) => {
    setTargetCourseId(courseId);
    setSelectedTrackId(null);
  };

  // Handle Course Completion Toggle
  const handleToggleCompletedCourse = (courseId) => {
    setCompletedCourseIds(curr => {
      if (curr.includes(courseId)) {
        return curr.filter(id => id !== courseId);
      } else {
        return [...curr, courseId];
      }
    });
  };

  // Handle Move Course Between Semesters
  const [customSemesterPlan, setCustomSemesterPlan] = useState(null);

  // Reset custom manual shifts whenever inputs recalculate
  useEffect(() => {
    setCustomSemesterPlan(null);
  }, [targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides]);

  const activeSemesters = customSemesterPlan || scheduleResult.semesters || [];

  const handleMoveCourse = (courseId, fromTerm, toTerm) => {
    const newSemesters = JSON.parse(JSON.stringify(activeSemesters));
    const sourceSem = newSemesters.find(s => s.termIndex === fromTerm);
    const targetSem = newSemesters.find(s => s.termIndex === toTerm);

    if (!sourceSem || !targetSem) return;

    const courseIdx = sourceSem.courses.findIndex(c => c.id === courseId);
    if (courseIdx === -1) return;

    const [course] = sourceSem.courses.splice(courseIdx, 1);
    sourceSem.totalCredits -= course.credits;

    targetSem.courses.push(course);
    targetSem.totalCredits += course.credits;

    // Recalculate fuzzy stress for affected terms
    const avgConfidence = (
      confidenceScores.math + confidenceScores.coding + confidenceScores.systems + confidenceScores.theory
    ) / 4;

    [sourceSem, targetSem].forEach(sem => {
      if (sem.courses.length > 0) {
        const weightedDiff = sem.courses.reduce((sum, c) => sum + (c.difficulty * c.credits), 0);
        sem.averageDifficulty = Math.round((weightedDiff / sem.totalCredits) * 10) / 10;
        sem.stressResult = fuzzyEngine.evaluate(avgConfidence, sem.averageDifficulty);
      }
    });

    setCustomSemesterPlan(newSemesters);
  };

  // Inspect Fuzzy Engine Modal
  const handleOpenFuzzyInspector = (customFuzzy = null) => {
    const avgConfidence = (
      confidenceScores.math + confidenceScores.coding + confidenceScores.systems + confidenceScores.theory
    ) / 4;
    const evaluation = customFuzzy || fuzzyEngine.evaluate(avgConfidence, 7.5);
    setDetailedFuzzyData(evaluation);
    setIsFuzzyModalOpen(true);
  };

  // Confetti trigger
  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Reset to default
  const handleResetPlan = () => {
    setSelectedTrackId("ai_ml");
    setTargetCourseId("CS480");
    setCompletedCourseIds(["MATH101", "CS101"]);
    setConfidenceScores({ coding: 8, math: 7, systems: 6, theory: 6 });
    setMaxAllowedSemesters(6);
    setIsCycleSimulated(false);
    setCustomSemesterPlan(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Export JSON Plan
  const handleExportPlan = () => {
    const exportPayload = {
      version: "ARCH-2026-v2.1",
      exportedAt: new Date().toISOString(),
      targetGoal: targetCourseId,
      completedCourses: completedCourseIds,
      confidenceScores,
      semesters: activeSemesters.map(s => ({
        term: s.termName,
        season: s.season,
        credits: s.totalCredits,
        stressScore: s.stressResult?.stressScore,
        courses: s.courses.map(c => ({ code: c.code, title: c.title, credits: c.credits }))
      }))
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CourseAdvisor_Roadmap_${targetCourseId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* System Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportPlan={handleExportPlan}
        onTriggerConfetti={handleTriggerConfetti}
        onResetPlan={handleResetPlan}
        totalCredits={scheduleResult.totalScheduleCredits || 0}
        maxStress={scheduleResult.maxOverallStress || 0}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem", width: "100%", flex: 1 }}>
        {/* Circular Prerequisite Loop Warning (Spec Section 9 & Flowchart Loop Step) */}
        {!scheduleResult.success && scheduleResult.error === "CIRCULAR_DEPENDENCY_DETECTED" && (
          <div
            className="glass-panel fade-in"
            style={{
              border: "2px solid #ef4444",
              background: "rgba(239, 68, 68, 0.12)",
              padding: "1.5rem",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem"
            }}
          >
            <ShieldAlert size={32} color="#ef4444" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-rose">Safety Intercepted</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fca5a5" }}>
                  Circular Prerequisite Loop Detected!
                </h3>
              </div>

              <p style={{ color: "#fecaca", fontSize: "0.875rem", margin: "0.5rem 0" }}>
                {scheduleResult.message}
              </p>

              <div style={{
                background: "rgba(0,0,0,0.3)",
                padding: "0.5rem 0.85rem",
                borderRadius: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "#fda4af",
                marginBottom: "0.75rem"
              }}>
                Loop Sequence: {scheduleResult.cyclePath?.join(" → ")}
              </div>

              <button
                onClick={() => setIsCycleSimulated(false)}
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.85rem", background: "#ef4444" }}
              >
                <RotateCcw size={14} /> Clear Simulated Loop & Restore Graph
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Semester Roadmap Planner */}
        {activeTab === "planner" && scheduleResult.success && (
          <div className="fade-in">
            {/* Step 1: Target Goal Selector */}
            <GoalSelector
              selectedTrackId={selectedTrackId}
              selectedTargetCourseId={targetCourseId}
              catalog={COURSE_CATALOG}
              maxAllowedSemesters={maxAllowedSemesters}
              onSelectTrack={handleSelectTrack}
              onSelectTargetCourse={handleSelectTargetCourse}
              onUpdateAllowedSemesters={setMaxAllowedSemesters}
            />

            {/* Step 2 & 3: Semester Plan Board */}
            <SemesterPlanBoard
              semesters={activeSemesters}
              criticalPathLength={scheduleResult.criticalPathLength}
              totalCredits={scheduleResult.totalScheduleCredits}
              maxOverallStress={scheduleResult.maxOverallStress}
              unsatisfiableWarning={scheduleResult.unsatisfiableWarning}
              onMoveCourse={handleMoveCourse}
              onInspectFuzzy={() => handleOpenFuzzyInspector()}
              onViewCourseDetails={(id) => {
                setActiveTab("catalog");
              }}
            />
          </div>
        )}

        {/* Tab 2: Prerequisite DAG Visualizer */}
        {activeTab === "graph" && (
          <div className="fade-in">
            <div style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Directed Acyclic Graph (DAG) Network</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Click any course node to highlight upstream prerequisites (blue) and downstream dependents (purple).
              </p>
            </div>

            <PrerequisiteGraphView
              catalog={COURSE_CATALOG}
              requiredCourses={scheduleResult.requiredCourses || []}
              completedCourseIds={completedCourseIds}
              targetCourseIds={[targetCourseId]}
              tierMap={scheduleResult.tierMap || {}}
              onToggleComplete={handleToggleCompletedCourse}
            />
          </div>
        )}

        {/* Tab 3: Confidence & Stress Tuning */}
        {activeTab === "confidence" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ConfidenceSliders
              confidenceScores={confidenceScores}
              onChange={setConfidenceScores}
            />

            {/* Quick Preview of Resulting Schedule Under Current Confidence */}
            <div className="glass-panel" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Real-time Recalculation Impact</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    See how adjusting confidence directly reshapes credit bounds and term stress.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenFuzzyInspector()}
                  className="btn-primary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                >
                  <Sparkles size={14} /> Open Full Fuzzy Math Inspector
                </button>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1rem"
              }}>
                {activeSemesters.map(s => (
                  <div
                    key={s.termIndex}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "0.85rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong>{s.termName}</strong>
                      <span style={{
                        color: s.stressResult?.statusColor || "#10b981",
                        fontWeight: 700,
                        fontSize: "0.8rem"
                      }}>
                        {s.stressResult?.stressScore}% Stress
                      </span>
                    </div>

                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Max Credit Bound: <strong>{s.stressResult?.maxCredits} hrs</strong>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Scheduled: <strong>{s.totalCredits} credits</strong> ({s.courses.length} courses)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Transcript History */}
        {activeTab === "transcript" && (
          <TranscriptManager
            catalog={COURSE_CATALOG}
            completedCourseIds={completedCourseIds}
            onToggleCourse={handleToggleCompletedCourse}
            onSetCompletedCourses={setCompletedCourseIds}
          />
        )}

        {/* Tab 5: System Flowchart & Edge Case Simulator */}
        {activeTab === "flowchart" && (
          <div className="fade-in">
            <SystemFlowchartModal
              onClose={() => setActiveTab("planner")}
              onTestCycle={() => setIsCycleSimulated(true)}
              onResetCycle={() => setIsCycleSimulated(false)}
              isCycleActive={isCycleSimulated}
              criticalPathLength={scheduleResult.criticalPathLength}
              currentSemestersCount={activeSemesters.length}
            />
          </div>
        )}

        {/* Tab 6: Course Catalog */}
        {activeTab === "catalog" && (
          <CatalogBrowser
            catalog={COURSE_CATALOG}
            completedCourseIds={completedCourseIds}
            targetCourseIds={[targetCourseId]}
            onToggleComplete={handleToggleCompletedCourse}
            onSetAsTarget={handleSelectTargetCourse}
          />
        )}
      </main>

      {/* Fuzzy Math Inspector Modal */}
      {isFuzzyModalOpen && (
        <FuzzyInspectorModal
          fuzzyEvaluation={detailedFuzzyData}
          onClose={() => setIsFuzzyModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(10, 14, 23, 0.9)",
        padding: "1rem 1.5rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        marginTop: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span>CourseAdvisor Native Architecture Platform</span>
          <span>•</span>
          <span>Dual-Engine: Backward Chaining Inference & Mamdani Fuzzy System</span>
          <span>•</span>
          <span>Document ID: ARCH-2026-v2.1</span>
        </div>
      </footer>
    </div>
  );
}
