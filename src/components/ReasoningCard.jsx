import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export function ReasoningCard({ note }) {
  if (!note) return null;

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.025)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "0.6rem 0.8rem",
        marginBottom: "0.5rem",
        fontSize: "0.78rem"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
        <strong style={{ color: "#818cf8", fontFamily: "var(--font-mono)" }}>
          {note.courseCode}
        </strong>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          Diff: {note.difficulty}/10
        </span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "0.25rem", lineHeight: 1.35 }}>
        {note.unlockText}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)", fontSize: "0.72rem" }}>
        <Sparkles size={11} color="#6366f1" />
        <span>{note.confidenceNote}</span>
      </div>
    </div>
  );
}
