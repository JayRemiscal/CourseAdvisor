import React, { useState } from "react";
import { Play, RotateCcw, AlertTriangle, CheckCircle, ArrowDown, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";

export function SystemFlowchartModal({ 
  onClose, 
  onTestCycle, 
  onResetCycle, 
  isCycleActive, 
  criticalPathLength, 
  currentSemestersCount 
}) {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: "goal",
      title: "Choose your goal",
      subtitle: "Degree or last class",
      type: "user",
      color: "#10b981",
      badge: "You do this"
    },
    {
      id: "passed",
      title: "Add passed classes",
      subtitle: "The app skips them",
      type: "user",
      color: "#10b981",
      badge: "You do this"
    },
    {
      id: "loop_check",
      title: "Is there a loop?",
      subtitle: "A needs B, B needs A",
      type: "question",
      color: "#d97706",
      badge: "Question"
    },
    {
      id: "backward",
      title: "Work backward",
      subtitle: "What comes before it?",
      type: "app",
      color: "#6366f1",
      badge: "App does this"
    },
    {
      id: "levels",
      title: "Put classes in levels",
      subtitle: "Level 0, 1, 2...",
      type: "app",
      color: "#6366f1",
      badge: "App does this"
    },
    {
      id: "stress",
      title: "Check stress",
      subtitle: "Safe credits and stress",
      type: "app",
      color: "#6366f1",
      badge: "App does this"
    },
    {
      id: "enough_terms",
      title: "Enough semesters?",
      subtitle: "Checks the longest chain",
      type: "question",
      color: "#d97706",
      badge: "Question"
    },
    {
      id: "build",
      title: "Build the schedule",
      subtitle: "Classes per semester",
      type: "app",
      color: "#6366f1",
      badge: "App does this"
    },
    {
      id: "show",
      title: "Show your plan",
      subtitle: "Map, meter, short notes",
      type: "user",
      color: "#10b981",
      badge: "You do this"
    },
    {
      id: "change",
      title: "You change it",
      subtitle: "Slider or class",
      type: "user",
      color: "#64748b",
      badge: "Loop recalculate"
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel fade-in"
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "1.75rem",
          background: "#0d131f",
          border: "1px solid rgba(99, 102, 241, 0.4)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="badge badge-indigo">System Pipeline</span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>CourseAdvisor Algorithmic Sequence Flow</h2>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              As specified in Document ID ARCH-2026-v2.1 & System Flowchart Architecture
            </p>
          </div>

          <button onClick={onClose} style={{ fontSize: "1.5rem", color: "var(--text-muted)", lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Edge Case Simulation Testing Bar */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <div>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
              Live Edge-Case Simulation Testing:
            </strong>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Inject circular prerequisite loops or force critical path overflows to test engine resilience.
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isCycleActive ? (
              <button
                onClick={onResetCycle}
                className="btn-primary"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", background: "#10b981" }}
              >
                <CheckCircle size={14} /> Restore Valid Graph
              </button>
            ) : (
              <button
                onClick={onTestCycle}
                className="btn-secondary"
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", borderColor: "#ef4444", color: "#f87171" }}
              >
                <AlertTriangle size={14} /> Simulate Loop (A ↔ B)
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", fontSize: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 12, height: 12, borderRadius: "3px", background: "#10b981" }} /> You do this
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 12, height: 12, borderRadius: "3px", background: "#6366f1" }} /> App does this
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 12, height: 12, borderRadius: "3px", background: "#d97706" }} /> Question
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 12, height: 12, borderRadius: "3px", background: "#dc2626" }} /> Problem
          </span>
        </div>

        {/* Flowchart Diagram Representation */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          {/* Step 1: Goal */}
          <div style={{
            background: "#064e3b",
            border: "1px solid #059669",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Choose your goal</div>
            <div style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>Degree or last class</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 2: Passed classes */}
          <div style={{
            background: "#064e3b",
            border: "1px solid #059669",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Add passed classes</div>
            <div style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>The app skips them</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 3 & Cycle Branch */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
            <div style={{
              background: isCycleActive ? "#b45309" : "#78350f",
              border: isCycleActive ? "2px solid #f59e0b" : "1px solid #b45309",
              borderRadius: "8px",
              padding: "0.75rem 2rem",
              textAlign: "center",
              width: "280px",
              boxShadow: isCycleActive ? "0 0 15px rgba(245, 158, 11, 0.5)" : "none"
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Is there a loop?</div>
              <div style={{ fontSize: "0.75rem", color: "#fde68a" }}>A needs B, B needs A</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#f87171", fontWeight: 700 }}>Yes →</span>
              <div style={{
                background: isCycleActive ? "#991b1b" : "#450a0a",
                border: isCycleActive ? "2px solid #ef4444" : "1px solid #991b1b",
                borderRadius: "8px",
                padding: "0.75rem 1.25rem",
                textAlign: "center",
                width: "200px",
                boxShadow: isCycleActive ? "0 0 20px rgba(239, 68, 68, 0.6)" : "none"
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fecaca" }}>Stop and warn</div>
                <div style={{ fontSize: "0.72rem", color: "#fca5a5" }}>Fix the data (Loop halted)</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, margin: "-4px 0" }}>↓ No</div>

          {/* Step 4: Work backward */}
          <div style={{
            background: "#312e81",
            border: "1px solid #4338ca",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Work backward</div>
            <div style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>What comes before it?</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 5: Put classes in levels */}
          <div style={{
            background: "#312e81",
            border: "1px solid #4338ca",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Put classes in levels</div>
            <div style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>Level 0, 1, 2... (Tiers)</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 6: Check stress */}
          <div style={{
            background: "#312e81",
            border: "1px solid #4338ca",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Check stress</div>
            <div style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>Safe credits & Mamdani Stress</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 7: Enough semesters & overflow branch */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              background: "#78350f",
              border: "1px solid #b45309",
              borderRadius: "8px",
              padding: "0.75rem 2rem",
              textAlign: "center",
              width: "280px"
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Enough semesters?</div>
              <div style={{ fontSize: "0.75rem", color: "#fde68a" }}>Checks the longest chain</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#f87171", fontWeight: 700 }}>No →</span>
              <div style={{
                background: "#450a0a",
                border: "1px solid #991b1b",
                borderRadius: "8px",
                padding: "0.75rem 1.25rem",
                textAlign: "center",
                width: "200px"
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fecaca" }}>Add semesters</div>
                <div style={{ fontSize: "0.72rem", color: "#fca5a5" }}>Needs more time (Extended)</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, margin: "-4px 0" }}>↓ Yes</div>

          {/* Step 8: Build schedule */}
          <div style={{
            background: "#312e81",
            border: "1px solid #4338ca",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Build the schedule</div>
            <div style={{ fontSize: "0.75rem", color: "#c7d2fe" }}>Classes per semester</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 9: Show your plan */}
          <div style={{
            background: "#064e3b",
            border: "1px solid #059669",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px"
          }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Show your plan</div>
            <div style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>Map, meter, short notes</div>
          </div>

          <ArrowDown size={18} color="#64748b" />

          {/* Step 10: Feedback loop */}
          <div style={{
            background: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            textAlign: "center",
            width: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem"
          }}>
            <CornerDownLeft size={16} color="#94a3b8" />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>You change it</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Slider or class (Loops back)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
