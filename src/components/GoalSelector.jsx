import React from "react";
import { 
  Briefcase, 
  Waves, 
  Fish, 
  Sprout, 
  GraduationCap, 
  Target, 
  Clock, 
  Compass, 
  Building2, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  ShieldAlert, 
  Microscope, 
  Anchor, 
  Navigation, 
  Award, 
  BookOpen, 
  FileText, 
  ShieldCheck,
  ChevronDown 
} from "lucide-react";
import { MSU_NAAWAN_PROGRAMS, MSU_CAREER_TRACKS } from "../data/courses";

export function GoalSelector({
  selectedProgramId,
  selectedTrackId,
  selectedTargetCourseId,
  catalog,
  maxAllowedSemesters,
  onSelectProgram,
  onSelectTrack,
  onSelectTargetCourse,
  onUpdateAllowedSemesters
}) {
  const currentProgram = MSU_NAAWAN_PROGRAMS.find(p => p.id === selectedProgramId) || MSU_NAAWAN_PROGRAMS[0];
  const careerTracks = MSU_CAREER_TRACKS[selectedProgramId] || MSU_CAREER_TRACKS.bsba_marketing;

  const iconMap = {
    Briefcase,
    Waves,
    Fish,
    Sprout,
    GraduationCap,
    TrendingUp,
    Globe,
    BarChart3,
    Compass,
    ShieldAlert,
    Microscope,
    Anchor,
    Navigation,
    Award,
    BookOpen,
    FileText,
    ShieldCheck
  };

  return (
    <div className="goal-selector glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
      {/* University & Degree Program Header */}
      <div style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
        padding: "1rem",
        marginBottom: "1.25rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                Mindanao State University at Naawan
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Official Prospectus Engine
              </span>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc", marginTop: "4px" }}>
              {currentProgram.name}
            </h3>
            <div style={{ fontSize: "0.8rem", color: currentProgram.color, fontWeight: 700 }}>
              {currentProgram.major}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {currentProgram.college} • {currentProgram.reference}
            </div>
          </div>

          {/* Timeline Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={14} color="#a855f7" /> Target Timeline:
            </span>
            <select
              value={maxAllowedSemesters}
              onChange={(e) => onUpdateAllowedSemesters(Number(e.target.value))}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
                borderRadius: "8px",
                padding: "0.35rem 0.65rem",
                fontSize: "0.8rem",
                fontWeight: 600
              }}
            >
              <option value={4} style={{ background: "#111827" }}>4 Semesters (Fast Track)</option>
              <option value={6} style={{ background: "#111827" }}>6 Semesters (Accelerated)</option>
              <option value={8} style={{ background: "#111827" }}>8 Semesters (Standard 4-Year)</option>
              <option value={9} style={{ background: "#111827" }}>9 Semesters (With Summer)</option>
            </select>
          </div>
        </div>

        {/* Academic Prospectus Dropdown Selector */}
        <div style={{ marginTop: "1rem" }}>
          <label 
            htmlFor="prospectus-dropdown"
            style={{ 
              display: "block",
              fontSize: "0.72rem", 
              color: "var(--text-muted)", 
              textTransform: "uppercase", 
              fontWeight: 700, 
              marginBottom: "0.45rem",
              letterSpacing: "0.05em"
            }}
          >
            Select Academic Prospectus:
          </label>
          
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{
              position: "absolute",
              left: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center"
            }}>
              {React.createElement(iconMap[currentProgram.icon] || Briefcase, {
                size: 18,
                color: currentProgram.color || "#38bdf8"
              })}
            </div>

            <select
              id="prospectus-dropdown"
              value={selectedProgramId}
              onChange={(e) => onSelectProgram(e.target.value)}
              style={{
                width: "100%",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${currentProgram.color || "var(--border-medium)"}`,
                borderRadius: "10px",
                padding: "0.75rem 2.5rem 0.75rem 2.6rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "#f8fafc",
                cursor: "pointer",
                outline: "none",
                boxShadow: `0 0 14px ${currentProgram.color}22`,
                transition: "all 0.2s ease"
              }}
            >
              {MSU_NAAWAN_PROGRAMS.map(prog => (
                <option 
                  key={prog.id} 
                  value={prog.id} 
                  style={{ background: "#0f172a", color: "#f8fafc", padding: "0.5rem" }}
                >
                  {prog.major} — {prog.name} ({prog.totalUnits} Units)
                </option>
              ))}
            </select>

            <div style={{
              position: "absolute",
              right: "0.85rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center"
            }}>
              <ChevronDown size={18} color="var(--text-secondary)" />
            </div>
          </div>
        </div>
      </div>

      {/* Career Specializations Grid */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>
          Target Career Specialization ($V_&#123;target&#125;$ Capstone Goal):
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.85rem"
        }}>
          {careerTracks.map(track => {
            const isSelected = selectedTrackId === track.id;
            const TrackIcon = iconMap[track.icon] || Target;

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
                    <TrackIcon size={16} color={track.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}>
                    {track.title}
                  </div>
                </div>

                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.5rem", lineHeight: 1.35 }}>
                  {track.description}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", color: "#a5b4fc" }}>
                  <span>Goal: <strong>{track.targetGoalCourseId}</strong></span>
                  {isSelected && <span style={{ fontWeight: 700, color: "#10b981" }}>✓ Active</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Target Selector */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
          <Compass size={15} color="#38bdf8" />
          <span>Or select any specific terminal course in this prospectus:</span>
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
            fontSize: "0.8rem",
            maxWidth: "340px"
          }}
        >
          {catalog.map(c => (
            <option key={c.id} value={c.id} style={{ background: "#111827" }}>
              {c.code} — {c.title} ({c.credits} units)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
