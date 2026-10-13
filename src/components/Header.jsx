import React from "react";
import { 
  GraduationCap, 
  Calendar, 
  GitFork, 
  Sliders, 
  BookMarked, 
  Workflow, 
  Library, 
  Download, 
  PartyPopper,
  RotateCcw
} from "lucide-react";

export function Header({
  activeTab,
  onTabChange,
  onExportPlan,
  onTriggerConfetti,
  onResetPlan,
  totalCredits,
  maxStress
}) {
  const tabs = [
    { id: "planner", label: "Semester Roadmap", icon: Calendar },
    { id: "graph", label: "Prerequisite DAG", icon: GitFork },
    { id: "confidence", label: "Confidence & Stress", icon: Sliders },
    { id: "transcript", label: "Transcript History", icon: BookMarked },
    { id: "flowchart", label: "System Flowchart", icon: Workflow },
    { id: "catalog", label: "Degree Catalog", icon: Library }
  ];

  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(10, 14, 23, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      {/* Top Metadata Header */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}>
            <GraduationCap size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#f8fafc" }}>
                CourseAdvisor
              </h1>
              <span className="badge badge-indigo" style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem" }}>
                ARCH-2026-v2.1
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Backward Chaining DAG & Mamdani Fuzzy System</span>
              <span style={{ color: "var(--border-medium)" }}>•</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>● Engine Active (&lt;16ms)</span>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={onTriggerConfetti}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.45rem 0.75rem" }}
            title="Celebrate completed plan"
          >
            <PartyPopper size={14} color="#f59e0b" /> <span className="action-text">Celebrate</span>
          </button>

          <button
            onClick={onExportPlan}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.45rem 0.75rem" }}
            title="Export schedule as JSON"
          >
            <Download size={14} /> <span className="action-text">Export</span>
          </button>

          <button
            onClick={onResetPlan}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.45rem 0.65rem" }}
            title="Reset to defaults"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar (Desktop View) */}
      <div className="desktop-tabs-nav" style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto"
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#818cf8" : "var(--text-secondary)",
                borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                borderRadius: "0",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={16} color={isActive ? "#818cf8" : "var(--text-muted)"} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
