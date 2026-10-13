import React, { useState } from "react";
import { SemesterStressMeter } from "./SemesterStressMeter";
import { ReasoningCard } from "./ReasoningCard";
import { CATEGORY_COLORS } from "../data/courses";
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Sparkles,
  BookOpen
} from "lucide-react";

export function SemesterPlanBoard({
  semesters,
  criticalPathLength,
  totalCredits,
  maxOverallStress,
  unsatisfiableWarning,
  onMoveCourse,
  onInspectFuzzy,
  onViewCourseDetails
}) {
  const [expandedReasoningTerm, setExpandedReasoningTerm] = useState(null);

  const toggleReasoning = (termIndex) => {
    setExpandedReasoningTerm(curr => curr === termIndex ? null : termIndex);
  };

  return (
    <div className="semester-plan-board fade-in">
      {/* Unsatisfiable Goal / Critical Path Warning Alert (Spec Section 9) */}
      {unsatisfiableWarning && (
        <div
          className="glass-panel"
          style={{
            border: "1px solid rgba(245, 158, 11, 0.4)",
            background: "rgba(245, 158, 11, 0.08)",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            borderRadius: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.85rem"
          }}
        >
          <AlertTriangle color="#f59e0b" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ color: "#fbbf24", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem" }}>
              {unsatisfiableWarning.title}: Critical Path Constraint Active
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.4 }}>
              {unsatisfiableWarning.message}
            </p>
          </div>
        </div>
      )}

      {/* Metrics Header Summary Bar */}
      <div 
        className="glass-panel"
        style={{
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Academic Duration
            </span>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {semesters.length} Semesters
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />

          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Degree Load
            </span>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#38bdf8" }}>
              {totalCredits} Credit Hours
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />

          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              DAG Critical Path Length
            </span>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a855f7" }}>
              {criticalPathLength} Levels
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: "var(--border-subtle)" }} />

          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Peak Term Stress
            </span>
            <div style={{ 
              fontSize: "1.25rem", 
              fontWeight: 800, 
              color: maxOverallStress > 70 ? "#ef4444" : maxOverallStress > 40 ? "#f59e0b" : "#10b981" 
            }}>
              {maxOverallStress}%
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={onInspectFuzzy}
            className="btn-secondary" 
            style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
          >
            <Sparkles size={14} color="#6366f1" /> View Fuzzy Stress Logic
          </button>
        </div>
      </div>

      {/* Semesters Grid */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "1.25rem"
        }}
      >
        {semesters.map((term, tIdx) => {
          const isReasoningOpen = expandedReasoningTerm === term.termIndex;
          const targetCap = term.stressResult?.maxCredits || 15;
          const isOverloaded = term.totalCredits > targetCap;

          return (
            <div
              key={term.termIndex}
              className="glass-panel"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                border: isOverloaded ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-subtle)",
                transition: "border-color 0.2s ease"
              }}
            >
              {/* Term Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={16} color="#818cf8" />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                      {term.termName}
                    </h3>
                    <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                      {term.season}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Avg Subject Difficulty: <strong>{term.averageDifficulty}/10</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ 
                    fontFamily: "var(--font-mono)", 
                    fontWeight: 800, 
                    fontSize: "1.1rem",
                    color: isOverloaded ? "#ef4444" : "var(--text-primary)"
                  }}>
                    {term.totalCredits} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>credits</span>
                  </div>
                </div>
              </div>

              {/* Mamdani Stress Gauge for this Semester */}
              <div style={{ marginBottom: "1rem" }}>
                <SemesterStressMeter
                  stressResult={term.stressResult}
                  currentCredits={term.totalCredits}
                  targetCreditCap={targetCap}
                  onInspectFuzzy={onInspectFuzzy}
                />
              </div>

              {/* Courses List */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1rem" }}>
                {term.courses.length === 0 ? (
                  <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    border: "1px dashed var(--border-subtle)",
                    borderRadius: "8px"
                  }}>
                    No courses scheduled for this semester.
                  </div>
                ) : (
                  term.courses.map((course) => {
                    const cat = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;

                    return (
                      <div
                        key={course.id}
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border-subtle)",
                          borderLeft: `4px solid ${cat.border}`,
                          borderRadius: "8px",
                          padding: "0.75rem 0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "background 0.2s"
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              color: "var(--text-primary)"
                            }}>
                              {course.code}
                            </span>
                            <span style={{
                              fontSize: "0.68rem",
                              color: "var(--text-muted)",
                              fontFamily: "var(--font-mono)"
                            }}>
                              {course.credits} cr
                            </span>
                          </div>

                          <div style={{
                            fontSize: "0.78rem",
                            color: "var(--text-secondary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "2px"
                          }}>
                            {course.title}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          {tIdx > 0 && (
                            <button
                              onClick={() => onMoveCourse(course.id, term.termIndex, term.termIndex - 1)}
                              title="Move to Previous Term"
                              style={{
                                padding: "0.25rem",
                                borderRadius: "4px",
                                background: "rgba(255, 255, 255, 0.05)"
                              }}
                            >
                              <ChevronLeft size={14} />
                            </button>
                          )}

                          {tIdx < semesters.length - 1 && (
                            <button
                              onClick={() => onMoveCourse(course.id, term.termIndex, term.termIndex + 1)}
                              title="Move to Next Term"
                              style={{
                                padding: "0.25rem",
                                borderRadius: "4px",
                                background: "rgba(255, 255, 255, 0.05)"
                              }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          )}

                          {onViewCourseDetails && (
                            <button
                              onClick={() => onViewCourseDetails(course.id)}
                              title="View Syllabus & Prereqs"
                              style={{
                                padding: "0.25rem",
                                borderRadius: "4px",
                                background: "rgba(255, 255, 255, 0.05)"
                              }}
                            >
                              <BookOpen size={14} color="#94a3b8" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Transparent Placement Reasoning (Spec Section 8) */}
              {term.reasoningNotes && term.reasoningNotes.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem", marginTop: "auto" }}>
                  <button
                    onClick={() => toggleReasoning(term.termIndex)}
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      padding: "0.3rem 0"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Sparkles size={12} color="#6366f1" /> Transparent Placement Logic ({term.reasoningNotes.length})
                    </span>
                    <span>{isReasoningOpen ? "▲ Hide" : "▼ Show"}</span>
                  </button>

                  {isReasoningOpen && (
                    <div className="fade-in" style={{ marginTop: "0.6rem" }}>
                      {term.reasoningNotes.map((note) => (
                        <ReasoningCard key={note.courseId} note={note} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
