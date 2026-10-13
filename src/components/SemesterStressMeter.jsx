import React from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu } from "lucide-react";

export function SemesterStressMeter({ stressResult, currentCredits, targetCreditCap, onInspectFuzzy }) {
  const stress = stressResult?.stressScore ?? 25;
  const status = stressResult?.status ?? "balanced";
  const statusColor = stressResult?.statusColor ?? "#10b981";
  const statusLabel = stressResult?.statusLabel ?? "Balanced";

  // Arc Gauge parameters
  // Semi-circle arc: angles from 180 to 360 deg (or SVG path)
  const radius = 54;
  const strokeWidth = 9;
  const arcLength = Math.PI * radius; // Half circumference
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, stress))) / 100;

  return (
    <div className="stress-meter-card glass-panel" style={{ padding: "1.25rem", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ 
            width: 8, 
            height: 8, 
            borderRadius: "50%", 
            background: statusColor, 
            boxShadow: `0 0 10px ${statusColor}` 
          }} />
          <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Mamdani Stress Index
          </span>
        </div>

        {onInspectFuzzy && (
          <button 
            onClick={onInspectFuzzy}
            title="Inspect Mamdani Fuzzy System rules & defuzzification"
            style={{
              fontSize: "0.75rem",
              padding: "0.2rem 0.5rem",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "6px"
            }}
          >
            <Cpu size={12} /> Fuzzy Math
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Semi-circular Radial Gauge */}
        <div style={{ position: "relative", width: "128px", height: "76px", flexShrink: 0, overflow: "hidden" }}>
          <svg viewBox="0 0 130 80" style={{ width: "100%", height: "100%" }}>
            {/* Background Arc Track */}
            <path
              d="M 15 70 A 50 50 0 0 1 115 70"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Active Stress Arc */}
            <path
              d="M 15 70 A 50 50 0 0 1 115 70"
              fill="none"
              stroke={statusColor}
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease",
                filter: `drop-shadow(0 0 6px ${statusColor}88)`
              }}
            />
          </svg>

          {/* Centered Value */}
          <div style={{
            position: "absolute",
            bottom: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: statusColor, lineHeight: 1 }}>
              {stress}%
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
              STRESS
            </div>
          </div>
        </div>

        {/* Status Metrics Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
            {status === "balanced" && <CheckCircle size={15} color="#10b981" />}
            {status === "challenging" && <AlertTriangle size={15} color="#f59e0b" />}
            {status === "overload" && <ShieldAlert size={15} color="#ef4444" />}
            <span style={{ fontWeight: 700, fontSize: "0.9rem", color: statusColor }}>
              {statusLabel}
            </span>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            Target Credit Bound: <strong style={{ color: "var(--text-primary)" }}>{targetCreditCap || 15} hrs</strong>
          </div>

          {/* Credit load bar */}
          <div style={{ 
            height: "6px", 
            background: "rgba(255, 255, 255, 0.1)", 
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative"
          }}>
            <div style={{
              width: `${Math.min(100, ((currentCredits || 0) / (targetCreditCap || 15)) * 100)}%`,
              height: "100%",
              background: currentCredits > targetCreditCap ? "#ef4444" : statusColor,
              borderRadius: "4px",
              transition: "width 0.4s ease"
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            <span>{currentCredits || 0} scheduled</span>
            <span>max {targetCreditCap || 15}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
