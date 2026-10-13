import React, { useState, useMemo, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Check, Star, AlertCircle, Info } from "lucide-react";
import { CATEGORY_COLORS } from "../data/courses";

export function PrerequisiteGraphView({
  catalog,
  requiredCourses = [],
  completedCourseIds = [],
  targetCourseIds = [],
  tierMap = {},
  onToggleComplete
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const containerRef = useRef(null);

  const completedSet = useMemo(() => new Set(completedCourseIds), [completedCourseIds]);
  const targetSet = useMemo(() => new Set(targetCourseIds), [targetCourseIds]);
  const requiredSet = useMemo(() => new Set(requiredCourses.map(c => c.id)), [requiredCourses]);

  // Build node layout organized by topological tiers or level
  const layout = useMemo(() => {
    // Collect all catalog courses, determining layer (tier)
    const tiers = {};
    const nodeCoords = new Map();

    const columnWidth = 260;
    const rowHeight = 110;

    catalog.forEach(course => {
      let tier = tierMap[course.id];
      if (tier === undefined) {
        // Fallback tier estimation based on level
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

    // Edges calculation
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

  // Compute ancestors & descendants of selected node for interactive highlighting
  const highlighted = useMemo(() => {
    if (!selectedCourseId) return null;

    const ancestors = new Set();
    const descendants = new Set();

    // Find ancestors (backward)
    const queueUp = [selectedCourseId];
    while (queueUp.length > 0) {
      const curr = queueUp.shift();
      const course = catalog.find(c => c.id === curr);
      if (course) {
        (course.prerequisites || []).forEach(p => {
          if (!ancestors.has(p)) {
            ancestors.add(p);
            queueUp.push(p);
          }
        });
      }
    }

    // Find descendants (forward)
    const queueDown = [selectedCourseId];
    while (queueDown.length > 0) {
      const curr = queueDown.shift();
      catalog.forEach(c => {
        if (c.prerequisites && c.prerequisites.includes(curr) && !descendants.has(c.id)) {
          descendants.add(c.id);
          queueDown.push(c.id);
        }
      });
    }

    return { ancestors, descendants };
  }, [selectedCourseId, catalog]);

  // Pan handlers
  const handleMouseDown = (e) => {
    // Only drag on canvas background
    if (e.target.tagName === "svg" || e.target.classList.contains("graph-bg")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedCourse = selectedCourseId ? catalog.find(c => c.id === selectedCourseId) : null;

  return (
    <div className="dag-container glass-panel" style={{ position: "relative", overflow: "hidden", height: "650px", display: "flex", flexDirection: "column" }}>
      {/* Top Controls Toolbar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.25rem",
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(10, 14, 23, 0.75)",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Prerequisite DAG Network</span>
            <span className="badge badge-indigo">Topological Graph Engine</span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} /> Completed
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} /> Goal Target
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} /> Required
            </span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.6rem" }}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", minWidth: "42px", textAlign: "center" }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.6rem" }}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 40, y: 40 }); }}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.6rem" }}
            title="Reset Pan & Zoom"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="graph-bg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          flex: 1,
          cursor: isDragging ? "grabbing" : "grab",
          background: "radial-gradient(#1e293b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          position: "relative",
          userSelect: "none"
        }}
      >
        <svg
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>
            <marker
              id="arrow-descendant"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Tier Column Headers / Guides */}
            {layout.tierKeys.map(tier => {
              const x = 50 + tier * 260;
              return (
                <g key={`tier-${tier}`}>
                  <rect
                    x={x - 10}
                    y={10}
                    width={230}
                    height={layout.height}
                    fill="rgba(255, 255, 255, 0.015)"
                    rx={8}
                    stroke="rgba(255, 255, 255, 0.03)"
                  />
                  <text
                    x={x + 105}
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

            {/* Bezier Prerequisite Edges */}
            {layout.edges.map(edge => {
              const isAncestorEdge = highlighted?.ancestors?.has(edge.sourceId) && (edge.targetId === selectedCourseId || highlighted?.ancestors?.has(edge.targetId));
              const isDescendantEdge = (edge.sourceId === selectedCourseId || highlighted?.descendants?.has(edge.sourceId)) && highlighted?.descendants?.has(edge.targetId);

              let stroke = "rgba(100, 116, 139, 0.25)";
              let strokeWidth = 1.5;
              let markerEnd = "url(#arrow-default)";

              if (isAncestorEdge) {
                stroke = "#6366f1";
                strokeWidth = 2.5;
                markerEnd = "url(#arrow-active)";
              } else if (isDescendantEdge) {
                stroke = "#a855f7";
                strokeWidth = 2.5;
                markerEnd = "url(#arrow-descendant)";
              }

              // Card width is 210, height is 80. Connect right of source to left of target.
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
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={markerEnd}
                  style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                />
              );
            })}

            {/* Nodes */}
            {Array.from(layout.nodeCoords.entries()).map(([courseId, node]) => {
              const { course, x, y } = node;
              const isCompleted = completedSet.has(courseId);
              const isTarget = targetSet.has(courseId);
              const isRequired = requiredSet.has(courseId);
              const isSelected = selectedCourseId === courseId;

              const isAncestor = highlighted?.ancestors?.has(courseId);
              const isDescendant = highlighted?.descendants?.has(courseId);

              const catColor = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;

              let borderColor = "rgba(255, 255, 255, 0.1)";
              let shadow = "none";
              let opacity = 1;

              if (selectedCourseId) {
                if (isSelected) {
                  borderColor = "#38bdf8";
                  shadow = "0 0 20px rgba(56, 189, 248, 0.6)";
                } else if (isAncestor) {
                  borderColor = "#6366f1";
                  shadow = "0 0 15px rgba(99, 102, 241, 0.5)";
                } else if (isDescendant) {
                  borderColor = "#a855f7";
                  shadow = "0 0 15px rgba(168, 85, 247, 0.5)";
                } else {
                  opacity = 0.35;
                }
              } else if (isTarget) {
                borderColor = "#f59e0b";
                shadow = "0 0 15px rgba(245, 158, 11, 0.4)";
              } else if (isCompleted) {
                borderColor = "#10b981";
              } else if (isRequired) {
                borderColor = "#6366f1";
              }

              return (
                <g
                  key={courseId}
                  transform={`translate(${x}, ${y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourseId(isSelected ? null : courseId);
                  }}
                  style={{ cursor: "pointer", opacity, transition: "opacity 0.2s" }}
                >
                  {/* Card Background */}
                  <rect
                    width={210}
                    height={80}
                    rx={10}
                    fill="#111827"
                    stroke={borderColor}
                    strokeWidth={isSelected ? 2.5 : isTarget ? 2 : 1}
                    style={{
                      filter: shadow !== "none" ? `drop-shadow(${shadow})` : "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                      transition: "all 0.2s ease"
                    }}
                  />

                  {/* Category Accent Bar */}
                  <rect
                    x={0}
                    y={0}
                    width={5}
                    height={80}
                    rx={2}
                    fill={catColor.border}
                  />

                  {/* Status Badge Icon */}
                  {isCompleted && (
                    <g transform="translate(182, 10)">
                      <circle cx={8} cy={8} r={8} fill="#10b981" />
                      <Check x={2} y={2} size={12} color="#ffffff" strokeWidth={3} />
                    </g>
                  )}
                  {isTarget && !isCompleted && (
                    <g transform="translate(182, 10)">
                      <circle cx={8} cy={8} r={8} fill="#f59e0b" />
                      <Star x={2} y={2} size={12} color="#ffffff" strokeWidth={3} />
                    </g>
                  )}

                  {/* Course Code */}
                  <text
                    x={16}
                    y={24}
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                  >
                    {course.code}
                  </text>

                  {/* Course Title (Truncated) */}
                  <text
                    x={16}
                    y={43}
                    fill="#cbd5e1"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {course.title.length > 25 ? `${course.title.slice(0, 24)}…` : course.title}
                  </text>

                  {/* Metadata Chips: Credits & Difficulty */}
                  <text
                    x={16}
                    y={66}
                    fill="var(--text-muted)"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    {course.credits} cr • Diff: {course.difficulty}/10
                  </text>

                  {/* Highlight badges for ancestors/descendants */}
                  {isAncestor && (
                    <text x={135} y={66} fill="#818cf8" fontSize="9" fontWeight="700">
                      PREREQ
                    </text>
                  )}
                  {isDescendant && (
                    <text x={125} y={66} fill="#c084fc" fontSize="9" fontWeight="700">
                      DEPENDENT
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Course Inspector Overlay */}
        {selectedCourse && (
          <div
            className="glass-panel fade-in"
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              width: "320px",
              padding: "1rem",
              zIndex: 20,
              border: "1px solid rgba(99, 102, 241, 0.4)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.6)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <span className="badge badge-indigo" style={{ marginBottom: "0.25rem" }}>
                  {selectedCourse.category.toUpperCase()}
                </span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{selectedCourse.code}</h4>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{selectedCourse.title}</div>
              </div>

              <button
                onClick={() => setSelectedCourseId(null)}
                style={{ color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
              {selectedCourse.description}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "0.6rem 0", fontSize: "0.78rem" }}>
              <span>Credits: <strong>{selectedCourse.credits}</strong></span>
              <span>Difficulty: <strong>{selectedCourse.difficulty}/10</strong></span>
              <span>Prereqs: <strong>{selectedCourse.prerequisites.length}</strong></span>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button
                onClick={() => onToggleComplete(selectedCourse.id)}
                className={completedSet.has(selectedCourse.id) ? "btn-secondary" : "btn-primary"}
                style={{ flex: 1, fontSize: "0.75rem", padding: "0.4rem" }}
              >
                {completedSet.has(selectedCourse.id) ? "Mark Not Taken" : "Mark Passed (Skip)"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
