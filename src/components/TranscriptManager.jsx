import React, { useState } from "react";
import { CheckCircle2, BookOpen, Filter, CheckSquare, Square, Sparkles } from "lucide-react";
import { CATEGORY_COLORS } from "../data/courses";

export function TranscriptManager({
  catalog,
  completedCourseIds = [],
  onToggleCourse,
  onSetCompletedCourses
}) {
  const [filterCat, setFilterCat] = useState("all");
  const completedSet = new Set(completedCourseIds);

  const totalCompletedCredits = catalog
    .filter(c => completedSet.has(c.id))
    .reduce((sum, c) => sum + c.credits, 0);

  const filteredCatalog = catalog.filter(c => {
    if (filterCat === "all") return true;
    return c.category === filterCat;
  });

  const handleQuickPreset = (preset) => {
    if (preset === "freshman") {
      onSetCompletedCourses(["MATH101", "CS101", "ENG101"]);
    } else if (preset === "sophomore") {
      onSetCompletedCourses(["MATH101", "CS101", "ENG101", "MATH102", "CS102", "PHYS101", "CS205"]);
    } else if (preset === "clear") {
      onSetCompletedCourses([]);
    }
  };

  return (
    <div className="transcript-manager glass-panel fade-in" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-emerald">Step 2: Transcript Engine</span>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Passed Transcript Courses</h3>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Select courses already passed. The Backward Chaining Engine automatically satisfies their prerequisites and skips them from your schedule.
          </p>
        </div>

        {/* Completed Credits Counter */}
        <div style={{
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "10px",
          padding: "0.6rem 1.2rem",
          textAlign: "right"
        }}>
          <span style={{ fontSize: "0.7rem", color: "#6ee7b7", textTransform: "uppercase", fontWeight: 700 }}>
            Transferred / Completed
          </span>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981", fontFamily: "var(--font-mono)" }}>
            {totalCompletedCredits} <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>Credits</span>
          </div>
        </div>
      </div>

      {/* Quick Load Presets */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.75rem",
        background: "rgba(255, 255, 255, 0.02)",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        marginBottom: "1.25rem",
        border: "1px solid var(--border-subtle)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          <Sparkles size={14} color="#6366f1" /> Quick Transcript Sets:
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            onClick={() => handleQuickPreset("clear")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
          >
            Clear Transcript
          </button>
          <button
            onClick={() => handleQuickPreset("freshman")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
          >
            + Year 1 Completed
          </button>
          <button
            onClick={() => handleQuickPreset("sophomore")}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
          >
            + Year 2 Completed (Transfer)
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {["all", "coding", "math", "systems", "theory", "general"].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            style={{
              fontSize: "0.75rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              background: filterCat === cat ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)",
              color: filterCat === cat ? "#a5b4fc" : "var(--text-secondary)",
              border: filterCat === cat ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
              textTransform: "capitalize",
              fontWeight: filterCat === cat ? 700 : 500
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Checklist */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "0.75rem"
      }}>
        {filteredCatalog.map(course => {
          const isDone = completedSet.has(course.id);
          const cat = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;

          return (
            <div
              key={course.id}
              onClick={() => onToggleCourse(course.id)}
              style={{
                background: isDone ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.02)",
                border: isDone ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "0.75rem 0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: "4px",
                    border: "1px solid var(--text-muted)",
                    flexShrink: 0
                  }} />
                )}

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <strong style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      color: isDone ? "#6ee7b7" : "var(--text-primary)"
                    }}>
                      {course.code}
                    </strong>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {course.credits} cr
                    </span>
                  </div>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {course.title}
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: "0.68rem",
                color: isDone ? "#10b981" : "var(--text-muted)",
                fontWeight: 600
              }}>
                {isDone ? "PASSED" : `Diff ${course.difficulty}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
