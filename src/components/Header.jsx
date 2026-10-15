import React from "react";
import { 
  GraduationCap, 
  Calendar, 
  GitFork, 
  Sliders, 
  BookMarked, 
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
    { id: "catalog", label: "Degree Catalog", icon: Library }
  ];

  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(10, 14, 23, 0.88)",
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
        padding: "0.6rem 1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: "0.5rem"
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.35)",
            flexShrink: 0
          }}>
            <GraduationCap size={20} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <h1 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#f8fafc" }}>
                CourseAdvisor
              </h1>
              <span className="badge badge-indigo badge-hide-mobile" style={{ fontSize: "0.62rem", padding: "0.1rem 0.45rem" }}>
                ARCH-2026
              </span>
            </div>
            <div className="header-meta-text" style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>DAG Solver & Fuzzy Engine</span>
              <span style={{ color: "var(--border-medium)" }}>•</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>● Ready</span>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            onClick={onTriggerConfetti}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
            title="Celebrate completed plan"
            aria-label="Celebrate"
          >
            <PartyPopper size={14} color="#f59e0b" />
            <span className="action-text">Celebrate</span>
          </button>

          <button
            onClick={onExportPlan}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
            title="Export schedule as JSON"
            aria-label="Export Plan"
          >
            <Download size={14} />
            <span className="action-text">Export</span>
          </button>

          <button
            onClick={onResetPlan}
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.55rem" }}
            title="Reset to defaults"
            aria-label="Reset plan"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar (Desktop View) */}
      <div className="desktop-tabs-nav" style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1.25rem",
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
              className={`tab-btn ${isActive ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 0.95rem",
                border: "none",
                background: "transparent",
                color: isActive ? "#818cf8" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? "2px solid #818cf8" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
