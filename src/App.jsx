import React, { useState, useEffect, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { 
  MSU_NAAWAN_PROGRAMS, 
  MSU_NAAWAN_COURSES, 
  MSU_CAREER_TRACKS 
} from "./data/courses";
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
import { ImportProspectusModal } from "./components/ImportProspectusModal";
import { InstallPrompt } from "./components/InstallPrompt";
import { BottomNav } from "./components/BottomNav";
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

const STORAGE_KEY = "msu_courseadvisor_state_v2";
const IMPORTED_PROSPECTUS_KEY = "msu_imported_prospectus_v1";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState("planner");

  // Student Custom Imported Prospectus state
  const [importedProspectus, setImportedProspectus] = useState(null);

  // Core Degree Program & Student Configuration State
  const [selectedProgramId, setSelectedProgramId] = useState("bsba_marketing");
  const [selectedTrackId, setSelectedTrackId] = useState("corporate_practicum");
  const [targetCourseId, setTargetCourseId] = useState("MKT197");
  const [completedCourseIds, setCompletedCourseIds] = useState(["GEC101", "GEC102"]);
  const [confidenceScores, setConfidenceScores] = useState({
    domain1: 7,
    domain2: 7,
    domain3: 6,
    domain4: 6
  });
  const [maxAllowedSemesters, setMaxAllowedSemesters] = useState(8);

  // Edge-case cycle simulation state
  const [isCycleSimulated, setIsCycleSimulated] = useState(false);

  // Modals
  const [isFuzzyModalOpen, setIsFuzzyModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [detailedFuzzyData, setDetailedFuzzyData] = useState(null);

  // Dynamic active program metadata (handles student imported vs preloaded)
  const activeProgramInfo = useMemo(() => {
    if (selectedProgramId === "imported" && importedProspectus) {
      return {
        id: "imported",
        name: importedProspectus.name || "Student Imported Curriculum",
        major: importedProspectus.major || "Custom Specialization",
        college: importedProspectus.college || "Academic Department",
        reference: importedProspectus.reference || `Imported by Student (${importedProspectus.courses.length} courses)`,
        totalUnits: importedProspectus.totalUnits,
        color: "#8b5cf6",
        icon: "GraduationCap",
        isImported: true
      };
    }
    return MSU_NAAWAN_PROGRAMS.find(p => p.id === selectedProgramId) || MSU_NAAWAN_PROGRAMS[0];
  }, [selectedProgramId, importedProspectus]);

  // Dynamic active catalog based on student's imported prospectus or MSU Naawan program
  const activeCatalog = useMemo(() => {
    if (selectedProgramId === "imported" && importedProspectus?.courses) {
      return importedProspectus.courses;
    }
    return MSU_NAAWAN_COURSES[selectedProgramId] || MSU_NAAWAN_COURSES.bsba_marketing;
  }, [selectedProgramId, importedProspectus]);

  // Career Tracks / Target Milestones for active prospectus
  const careerTracks = useMemo(() => {
    if (selectedProgramId === "imported" && importedProspectus) {
      if (importedProspectus.terminalCapstones && importedProspectus.terminalCapstones.length > 0) {
        return importedProspectus.terminalCapstones.slice(0, 4).map((capId, idx) => {
          const course = importedProspectus.courses.find(c => c.id === capId) || { code: capId, title: "Capstone Milestone" };
          return {
            id: `capstone_${capId}`,
            title: course.title,
            targetGoalCourseId: capId,
            description: `Target capstone goal: complete ${course.code} (${course.credits || 3} units)`,
            color: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][idx % 4],
            icon: "Award"
          };
        });
      }
      return [];
    }
    return MSU_CAREER_TRACKS[selectedProgramId] || MSU_CAREER_TRACKS.bsba_marketing;
  }, [selectedProgramId, importedProspectus]);

  // Engines instantiated on current active prospectus
  const solver = useMemo(() => new ScheduleSolver(activeCatalog), [activeCatalog]);
  const fuzzyEngine = useMemo(() => new MamdaniFuzzyEngine(), []);

  // Cycle Overrides simulation map (dynamically links first two courses of active prospectus)
  const customOverrides = useMemo(() => {
    if (!isCycleSimulated) return null;
    if (activeCatalog.length < 2) return null;
    const c1 = activeCatalog[0].id;
    const c2 = activeCatalog[1].id;
    const map = new Map();
    map.set(c1, [c2]);
    map.set(c2, [c1]);
    return map;
  }, [isCycleSimulated, activeCatalog]);

  // Helper for computing student's average confidence
  const getAverageConfidence = useCallback(() => {
    const scores = Object.values(confidenceScores).filter(v => typeof v === "number");
    return scores.length > 0 
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 
      : 6.5;
  }, [confidenceScores]);

  // Load initial state from LocalStorage (Offline-First principle)
  useEffect(() => {
    try {
      const savedImport = localStorage.getItem(IMPORTED_PROSPECTUS_KEY);
      let parsedImport = null;
      if (savedImport) {
        parsedImport = JSON.parse(savedImport);
        setImportedProspectus(parsedImport);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedProgramId) {
          if (parsed.selectedProgramId === "imported" && parsedImport) {
            setSelectedProgramId("imported");
          } else if (MSU_NAAWAN_COURSES[parsed.selectedProgramId]) {
            setSelectedProgramId(parsed.selectedProgramId);
          }
        }
        if (parsed.selectedTrackId) setSelectedTrackId(parsed.selectedTrackId);
        if (parsed.targetCourseId) setTargetCourseId(parsed.targetCourseId);
        if (parsed.completedCourseIds) setCompletedCourseIds(parsed.completedCourseIds);
        if (parsed.confidenceScores) setConfidenceScores(parsed.confidenceScores);
        if (parsed.maxAllowedSemesters) setMaxAllowedSemesters(parsed.maxAllowedSemesters);
      } else if (parsedImport) {
        // If an imported prospectus exists, default to it
        setSelectedProgramId("imported");
        setTargetCourseId(parsedImport.defaultTarget || parsedImport.courses[parsedImport.courses.length - 1]?.id);
      }
    } catch (e) {
      console.warn("Failed to read from local storage", e);
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedProgramId,
        selectedTrackId,
        targetCourseId,
        completedCourseIds,
        confidenceScores,
        maxAllowedSemesters
      }));
    } catch (e) {
      console.warn("Failed to persist to local storage", e);
    }
  }, [selectedProgramId, selectedTrackId, targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters]);

  // Execute Graph Traversal & Fuzzy Workload Engine
  const scheduleResult = useMemo(() => {
    // Validate targetCourseId belongs to active catalog; fallback to program default if mismatch
    const validTargetId = activeCatalog.some(c => c.id === targetCourseId)
      ? targetCourseId
      : activeCatalog[activeCatalog.length - 1]?.id;

    return solver.generateSchedule({
      targetCourseIds: [validTargetId],
      completedCourseIds,
      confidenceScores,
      maxAllowedSemesters,
      customOverrides
    });
  }, [solver, targetCourseId, activeCatalog, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides]);

  // Handle Degree Program Switching
  const handleSelectProgram = (programId) => {
    setSelectedProgramId(programId);

    if (programId === "imported" && importedProspectus) {
      setSelectedTrackId(null);
      setTargetCourseId(importedProspectus.defaultTarget || importedProspectus.courses[importedProspectus.courses.length - 1]?.id);
      setCompletedCourseIds([]);
      setCustomSemesterPlan(null);
      setIsCycleSimulated(false);
      return;
    }

    const prog = MSU_NAAWAN_PROGRAMS.find(p => p.id === programId) || MSU_NAAWAN_PROGRAMS[0];
    const tracks = MSU_CAREER_TRACKS[programId] || [];
    const defaultTrack = tracks[0];

    if (defaultTrack) {
      setSelectedTrackId(defaultTrack.id);
      setTargetCourseId(defaultTrack.targetGoalCourseId);
    } else {
      setSelectedTrackId(null);
      setTargetCourseId(prog.defaultTarget);
    }

    // Reset completed courses and manual edits for the clean new prospectus
    setCompletedCourseIds([]);
    setCustomSemesterPlan(null);
    setIsCycleSimulated(false);
  };

  // Handle student-led prospectus import
  const handleImportProspectus = (newProspectus) => {
    setImportedProspectus(newProspectus);
    try {
      localStorage.setItem(IMPORTED_PROSPECTUS_KEY, JSON.stringify(newProspectus));
    } catch (e) {
      console.warn("Failed to persist imported prospectus", e);
    }

    setSelectedProgramId("imported");
    setSelectedTrackId(null);
    setTargetCourseId(newProspectus.defaultTarget || newProspectus.courses[newProspectus.courses.length - 1]?.id);
    setCompletedCourseIds([]);
    setCustomSemesterPlan(null);
    setIsCycleSimulated(false);

    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

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
  }, [targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides, selectedProgramId]);

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
    const avgConfidence = getAverageConfidence();

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
    const avgConfidence = getAverageConfidence();
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
    if (selectedProgramId === "imported" && importedProspectus) {
      setTargetCourseId(importedProspectus.defaultTarget || importedProspectus.courses[importedProspectus.courses.length - 1]?.id);
      setCompletedCourseIds([]);
      setConfidenceScores({ domain1: 7, domain2: 7, domain3: 6, domain4: 6 });
      setMaxAllowedSemesters(8);
      setIsCycleSimulated(false);
      setCustomSemesterPlan(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      return;
    }

    setSelectedProgramId("bsba_marketing");
    setSelectedTrackId("corporate_practicum");
    setTargetCourseId("MKT197");
    setCompletedCourseIds(["GEC101", "GEC102"]);
    setConfidenceScores({ domain1: 7, domain2: 7, domain3: 6, domain4: 6 });
    setMaxAllowedSemesters(8);
    setIsCycleSimulated(false);
    setCustomSemesterPlan(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  // Export JSON Plan
  const handleExportPlan = () => {
    const exportPayload = {
      version: "ARCH-2026-v2.1",
      exportedAt: new Date().toISOString(),
      degreeProgram: activeProgramInfo.name,
      major: activeProgramInfo.major,
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
    a.download = `CourseAdvisor_${activeProgramInfo.name.replace(/\s+/g, "_")}_${targetCourseId}.json`;
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
        {/* Circular Prerequisite Loop Warning (Spec Section 9) */}
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
            {/* Step 1: Target Goal Selector & MSU Naawan Prospectus Switcher */}
            <GoalSelector
              selectedProgramId={selectedProgramId}
              selectedTrackId={selectedTrackId}
              selectedTargetCourseId={targetCourseId}
              catalog={activeCatalog}
              maxAllowedSemesters={maxAllowedSemesters}
              onSelectProgram={handleSelectProgram}
              onSelectTrack={handleSelectTrack}
              onSelectTargetCourse={handleSelectTargetCourse}
              onUpdateAllowedSemesters={setMaxAllowedSemesters}
              activeProgramInfo={activeProgramInfo}
              importedProspectus={importedProspectus}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              careerTracks={careerTracks}
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

        {/* Tab 2: Prerequisite DAG Visualizer & Mobile Pathway Stream */}
        {activeTab === "graph" && (
          <div className="fade-in">
            <div style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Directed Acyclic Graph (DAG) Network</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Touch any course node to highlight upstream prerequisites (blue) and downstream dependents (purple).
              </p>
            </div>

            <PrerequisiteGraphView
              catalog={activeCatalog}
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
              programId={selectedProgramId}
              confidenceScores={confidenceScores}
              onChange={setConfidenceScores}
            />

            {/* Quick Preview of Resulting Schedule Under Current Confidence */}
            <div className="glass-panel" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
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
            catalog={activeCatalog}
            completedCourseIds={completedCourseIds}
            onToggleCourse={handleToggleCompletedCourse}
            onSetCompletedCourses={setCompletedCourseIds}
          />
        )}



        {/* Tab 6: Course Catalog */}
        {activeTab === "catalog" && (
          <CatalogBrowser
            catalog={activeCatalog}
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

      {/* Student Prospectus Import Modal */}
      <ImportProspectusModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportProspectus={handleImportProspectus}
        currentProspectusName={activeProgramInfo.name}
      />

      {/* PWA App Install Banner for PWABuilder / Mobile App Install */}
      <InstallPrompt />

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
          <span>Mindanao State University at Naawan (MSU Naawan)</span>
          <span>•</span>
          <span>CourseAdvisor Dual-Engine Platform (ARCH-2026-v2.1)</span>
          <span>•</span>
          <span>Offline-Ready Progressive Web App</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (PWA Native Feel) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
