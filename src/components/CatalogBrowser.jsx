import React, { useState } from "react";
import { Search, BookOpen, CheckCircle, Target, Layers } from "lucide-react";
import { CATEGORY_COLORS } from "../data/courses";

export function CatalogBrowser({
  catalog,
  completedCourseIds = [],
  targetCourseIds = [],
  onToggleComplete,
  onSetAsTarget
}) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const completedSet = new Set(completedCourseIds);
  const targetSet = new Set(targetCourseIds);

  const filtered = catalog.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.skills && c.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));

    const matchesCat = selectedCat === "all" || c.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="catalog-browser glass-panel fade-in" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span className="badge badge-indigo">Academic Catalog</span>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Curriculum & Degree Repository</h3>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Search full catalog courses, inspect prerequisite requirements, and set targets
          </p>
        </div>

        {/* Search input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-medium)",
          borderRadius: "8px",
          padding: "0.4rem 0.75rem",
          minWidth: "260px"
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search code, title, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              width: "100%"
            }}
          />
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["all", "coding", "math", "systems", "theory", "capstone"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            style={{
              fontSize: "0.75rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              background: selectedCat === cat ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)",
              color: selectedCat === cat ? "#a5b4fc" : "var(--text-secondary)",
              border: selectedCat === cat ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
              textTransform: "capitalize",
              fontWeight: selectedCat === cat ? 700 : 500
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1rem"
      }}>
        {filtered.map(course => {
          const isDone = completedSet.has(course.id);
          const isTarget = targetSet.has(course.id);
          const cat = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;

          return (
            <div
              key={course.id}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: isTarget ? "2px solid #f59e0b" : isDone ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {/* Category pill and tags */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: cat.text,
                    background: cat.bg,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    border: `1px solid ${cat.border}44`
                  }}
                >
                  {cat.label}
                </span>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {course.credits} cr • Diff: {course.difficulty}/10
                </span>
              </div>

              {/* Course Title and Code */}
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>
                  {course.code}
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
                  {course.title}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.4, flex: 1 }}>
                {course.description}
              </p>

              {/* Prerequisites line */}
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Prerequisites: </span>
                {course.prerequisites.length > 0 ? (
                  <span style={{ fontFamily: "var(--font-mono)", color: "#818cf8" }}>
                    {course.prerequisites.join(", ")}
                  </span>
                ) : (
                  <span style={{ color: "#10b981" }}>None (Entry Level)</span>
                )}
              </div>

              {/* Skills Tags */}
              {course.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
                  {course.skills.map(sk => (
                    <span
                      key={sk}
                      style={{
                        fontSize: "0.68rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        color: "var(--text-secondary)",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px"
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.65rem" }}>
                <button
                  onClick={() => onToggleComplete(course.id)}
                  style={{
                    flex: 1,
                    fontSize: "0.72rem",
                    padding: "0.35rem 0.5rem",
                    borderRadius: "6px",
                    background: isDone ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    color: isDone ? "#6ee7b7" : "var(--text-secondary)",
                    border: isDone ? "1px solid #10b981" : "1px solid var(--border-subtle)"
                  }}
                >
                  {isDone ? "✓ Passed" : "Mark Passed"}
                </button>

                <button
                  onClick={() => onSetAsTarget(course.id)}
                  style={{
                    flex: 1,
                    fontSize: "0.72rem",
                    padding: "0.35rem 0.5rem",
                    borderRadius: "6px",
                    background: isTarget ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    color: isTarget ? "#fbbf24" : "var(--text-secondary)",
                    border: isTarget ? "1px solid #f59e0b" : "1px solid var(--border-subtle)"
                  }}
                >
                  {isTarget ? "★ Current Goal" : "Target as Goal"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
