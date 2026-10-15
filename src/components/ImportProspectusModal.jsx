import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  Code2, 
  ArrowRight,
  BookOpen,
  Trash2
} from "lucide-react";
import { 
  parseProspectusJson, 
  parseProspectusCsv, 
  getSampleProspectusJson, 
  getSampleProspectusCsv 
} from "../utils/prospectusParser";

export function ImportProspectusModal({
  isOpen,
  onClose,
  onImportProspectus,
  currentProspectusName
}) {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "paste" | "samples"
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");
  const [formatType, setFormatType] = useState("auto"); // "auto" | "json" | "csv"
  
  // Custom metadata fields
  const [programName, setProgramName] = useState("");
  const [majorName, setMajorName] = useState("");

  // Parsing result state
  const [parseResult, setParseResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Process text or file content
  const processContent = (content, name = "", explicitFormat = null) => {
    setErrorMsg("");
    setParseResult(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setErrorMsg("Please provide prospectus data or select a valid file.");
      return;
    }

    const isJson = explicitFormat === "json" || (explicitFormat !== "csv" && (trimmed.startsWith("{") || trimmed.startsWith("[")));

    try {
      let result;
      if (isJson) {
        result = parseProspectusJson(trimmed);
      } else {
        result = parseProspectusCsv(trimmed, {
          programName: programName || name.replace(/\.[^/.]+$/, ""),
          major: majorName
        });
      }

      if (programName) result.metadata.programName = programName;
      if (majorName) result.metadata.major = majorName;

      setParseResult(result);
      if (!programName && result.metadata.programName) {
        setProgramName(result.metadata.programName);
      }
      if (!majorName && result.metadata.major) {
        setMajorName(result.metadata.major);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to parse prospectus data.");
    }
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const ext = file.name.split(".").pop()?.toLowerCase();
        const explicitFormat = ext === "json" ? "json" : ext === "csv" ? "csv" : "auto";
        processContent(content, file.name, explicitFormat);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading the selected file.");
    };
    reader.readAsText(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const ext = file.name.split(".").pop()?.toLowerCase();
        processContent(content, file.name, ext === "json" ? "json" : "csv");
      }
    };
    reader.readAsText(file);
  };

  // Handle Load Starter Example
  const handleLoadSample = (type = "json") => {
    if (type === "json") {
      const sample = getSampleProspectusJson();
      setRawText(sample);
      processContent(sample, "sample_prospectus.json", "json");
    } else {
      const sample = getSampleProspectusCsv();
      setRawText(sample);
      processContent(sample, "sample_prospectus.csv", "csv");
    }
  };

  // Download template helpers
  const handleDownloadTemplate = (type = "json") => {
    const isJson = type === "json";
    const content = isJson ? getSampleProspectusJson() : getSampleProspectusCsv();
    const mime = isJson ? "application/json" : "text/csv";
    const filename = isJson ? "CourseAdvisor_Prospectus_Template.json" : "CourseAdvisor_Prospectus_Template.csv";

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Confirm and apply import
  const handleConfirmImport = () => {
    if (!parseResult || !parseResult.courses || parseResult.courses.length === 0) return;

    onImportProspectus({
      id: "custom_" + Date.now(),
      name: programName || parseResult.metadata.programName || "Student Prospectus",
      major: majorName || parseResult.metadata.major || "Custom Specialization",
      college: parseResult.metadata.college || "Academic Department",
      reference: `Imported by Student (${parseResult.courses.length} courses)`,
      totalUnits: parseResult.totalUnits,
      courses: parseResult.courses,
      terminalCapstones: parseResult.terminalCapstones,
      defaultTarget: parseResult.defaultTarget,
      color: "#8b5cf6",
      icon: "GraduationCap"
    });

    onClose();
  };

  return (
    <div 
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel fade-in"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: "1px solid var(--border-medium)",
          background: "rgba(15, 23, 42, 0.95)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-indigo" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <UploadCloud size={12} /> Student Prospectus Importer
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                JSON & CSV Supported
              </span>
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "4px", color: "#f8fafc" }}>
              Import Your Academic Prospectus
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Load your syllabus, courses, credit units, and prerequisites to automatically generate your personalized graduation roadmap.
            </p>
          </div>

          <button
            onClick={onClose}
            className="icon-btn"
            style={{ padding: "0.4rem", borderRadius: "8px", color: "var(--text-muted)" }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Navigation Sub-Tabs */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "0.75rem"
          }}>
            <button
              onClick={() => setActiveTab("upload")}
              className={`btn-ghost ${activeTab === "upload" ? "active" : ""}`}
              style={{
                fontSize: "0.82rem",
                padding: "0.4rem 0.85rem",
                background: activeTab === "upload" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                borderColor: activeTab === "upload" ? "#6366f1" : "transparent",
                color: activeTab === "upload" ? "#818cf8" : "var(--text-secondary)"
              }}
            >
              <UploadCloud size={15} /> Upload File (.json, .csv)
            </button>

            <button
              onClick={() => setActiveTab("paste")}
              className={`btn-ghost ${activeTab === "paste" ? "active" : ""}`}
              style={{
                fontSize: "0.82rem",
                padding: "0.4rem 0.85rem",
                background: activeTab === "paste" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                borderColor: activeTab === "paste" ? "#6366f1" : "transparent",
                color: activeTab === "paste" ? "#818cf8" : "var(--text-secondary)"
              }}
            >
              <Code2 size={15} /> Paste JSON / CSV Text
            </button>

            <button
              onClick={() => setActiveTab("samples")}
              className={`btn-ghost ${activeTab === "samples" ? "active" : ""}`}
              style={{
                fontSize: "0.82rem",
                padding: "0.4rem 0.85rem",
                background: activeTab === "samples" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                borderColor: activeTab === "samples" ? "#6366f1" : "transparent",
                color: activeTab === "samples" ? "#818cf8" : "var(--text-secondary)"
              }}
            >
              <Sparkles size={15} /> Starter Templates
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === "upload" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,text/csv,application/json"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragOver ? "#6366f1" : "var(--border-medium)"}`,
                  borderRadius: "12px",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragOver ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.02)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: "12px",
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem"
                }}>
                  <UploadCloud size={28} />
                </div>

                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc" }}>
                  {fileName ? `Selected File: ${fileName}` : "Click to browse or drag and drop your prospectus"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  Supports official prospectus files in <strong>.JSON</strong> or <strong>.CSV</strong> format
                </div>
              </div>

              {/* Template Download Links */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Need a starting format? Download our pre-formatted templates:
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate("json")}
                    className="btn-ghost"
                    style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
                  >
                    <Download size={13} /> JSON Template
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate("csv")}
                    className="btn-ghost"
                    style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem" }}
                  >
                    <Download size={13} /> CSV Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Paste Raw Text */}
          {activeTab === "paste" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Paste raw JSON array or CSV text:
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRawText(getSampleProspectusJson());
                      processContent(getSampleProspectusJson(), "", "json");
                    }}
                    className="btn-ghost"
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                  >
                    Paste Sample JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRawText(getSampleProspectusCsv());
                      processContent(getSampleProspectusCsv(), "", "csv");
                    }}
                    className="btn-ghost"
                    style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                  >
                    Paste Sample CSV
                  </button>
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  processContent(e.target.value, "", formatType);
                }}
                placeholder={`Example JSON:
[
  { "code": "CS 101", "title": "Intro to Programming", "credits": 3, "prerequisites": [] },
  { "code": "CS 102", "title": "Data Structures", "credits": 3, "prerequisites": ["CS 101"] }
]

Or CSV:
Code, Title, Credits, Prerequisites
CS 101, Intro to Programming, 3, 
CS 102, Data Structures, 3, CS 101`}
                rows={7}
                style={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  padding: "0.75rem",
                  resize: "vertical",
                  lineHeight: "1.4"
                }}
              />
            </div>
          )}

          {/* Tab 3: Starter Templates */}
          {activeTab === "samples" && (
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                Select a starter prospectus template below to inspect the structure or quickly adapt it for your own degree:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
                <div
                  onClick={() => handleLoadSample("json")}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    padding: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="hover-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <Code2 size={16} color="#6366f1" />
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>BS in IT (JSON Format)</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Standard computing prospectus with 11 milestone courses, algorithms, databases, and capstone.
                  </p>
                  <span className="badge badge-indigo" style={{ marginTop: "0.5rem", fontSize: "0.68rem" }}>
                    Click to Load Preview
                  </span>
                </div>

                <div
                  onClick={() => handleLoadSample("csv")}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    padding: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="hover-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <FileSpreadsheet size={16} color="#10b981" />
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>BS in IT (CSV Spreadsheet)</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Spreadsheet-style rows matching typical registrar curriculums with course codes and prerequisites.
                  </p>
                  <span className="badge badge-emerald" style={{ marginTop: "0.5rem", fontSize: "0.68rem" }}>
                    Click to Load Preview
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Program Name & Major Inputs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.75rem",
            background: "rgba(255, 255, 255, 0.02)",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)"
          }}>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>
                Degree Program Title:
              </label>
              <input
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="e.g. BS in Information Technology"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "6px",
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.8rem",
                  color: "#f8fafc"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>
                Major / Field of Study:
              </label>
              <input
                type="text"
                value={majorName}
                onChange={(e) => setMajorName(e.target.value)}
                placeholder="e.g. Software Systems (or General)"
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "6px",
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.8rem",
                  color: "#f8fafc"
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: "#fca5a5",
              fontSize: "0.8rem"
            }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Successful Parse Preview */}
          {parseResult && (
            <div style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "10px",
              padding: "1rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle size={18} color="#10b981" />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#6ee7b7" }}>
                    Prospectus Successfully Validated!
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className="badge badge-indigo">
                    {parseResult.courseCount} Courses
                  </span>
                  <span className="badge badge-emerald">
                    {parseResult.totalUnits} Total Units
                  </span>
                </div>
              </div>

              {/* Warnings notice if any */}
              {parseResult.warnings && parseResult.warnings.length > 0 && (
                <div style={{
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  color: "#fde68a",
                  marginBottom: "0.75rem"
                }}>
                  {parseResult.warnings.map((w, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "2px" }}>
                      <span>⚠️</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Course Preview Table */}
              <div style={{
                maxHeight: "180px",
                overflowY: "auto",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                background: "rgba(0,0,0,0.2)"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.05)" }}>
                      <th style={{ padding: "0.4rem 0.6rem" }}>Code</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>Course Title</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>Units</th>
                      <th style={{ padding: "0.4rem 0.6rem" }}>Prerequisites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.courses.slice(0, 15).map(c => (
                      <tr key={c.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                        <td style={{ padding: "0.35rem 0.6rem", fontWeight: 700, color: "#93c5fd" }}>{c.code}</td>
                        <td style={{ padding: "0.35rem 0.6rem" }}>{c.title}</td>
                        <td style={{ padding: "0.35rem 0.6rem" }}>{c.credits}</td>
                        <td style={{ padding: "0.35rem 0.6rem", color: "var(--text-muted)" }}>
                          {c.prerequisites.length > 0 ? c.prerequisites.join(", ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parseResult.courses.length > 15 && (
                  <div style={{ textAlign: "center", padding: "0.35rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    ... and {parseResult.courses.length - 15} more courses
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.02)"
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{ fontSize: "0.85rem" }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parseResult || parseResult.courses.length === 0}
            onClick={handleConfirmImport}
            className="btn-primary"
            style={{
              fontSize: "0.85rem",
              padding: "0.55rem 1.25rem",
              opacity: !parseResult || parseResult.courses.length === 0 ? 0.5 : 1,
              cursor: !parseResult || parseResult.courses.length === 0 ? "not-allowed" : "pointer"
            }}
          >
            <CheckCircle size={16} /> Import & Build Graduation Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
