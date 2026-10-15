import React, { useState, useMemo } from "react";
import { Search, CheckCircle, Target, Layers, X, BookOpen } from "lucide-react";
import { CATEGORY_COLORS } from "../data/courses";

export function CatalogBrowser({
  catalog = [],
  completedCourseIds = [],
  targetCourseIds = [],
  onToggleComplete,
  onSetAsTarget
}) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const completedSet = useMemo(() => new Set(completedCourseIds), [completedCourseIds]);
  const targetSet = useMemo(() => new Set(targetCourseIds), [targetCourseIds]);

  // Dynamically extract categories from the actual active catalog
  const availableCategories = useMemo(() => {
    const cats = new Set();
    catalog.forEach(c => {
      if (c.category) cats.add(c.category);
    });
    return ["all", ...Array.from(cats)];
  }, [catalog]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter(c => {
      const code = String(c.code || c.id || "").toLowerCase();
      const title = String(c.title || "").toLowerCase();
      const desc = String(c.description || "").toLowerCase();
      const skills = Array.isArray(c.skills) ? c.skills.join(" ").toLowerCase() : "";

      const matchesSearch = !q || code.includes(q) || title.includes(q) || desc.includes(q) || skills.includes(q);
      const matchesCat = selectedCat === "all" || c.category === selectedCat;

      return matchesSearch && matchesCat;
    });
  }, [catalog, search, selectedCat]);

  const getCategoryTheme = (catKey) => {
    if (CATEGORY_COLORS && CATEGORY_COLORS[catKey]) {
      return CATEGORY_COLORS[catKey];
    }
    return {
      bg: "rgba(99, 102, 241, 0.12)",
      border: "#6366f1",
      text: "#a5b4fc",
      label: catKey ? (catKey.charAt(0).toUpperCase() + catKey.slice(1)) : "Major"
    };
  };

  return (
    <div className="catalog-browser glass-panel fade-in" style={{ padding: "1.25rem", borderRadius: "14px" }}>
      {/* Header & Search */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.85rem",
        marginBottom: "1rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-indigo">Degree Catalog</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {filtered.length} of {catalog.length} Courses
            </span>
          </div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "2px", color: "#f8fafc" }}>
            Curriculum Course Directory
          </h2>
        </div>

        {/* Search Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-medium)",
          borderRadius: "8px",
          padding: "0.35rem 0.65rem",
          width: "100%",
          maxWidth: "320px"
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search code, title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.82rem",
              width: "100%"
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      {availableCategories.length > 2 && (
        <div style={{
          display: "flex",
          gap: "0.4rem",
          marginBottom: "1rem",
          overflowX: "auto",
          paddingBottom: "4px"
        }}>
          {availableCategories.map(cat => {
            const isSelected = selectedCat === cat;
            const theme = cat === "all" ? null : getCategoryTheme(cat);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  fontSize: "0.72rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "6px",
                  background: isSelected ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.03)",
                  color: isSelected ? "#a5b4fc" : "var(--text-secondary)",
                  border: isSelected ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                  whiteSpace: "nowrap",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {cat === "all" ? "All Courses" : (theme?.label || cat)}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty Search Result */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "2.5rem 1rem",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "10px",
          border: "1px dashed var(--border-subtle)"
        }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            No courses found matching <strong>"{search}"</strong>.
          </p>
          <button
            onClick={() => { setSearch(""); setSelectedCat("all"); }}
            className="btn-ghost"
            style={{ fontSize: "0.75rem", marginTop: "0.75rem" }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Course Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "0.85rem"
      }}>
        {filtered.map(course => {
          const isDone = completedSet.has(course.id);
          const isTarget = targetSet.has(course.id);
          const theme = getCategoryTheme(course.category);
          const prereqs = Array.isArray(course.prerequisites) ? course.prerequisites : [];

          return (
            <div
              key={course.id}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: isTarget 
                  ? "2px solid #f59e0b" 
                  : isDone 
                  ? "1px solid rgba(16, 185, 129, 0.45)" 
                  : "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "0.85rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "border 0.2s ease"
              }}
            >
              {/* Category pill & units */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: theme.text,
                    background: theme.bg,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    border: `1px solid ${theme.border}44`
                  }}
                >
                  {theme.label}
                </span>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {course.credits || 3} Units • Yr {course.year || 1} Sem {course.sem || 1}
                </span>
              </div>

              {/* Code & Title */}
              <div style={{ marginBottom: "0.4rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: "0.95rem", color: "#f8fafc" }}>
                  {course.code || course.id}
                </div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.3 }}>
                  {course.title}
                </div>
              </div>

              {/* Description (clean & optional) */}
              {course.description && (
                <p style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.6rem",
                  lineHeight: 1.35,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  flex: 1
                }}>
                  {course.description}
                </p>
              )}

              {/* Prerequisites line */}
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginBottom: "0.65rem", marginTop: "auto" }}>
                <span style={{ color: "var(--text-muted)" }}>Prereqs: </span>
                {prereqs.length > 0 ? (
                  <span style={{ fontFamily: "var(--font-mono)", color: "#818cf8" }}>
                    {prereqs.join(", ")}
                  </span>
                ) : (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>None (Entry Level)</span>
                )}
              </div>

              {/* Minimal Action Buttons */}
              <div style={{ display: "flex", gap: "0.4rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.55rem" }}>
                <button
                  type="button"
                  onClick={() => onToggleComplete(course.id)}
                  style={{
                    flex: 1,
                    fontSize: "0.72rem",
                    padding: "0.3rem 0.45rem",
                    borderRadius: "6px",
                    background: isDone ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    color: isDone ? "#6ee7b7" : "var(--text-secondary)",
                    border: isDone ? "1px solid #10b981" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  {isDone ? "✓ Passed" : "Mark Passed"}
                </button>

                <button
                  type="button"
                  onClick={() => onSetAsTarget(course.id)}
                  style={{
                    flex: 1,
                    fontSize: "0.72rem",
                    padding: "0.3rem 0.45rem",
                    borderRadius: "6px",
                    background: isTarget ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.04)",
                    color: isTarget ? "#fbbf24" : "var(--text-secondary)",
                    border: isTarget ? "1px solid #f59e0b" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  {isTarget ? "★ Target Goal" : "Set as Goal"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
