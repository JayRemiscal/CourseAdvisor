import React from "react";
import { 
  Calculator, 
  Code2, 
  Server, 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Briefcase, 
  Waves, 
  Microscope, 
  Anchor, 
  Fish, 
  ShieldCheck, 
  FileText, 
  Sprout, 
  ShieldAlert, 
  GraduationCap, 
  BookOpen 
} from "lucide-react";

const PROGRAM_DOMAINS = {
  bsba_marketing: [
    { key: "domain1", label: "Marketing Strategy & Brand", subtext: "Product, Pricing, Advertising, Consumer Behavior", icon: TrendingUp, color: "#6366f1" },
    { key: "domain2", label: "Finance, Accounting & Tax", subtext: "Managerial Accounting, Taxation, Legal Obligations", icon: Calculator, color: "#f59e0b" },
    { key: "domain3", label: "Analytics & E-Commerce", subtext: "IBA101, BIT103, E-Commerce, Spreadsheets", icon: BarChart3, color: "#06b6d4" },
    { key: "domain4", label: "Management & Governance", subtext: "HRM, Strategic Mgmt, TQM, Halal Marketing", icon: Briefcase, color: "#10b981" }
  ],
  bs_marine_science: [
    { key: "domain1", label: "Marine Biology & Ecology", subtext: "Botany, Invertebrates, Coral Reefs, Plankton", icon: Waves, color: "#3b82f6" },
    { key: "domain2", label: "Chemistry & Oceanography", subtext: "Inorganic, Organic, Biochemistry, Physical OCN", icon: Microscope, color: "#06b6d4" },
    { key: "domain3", label: "Calculus & Biometry", subtext: "Integrative Calculus, Inferential Stats, GIS Mapping", icon: Calculator, color: "#a855f7" },
    { key: "domain4", label: "Field Sampling & Thesis", subtext: "Sampling Design, Lab Assays, Defense Protocol", icon: FileText, color: "#10b981" }
  ],
  bs_fisheries: [
    { key: "domain1", label: "Aquaculture & Engineering", subtext: "Hatchery Design, Aeration, Recirculating Systems", icon: Anchor, color: "#10b981" },
    { key: "domain2", label: "Aquatic Biology & Ichthyology", subtext: "Fish Anatomy, Ecology, Genetics, Physiology", icon: Fish, color: "#3b82f6" },
    { key: "domain3", label: "Post-Harvest Preservation", subtext: "HACCP, Freezing, Canning, Quality & Safety", icon: ShieldCheck, color: "#f59e0b" },
    { key: "domain4", label: "Fisheries Policy & Research", subtext: "Fisheries Code, Coastal Mgmt, MSY, Thesis", icon: FileText, color: "#a855f7" }
  ],
  bs_agriculture: [
    { key: "domain1", label: "Crop Physiology & Breeding", subtext: "Photosynthesis, Genetics, Seed Tech, Physiology", icon: Sprout, color: "#10b981" },
    { key: "domain2", label: "Soil Science & Fertility", subtext: "Soil Chemistry, NPK Dynamics, Erosion Control", icon: Sparkles, color: "#f59e0b" },
    { key: "domain3", label: "Crop Protection & IPM", subtext: "Entomology, Weed Science, Biocontrol, Toxicology", icon: ShieldAlert, color: "#ef4444" },
    { key: "domain4", label: "Farm Machinery & Precision Tech", subtext: "Tractors, Hydraulics, Drone NDVI, Research", icon: Server, color: "#3b82f6" }
  ],
  beed: [
    { key: "domain1", label: "Pedagogy & Child Psychology", subtext: "Child Development, Teaching Profession, Learning", icon: GraduationCap, color: "#a855f7" },
    { key: "domain2", label: "Curriculum & Assessment", subtext: "Assessment 1 & 2, Curriculum Planning, Rubrics", icon: FileText, color: "#6366f1" },
    { key: "domain3", label: "Elementary Subject Methods", subtext: "Teaching Math, Science, Reading, Language Arts", icon: BookOpen, color: "#06b6d4" },
    { key: "domain4", label: "Field Study & Internship", subtext: "Classroom Observation, Assistantship, Practice Teaching", icon: Briefcase, color: "#10b981" }
  ]
};

export function ConfidenceSliders({ programId = "bsba_marketing", confidenceScores, onChange }) {
  const categories = PROGRAM_DOMAINS[programId] || PROGRAM_DOMAINS.bsba_marketing;

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
      onChange({ domain1: 3, domain2: 4, domain3: 3, domain4: 3 });
    } else if (preset === "balanced") {
      onChange({ domain1: 7, domain2: 6, domain3: 6, domain4: 6 });
    } else if (preset === "advanced") {
      onChange({ domain1: 9, domain2: 9, domain3: 8, domain4: 9 });
    }
  };

  return (
    <div className="confidence-controls glass-panel" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
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
          // Fallback check: domain key, or legacy keys if previously stored
          const val = confidenceScores[cat.key] ?? confidenceScores.coding ?? 7;
          const tier = getTierBadge(val);
          const IconComp = cat.icon;

          return (
            <div
              key={cat.key}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: `${cat.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <IconComp size={16} color={cat.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      {cat.subtext}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    background: tier.bg,
                    color: tier.color
                  }}
                >
                  {tier.label}
                </span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Rating:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem", color: cat.color }}>
                    {val} / 10
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={val}
                  onChange={(e) => handleSlider(cat.key, e.target.value)}
                  style={{
                    width: "100%",
                    accentColor: cat.color,
                    cursor: "pointer"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
