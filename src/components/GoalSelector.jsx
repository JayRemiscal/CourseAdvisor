import React from "react";
import { Brain, Server, ShieldAlert, Database, Compass, Target, Clock, ArrowRight } from "lucide-react";
import { CAREER_TRACKS } from "../data/courses";

export function GoalSelector({
  selectedTrackId,
  selectedTargetCourseId,
  catalog,
  maxAllowedSemesters,
  onSelectTrack,
  onSelectTargetCourse,
  onUpdateAllowedSemesters
}) {
  const iconMap = {
    Brain: Brain,
    Server: Server,
    ShieldAlert: ShieldAlert,
    Database: Database
  };

  return (
    <div className="goal-selector glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={18} color="#6366f1" /> Step 1: Define Target Degree Goal
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Select an industry specialization or individual capstone milestone ($V_&#123;target&#125;$) for backward chaining
          </p>
        </div>

        {/* Target Timeline selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={14} color="#a855f7" /> Target Timeline:
          </span>
          <select
            value={maxAllowedSemesters}
            onChange={(e) => onUpdateAllowedSemesters(Number(e.target.value))}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              padding: "0.35rem 0.65rem",
              fontSize: "0.8rem",
              fontWeight: 600
            }}
          >
            <option value={4} style={{ background: "#111827" }}>4 Semesters (Aggressive)</option>
            <option value={5} style={{ background: "#111827" }}>5 Semesters</option>
            <option value={6} style={{ background: "#111827" }}>6 Semesters (Standard)</option>
            <option value={7} style={{ background: "#111827" }}>7 Semesters</option>
            <option value={8} style={{ background: "#111827" }}>8 Semesters (4-Year Track)</option>
          </select>
        </div>
      </div>

      {/* Career Tracks Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "0.85rem",
        marginBottom: "1rem"
      }}>
        {CAREER_TRACKS.map(track => {
          const isSelected = selectedTrackId === track.id;
          const Icon = iconMap[track.icon] || Compass;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              style={{
                background: isSelected ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.025)",
                border: isSelected ? "2px solid #6366f1" : "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isSelected ? "0 0 15px rgba(99, 102, 241, 0.3)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  background: `${track.color}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={16} color={track.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.2 }}>
                  {track.title}
                </div>
              </div>

              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.5rem", lineHeight: 1.35 }}>
                {track.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", color: "#a5b4fc" }}>
                <span>Capstone: <strong>{track.targetGoalCourseId}</strong></span>
                {isSelected && <span style={{ fontWeight: 700 }}>✓ Active</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Target Selection Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        background: "rgba(255, 255, 255, 0.02)",
        padding: "0.65rem 1rem",
        borderRadius: "8px",
        border: "1px dashed var(--border-subtle)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          <Compass size={15} color="#38bdf8" />
          <span>Or manually target any specific course milestone:</span>
        </div>

        <select
          value={selectedTargetCourseId}
          onChange={(e) => onSelectTargetCourse(e.target.value)}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid var(--border-medium)",
            color: "var(--text-primary)",
            borderRadius: "6px",
            padding: "0.35rem 0.75rem",
            fontSize: "0.8rem"
          }}
        >
          {catalog.map(c => (
            <option key={c.id} value={c.id} style={{ background: "#111827" }}>
              {c.code} — {c.title} ({c.credits} cr)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
