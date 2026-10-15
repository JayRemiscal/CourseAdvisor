import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
  Network,
  Maximize2,
  X,
  Compass
} from "lucide-react";
import { CATEGORY_COLORS, getCategoryTheme } from "../data/courses";

export function PrerequisiteGraphView({
  catalog = [],
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
  const [canvasFilter, setCanvasFilter] = useState("required"); // "required" | "all"

  // Canvas pan & zoom state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragDistance = useRef(0);

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
        if (course.year) {
          tier = (course.year - 1) * 2 + ((course.sem || 1) - 1);
        } else {
          const num = parseInt(course.code.replace(/\D/g, ""), 10) || 100;
          tier = Math.floor(num / 100) - 1;
        }
        if (tier < 0) tier = 0;
      }
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(course);
    });

    const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
    
    // Tier titles for mobile milestones
    const milestoneLabels = {
      0: { title: "Milestone 1: Foundations", sub: "Entry-level coursework with 0 pending prerequisites" },
      1: { title: "Milestone 2: Core Fundamentals", sub: "Intermediate coursework & foundational prerequisites" },
      2: { title: "Milestone 3: Advanced Specialization", sub: "Core major subjects & higher-level disciplines" },
      3: { title: "Milestone 4: Senior Specialization", sub: "Advanced research, analytics & specialized coursework" },
      4: { title: "Milestone 5: Capstone & Practicum", sub: "Final degree thesis, practicum & graduation integration" }
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

  // Currently selected course in canvas inspector
  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return catalog.find(c => c.id === selectedCourseId) || null;
  }, [selectedCourseId, catalog]);

  // Canvas Layout calculation for Canvas View
  const layout = useMemo(() => {
    const tiers = {};
    const nodeCoords = new Map();
    const columnWidth = 270;
    const rowHeight = 105;

    const coursesToLayout = canvasFilter === "required" && requiredCourses.length > 0
      ? requiredCourses
      : catalog;

    coursesToLayout.forEach(course => {
      let tier = tierMap[course.id];
      if (tier === undefined) {
        if (course.year) {
          tier = (course.year - 1) * 2 + ((course.sem || 1) - 1);
        } else {
          const num = parseInt(course.code.replace(/\D/g, ""), 10) || 100;
          tier = Math.floor(num / 100) - 1;
        }
        if (tier < 0) tier = 0;
      }
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(course);
    });

    const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
    let maxX = 0;
    let maxY = 0;

    tierKeys.forEach((tier, colIdx) => {
      const coursesInTier = tiers[tier];
      coursesInTier.forEach((course, rowIdx) => {
        const x = 50 + colIdx * columnWidth;
        const y = 60 + rowIdx * rowHeight;
        nodeCoords.set(course.id, { x, y, tier, course, colIdx });
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
    });

    const edges = [];
    coursesToLayout.forEach(course => {
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
      width: Math.max(900, maxX + 320),
      height: Math.max(550, maxY + 140),
      tierKeys,
      coursesCount: coursesToLayout.length
    };
  }, [catalog, requiredCourses, tierMap, canvasFilter]);

  // Auto-fit function
  const handleFitView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (!clientWidth || !clientHeight) return;

    const graphWidth = layout.width;
    const graphHeight = layout.height;

    const zoomX = (clientWidth - 40) / graphWidth;
    const zoomY = (clientHeight - 40) / graphHeight;
    const optimalZoom = Math.max(0.35, Math.min(1.1, Math.min(zoomX, zoomY)));

    setZoom(Math.round(optimalZoom * 100) / 100);
    setPan({
      x: Math.max(16, Math.round((clientWidth - graphWidth * optimalZoom) / 2)),
      y: 24
    });
  }, [layout]);

  // Auto-fit when switching to canvas mode
  useEffect(() => {
    if (viewMode === "canvas") {
      const timer = setTimeout(() => {
        handleFitView();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [viewMode, handleFitView]);

  // Pan handlers for Canvas
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest(".canvas-overlay")) return;
    setIsDragging(true);
    dragDistance.current = 0;
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    dragDistance.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (e.target.closest("button") || e.target.closest(".canvas-overlay")) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragDistance.current = 0;
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    dragDistance.current += Math.abs(newX - pan.x) + Math.abs(newY - pan.y);
    setPan({ x: newX, y: newY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="mobile-dag-experience fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Top Header & Segmented Mode Switcher */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "0.85rem 1.15rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          borderRadius: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>Topological DAG</span>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Prerequisite Network</h2>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              {viewMode === "pathway" ? "Milestone roadmap ordered by unlock tiers" : "Interactive 2D graph with pan, zoom & dependency tracing"}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          <div style={{
            display: "flex",
            background: "rgba(0, 0, 0, 0.4)",
            padding: "3px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)"
          }}>
            <button
              type="button"
              onClick={() => setViewMode("pathway")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: viewMode === "pathway" ? 700 : 500,
                background: viewMode === "pathway" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
                color: viewMode === "pathway" ? "#ffffff" : "var(--text-muted)",
                boxShadow: viewMode === "pathway" ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <ListTree size={14} /> Mobile Pathway
            </button>

            <button
              type="button"
              onClick={() => setViewMode("canvas")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.38rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: viewMode === "canvas" ? 700 : 500,
                background: viewMode === "canvas" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
                color: viewMode === "canvas" ? "#ffffff" : "var(--text-muted)",
                boxShadow: viewMode === "canvas" ? "0 2px 8px rgba(99, 102, 241, 0.4)" : "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Network size={14} /> Full Network Map
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          padding: "0.55rem 0.85rem",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              Milestone Progress: <strong style={{ color: "#10b981" }}>{progressStats.completedCount} / {progressStats.totalRequired} Courses Passed</strong>
            </span>
            <span style={{ fontWeight: 800, color: "#818cf8" }}>{progressStats.percentage}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255, 255, 255, 0.08)", borderRadius: 4, overflow: "hidden" }}>
            <div 
              style={{ 
                height: "100%", 
                width: `${progressStats.percentage}%`, 
                background: "linear-gradient(90deg, #10b981, #6366f1)",
                transition: "width 0.4s ease"
              }} 
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: MOBILE PATHWAY STREAM */}
      {/* ========================================================================= */}
      {viewMode === "pathway" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {tierStructure.tierKeys.map((tierNum, tOrder) => {
            const courses = tierStructure.tiers[tierNum] || [];
            const milestoneInfo = tierStructure.milestoneLabels[tierNum] || {
              title: `Milestone ${tierNum + 1}: Level Tier ${tierNum}`,
              sub: `Phase of degree completion with ${courses.length} courses`
            };

            const allMilestonePassed = courses.every(c => completedSet.has(c.id));

            return (
              <div key={tierNum} className="milestone-block">
                {/* Milestone Tier Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem"
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: allMilestonePassed ? "#10b981" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    color: "#ffffff",
                    boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)",
                    flexShrink: 0
                  }}>
                    {allMilestonePassed ? "✓" : tierNum + 1}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f8fafc" }}>
                        {milestoneInfo.title}
                      </h3>
                      <span className="badge badge-indigo" style={{ fontSize: "0.62rem" }}>
                        TIER {tierNum}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {milestoneInfo.sub}
                    </div>
                  </div>
                </div>

                {/* Course Cards for this Milestone */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.65rem" }}>
                  {courses.map(course => {
                    const isDone = completedSet.has(course.id);
                    const isTarget = targetSet.has(course.id);
                    const isExpanded = expandedCourseId === course.id;
                    const cat = getCategoryTheme(course.category);
                    const prereqStatus = getPrerequisiteStatus(course);
                    const unlockedCourses = getUnlockedCourses(course.id);

                    return (
                      <div
                        key={course.id}
                        className="glass-panel"
                        style={{
                          borderRadius: "12px",
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
                        {/* Course Card Header Row */}
                        <div
                          onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                          style={{
                            padding: "0.85rem 1rem",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{
                                fontFamily: "var(--font-mono)",
                                fontWeight: 800,
                                fontSize: "1rem",
                                color: isDone ? "#6ee7b7" : "#f8fafc"
                              }}>
                                {course.code}
                              </span>

                              <span style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: cat.text,
                                background: cat.bg,
                                border: `1px solid ${cat.border}44`,
                                padding: "0.12rem 0.4rem",
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
                                  gap: "3px",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  color: "#10b981",
                                  background: "rgba(16, 185, 129, 0.15)",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "6px"
                                }}>
                                  <CheckCircle2 size={12} color="#10b981" /> Passed
                                </span>
                              ) : isTarget ? (
                                <span style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  color: "#f59e0b",
                                  background: "rgba(245, 158, 11, 0.15)",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "6px"
                                }}>
                                  ★ Capstone Goal
                                </span>
                              ) : prereqStatus.isReady ? (
                                <span style={{
                                  fontSize: "0.7rem",
                                  color: "#38bdf8",
                                  fontWeight: 600,
                                  background: "rgba(56, 189, 248, 0.1)",
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "4px"
                                }}>
                                  Ready to Enroll
                                </span>
                              ) : (
                                <span style={{
                                  fontSize: "0.7rem",
                                  color: "var(--text-muted)",
                                  fontWeight: 500
                                }}>
                                  Locked ({prereqStatus.missing.length} prereq)
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                            {course.title}
                          </div>

                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "0.72rem",
                            color: "var(--text-muted)"
                          }}>
                            <div>
                              <span>{course.credits} Credits</span>
                              <span> • </span>
                              <span>Diff: <strong style={{ color: "var(--text-secondary)" }}>{course.difficulty}/10</strong></span>
                            </div>

                            <div style={{ color: "#818cf8", fontSize: "0.72rem" }}>
                              {isExpanded ? "Hide Details ▲" : "Inspect Pathway ▼"}
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
                              padding: "0.85rem 1rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.65rem"
                            }}
                          >
                            {course.description && (
                              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                                {course.description}
                              </p>
                            )}

                            {/* Prerequisites Required */}
                            <div style={{
                              background: "rgba(255, 255, 255, 0.02)",
                              padding: "0.55rem 0.75rem",
                              borderRadius: "6px",
                              border: "1px solid var(--border-subtle)"
                            }}>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.3rem" }}>
                                Prerequisites Required:
                              </div>
                              {course.prerequisites.length === 0 ? (
                                <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600 }}>
                                  ✓ None (Foundational entry-level course)
                                </span>
                              ) : (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                  {course.prerequisites.map(pCode => {
                                    const pDone = completedSet.has(pCode);
                                    return (
                                      <span
                                        key={pCode}
                                        style={{
                                          fontFamily: "var(--font-mono)",
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          color: pDone ? "#6ee7b7" : "#fca5a5",
                                          background: pDone ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                          border: pDone ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                                          padding: "0.12rem 0.45rem",
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

                            {/* Downstream Unlocks */}
                            {unlockedCourses.length > 0 && (
                              <div style={{
                                background: "rgba(99, 102, 241, 0.05)",
                                padding: "0.55rem 0.75rem",
                                borderRadius: "6px",
                                border: "1px solid rgba(99, 102, 241, 0.2)"
                              }}>
                                <div style={{ fontSize: "0.7rem", color: "#a5b4fc", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.3rem" }}>
                                  ⚡ Unlocks {unlockedCourses.length} Downstream Courses:
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                  {unlockedCourses.map(uCourse => (
                                    <span
                                      key={uCourse.id}
                                      style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        color: "#c7d2fe",
                                        background: "rgba(99, 102, 241, 0.15)",
                                        padding: "0.12rem 0.45rem",
                                        borderRadius: "4px"
                                      }}
                                    >
                                      → {uCourse.code}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 1-Tap Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(course.id);
                              }}
                              className={isDone ? "btn-secondary" : "btn-primary"}
                              style={{ width: "100%", fontSize: "0.75rem", padding: "0.45rem", marginTop: "0.2rem" }}
                            >
                              {isDone ? "✓ Mark Incomplete" : "Mark as Passed"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Arrow between milestones */}
                {tOrder < tierStructure.tierKeys.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0.6rem 0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <div style={{ width: 2, height: 12, background: "rgba(99, 102, 241, 0.4)" }} />
                      <ArrowDown size={16} color="#818cf8" />
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
            borderRadius: "14px",
            minHeight: "460px", 
            height: "62vh", 
            maxHeight: "700px", 
            display: "flex", 
            flexDirection: "column" 
          }}
        >
          {/* Zoom & Filter Toolbar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 0.85rem",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(10, 14, 23, 0.9)",
            zIndex: 10,
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            {/* Filter Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <button
                type="button"
                onClick={() => setCanvasFilter("required")}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.25rem 0.55rem",
                  borderRadius: "6px",
                  background: canvasFilter === "required" ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  color: canvasFilter === "required" ? "#818cf8" : "var(--text-muted)",
                  border: canvasFilter === "required" ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  fontWeight: canvasFilter === "required" ? 700 : 500
                }}
              >
                Goal Pathway ({requiredCourses.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setCanvasFilter("all")}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.25rem 0.55rem",
                  borderRadius: "6px",
                  background: canvasFilter === "all" ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  color: canvasFilter === "all" ? "#818cf8" : "var(--text-muted)",
                  border: canvasFilter === "all" ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  fontWeight: canvasFilter === "all" ? 700 : 500
                }}
              >
                All Courses ({catalog.length})
              </button>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <button 
                type="button"
                onClick={() => setZoom(z => Math.max(0.3, Math.round((z - 0.15) * 100) / 100))} 
                className="btn-secondary" 
                style={{ padding: "0.25rem 0.45rem", minWidth: 28 }}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", minWidth: "36px", textAlign: "center", color: "#f8fafc" }}>
                {Math.round(zoom * 100)}%
              </span>
              
              <button 
                type="button"
                onClick={() => setZoom(z => Math.min(1.8, Math.round((z + 0.15) * 100) / 100))} 
                className="btn-secondary" 
                style={{ padding: "0.25rem 0.45rem", minWidth: 28 }}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              
              <button 
                type="button"
                onClick={handleFitView} 
                className="btn-secondary" 
                style={{ padding: "0.25rem 0.55rem", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "3px" }}
                title="Auto-Fit to Screen"
              >
                <Maximize2 size={12} /> Fit
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
              touchAction: "none",
              overflow: "hidden"
            }}
          >
            <svg style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
              <defs>
                <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
                <marker id="arrow-highlight-upstream" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
                <marker id="arrow-highlight-downstream" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
                </marker>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Tier background columns */}
                {layout.tierKeys.map((tier, colIdx) => {
                  const x = 50 + colIdx * 270;
                  return (
                    <g key={`tier-${tier}`}>
                      <rect 
                        x={x - 10} 
                        y={10} 
                        width={240} 
                        height={layout.height} 
                        fill="rgba(255, 255, 255, 0.015)" 
                        rx={8} 
                        stroke="rgba(255, 255, 255, 0.03)" 
                      />
                      <text 
                        x={x + 110} 
                        y={32} 
                        textAnchor="middle" 
                        fill="var(--text-muted)" 
                        fontSize="11" 
                        fontWeight="700" 
                        letterSpacing="1"
                      >
                        TIER {tier}
                      </text>
                    </g>
                  );
                })}

                {/* Edges */}
                {layout.edges.map(edge => {
                  const isUpstream = selectedCourseId && edge.targetId === selectedCourseId;
                  const isDownstream = selectedCourseId && edge.sourceId === selectedCourseId;

                  const x1 = edge.source.x + 210;
                  const y1 = edge.source.y + 38;
                  const x2 = edge.target.x;
                  const y2 = edge.target.y + 38;
                  const dx = Math.abs(x2 - x1) * 0.5;
                  const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                  const strokeColor = isUpstream 
                    ? "#38bdf8" 
                    : isDownstream 
                    ? "#a855f7" 
                    : "rgba(100, 116, 139, 0.35)";

                  const marker = isUpstream 
                    ? "url(#arrow-highlight-upstream)" 
                    : isDownstream 
                    ? "url(#arrow-highlight-downstream)" 
                    : "url(#arrow-default)";

                  return (
                    <path
                      key={edge.id}
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isUpstream || isDownstream ? 2.5 : 1.5}
                      markerEnd={marker}
                    />
                  );
                })}

                {/* Nodes */}
                {Array.from(layout.nodeCoords.entries()).map(([courseId, node]) => {
                  const { course, x, y } = node;
                  const isCompleted = completedSet.has(courseId);
                  const isTarget = targetSet.has(courseId);
                  const isSelected = selectedCourseId === courseId;
                  const catColor = getCategoryTheme(course.category);
                  const title = String(course.title || course.code || course.id);

                  const isPrereqOfSelected = selectedCourse && (selectedCourse.prerequisites || []).includes(courseId);
                  const isUnlockedBySelected = selectedCourseId && (course.prerequisites || []).includes(selectedCourseId);

                  const opacity = selectedCourseId 
                    ? (isSelected || isPrereqOfSelected || isUnlockedBySelected ? 1 : 0.38) 
                    : 1;

                  const borderColor = isSelected
                    ? "#6366f1"
                    : isPrereqOfSelected
                    ? "#38bdf8"
                    : isUnlockedBySelected
                    ? "#a855f7"
                    : isTarget
                    ? "#f59e0b"
                    : isCompleted
                    ? "#10b981"
                    : "rgba(255, 255, 255, 0.12)";

                  return (
                    <g
                      key={courseId}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => {
                        if (dragDistance.current < 6) {
                          setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
                        }
                      }}
                      style={{ cursor: "pointer", opacity, transition: "opacity 0.2s" }}
                    >
                      <rect
                        width={210}
                        height={76}
                        rx={10}
                        fill={isSelected ? "rgba(99, 102, 241, 0.18)" : "#111827"}
                        stroke={borderColor}
                        strokeWidth={isSelected || isTarget ? 2.5 : 1}
                      />
                      <rect x={0} y={0} width={5} height={76} rx={2} fill={catColor.border || "#6366f1"} />
                      
                      {isCompleted && (
                        <g transform="translate(182, 8)">
                          <circle cx={8} cy={8} r={8} fill="#10b981" />
                          <Check x={2} y={2} size={12} color="#ffffff" strokeWidth={3} />
                        </g>
                      )}

                      <text x={14} y={22} fill="#f8fafc" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">
                        {course.code}
                      </text>
                      
                      <text x={14} y={42} fill="#cbd5e1" fontSize="11" fontWeight="500">
                        {title.length > 24 ? `${title.slice(0, 23)}…` : title}
                      </text>
                      
                      <text x={14} y={63} fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">
                        {course.credits || 3} cr • Diff: {course.difficulty || 5}/10
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Selected Course Floating Inspector Drawer */}
            {selectedCourse && (
              <div
                className="canvas-overlay glass-panel fade-in"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  right: "10px",
                  background: "rgba(15, 23, 42, 0.95)",
                  backdropFilter: "blur(16px)",
                  border: "1.5px solid rgba(99, 102, 241, 0.4)",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                  zIndex: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)"
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#818cf8", fontSize: "0.95rem" }}>
                      {selectedCourse.code}
                    </span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {selectedCourse.title}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Prereqs: {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 ? selectedCourse.prerequisites.join(", ") : "None (Entry Level)"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => onToggleComplete(selectedCourse.id)}
                    className={completedSet.has(selectedCourse.id) ? "btn-secondary" : "btn-primary"}
                    style={{ fontSize: "0.72rem", padding: "0.35rem 0.65rem" }}
                  >
                    {completedSet.has(selectedCourse.id) ? "✓ Completed" : "Mark Passed"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCourseId(null)}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                    aria-label="Close inspector"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
