import React from "react";
import { Cpu, CheckCircle2, ChevronRight, Activity, Award } from "lucide-react";

export function FuzzyInspectorModal({ fuzzyEvaluation, onClose }) {
  if (!fuzzyEvaluation) return null;

  const {
    confidenceInput,
    difficultyInput,
    confFuzzy,
    diffFuzzy,
    stressScore,
    maxCredits,
    status,
    statusLabel,
    statusColor,
    activeRules,
    dominantRule
  } = fuzzyEvaluation;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel fade-in"
        style={{
          width: "100%",
          maxWidth: "780px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "1.75rem",
          background: "#0d131f",
          border: "1px solid rgba(99, 102, 241, 0.4)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="badge badge-indigo">Mamdani FIS</span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Fuzzy Inference Mathematical Engine</h2>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              Fuzzification → Mamdani Min-Rule Evaluation → Centroid Defuzzification (ARCH-2026-v2.1 §3.2)
            </p>
          </div>

          <button onClick={onClose} style={{ fontSize: "1.5rem", color: "var(--text-muted)", lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Crisp Inputs & Defuzzified Outputs Summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem"
        }}>
          {/* Crisp Inputs */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "1rem"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Crisp Inputs</div>
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                <span>Student Confidence:</span>
                <strong style={{ color: "#818cf8", fontFamily: "var(--font-mono)" }}>{confidenceInput}/10</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span>Subject Difficulty:</span>
                <strong style={{ color: "#f59e0b", fontFamily: "var(--font-mono)" }}>{difficultyInput}/10</strong>
              </div>
            </div>
          </div>

          {/* Fuzzified Memberships */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "1rem"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Fuzzification (μ)</div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              <div>Conf: Low({confFuzzy.low.toFixed(2)}) Mid({confFuzzy.medium.toFixed(2)}) High({confFuzzy.high.toFixed(2)})</div>
              <div style={{ marginTop: "3px" }}>Diff: Easy({diffFuzzy.easy.toFixed(2)}) Mod({diffFuzzy.moderate.toFixed(2)}) Hard({diffFuzzy.hard.toFixed(2)})</div>
            </div>
          </div>

          {/* Defuzzified Crisp Outputs */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "1rem"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Centroid Outputs</div>
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                <span>Stress Rating:</span>
                <strong style={{ color: statusColor, fontFamily: "var(--font-mono)" }}>{stressScore}% ({statusLabel})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span>Max Credit Limit:</span>
                <strong style={{ color: "#38bdf8", fontFamily: "var(--font-mono)" }}>{maxCredits} Credits</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rule Firing Matrix */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Activity size={16} color="#6366f1" /> Active Fuzzy Rules (AND/Mamdani Min)
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {activeRules.map((rule, idx) => {
              const isDominant = idx === 0;

              return (
                <div
                  key={rule.id}
                  style={{
                    background: isDominant ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.02)",
                    border: isDominant ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>
                        {rule.id}
                      </span>
                      <strong style={{ fontSize: "0.85rem" }}>{rule.name}</strong>
                      {isDominant && (
                        <span style={{ fontSize: "0.7rem", color: "#818cf8", fontWeight: 700 }}>
                          ★ Dominant Rule
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {rule.explanation}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "110px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Firing Strength</div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: isDominant ? "#818cf8" : "var(--text-primary)"
                    }}>
                      μ = {rule.weight.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centroid Integration Explanation */}
        <div style={{
          background: "rgba(99, 102, 241, 0.05)",
          border: "1px dashed rgba(99, 102, 241, 0.3)",
          borderRadius: "8px",
          padding: "0.9rem",
          fontSize: "0.8rem",
          color: "var(--text-secondary)"
        }}>
          <strong>Centroid Defuzzification Formula:</strong>
          <div style={{ fontFamily: "var(--font-mono)", margin: "0.35rem 0", color: "#a5b4fc" }}>
            z* = ∫ [x · μ_agg(x)] dx / ∫ [μ_agg(x)] dx
          </div>
          Continuous numerical integration evaluates composite membership surfaces over the universe of discourse [0, 100] for Semester Stress and [12, 18] for Academic Credit Bounds.
        </div>
      </div>
    </div>
  );
}
