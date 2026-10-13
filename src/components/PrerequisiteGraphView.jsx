import React, { useState, useMemo, useRef } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Star, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ArrowDown, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  CheckCircle2,
  ListTree,
  Network
} from "lucide-react";
import { CATEGORY_COLORS } from "../data/courses";

export function PrerequisiteGraphView({
  catalog,
  requiredCourses = [],
  completedCourseIds = [],
  targetCourseIds = [],
  tierMap = {},
  onToggleComplete
}) {
  // Mobile-first default: pathway stream on mobile, canvas available
  const [viewMode, setViewMode] = useState("pathway"); // "pathway" | "canvas"
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Canvas pan & zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const completedSet = useMemo(() => new Set(completedCourseIds), [completedCourseIds]);
  const targetSet = useMemo(() => new Set(targetCourseIds), [targetCourseIds]);
  const requiredSet = useMemo(() => new Set(requiredCourses.map(c => c.id)), [requiredCourses]);

  // Group courses by Tier for Pathway Stream
  const tierStructure = useMemo(() => {
    const tiers = {};
    const coursesToInclude = requiredCourses.length > 0 ? requiredCourses : catalog;

    coursesToInclude.forEach(course => {
      let tier = tierMap[course.id];
      if (tier === undefined) {
        const num = parseInt(course.code.replace(/\D/g, ""), 10) || 100;
        tier = Math.floor(num / 100) - 1;
        if (tier < 0) tier = 0;
      }
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(course);
    });

    const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
    
    // Tier titles for mobile milestones
    const milestoneLabels = {
      0: { title: "Milestone 1: Foundations", sub: "Entry-level coursework with 0 pending prerequisites" },
      1: { title: "Milestone 2: Core Engineering", sub: "Intermediate data structures & machine organization" },
      2: { title: "Milestone 3: Advanced Systems & AI", sub: "Operating systems, databases, automata & discrete theory" },
      3: { title: "Milestone 4: Senior Specialization & Capstone", sub: "High-level capstone defense, deep learning & cloud computing" },
      4: { title: "Milestone 5: Advanced Defense", sub: "Final degree capstone integration" }
    };

    return {
      tiers,
      tierKeys,
      milestoneLabels
    };
  }, [catalog, requiredCourses, tierMap]);

  // Calculate degree progress %
  const progressStats = useMemo(() => {
    const totalRequired = requiredCourses.length > 0 ? requiredCourses.length : catalog.length;
    const completedCount = requiredCourses.filter(c => completedSet.has(c.id)).length;
    const percentage = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;
    return { totalRequired, completedCount, percentage };
  }, [requiredCourses, completedSet, catalog]);

  // Check if all prerequisites of a course are satisfied
  const getPrerequisiteStatus = (course) => {
    const prereqs = course.prerequisites || [];
    if (prereqs.length === 0) return { isReady: true, missing: [] };
    const missing = prereqs.filter(pId => !completedSet.has(pId));
    return {
      isReady: missing.length === 0,
      missing
    };
  };

  // Find downstream courses that this course unlocks
  const getUnlockedCourses = (courseId) => {
    return catalog.filter(c => c.prerequisites && c.prerequisites.includes(courseId));
  };

  // Canvas Layout calculation for Canvas View
  const layout = useMemo(() => {
    const tiers = {};
    const nodeCoords = new Map();
    const columnWidth = 260;
    const rowHeight = 110;

    catalog.forEach(course => {
      let tier = tierMap[course.id];
      if (tier === undefined) {
        const num = parseInt(course.code.replace(/\D/g, ""), 10) || 100;
        tier = Math.floor(num / 100) - 1;
        if (tier < 0) tier = 0;
      }
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(course);
    });

    const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
    let maxX = 0;
    let maxY = 0;

    tierKeys.forEach((tier) => {
      const coursesInTier = tiers[tier];
      coursesInTier.forEach((course, rowIdx) => {
        const x = 50 + tier * columnWidth;
        const y = 60 + rowIdx * rowHeight;
        nodeCoords.set(course.id, { x, y, tier, course });
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
    });

    const edges = [];
    catalog.forEach(course => {
      const targetPos = nodeCoords.get(course.id);
      if (!targetPos) return;

      (course.prerequisites || []).forEach(pId => {
        const sourcePos = nodeCoords.get(pId);
        if (sourcePos) {
          edges.push({
            id: `${pId}->${course.id}`,
            sourceId: pId,
            targetId: course.id,
            source: sourcePos,
            target: targetPos
          });
        }
      });
    });

    return {
      nodeCoords,
      edges,
      width: Math.max(1200, maxX + 350),
      height: Math.max(700, maxY + 200),
      tierKeys
    };
  }, [catalog, tierMap]);

  // Pan handlers for Canvas
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg" || e.target.classList.contains("graph-bg")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="mobile-dag-experience fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Mobile Top Header & Segmented Mode Switcher */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>Topological DAG</span>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Degree Prerequisite Pathway</h2>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Mobile roadmap ordered by prerequisite unlock tiers
            </p>
          </div>

          {/* iOS-Style Segmented Mode Switcher */}
          <div style={{
            display: "flex",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "3px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)"
          }}>
            <button
              onClick={() => setViewMode("pathway")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: viewMode === "pathway" ? 700 : 500,
                background: viewMode === "pathway" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
                color: viewMode === "pathway" ? "#ffffff" : "var(--text-muted)",
                boxShadow: viewMode === "pathway" ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                transition: "all 0.2s"
              }}
            >
              <ListTree size={14} /> Mobile Pathway
            </button>

            <button
              onClick={() => setViewMode("canvas")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: viewMode === "canvas" ? 700 : 500,
                background: viewMode === "canvas" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
                color: viewMode === "canvas" ? "#ffffff" : "var(--text-muted)",
                boxShadow: viewMode === "canvas" ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                transition: "all 0.2s"
              }}
            >
              <Network size={14} /> Full Network Map
            </button>
          </div>
        </div>

        {/* Milestone Progress Tracker Bar */}
        <div style={{
          background: "rgba(255, 255, 255, 0.025)",
          borderRadius: "10px",
          padding: "0.75rem 1rem",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              Milestone Progress: <strong style={{ color: "#10b981" }}>{progressStats.completedCount} / {progressStats.totalRequired} Courses Passed</strong>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#818cf8" }}>
              {progressStats.percentage}%
            </span>
          </div>

          <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              width: `${progressStats.percentage}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #06b6d4, #6366f1)",
              borderRadius: "3px",
              transition: "width 0.4s ease"
            }} />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: MOBILE PATHWAY STREAM (MOBILE-APP NATIVE DESIGN) */}
      {/* ========================================================================= */}
      {viewMode === "pathway" && (
        <div className="pathway-stream-container fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {tierStructure.tierKeys.map((tierIndex, tOrder) => {
            const courses = tierStructure.tiers[tierIndex] || [];
            const milestone = tierStructure.milestoneLabels[tierIndex] || {
              title: `Milestone ${tierIndex + 1}: Level ${tierIndex}`,
              sub: "Higher level dependencies"
            };

            return (
              <div key={tierIndex} style={{ position: "relative" }}>
                {/* Milestone Section Header Banner */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.85rem",
                  paddingLeft: "0.5rem"
                }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    color: "#ffffff",
                    boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
                    flexShrink: 0
                  }}>
                    {tierIndex + 1}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#f8fafc" }}>
                        {milestone.title}
                      </h3>
                      <span className="badge badge-indigo" style={{ fontSize: "0.625rem" }}>
                        Tier {tierIndex}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1px" }}>
                      {milestone.sub}
                    </div>
                  </div>
                </div>

                {/* Course Cards for this Milestone */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "0.75rem"
                }}>
                  {courses.map(course => {
                    const isDone = completedSet.has(course.id);
                    const isTarget = targetSet.has(course.id);
                    const isExpanded = expandedCourseId === course.id;
                    const cat = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;
                    const prereqStatus = getPrerequisiteStatus(course);
                    const unlockedCourses = getUnlockedCourses(course.id);

                    return (
                      <div
                        key={course.id}
                        className="glass-panel"
                        style={{
                          borderRadius: "14px",
                          overflow: "hidden",
                          border: isTarget
                            ? "2px solid #f59e0b"
                            : isDone
                            ? "1px solid rgba(16, 185, 129, 0.4)"
                            : "1px solid var(--border-subtle)",
                          background: isDone
                            ? "rgba(16, 185, 129, 0.05)"
                            : isTarget
                            ? "rgba(245, 158, 11, 0.05)"
                            : "rgba(26, 34, 52, 0.8)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {/* Course Card Main Header Row */}
                        <div
                          onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                          style={{
                            padding: "1rem 1.15rem",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                          }}
                        >
                          {/* Top Row: Code + Category Pill + Status Chip */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <span style={{
                                fontFamily: "var(--font-mono)",
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                color: isDone ? "#6ee7b7" : "#f8fafc"
                              }}>
                                {course.code}
                              </span>

                              <span style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                color: cat.text,
                                background: cat.bg,
                                border: `1px solid ${cat.border}44`,
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px"
                              }}>
                                {cat.label}
                              </span>
                            </div>

                            {/* Status Chip */}
                            <div>
                              {isDone ? (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  color: "#10b981",
                                  background: "rgba(16, 185, 129, 0.15)",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px"
                                }}>
                                  <CheckCircle2 size={13} color="#10b981" /> Passed
                                </span>
                              ) : isTarget ? (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  color: "#f59e0b",
                                  background: "rgba(245, 158, 11, 0.15)",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px"
                                }}>
                                  <Star size={13} color="#f59e0b" /> Capstone Goal
                                </span>
                              ) : prereqStatus.isReady ? (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  color: "#38bdf8",
                                  background: "rgba(56, 189, 248, 0.15)",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px"
                                }}>
                                  <Unlock size={12} color="#38bdf8" /> Ready to Take
                                </span>
                              ) : (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  color: "#f87171",
                                  background: "rgba(239, 68, 68, 0.12)",
                                  padding: "0.2rem 0.55rem",
                                  borderRadius: "6px"
                                }}>
                                  <Lock size={12} color="#f87171" /> Locked ({prereqStatus.missing.length})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Middle Row: Full Course Title */}
                          <div style={{
                            fontSize: "0.92rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            lineHeight: 1.3
                          }}>
                            {course.title}
                          </div>

                          {/* Bottom Row: Metadata & Quick Unlocks Summary */}
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "0.75rem",
                            color: "var(--text-muted)"
                          }}>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                              <span>{course.credits} Credits</span>
                              <span>•</span>
                              <span>Diff: <strong style={{ color: "var(--text-secondary)" }}>{course.difficulty}/10</strong></span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#818cf8", fontSize: "0.75rem" }}>
                              <span>{isExpanded ? "Hide Details ▲" : "Inspect Pathway ▼"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Mobile Detail Drawer */}
                        {isExpanded && (
                          <div
                            className="fade-in"
                            style={{
                              borderTop: "1px solid var(--border-subtle)",
                              background: "rgba(10, 14, 23, 0.45)",
                              padding: "1rem 1.15rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.75rem"
                            }}
                          >
                            {/* Course Syllabus Overview */}
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                              {course.description}
                            </p>

                            {/* Prerequisites Breakdown */}
                            <div style={{
                              background: "rgba(255, 255, 255, 0.02)",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: "1px solid var(--border-subtle)"
                            }}>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Prerequisites Required:
                              </div>
                              {course.prerequisites.length === 0 ? (
                                <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
                                  ✓ None (Foundational entry-level course)
                                </span>
                              ) : (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                  {course.prerequisites.map(pCode => {
                                    const pDone = completedSet.has(pCode);
                                    return (
                                      <span
                                        key={pCode}
                                        style={{
                                          fontFamily: "var(--font-mono)",
                                          fontSize: "0.75rem",
                                          fontWeight: 700,
                                          color: pDone ? "#6ee7b7" : "#fca5a5",
                                          background: pDone ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                          border: pDone ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                                          padding: "0.15rem 0.5rem",
                                          borderRadius: "4px"
                                        }}
                                      >
                                        {pDone ? "✓ " : "✗ "}{pCode}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Downstream Unlocks Preview */}
                            {unlockedCourses.length > 0 && (
                              <div style={{
                                background: "rgba(99, 102, 241, 0.05)",
                                padding: "0.65rem 0.85rem",
                                borderRadius: "8px",
                                border: "1px solid rgba(99, 102, 241, 0.2)"
                              }}>
                                <div style={{ fontSize: "0.72rem", color: "#a5b4fc", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.35rem" }}>
                                  ⚡ Unlocks {unlockedCourses.length} Downstream Courses:
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                  {unlockedCourses.map(uCourse => (
                                    <span
                                      key={uCourse.id}
                                      style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        color: "#c7d2fe",
                                        background: "rgba(99, 102, 241, 0.15)",
                                        padding: "0.15rem 0.5rem",
                                        borderRadius: "4px"
                                      }}
                                    >
                                      → {uCourse.code}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 1-Tap Action Button */}
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(course.id);
                                }}
                                className={isDone ? "btn-secondary" : "btn-primary"}
                                style={{
                                  width: "100%",
                                  fontSize: "0.8rem",
                                  padding: "0.55rem"
                                }}
                              >
                                {isDone ? "✓ Mark Incomplete" : "Mark as Passed (Satisfy Prerequisites)"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Connector Arrow between Milestones */}
                {tOrder < tierStructure.tierKeys.length - 1 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0.75rem 0"
                  }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px"
                    }}>
                      <div style={{ width: 2, height: 16, background: "rgba(99, 102, 241, 0.4)" }} />
                      <ArrowDown size={18} color="#818cf8" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: FULL CANVAS GRAPH (PAN & ZOOM 2D MAP) */}
      {/* ========================================================================= */}
      {viewMode === "canvas" && (
        <div 
          className="dag-container glass-panel fade-in" 
          style={{ 
            position: "relative", 
            overflow: "hidden", 
            minHeight: "520px", 
            height: "calc(100vh - 240px)", 
            maxHeight: "720px", 
            display: "flex", 
            flexDirection: "column" 
          }}
        >
          {/* Zoom toolbar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.6rem 1rem",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(10, 14, 23, 0.85)",
            zIndex: 10
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              Drag to pan • Pinch / buttons to zoom
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <button onClick={() => setZoom(z => Math.max(0.4, z - 0.15))} className="btn-secondary" style={{ padding: "0.25rem 0.5rem" }}>
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", minWidth: "36px", textAlign: "center" }}>
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={() => setZoom(z => Math.min(1.8, z + 0.15))} className="btn-secondary" style={{ padding: "0.25rem 0.5rem" }}>
                <ZoomIn size={14} />
              </button>
              <button onClick={() => { setZoom(1); setPan({ x: 40, y: 40 }); }} className="btn-secondary" style={{ padding: "0.25rem 0.5rem" }}>
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Canvas SVG Area */}
          <div
            ref={containerRef}
            className="graph-bg"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              flex: 1,
              cursor: isDragging ? "grabbing" : "grab",
              background: "radial-gradient(#1e293b 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              position: "relative",
              userSelect: "none",
              touchAction: "none"
            }}
          >
            <svg style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
              <defs>
                <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
                </marker>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {layout.tierKeys.map(tier => {
                  const x = 50 + tier * 260;
                  return (
                    <g key={`tier-${tier}`}>
                      <rect x={x - 10} y={10} width={230} height={layout.height} fill="rgba(255, 255, 255, 0.015)" rx={8} stroke="rgba(255, 255, 255, 0.03)" />
                      <text x={x + 105} y={32} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="700" letterSpacing="1">
                        TIER {tier}
                      </text>
                    </g>
                  );
                })}

                {layout.edges.map(edge => {
                  const x1 = edge.source.x + 210;
                  const y1 = edge.source.y + 40;
                  const x2 = edge.target.x;
                  const y2 = edge.target.y + 40;
                  const dx = Math.abs(x2 - x1) * 0.5;
                  const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                  return (
                    <path
                      key={edge.id}
                      d={pathData}
                      fill="none"
                      stroke="rgba(100, 116, 139, 0.25)"
                      strokeWidth={1.5}
                      markerEnd="url(#arrow-default)"
                    />
                  );
                })}

                {Array.from(layout.nodeCoords.entries()).map(([courseId, node]) => {
                  const { course, x, y } = node;
                  const isCompleted = completedSet.has(courseId);
                  const isTarget = targetSet.has(courseId);
                  const catColor = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;

                  return (
                    <g
                      key={courseId}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => onToggleComplete(courseId)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect
                        width={210}
                        height={80}
                        rx={10}
                        fill="#111827"
                        stroke={isTarget ? "#f59e0b" : isCompleted ? "#10b981" : "rgba(255, 255, 255, 0.1)"}
                        strokeWidth={isTarget ? 2 : 1}
                      />
                      <rect x={0} y={0} width={5} height={80} rx={2} fill={catColor.border} />
                      {isCompleted && (
                        <g transform="translate(182, 10)">
                          <circle cx={8} cy={8} r={8} fill="#10b981" />
                          <Check x={2} y={2} size={12} color="#ffffff" strokeWidth={3} />
                        </g>
                      )}
                      <text x={16} y={24} fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily="var(--font-mono)">
                        {course.code}
                      </text>
                      <text x={16} y={43} fill="#cbd5e1" fontSize="11" fontWeight="500">
                        {course.title.length > 25 ? `${course.title.slice(0, 24)}…` : course.title}
                      </text>
                      <text x={16} y={66} fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">
                        {course.credits} cr • Diff: {course.difficulty}/10
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
