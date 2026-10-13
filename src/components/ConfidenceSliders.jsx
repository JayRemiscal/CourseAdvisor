import React from "react";
import { Calculator, Code2, Server, BrainCircuit, Sparkles } from "lucide-react";

export function ConfidenceSliders({ confidenceScores, onChange }) {
  const categories = [
    {
      key: "coding",
      label: "Programming & Algorithms",
      subtext: "Python, C++, OOP, Recursion & Trees",
      icon: Code2,
      color: "#3b82f6"
    },
    {
      key: "math",
      label: "Mathematics & Calculus",
      subtext: "Derivatives, Integrals, Linear Algebra",
      icon: Calculator,
      color: "#a855f7"
    },
    {
      key: "systems",
      label: "Systems & Architecture",
      subtext: "Memory, Concurrency, Networks, OS",
      icon: Server,
      color: "#10b981"
    },
    {
      key: "theory",
      label: "Theory & Discrete Logic",
      subtext: "Proof Techniques, Automata, Big-O Complexity",
      icon: BrainCircuit,
      color: "#f59e0b"
    }
  ];

  const getTierBadge = (val) => {
    if (val <= 3) return { label: "Needs Support", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
    if (val <= 6) return { label: "Developing", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" };
    if (val <= 8) return { label: "Proficient", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
    return { label: "Mastery", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
  };

  const handleSlider = (key, val) => {
    onChange({
      ...confidenceScores,
      [key]: Number(val)
    });
  };

  const handleQuickPreset = (preset) => {
    if (preset === "novice") {
      onChange({ coding: 3, math: 4, systems: 3, theory: 3 });
    } else if (preset === "balanced") {
      onChange({ coding: 7, math: 6, systems: 6, theory: 6 });
    } else if (preset === "advanced") {
      onChange({ coding: 9, math: 9, systems: 8, theory: 9 });
    }
  };

  return (
    <div className="confidence-controls glass-panel" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={16} color="#6366f1" /> Foundational Confidence Ratings
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Calibrates Mamdani Fuzzy System parameters to dictate maximum safe credits
          </p>
        </div>

        {/* Quick presets */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button 
            onClick={() => handleQuickPreset("novice")}
            className="btn-secondary" 
            style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
          >
            Support
          </button>
          <button 
            onClick={() => handleQuickPreset("balanced")}
            className="btn-secondary" 
            style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
          >
            Standard
          </button>
          <button 
            onClick={() => handleQuickPreset("advanced")}
            className="btn-secondary" 
            style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
          >
            Accelerated
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {categories.map(cat => {
          const val = confidenceScores[cat.key] || 6;
          const badge = getTierBadge(val);
          const Icon = cat.icon;

          return (
            <div 
              key={cat.key}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "0.9rem",
                transition: "border-color 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    background: `${cat.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={16} color={cat.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{cat.label}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{cat.subtext}</div>
                  </div>
                </div>

                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: badge.color,
                  background: badge.bg,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px"
                }}>
                  {badge.label}
                </span>
              </div>

              {/* Slider Track and readout */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={val}
                  onChange={(e) => handleSlider(cat.key, e.target.value)}
                  style={{
                    flex: 1,
                    accentColor: cat.color,
                    cursor: "pointer",
                    height: "6px"
                  }}
                />
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: cat.color,
                  minWidth: "24px",
                  textAlign: "right"
                }}>
                  {val}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 400 }}>/10</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
