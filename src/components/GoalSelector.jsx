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
  ChevronDown,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { MSU_NAAWAN_PROGRAMS, MSU_CAREER_TRACKS } from "../data/courses";

export function GoalSelector({
  selectedProgramId,
  selectedTrackId,
  selectedTargetCourseId,
  catalog = [],
  maxAllowedSemesters = 8,
  onSelectProgram,
  onSelectTrack,
  onSelectTargetCourse,
  onUpdateAllowedSemesters,
  activeProgramInfo,
  importedProspectus,
  onOpenImportModal,
  careerTracks = []
}) {
  const isImported = selectedProgramId === "imported" || activeProgramInfo?.isImported;
  const currentProgram = activeProgramInfo || (MSU_NAAWAN_PROGRAMS.find(p => p.id === selectedProgramId) || MSU_NAAWAN_PROGRAMS[0]);

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

  const totalCatalogUnits = catalog.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <div className="goal-selector glass-panel" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
      {/* Student Prospectus Master Banner */}
      <div style={{
        background: isImported 
          ? "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08))" 
          : "rgba(255, 255, 255, 0.02)",
        border: isImported ? "1.5px solid rgba(139, 92, 246, 0.35)" : "1px solid var(--border-subtle)",
        borderRadius: "14px",
        padding: "1.15rem",
        marginBottom: "1.25rem",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {isImported ? (
                <span className="badge badge-purple" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", fontWeight: 700 }}>
                  <Sparkles size={13} /> Student Imported Prospectus
                </span>
              ) : (
                <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                  Mindanao State University at Naawan
                </span>
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {catalog.length} Courses • {totalCatalogUnits} Total Units
              </span>
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", marginTop: "6px" }}>
              {currentProgram.name}
            </h3>

            <div style={{ fontSize: "0.85rem", color: currentProgram.color || "#818cf8", fontWeight: 700 }}>
              {currentProgram.major}
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {currentProgram.college} • {currentProgram.reference}
            </div>
          </div>

          {/* Quick Actions & Timeline Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <button
              onClick={onOpenImportModal}
              className="btn-primary"
              style={{
                fontSize: "0.78rem",
                padding: "0.45rem 0.85rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 16px rgba(139, 92, 246, 0.35)",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
              title="Import student prospectus from JSON or CSV file"
            >
              <UploadCloud size={15} />
              <span>Import Prospectus</span>
            </button>

            {/* Target Timeline */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(0, 0, 0, 0.25)",
              padding: "0.25rem 0.5rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)"
            }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} color="#a855f7" /> Timeline:
              </span>
              <select
                value={maxAllowedSemesters}
                onChange={(e) => onUpdateAllowedSemesters(Number(e.target.value))}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid var(--border-medium)",
                  color: "var(--text-primary)",
                  borderRadius: "6px",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
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
        </div>

        {/* Academic Prospectus Dropdown Switcher */}
        <div style={{ marginTop: "1rem" }}>
          <label 
            htmlFor="prospectus-dropdown"
            style={{ 
              display: "block",
              fontSize: "0.72rem", 
              color: "var(--text-muted)", 
              textTransform: "uppercase", 
              fontWeight: 700, 
              marginBottom: "0.4rem",
              letterSpacing: "0.05em"
            }}
          >
            Active Curriculum / Prospectus:
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
              {React.createElement(iconMap[currentProgram.icon] || GraduationCap, {
                size: 18,
                color: currentProgram.color || "#8b5cf6"
              })}
            </div>

            <select
              id="prospectus-dropdown"
              value={selectedProgramId}
              onChange={(e) => {
                if (e.target.value === "IMPORT_ACTION") {
                  onOpenImportModal();
                } else {
                  onSelectProgram(e.target.value);
                }
              }}
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
                boxShadow: `0 0 14px ${currentProgram.color || "#8b5cf6"}22`,
                transition: "all 0.2s ease"
              }}
            >
              {/* If student has imported a prospectus, list it at the top */}
              {importedProspectus && (
                <option 
                  value="imported" 
                  style={{ background: "#1e1b4b", color: "#c7d2fe", padding: "0.5rem", fontWeight: 700 }}
                >
                  ★ [Student Imported] {importedProspectus.name} — {importedProspectus.major} ({importedProspectus.courses.length} Courses, {importedProspectus.totalUnits} Units)
                </option>
              )}

              <option value="IMPORT_ACTION" style={{ background: "#0f172a", color: "#38bdf8", fontWeight: 600 }}>
                ➕ Import / Upload New Prospectus (JSON or CSV)...
              </option>

              <optgroup label="Sample University Curricula (MSU Naawan)" style={{ background: "#0f172a" }}>
                {MSU_NAAWAN_PROGRAMS.map(prog => (
                  <option 
                    key={prog.id} 
                    value={prog.id} 
                    style={{ background: "#0f172a", color: "#f8fafc", padding: "0.5rem" }}
                  >
                    {prog.major} — {prog.name} ({prog.totalUnits} Units)
                  </option>
                ))}
              </optgroup>
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

      {/* Target Milestone / Specialization Selection */}
      {careerTracks && careerTracks.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "0.04em" }}>
            Target Specialization & Capstone Goal:
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.85rem"
          }}>
            {careerTracks.map(track => {
              const isSelected = selectedTrackId === track.id || selectedTargetCourseId === track.targetGoalCourseId;
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
      )}

      {/* Manual Target Selector across whole catalog */}
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
          <span>Or pick any specific graduation milestone course in this prospectus:</span>
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
