// Mindanao State University at Naawan (MSU Naawan)
// Official Academic Prospectuses & Curricula Repository
// Document ID: ARCH-2026-v2.1 Compliance

export const MSU_NAAWAN_PROGRAMS = [
  {
    id: "bsba_marketing",
    name: "BS in Business Administration",
    major: "Marketing Management (BSBA-MM)",
    college: "College of Business and Information Technology",
    reference: "CMO 17 s. 2017, BOR Res. 201 s. 2024 (Effective AY 2025-2026)",
    totalUnits: 153,
    terminalCapstones: ["MKT199", "MKT197"],
    defaultTarget: "MKT197",
    color: "#06b6d4",
    icon: "Briefcase"
  },
  {
    id: "bs_marine_science",
    name: "BS in Marine Science",
    major: "Marine Science (BSMS)",
    college: "College of Fisheries and Marine Sciences",
    reference: "BOR Res. 128 s. 2023, CMO 46 s. 2017 (Effective AY 2025-2026)",
    totalUnits: 165,
    terminalCapstones: ["MRB199", "MRB197"],
    defaultTarget: "MRB199",
    color: "#3b82f6",
    icon: "Waves"
  },
  {
    id: "bs_fisheries",
    name: "BS in Fisheries",
    major: "Fisheries (BSFi)",
    college: "College of Fisheries and Marine Sciences",
    reference: "BOR Res. 128 s. 2023, CMO 33 s. 2021 (Effective AY 2025-2026)",
    totalUnits: 183,
    terminalCapstones: ["FIS199", "FIS197"],
    defaultTarget: "FIS199",
    color: "#10b981",
    icon: "Fish"
  },
  {
    id: "bs_agriculture",
    name: "BS in Agriculture",
    major: "Agronomy (BSA-Agronomy)",
    college: "College of Agriculture",
    reference: "BOR Res. 197-L s. 2024, CMO 23 s. 2021 (Effective AY 2025-2026)",
    totalUnits: 178,
    terminalCapstones: ["AGM199", "AGM197"],
    defaultTarget: "AGM199",
    color: "#f59e0b",
    icon: "Sprout"
  },
  {
    id: "beed",
    name: "Bachelor of Elementary Education",
    major: "Elementary Education (BEEd)",
    college: "College of Education and Social Sciences",
    reference: "BOR Res. 357 s. 2017, CMO 74 s. 2017 (Effective AY 2025-2026)",
    totalUnits: 167,
    terminalCapstones: ["ELC197", "GED199"],
    defaultTarget: "ELC197",
    color: "#a855f7",
    icon: "GraduationCap"
  }
];

// Complete Catalog of MSU Naawan Courses mapped with exact codes, titles, units, prerequisites and categories
export const MSU_NAAWAN_COURSES = {
  // =========================================================================
  // BSBA MAJOR IN MARKETING MANAGEMENT
  // =========================================================================
  bsba_marketing: [
    // First Year, 1st Sem
    { id: "GEC101", code: "GEC 101", title: "Understanding the Self", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Nature of identity, factors and forces that affect personal development." },
    { id: "GEC102", code: "GEC 102", title: "Purposive Communication", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Writing, speaking, and presenting to different audiences for academic and professional purposes." },
    { id: "GEC104", code: "GEC 104", title: "Mathematics in the Modern World", credits: 3, category: "math", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Nature of mathematics, patterns, reasoning, and practical applications in data." },
    { id: "GEC105", code: "GEC 105", title: "Readings in Philippine History", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Analysis of Philippine history through primary sources." },
    { id: "ECN101", code: "ECN 101", title: "Basic Microeconomics", credits: 3, category: "theory", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Price theory, consumer behavior, market structures, and resource allocation." },
    { id: "MKT101", code: "MKT 101", title: "Marketing Management", credits: 3, category: "major", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Core principles of marketing, segmentation, targeting, positioning, and market mixes." },
    { id: "GEC110", code: "GEC 110", title: "History of Muslim Filipinos & IPs of MINSUPALA", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "History, culture, and peace initiatives of indigenous peoples in Mindanao, Sulu, and Palawan." },
    { id: "PED011", code: "PED 011", title: "PATHFIT 1: Movement Competency Training", credits: 2, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Physical fitness fundamentals and movement biomechanics." },
    { id: "NST001", code: "NST 001", title: "National Service Training Program 1", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Civic welfare and community immersion training." },

    // First Year, 2nd Sem
    { id: "GEC103", code: "GEC 103", title: "The Contemporary World", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Globalization, economic integration, and international governance." },
    { id: "GEC106", code: "GEC 106", title: "Art Appreciation", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 2, description: "Appreciation and critical analysis of visual, performing, and traditional arts." },
    { id: "GEC108", code: "GEC 108", title: "Science, Technology, and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Interactions between scientific advancements, technology, and human society." },
    { id: "GEC109", code: "GEC 109", title: "Rizal's Life and Works", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Life, novels, essays, and nationalistic philosophies of Dr. Jose Rizal." },
    { id: "MKT102", code: "MKT 102", title: "Product Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT101"], year: 1, sem: 2, description: "Product lifecycle, prototyping, new product development, branding, and packaging." },
    { id: "MKT103", code: "MKT 103", title: "Pricing Strategy", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT101"], year: 1, sem: 2, description: "Value-based pricing, cost structures, price elasticity, and competitive pricing models." },
    { id: "PED012", code: "PED 012", title: "PATHFIT 2: Exercise-based Fitness Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 1, sem: 2, description: "Cardiovascular endurance and functional strength training." },
    { id: "FPE101", code: "FPE 101", title: "Fundamentals of Peace Education", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 2, description: "Conflict resolution, non-violence strategies, and culture of peace." },
    { id: "NST002", code: "NST 002", title: "National Service Training Program 2", credits: 3, category: "general", difficulty: 3, prerequisites: ["NST001"], year: 1, sem: 2, description: "Community project implementation and literacy training." },

    // Second Year, 1st Sem
    { id: "GEC107", code: "GEC 107", title: "Ethics", credits: 3, category: "general", difficulty: 5, prerequisites: [], year: 2, sem: 1, description: "Moral principles, ethical frameworks, and decision-making dilemmas." },
    { id: "ACT102", code: "ACT 102", title: "Managerial Accounting", credits: 3, category: "finance", difficulty: 7, prerequisites: [], year: 2, sem: 1, description: "Cost-volume-profit analysis, budgeting, and performance variance evaluation." },
    { id: "MGT103", code: "MGT 103", title: "Human Resource Management", credits: 3, category: "management", difficulty: 5, prerequisites: [], year: 2, sem: 1, description: "Recruitment, talent retention, employee compensation, and labor relations." },
    { id: "MKT104", code: "MKT 104", title: "Retail Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 2, sem: 1, description: "Store design, inventory replenishment, visual merchandising, and omni-channel retail." },
    { id: "MKT105", code: "MKT 105", title: "Salesmanship", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 2, sem: 1, description: "Consultative selling, negotiation strategies, client relationship management, and sales pipelines." },
    { id: "PED013", code: "PED 013", title: "PATHFIT 3: Individual & Dual Sports", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 1, description: "Individual and recreational games, martial arts, and group fitness." },
    { id: "GEC120", code: "GEC 120", title: "Wika at Kultura sa Mapayapang Lipunan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Ugnayan ng wikang Filipino sa kultura at pagkakaisa ng bansa." },

    // Second Year, 2nd Sem
    { id: "MGT108", code: "MGT 108", title: "Strategic Management", credits: 3, category: "management", difficulty: 7, prerequisites: [], year: 2, sem: 2, description: "Environmental scanning, competitive advantage, corporate strategy, and KPI implementation." },
    { id: "MKT106", code: "MKT 106", title: "Advertising", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 2, sem: 2, description: "Campaign creative strategy, media planning, brand positioning, and ad impact measurement." },
    { id: "MKT107", code: "MKT 107", title: "Distribution Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 2, sem: 2, description: "Supply chain logistics, wholesale channels, inventory warehouses, and fulfillment." },
    { id: "MKT115", code: "MKT 115", title: "Entrepreneurial Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 2, sem: 2, description: "Business model canvas, SME launch, venture funding, and operational scaling." },
    { id: "BIT103", code: "BIT 103", title: "Computer Applications in Business", credits: 3, category: "tech", difficulty: 5, prerequisites: [], year: 2, sem: 2, description: "Spreadsheets, database queries, business enterprise software, and productivity tools." },
    { id: "PED014", code: "PED 014", title: "PATHFIT 4: Team Sports & Outdoor Adventure", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 2, description: "Team games, tactical sportsmanship, and outdoor recreation." },
    { id: "FIL103", code: "FIL 103", title: "Inobasyon sa Wikang Filipino", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Paggamit ng wikang Filipino sa modernong teknolohiya at komunikasyon." },
    { id: "ACT103", code: "ACT 103", title: "Income Taxation", credits: 3, category: "finance", difficulty: 7, prerequisites: [], year: 2, sem: 2, description: "Individual and corporate income taxes, deductions, exemptions, and BIR compliance." },

    // Third Year, 1st Sem
    { id: "MGT104", code: "MGT 104", title: "Operations Management & TQM", credits: 3, category: "management", difficulty: 6, prerequisites: [], year: 3, sem: 1, description: "Total Quality Management, Six Sigma, lean production, and service operations." },
    { id: "HAL101", code: "HAL 101", title: "Halal Principles & Standards", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 1, description: "Halal compliance, Islamic trade regulations, and food safety standards." },
    { id: "MKT109", code: "MKT 109", title: "Business Research", credits: 3, category: "research", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Methodological research design, sampling methods, and academic survey instruments." },
    { id: "MKT113", code: "MKT 113", title: "Services Marketing", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 3, sem: 1, description: "Service blueprinting, service quality dimensions (SERVQUAL), and customer experience." },
    { id: "MKT120", code: "MKT 120", title: "Consumer Behavior", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 3, sem: 1, description: "Psychological, social, and cognitive factors influencing consumer purchase decisions." },
    { id: "MKT131", code: "MKT 131", title: "Media Laws, Ethics & Introduction to E-Commerce", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT106"], year: 3, sem: 1, description: "Cybercrime laws, consumer rights, intellectual property, and e-commerce ecosystems." },
    { id: "IBA101", code: "IBA 101", title: "Introduction to Business Analytics", credits: 3, category: "tech", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Descriptive and predictive data analytics, KPI dashboards, and data visualization." },

    // Third Year, 2nd Sem
    { id: "ACT180", code: "ACT 180", title: "Obligations and Contracts", credits: 3, category: "finance", difficulty: 7, prerequisites: [], year: 3, sem: 2, description: "Philippine law on civil obligations, legal consent, breach, and contract enforceability." },
    { id: "MGT109", code: "MGT 109", title: "Good Governance & Social Responsibility", credits: 3, category: "management", difficulty: 5, prerequisites: [], year: 3, sem: 2, description: "Corporate social responsibility (CSR), stakeholder ethics, and sustainable governance." },
    { id: "MKT198", code: "MKT 198", title: "Marketing Research", credits: 3, category: "research", difficulty: 8, prerequisites: ["IBA101", "MKT109"], year: 3, sem: 2, description: "Empirical market analysis, statistical testing with SPSS/R, and research manuscript writing." },
    { id: "MKT108", code: "MKT 108", title: "Halal Marketing", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 3, sem: 2, description: "Global Halal trade, certification marketing, Islamic branding, and consumer segments." },
    { id: "MKT118", code: "MKT 118", title: "Special Topics in Marketing Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT102", "MKT103"], year: 3, sem: 2, description: "Emerging trends: AI in marketing, neuromarketing, and growth marketing." },
    { id: "MKT132", code: "MKT 132", title: "Graphics Design & E-Commerce Development", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT106"], year: 3, sem: 2, description: "Visual UX/UI design, brand style guides, web store setup, and digital ad creative." },
    { id: "MKT133", code: "MKT 133", title: "Broadcast & Social Media Marketing", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT106"], year: 3, sem: 2, description: "Algorithm dynamics, viral content creation, community engagement, and social ROI." },

    // Fourth Year, 1st Sem
    { id: "ECN138", code: "ECN 138", title: "International Business and Trade", credits: 3, category: "theory", difficulty: 7, prerequisites: [], year: 4, sem: 1, description: "Tariffs, exchange rates, multilateral trade pacts, and global export strategy." },
    { id: "MKT199", code: "MKT 199", title: "Thesis in Marketing Management", credits: 3, category: "capstone", difficulty: 9, prerequisites: ["MKT198"], year: 4, sem: 1, description: "Formal thesis defense, data defense, and publication-ready academic manuscript." },
    { id: "GEC123", code: "GEC 123", title: "Gender and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Gender identities, sociological structures, human rights, and social equity." },
    { id: "MKT134", code: "MKT 134", title: "Content Marketing & Influencer Marketing", credits: 3, category: "major", difficulty: 6, prerequisites: ["MKT106"], year: 4, sem: 1, description: "KOL partnerships, sponsored storytelling, content attribution, and brand ambassadorship." },

    // Fourth Year, 2nd Sem
    { id: "MKT197", code: "MKT 197", title: "Practicum in Marketing (600 Hours)", credits: 6, category: "capstone", difficulty: 8, prerequisites: ["MKT199"], year: 4, sem: 2, description: "600 hours of professional industry internship in corporate marketing, agency, or enterprise." }
  ],

  // =========================================================================
  // BS IN MARINE SCIENCE (BSMS)
  // =========================================================================
  bs_marine_science: [
    // First Year, 1st Sem
    { id: "PHY101", code: "PHY 101", title: "Mechanics, Electromagnetism & Gravitation (Lec)", credits: 2, category: "physics", difficulty: 7, prerequisites: [], year: 1, sem: 1, description: "Classical mechanics, electromagnetism, and gravitational field theory." },
    { id: "PHY101.1", code: "PHY 101.1", title: "Mechanics & Electromagnetism Lab", credits: 1, category: "physics", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Laboratory investigations in physical mechanics and electric circuits." },
    { id: "MAT043", code: "MAT 043", title: "Calculus (Integrative)", credits: 4, category: "math", difficulty: 8, prerequisites: [], year: 1, sem: 1, description: "Differential and integral calculus with physical and oceanographic applications." },
    { id: "CHM011", code: "CHM 011", title: "Inorganic Chemistry (Lec)", credits: 2, category: "science", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Chemical bonding, atomic structure, periodic properties, and stoichiometric reactions." },
    { id: "CHM011.1", code: "CHM 011.1", title: "Inorganic Chemistry Lab", credits: 1, category: "science", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Qualitative and quantitative inorganic chemical laboratory methods." },
    { id: "BIO117", code: "BIO 117", title: "Cell and Molecular Biology", credits: 4, category: "science", difficulty: 7, prerequisites: [], year: 1, sem: 1, description: "Cellular structures, bioenergetics, genetics, molecular transcription, and translation." },
    { id: "GEC101", code: "GEC 101", title: "Understanding the Self", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Self and identity exploration across psychological and sociological dimensions." },
    { id: "PED011", code: "PED 011", title: "PATHFIT 1: Movement Competency Training", credits: 2, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Biomechanics, posture, and fundamental movement competencies." },
    { id: "NST001", code: "NST 001", title: "National Service Training Program 1", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Civic welfare service and community preparedness." },

    // First Year, 2nd Sem
    { id: "PHY102", code: "PHY 102", title: "Waves, Optics, and Thermodynamics (Lec)", credits: 2, category: "physics", difficulty: 8, prerequisites: ["PHY101", "PHY101.1"], year: 1, sem: 2, description: "Wave propagation, optical refraction, thermodynamics, and heat transfer." },
    { id: "PHY102.1", code: "PHY 102.1", title: "Waves, Optics & Thermodynamics Lab", credits: 1, category: "physics", difficulty: 6, prerequisites: ["PHY101", "PHY101.1"], year: 1, sem: 2, description: "Experiments in thermal properties, fluid dynamics, and optical wave physics." },
    { id: "STT034", code: "STT 034", title: "Inferential Statistics and Biometry", credits: 3, category: "math", difficulty: 7, prerequisites: [], year: 1, sem: 2, description: "Hypothesis testing, ANOVA, biostatistical modeling, and sampling strategies." },
    { id: "CHM032", code: "CHM 032", title: "Organic Chemistry (Lec)", credits: 2, category: "science", difficulty: 8, prerequisites: ["CHM011", "CHM011.1"], year: 1, sem: 2, description: "Hydrocarbons, functional groups, organic synthesis, and reaction mechanisms." },
    { id: "CHM032.2", code: "CHM 032.2", title: "Organic Chemistry Lab", credits: 2, category: "science", difficulty: 7, prerequisites: ["CHM011", "CHM011.1"], year: 1, sem: 2, description: "Synthesis, distillation, purification, and organic qualitative analysis." },
    { id: "BIO118", code: "BIO 118", title: "General Physiology", credits: 3, category: "science", difficulty: 7, prerequisites: ["BIO117"], year: 1, sem: 2, description: "Cellular, organ, and systemic physiology in marine organisms and animals." },
    { id: "GEC105", code: "GEC 105", title: "Readings in Philippine History", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Critical reading of historical accounts and Philippine socio-political documents." },
    { id: "PED012", code: "PED 012", title: "PATHFIT 2: Exercise-based Fitness Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 1, sem: 2, description: "Cardiovascular fitness and functional physical resistance routines." },
    { id: "NST002", code: "NST 002", title: "National Service Training Program 2", credits: 3, category: "general", difficulty: 3, prerequisites: ["NST001"], year: 1, sem: 2, description: "Community-based project implementation and disaster management." },

    // Second Year, 1st Sem
    { id: "OCN121", code: "OCN 121", title: "Geological and Physical Oceanography", credits: 4, category: "major", difficulty: 8, prerequisites: ["PHY102", "PHY102.1", "MAT043"], year: 2, sem: 1, description: "Ocean floor geomorphology, plate tectonics, tides, oceanic currents, and thermohaline circulation." },
    { id: "CHM045", code: "CHM 045", title: "Biochemistry (Lec)", credits: 2, category: "science", difficulty: 8, prerequisites: ["CHM032", "CHM032.2"], year: 2, sem: 1, description: "Structure and functions of biomolecules, enzymes, metabolism, and bioenergetics." },
    { id: "CHM045.1", code: "CHM 045.1", title: "Biochemistry Lab", credits: 1, category: "science", difficulty: 7, prerequisites: ["CHM032", "CHM032.2"], year: 2, sem: 1, description: "Colorimetric assays, spectrophotometry, enzyme kinetics, and protein electrophoresis." },
    { id: "BIO119", code: "BIO 119", title: "Developmental and Reproductive Biology", credits: 3, category: "science", difficulty: 7, prerequisites: ["BIO118"], year: 2, sem: 1, description: "Embryogenesis, gametogenesis, larval stages, and marine reproductive adaptations." },
    { id: "GEC102", code: "GEC 102", title: "Purposive Communication", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Scholarly scientific communication, oral presentation, and technical writing." },
    { id: "GEC106", code: "GEC 106", title: "Art Appreciation", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 2, sem: 1, description: "Aesthetics, indigenous culture, and artistic evaluation." },
    { id: "GEC103", code: "GEC 103", title: "The Contemporary World", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Global systems, economic borders, and transnational environmental governance." },
    { id: "GEC120", code: "GEC 120", title: "Wika at Kultura sa Mapayapang Lipunan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Kalinangang Pilipino, diskursong pangkapayapaan, at ugnayang pangwika." },
    { id: "PED013", code: "PED 013", title: "PATHFIT 3: Swimming", credits: 2, category: "general", difficulty: 5, prerequisites: ["PED011"], year: 2, sem: 1, description: "Aquatic strokes, deep water survival, and open-water swimming fundamentals." },

    // Second Year, 2nd Sem
    { id: "OCN122", code: "OCN 122", title: "Biological and Chemical Oceanography", credits: 4, category: "major", difficulty: 8, prerequisites: ["CHM011", "CHM011.1"], year: 2, sem: 2, description: "Marine biogeochemical cycles, primary productivity, dissolved oxygen, and nutrient flux." },
    { id: "ERS100", code: "ERS 100", title: "Earth Science", credits: 3, category: "science", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Earth systems, lithosphere dynamics, mineralogy, and planetary evolution." },
    { id: "BIO120", code: "BIO 120", title: "Ecology", credits: 3, category: "science", difficulty: 7, prerequisites: [], year: 2, sem: 2, description: "Populations, communities, ecosystems, energy flow, and niche dynamics." },
    { id: "MRB147", code: "MRB 147", title: "Systematics, Biodiversity, and Evolution", credits: 4, category: "major", difficulty: 8, prerequisites: [], year: 2, sem: 2, description: "Phylogenetic reconstruction, cladistics, speciation, and marine biodiversity patterns." },
    { id: "GEC107", code: "GEC 107", title: "Ethics", credits: 3, category: "general", difficulty: 5, prerequisites: [], year: 2, sem: 2, description: "Ethical frameworks, environmental morality, and bioethics in marine conservation." },
    { id: "FPE101", code: "FPE 101", title: "Fundamentals of Peace Education", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 2, sem: 2, description: "Conflict transformation and inter-cultural peacebuilding in Mindanao." },
    { id: "PED014", code: "PED 014", title: "PATHFIT 4: Team Sports (Basketball, Volleyball)", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 2, sem: 2, description: "Tactical team coordination and physical conditioning." },

    // Third Year, 1st Sem
    { id: "MRB131", code: "MRB 131", title: "Marine Botany", credits: 4, category: "major", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Marine macroalgae, seagrass meadow ecology, mangrove taxonomy, and zonation." },
    { id: "MRB132", code: "MRB 132", title: "Marine Invertebrates", credits: 4, category: "major", difficulty: 8, prerequisites: ["BIO117"], year: 3, sem: 1, description: "Phylogeny, morphology, life cycles, and ecology of marine sponges, cnidarians, and mollusca." },
    { id: "MRB114", code: "MRB 114", title: "Marine Plankton (Professional Elective)", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Phytoplankton, zooplankton taxonomy, harmful algal blooms, and oceanic microbial loop." },
    { id: "BIO121", code: "BIO 121", title: "Genetics", credits: 4, category: "science", difficulty: 8, prerequisites: ["STT034"], year: 3, sem: 1, description: "Mendelian genetics, population genetics, molecular markers, and conservation genomics." },
    { id: "GEC130", code: "GEC 130", title: "Ekokritisismo at Pagpapahalaga sa Kalikasan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 1, description: "Panitikan, ugnayan ng tao at kalikasan, at kamalayang pang-ekolohiya." },
    { id: "MRB125", code: "MRB 125", title: "Marine Geography and Geochemistry", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Marine cartography, coastal geomorphology, isotopic geochemistry, and sedimentology." },

    // Third Year, 2nd Sem
    { id: "MRB134", code: "MRB 134", title: "Marine Ecology", credits: 4, category: "major", difficulty: 9, prerequisites: ["STT034", "MRB131", "MRB132"], year: 3, sem: 2, description: "Trophic webs, benthic-pelagic coupling, coral reef resilience, and marine biodiversity indices." },
    { id: "MRB198", code: "MRB 198", title: "Research Methodology in Marine Science", credits: 3, category: "research", difficulty: 8, prerequisites: ["STT034"], year: 3, sem: 2, description: "Marine sampling design, scientific writing, proposal defense, and ethics review." },
    { id: "MRB117", code: "MRB 117", title: "Marine Protected Areas (Professional Elective)", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 3, sem: 2, description: "MPA design, zoning, spillover effects, community enforcement, and reef monitoring." },
    { id: "GEC108", code: "GEC 108", title: "Science, Technology and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 2, description: "Ethical intersections of technological revolutions and ecological responsibility." },
    { id: "MRB146", code: "MRB 146", title: "Marine Microbiology & Fungi", credits: 4, category: "major", difficulty: 8, prerequisites: [], year: 3, sem: 2, description: "Marine bacterioplankton, archaea, extremophiles, and fungal decomposition in mangroves." },
    { id: "MRB195", code: "MRB 195", title: "Fundamentals of Research (Problem & Sampling Design)", credits: 2, category: "research", difficulty: 7, prerequisites: ["STT034"], year: 3, sem: 2, description: "Research question formulation, field station safety, and marine sampling methodology." },
    { id: "GAS123", code: "GAS 123", title: "Gender and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 2, description: "Gender roles in coastal communities, equity, and sustainable resource stewardship." },

    // Third Year, Summer
    { id: "GEC104", code: "GEC 104", title: "Mathematics in the Modern World", credits: 3, category: "math", difficulty: 5, prerequisites: [], year: 3, sem: 3, description: "Mathematical patterns in nature, logic, codes, and quantitative reasoning." },
    { id: "GEC110", code: "GEC 110", title: "History of Muslim Filipinos and IPs of MINSUPALA", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 3, description: "Socio-cultural history and ancestral domains in Mindanao, Sulu, and Palawan." },
    { id: "GEC124", code: "GEC 124", title: "Entrepreneurial Mind", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 3, description: "Blue economy entrepreneurship, sustainable startups, and innovation mindset." },
    { id: "HAL101", code: "HAL 101", title: "Fundamentals of Halal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 3, description: "Halal food principles, standards, and blue resource applications." },

    // Fourth Year, 1st Sem
    { id: "MRB145", code: "MRB 145", title: "Coral Reefs", credits: 3, category: "major", difficulty: 8, prerequisites: ["MRB134"], year: 4, sem: 1, description: "Scleractinian coral taxonomy, bleaching physiology, reef health monitoring, and restoration." },
    { id: "MRB143", code: "MRB 143", title: "Marine Vertebrates", credits: 4, category: "major", difficulty: 8, prerequisites: ["MRB132"], year: 4, sem: 1, description: "Chondrichthyes, osteichthyes, marine reptiles, seabirds, and marine mammals." },
    { id: "MRB122", code: "MRB 122", title: "Remote Sensing and GIS (Professional Elective)", credits: 3, category: "tech", difficulty: 7, prerequisites: [], year: 4, sem: 1, description: "Satellite imagery, bathymetric mapping, spatial analysis with QGIS, and drone mapping." },
    { id: "GEC109", code: "GEC 109", title: "Life and Works of Rizal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Historical biography, nationalist literature, and democratic legacy of Dr. Jose Rizal." },
    { id: "MRB148", code: "MRB 148", title: "Integrated Coastal/Marine Resources Management", credits: 4, category: "major", difficulty: 8, prerequisites: ["MRB134"], year: 4, sem: 1, description: "ICM frameworks, Ridge-to-Reef approach, stakeholder consensus, and policy analysis." },
    { id: "MRB196", code: "MRB 196", title: "Experimental Research (Data Gathering & Analysis)", credits: 2, category: "research", difficulty: 8, prerequisites: ["MRB195"], year: 4, sem: 1, description: "Field transects, laboratory measurements, statistical modeling, and data synthesis." },

    // Fourth Year, 2nd Sem
    { id: "MRB197", code: "MRB 197", title: "Practicum in Marine Science (240 Hours)", credits: 3, category: "capstone", difficulty: 7, prerequisites: [], year: 4, sem: 2, description: "240 hours of field immersion in marine research institutes, NGO conservancies, or DA-BFAR." },
    { id: "MRB199", code: "MRB 199", title: "Undergraduate Thesis in Marine Science", credits: 2, category: "capstone", difficulty: 9, prerequisites: ["MRB196"], year: 4, sem: 2, description: "Final thesis defense, publication manuscript submission, and panel evaluation." }
  ],

  // =========================================================================
  // BS IN FISHERIES (BSFi)
  // =========================================================================
  bs_fisheries: [
    // First Year, 1st Sem
    { id: "GEC101", code: "GEC 101", title: "Understanding the Self", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Psychological, biological, and cultural perspectives on self-identity." },
    { id: "GEC102", code: "GEC 102", title: "Purposive Communication", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Written and spoken communication in academic and professional contexts." },
    { id: "GEC103", code: "GEC 103", title: "The Contemporary World", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Global economic systems, sustainability, and international governance." },
    { id: "GEC106", code: "GEC 106", title: "Art Appreciation", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Appreciation and critical analysis of visual and performing arts." },
    { id: "BIO101", code: "BIO 101", title: "Botany (Lec)", credits: 3, category: "science", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Plant cell structure, physiology, anatomy, and economic aquatic plants." },
    { id: "BIO101.2", code: "BIO 101.2", title: "Botany (Lab)", credits: 2, category: "science", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Microscopic analysis, plant tissues, and herbarium specimen preparation." },
    { id: "PED011", code: "PED 011", title: "PATHFit 1: Movement Competency Training", credits: 2, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Fundamental movement skills and physical conditioning." },
    { id: "FPE101", code: "FPE 101", title: "Fundamentals of Peace Education", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Non-violent conflict resolution and culture of peace in Mindanao." },
    { id: "NST001", code: "NST 001", title: "National Service Training Program 1", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Civic welfare and community immersion training." },

    // First Year, 2nd Sem
    { id: "GEC104", code: "GEC 104", title: "Mathematics in the Modern World", credits: 3, category: "math", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Quantitative methods, mathematical modeling, and statistical thinking." },
    { id: "GEC105", code: "GEC 105", title: "Readings in Philippine History", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Philippine history examined through primary documents and historical criticism." },
    { id: "BIO102", code: "BIO 102", title: "Zoology (Lec)", credits: 3, category: "science", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Comparative animal anatomy, physiological systems, phylogeny, and ecology." },
    { id: "BIO102.2", code: "BIO 102.2", title: "Zoology (Lab)", credits: 2, category: "science", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Anatomical dissections and taxonomic identification of animal specimens." },
    { id: "CHM029", code: "CHM 029", title: "Inorganic Analytical Chemistry (Lec)", credits: 3, category: "science", difficulty: 7, prerequisites: [], year: 1, sem: 2, description: "Stoichiometry, volumetric titration, chemical equilibrium, and spectrophotometry." },
    { id: "CHM029.2", code: "CHM 029.2", title: "Inorganic Analytical Chemistry (Lab)", credits: 2, category: "science", difficulty: 6, prerequisites: [], year: 1, sem: 2, description: "Gravimetric and volumetric quantitative wet chemical analysis." },
    { id: "PED012", code: "PED 012", title: "PATHFit 2: Exercise-based Fitness Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 1, sem: 2, description: "Cardiovascular endurance and functional strength training." },
    { id: "GEC115", code: "GEC 115", title: "Teknikal na Pagsulat at Korespondensya Opisyal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Pagsulat ng opisyal na dokumento, ulat pananaliksik, at liham pangkalakalan." },
    { id: "NST002", code: "NST 002", title: "National Service Training Program 2", credits: 3, category: "general", difficulty: 3, prerequisites: ["NST001"], year: 1, sem: 2, description: "Community project implementation and social action." },

    // Second Year, 1st Sem
    { id: "FIS120", code: "FIS 120", title: "Ichthyology", credits: 5, category: "major", difficulty: 8, prerequisites: ["BIO102", "BIO102.2"], year: 2, sem: 1, description: "Fish anatomy, taxonomy, osteology, evolutionary biology, and finfish identification." },
    { id: "FIS121", code: "FIS 121", title: "Aquatic Ecology and Resources", credits: 5, category: "major", difficulty: 8, prerequisites: ["BIO101", "BIO101.2", "BIO102", "BIO102.2"], year: 2, sem: 1, description: "Limnology, marine habitats, nutrient cycling, trophic dynamics, and aquatic biota." },
    { id: "FIS122", code: "FIS 122", title: "Physiology of Aquatic Organisms", credits: 3, category: "major", difficulty: 7, prerequisites: ["BIO101", "BIO101.2", "BIO102", "BIO102.2"], year: 2, sem: 1, description: "Osmoregulation, respiration, swimming energetics, and endocrinology in aquatic fauna." },
    { id: "CHM032", code: "CHM 032", title: "Organic Chemistry (Lec)", credits: 3, category: "science", difficulty: 8, prerequisites: ["CHM029"], year: 2, sem: 1, description: "Hydrocarbon structures, functional groups, and biomolecular precursors." },
    { id: "CHM032.2", code: "CHM 032.2", title: "Organic Chemistry (Lab)", credits: 2, category: "science", difficulty: 7, prerequisites: ["CHM029.2"], year: 2, sem: 1, description: "Synthesis, fractional distillation, extraction, and spectroscopic analysis." },
    { id: "GEC130", code: "GEC 130", title: "Ekokritisismo at Pagpapahalaga sa Kalikasan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Kritikal na pagsusuri ng panitikan kaugnay ng kalikasan at yamang-tubig." },
    { id: "PED013", code: "PED 013", title: "PATHFit 3: Menu of Dance, Sports & Swimming", credits: 2, category: "general", difficulty: 5, prerequisites: ["PED012"], year: 2, sem: 1, description: "Aquatic skills, survival swimming, and individual-dual athletics." },

    // Second Year, 2nd Sem
    { id: "BIO010", code: "BIO 010", title: "Microbiology", credits: 3, category: "science", difficulty: 7, prerequisites: ["BIO101", "BIO101.2", "BIO102", "BIO102.2"], year: 2, sem: 2, description: "Bacterial culture, sterile technique, waterborne microbes, and aquatic pathogens." },
    { id: "FIS123", code: "FIS 123", title: "Oceanography", credits: 3, category: "major", difficulty: 7, prerequisites: ["FIS120", "FIS121", "CHM032", "CHM032.2"], year: 2, sem: 2, description: "Physical and chemical oceanography influencing commercial fish stocks." },
    { id: "FIS124", code: "FIS 124", title: "Fisheries Meteorology", credits: 3, category: "major", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Monsoons, typhoons, sea surface temperatures, El Niño/La Niña, and fishing safety." },
    { id: "FIS125", code: "FIS 125", title: "Aquaculture 1", credits: 3, category: "major", difficulty: 7, prerequisites: ["FIS120", "FIS121", "FIS122"], year: 2, sem: 2, description: "Principles of finfish and crustacean culture, pond construction, and stocking density." },
    { id: "CHM045", code: "CHM 045", title: "Biochemistry", credits: 3, category: "science", difficulty: 8, prerequisites: ["CHM032", "CHM032.2"], year: 2, sem: 2, description: "Proteins, lipids, nucleic acids, metabolic pathways, and post-harvest biochemistry." },
    { id: "HAL101", code: "HAL 101", title: "Fundamentals of Halal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Halal compliance in seafood handling, aquaculture inputs, and export standards." },
    { id: "GEC123", code: "GEC 123", title: "Gender and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Gender dimensions in small-scale fisheries and value chains." },
    { id: "GEC109", code: "GEC 109", title: "Life and Works of Rizal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Dr. Jose Rizal's life, patriotic philosophy, and literary masterpieces." },
    { id: "PED014", code: "PED 014", title: "PATHFit 4: Sports, Outdoor and Adventure Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 2, description: "Team games, tactical sportsmanship, and outdoor adventure activities." },

    // Third Year, 1st Sem
    { id: "FIS130", code: "FIS 130", title: "Aquaculture 2", credits: 3, category: "major", difficulty: 7, prerequisites: ["FIS125"], year: 3, sem: 1, description: "Intensive mariculture, cage and pen farming, recirculating systems, and biosecurity." },
    { id: "FIS131", code: "FIS 131", title: "Aquaculture Engineering", credits: 3, category: "major", difficulty: 8, prerequisites: ["FIS123", "FIS124", "FIS125"], year: 3, sem: 1, description: "Hatchery design, hydraulic pumps, aeration calculations, and pond earthworks." },
    { id: "FIS132", code: "FIS 132", title: "Fish Nutrition", credits: 3, category: "major", difficulty: 7, prerequisites: ["CHM045", "FIS122", "FIS125"], year: 3, sem: 1, description: "Feed formulation, dietary protein requirements, proximate analysis, and feed conversion." },
    { id: "FIS133", code: "FIS 133", title: "Fish Health Management", credits: 3, category: "major", difficulty: 8, prerequisites: ["BIO010", "CHM045", "FIS125"], year: 3, sem: 1, description: "Diagnostic pathology, bacterial and parasitic diseases, vaccines, and quarantine." },
    { id: "FIS134", code: "FIS 134", title: "Fish Genetics and Breeding", credits: 3, category: "major", difficulty: 8, prerequisites: ["FIS125", "CHM045"], year: 3, sem: 1, description: "Selective breeding, induced spawning, sex reversal, and broodstock improvement." },
    { id: "GEC110", code: "GEC 110", title: "History of Muslim Filipinos & IPs of MINSUPALA", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 1, description: "Bangsamoro culture, customary tenure, and maritime history of Southern Philippines." },
    { id: "FIS150", code: "FIS 150", title: "Fisheries Statistics", credits: 3, category: "math", difficulty: 7, prerequisites: [], year: 3, sem: 1, description: "Biostatistical analysis, catch effort curves, regression models, and fish population metrics." },

    // Third Year, 2nd Sem
    { id: "FIS135", code: "FIS 135", title: "Post-Harvest Fisheries", credits: 5, category: "major", difficulty: 7, prerequisites: ["BIO010", "CHM045"], year: 3, sem: 2, description: "Fish handling, smoking, salting, canning, surimi production, and cold chain logistics." },
    { id: "FIS137", code: "FIS 137", title: "Capture Fisheries", credits: 5, category: "major", difficulty: 8, prerequisites: ["FIS123", "FIS124"], year: 3, sem: 2, description: "Fishing gear mechanics, net acoustics, mesh selectivity, and commercial vessels." },
    { id: "FIS138", code: "FIS 138", title: "Fisheries Laws, Policies, and Institutions", credits: 3, category: "major", difficulty: 6, prerequisites: [], year: 3, sem: 2, description: "Philippine Fisheries Code (RA 8550/10654), municipal waters, and international treaties." },
    { id: "FIS198", code: "FIS 198", title: "Research Design and Methodologies", credits: 3, category: "research", difficulty: 8, prerequisites: ["FIS150", "FIS130", "FIS131", "FIS132", "FIS133", "FIS134"], year: 3, sem: 2, description: "Scientific proposal defense, experimental design, and thesis outline approval." },
    { id: "FIS151", code: "FIS 151", title: "Fish Stock Assessment (Elective)", credits: 3, category: "major", difficulty: 8, prerequisites: [], year: 3, sem: 2, description: "Growth parameters, mortality rates, virtual population analysis, and maximum sustainable yield." },
    { id: "FIS152", code: "FIS 152", title: "Hatchery Management (Elective)", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 3, sem: 2, description: "Larviculture, live feed propagation (Artemia, rotifers), and water disinfection." },

    // Third Year, Summer
    { id: "FIS197", code: "FIS 197", title: "On-the-Job Training (320 Hours)", credits: 3, category: "capstone", difficulty: 7, prerequisites: ["FIS130", "FIS131", "FIS132", "FIS133", "FIS134", "FIS135", "FIS137", "FIS138"], year: 3, sem: 3, description: "320 hours immersion in commercial aquaculture farms, canning facilities, or BFAR stations." },

    // Fourth Year, 1st Sem
    { id: "GEC108", code: "GEC 108", title: "Science, Technology, and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Scientific breakthroughs, environmental issues, and socio-economic responsibilities." },
    { id: "FIS136", code: "FIS 136", title: "Fishery Product Safety and Quality", credits: 3, category: "major", difficulty: 7, prerequisites: ["FIS135"], year: 4, sem: 1, description: "HACCP principles, sensory evaluation, microbial spoilage indicators, and Codex Alimentarius." },
    { id: "FIS140", code: "FIS 140", title: "Project Development and Management", credits: 3, category: "management", difficulty: 7, prerequisites: ["FIS130", "FIS135", "FIS137"], year: 4, sem: 1, description: "Feasibility studies, aquaculture enterprise cash flows, and loan proposal drafting." },
    { id: "FIS141", code: "FIS 141", title: "Fisheries Management", credits: 5, category: "major", difficulty: 8, prerequisites: ["FIS137", "FIS138"], year: 4, sem: 1, description: "Ecosystem-based fisheries management, closed fishing seasons, and quota allocations." },
    { id: "FIS199", code: "FIS 199", title: "Undergraduate Thesis in Fisheries", credits: 3, category: "capstone", difficulty: 9, prerequisites: ["FIS198"], year: 4, sem: 1, description: "Independent experimental fisheries thesis defense and manuscript preparation." },
    { id: "FIS163", code: "FIS 163", title: "Fish Processing Plant Management (Elective)", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 4, sem: 1, description: "Plant layout, cold storage automation, wastewater treatment, and GMP compliance." },

    // Fourth Year, 2nd Sem
    { id: "GEC107", code: "GEC 107", title: "Ethics", credits: 3, category: "general", difficulty: 5, prerequisites: [], year: 4, sem: 2, description: "Moral principles, animal welfare in aquaculture, and resource equity." },
    { id: "FIS142", code: "FIS 142", title: "Coastal Resource Management", credits: 3, category: "major", difficulty: 7, prerequisites: ["FIS137", "FIS138"], year: 4, sem: 2, description: "Marine sanctuary co-management, bantay-dagat patrols, and coastal zoning." },
    { id: "FIS143", code: "FIS 143", title: "Fisheries Entrepreneurship", credits: 3, category: "management", difficulty: 6, prerequisites: ["FIS140"], year: 4, sem: 2, description: "Aquapreneurship, value-adding fish products, and marketing cooperative setup." },
    { id: "FIS144", code: "FIS 144", title: "Fisheries Extension", credits: 3, category: "major", difficulty: 6, prerequisites: ["FIS140", "FIS141"], year: 4, sem: 2, description: "Participatory rural appraisal, technology transfer to fisherfolk, and extension communication." },
    { id: "FSH196", code: "FSH 196", title: "Seminar in Fisheries", credits: 1, category: "capstone", difficulty: 6, prerequisites: ["GEC102", "FIS130", "FIS135", "FIS137"], year: 4, sem: 2, description: "Scholarly symposium presentations and review of contemporary fisheries breakthroughs." },
    { id: "FSH166", code: "FSH 166", title: "Post-Harvest Handling & Low Temperature Preservation (Elective)", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 4, sem: 2, description: "Blast freezing, IQF systems, superchilling, and cryogenic transport of high-value seafood." },
    { id: "FSH154", code: "FSH 154", title: "GIS and Remote Sensing for Fisheries (Elective)", credits: 3, category: "tech", difficulty: 7, prerequisites: [], year: 4, sem: 2, description: "Chlorophyll-a satellite mapping, fishing vessel tracking (VMS), and habitat GIS." }
  ],

  // =========================================================================
  // BS IN AGRICULTURE MAJOR IN AGRONOMY (BSA-AGRONOMY)
  // =========================================================================
  bs_agriculture: [
    // First Year, 1st Sem
    { id: "GEC101", code: "GEC 101", title: "Understanding the Self", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Psychological and social dimensions of personal identity and self-development." },
    { id: "GEC102", code: "GEC 102", title: "Purposive Communication", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Professional, agricultural, and technical communication across diverse media." },
    { id: "CHM033", code: "CHM 033", title: "Organic Chemistry (Lec)", credits: 2, category: "science", difficulty: 7, prerequisites: [], year: 1, sem: 1, description: "Organic structures, functional groups, agrochemicals, and plant molecular constituents." },
    { id: "CHM033.1", code: "CHM 033.1", title: "Organic Chemistry Laboratory", credits: 1, category: "science", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Laboratory investigations in organic extraction, distillation, and assays." },
    { id: "AGR001", code: "AGR 001", title: "Introduction to Agriculture", credits: 3, category: "major", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Overview of agricultural systems, food security, agro-ecology, and Philippine agriculture." },
    { id: "CRS001", code: "CRS 001", title: "Principles of Crop Production", credits: 3, category: "major", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Physiology of cultivated crops, environment-crop interactions, and yield determinants." },
    { id: "SSC001", code: "SSC 001", title: "Principles of Soil Science", credits: 3, category: "science", difficulty: 6, prerequisites: [], year: 1, sem: 1, description: "Soil formation, morphology, physical, chemical, and microbiological soil traits." },
    { id: "FPE101", code: "FPE 101", title: "Fundamentals of Peace Education", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Culture of peace, conflict resolution, and rural community peacebuilding." },
    { id: "PED011", code: "PED 011", title: "Movement Competency Training", credits: 2, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Physical fitness fundamentals and movement biomechanics." },
    { id: "NST001", code: "NST 001", title: "National Service Training Program 1", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Civic welfare and community immersion training." },

    // First Year, 2nd Sem
    { id: "GEC103", code: "GEC 103", title: "The Contemporary World", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Globalization, international trade policies, and global food supply networks." },
    { id: "GEC104", code: "GEC 104", title: "Mathematics in the Modern World", credits: 3, category: "math", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Mathematical patterns, financial math, and quantitative reasoning in agriculture." },
    { id: "ANS001", code: "ANS 001", title: "Introduction to Animal Science", credits: 3, category: "science", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Breeds, nutrition, physiology, and livestock-crop integration systems." },
    { id: "CRP001", code: "CRP 001", title: "Principles of Crop Protection", credits: 3, category: "major", difficulty: 6, prerequisites: [], year: 1, sem: 2, description: "Plant pathology, entomology, weed science, and integrated pest management (IPM)." },
    { id: "SSC002", code: "SSC 002", title: "Soil Fertility, Conservation and Management", credits: 3, category: "science", difficulty: 7, prerequisites: ["SSC001"], year: 1, sem: 2, description: "Nutrient dynamics, NPK fertilizers, soil acidity correction, and soil erosion control." },
    { id: "CRS002", code: "CRS 002", title: "Practices of Crop Science and Management", credits: 3, category: "major", difficulty: 6, prerequisites: ["CRS001"], year: 1, sem: 2, description: "Field tillage, seedbed preparation, planting geometry, irrigation, and crop scheduling." },
    { id: "GEC110", code: "GEC 110", title: "History of Filipino Muslim & IPs of MINSUPALA", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Indigenous agricultural traditions and socio-cultural history of Mindanao." },
    { id: "PED012", code: "PED 012", title: "Exercise-based Fitness Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 1, sem: 2, description: "Cardiovascular endurance and functional strength development." },
    { id: "NST002", code: "NST 002", title: "National Service Training Program 2", credits: 3, category: "general", difficulty: 3, prerequisites: ["NST001"], year: 1, sem: 2, description: "Community-based agricultural extension and service projects." },

    // First Year, Summer
    { id: "AGM097", code: "AGM 097", title: "Practicum Skills & Development in Agronomy (In-Campus 240 Hrs)", credits: 3, category: "capstone", difficulty: 7, prerequisites: ["CRS001", "CRS002", "SSC001", "SSC002", "CRP001", "ANS001"], year: 1, sem: 3, description: "Hands-on agronomy practicum at university trial plots and demo farms." },

    // Second Year, 1st Sem
    { id: "CHM043", code: "CHM 043", title: "General Biochemistry (Lec)", credits: 2, category: "science", difficulty: 8, prerequisites: ["CHM033"], year: 2, sem: 1, description: "Photosynthetic pathways, plant hormones, amino acid biosynthesis, and metabolism." },
    { id: "CHM043.1", code: "CHM 043.1", title: "General Biochemistry Laboratory", credits: 1, category: "science", difficulty: 7, prerequisites: ["CHM033"], year: 2, sem: 1, description: "Enzyme assays, chlorophyll quantification, and biomolecular analysis." },
    { id: "AGR002", code: "AGR 002", title: "Introduction to Organic Agriculture", credits: 3, category: "major", difficulty: 6, prerequisites: ["SSC002", "CRS002"], year: 2, sem: 1, description: "Organic farming standards, bio-fertilizers, concoctions, and certification (RA 10068)." },
    { id: "AGR003", code: "AGR 003", title: "Methods of Agricultural Research", credits: 3, category: "research", difficulty: 7, prerequisites: [], year: 2, sem: 1, description: "RCBD, Split-plot layouts, field plot sampling, ANOVA, and research proposals." },
    { id: "ANS002", code: "ANS 002", title: "Introduction to Livestock & Poultry Production", credits: 3, category: "science", difficulty: 6, prerequisites: ["ANS001"], year: 2, sem: 1, description: "Broiler, layer, swine, and ruminant housing, feeding, and waste management." },
    { id: "CRP002", code: "CRP 002", title: "Approaches and Practices in Pest Management", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRP001"], year: 2, sem: 1, description: "Biological control agents, biocides, pheromone traps, and economic threshold levels." },
    { id: "GEC105", code: "GEC 105", title: "Readings in Philippine History", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Critical historical reading of Philippine land reform and rural movements." },
    { id: "GEC120", code: "GEC 120", title: "Wika at Kultura sa Mapayapang Lipunan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Wikang Filipino at papel nito sa pambansang kaunlaran at agrikultura." },
    { id: "PED013", code: "PED 013", title: "Choice of Individual – Dual Sports", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 1, description: "Dual games, martial arts, and individual recreational training." },

    // Second Year, 2nd Sem
    { id: "GEC106", code: "GEC 106", title: "Art Appreciation", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 2, sem: 2, description: "Visual and cultural arts, Philippine indigenous design, and aesthetic appreciation." },
    { id: "GEC107", code: "GEC 107", title: "Ethics", credits: 3, category: "general", difficulty: 5, prerequisites: [], year: 2, sem: 2, description: "Environmental ethics, agricultural sustainability, and moral accountability." },
    { id: "AEX001", code: "AEX 001", title: "Principles of Agricultural Extension and Communication", credits: 3, category: "major", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Diffusion of agricultural innovations, farmer field schools, and rural communication." },
    { id: "GEN001", code: "GEN 001", title: "Principles of Genetics", credits: 3, category: "science", difficulty: 8, prerequisites: ["CHM043"], year: 2, sem: 2, description: "Mendelian genetics, chromosome mechanics, DNA replication, and gene expression." },
    { id: "ABE001", code: "ABE 001", title: "Basic Farm Machineries, Mechanization and Water Mgt", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 2, sem: 2, description: "Tractors, combine harvesters, drip and sprinkler irrigation hydraulics, and maintenance." },
    { id: "AGR004", code: "AGR 004", title: "Natural Resource & Environmental Mgt for Agriculture", credits: 3, category: "science", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Watershed conservation, agroforestry, carbon sequestration, and climate adaptation." },
    { id: "GEC130", code: "GEC 130", title: "Ekokritisismo at Pagpapahalaga sa Kalikasan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Ekolohikal na pananaw sa pamamagitan ng literaturang makakalikasan." },
    { id: "PED014", code: "PED 014", title: "Choice of Team Sports & Adventure Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 2, description: "Team coordination, sportsmanship, and outdoor physical recreation." },

    // Third Year, 1st Sem
    { id: "AGR005", code: "AGR 005", title: "General Physiology and Toxicology", credits: 3, category: "science", difficulty: 7, prerequisites: ["CRP002"], year: 3, sem: 1, description: "Toxicological modes of action of pesticides, bioaccumulation, and safety." },
    { id: "ABT001", code: "ABT 001", title: "Agricultural Biotechnology", credits: 3, category: "major", difficulty: 8, prerequisites: ["GEN001"], year: 3, sem: 1, description: "Tissue culture, molecular markers, recombinant DNA, and transgenic crops." },
    { id: "CRS003", code: "CRS 003", title: "Post-Harvest Handling & Seed Technology", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 3, sem: 1, description: "Grain drying, seed purity testing, seed certification, and cold store respiration." },
    { id: "ABM001", code: "ABM 001", title: "Principles of Agricultural Entrepreneurship & Enterprise Dev", credits: 3, category: "management", difficulty: 6, prerequisites: [], year: 3, sem: 1, description: "Agri-business canvas, value chain financing, contract farming, and financial projections." },
    { id: "HOR123", code: "HOR 123", title: "Vegetables Crop Production", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 3, sem: 1, description: "Solanaceous, cucurbit, and leafy vegetable cultural practices and market timing." },
    { id: "AGM101", code: "AGM 101", title: "Crop Physiology", credits: 3, category: "major", difficulty: 8, prerequisites: ["CRS002"], year: 3, sem: 1, description: "Photosynthetic light reactions, Rubisco kinetics, transpiration, and source-sink dynamics." },
    { id: "AGM102", code: "AGM 102", title: "Principles, Practices & Technologies in Plant Breeding", credits: 3, category: "major", difficulty: 8, prerequisites: ["CRS002", "GEN001"], year: 3, sem: 1, description: "Hybridization, pedigree selection, backcrossing, male sterility, and seed production." },
    { id: "ANS191", code: "ANS 191", title: "Seminar A", credits: 1, category: "major", difficulty: 5, prerequisites: [], year: 3, sem: 1, description: "Oral presentations and critique of published agronomic scientific literature." },
    { id: "AGM194", code: "AGM 194", title: "Undergraduate Thesis: Technical Writing for Outline", credits: 1, category: "research", difficulty: 8, prerequisites: ["AGR003"], year: 3, sem: 1, description: "Thesis proposal formulation, literature review, and methodology defense." },

    // Third Year, 2nd Sem
    { id: "HAL101", code: "HAL 101", title: "Fundamentals of Halal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 2, description: "Halal crop production guidelines, organic integrity, and traceability standards." },
    { id: "AGR006", code: "AGR 006", title: "Beneficial Arthropods and Micro-organisms", credits: 3, category: "science", difficulty: 7, prerequisites: ["CRP001"], year: 3, sem: 2, description: "Pollinators, parasitoids, entomopathogenic fungi, and mycorrhizae in agronomy." },
    { id: "ANS003", code: "ANS 003", title: "Slaughter of Animals and Animal Product Processing", credits: 3, category: "science", difficulty: 6, prerequisites: ["ANS002"], year: 3, sem: 2, description: "Meat processing, preservation, and hygienic handling of livestock goods." },
    { id: "AGM103", code: "AGM 103", title: "Cereals, Forage and Pasture Crop Production", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 3, sem: 2, description: "Rice and corn agronomy, silage preservation, and pasture grassland management." },
    { id: "AGM104", code: "AGM 104", title: "Legumes, Roots and Tubers Crop Production", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 3, sem: 2, description: "Cassava, sweet potato, peanut, and mungbean agronomic systems." },
    { id: "AGM105", code: "AGM 105", title: "Biology of Weeds and their Control", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002", "CRP002"], year: 3, sem: 2, description: "Weed competition, herbicide selectivity, resistance mechanisms, and mechanical weeding." },
    { id: "AGM106", code: "AGM 106", title: "Precision Agriculture", credits: 3, category: "tech", difficulty: 8, prerequisites: ["CRS002", "SSC002"], year: 3, sem: 2, description: "GPS soil mapping, variable rate fertilizing, NDVI multispectral drone crop analysis." },
    { id: "AGM192", code: "AGM 192", title: "Seminar B", credits: 1, category: "major", difficulty: 5, prerequisites: ["ANS191"], year: 3, sem: 2, description: "Colloquium presentation of preliminary field trial findings and research progress." },
    { id: "AGM195", code: "AGM 195", title: "Undergraduate Thesis: Field Experiments", credits: 2, category: "research", difficulty: 8, prerequisites: ["AGM194"], year: 3, sem: 2, description: "Execution of agronomic field experiments, phenotyping, and data collection." },

    // Third Year, Summer
    { id: "AGM197", code: "AGM 197", title: "On-the-Job Training in Agronomy (Off-Campus 240 Hrs)", credits: 3, category: "capstone", difficulty: 7, prerequisites: ["AGM101", "AGM102", "AGM103", "AGM104", "AGM105", "AGM106", "HOR123", "CRS003"], year: 3, sem: 3, description: "240 hours of industrial farm or research institute internship (PhilRice, DA, plantations)." },

    // Fourth Year, 1st Sem
    { id: "GEC108", code: "GEC 108", title: "Science, Technology and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Technological disruptions, ethics of GMOs, and global environmental impact." },
    { id: "GEC109", code: "GEC 109", title: "Life and Works of Rizal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Life and legacy of Dr. Jose Rizal as a patriot, scientist, and agriculturist in Dapitan." },
    { id: "AGR007", code: "AGR 007", title: "Principles and Practices of Halal Agriculture", credits: 3, category: "major", difficulty: 6, prerequisites: ["ANS002", "CRS002", "HAL101"], year: 4, sem: 1, description: "Halal integrity in cropping, bio-inputs, harvesting, and packaging protocols." },
    { id: "AEC001", code: "AEC 001", title: "Principles of Agricultural Economics", credits: 3, category: "theory", difficulty: 6, prerequisites: [], year: 4, sem: 1, description: "Farm budgeting, supply-demand for agri-commodities, and price formation." },
    { id: "ABM002", code: "ABM 002", title: "Agricultural Commodity System and Marketing", credits: 3, category: "management", difficulty: 6, prerequisites: [], year: 4, sem: 1, description: "Post-harvest marketing chains, wholesale consolidation, and export logistics." },
    { id: "GEC123", code: "GEC 123", title: "Gender and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 1, description: "Gender roles in agrarian families and inclusive rural development." },
    { id: "GEC133", code: "GEC 133", title: "Living the IT Era", credits: 3, category: "tech", difficulty: 5, prerequisites: [], year: 4, sem: 1, description: "Digital literacy, smart farming apps, cloud computing, and cybersecurity." },
    { id: "FSY131", code: "FSY 131", title: "Introduction to Farming System", credits: 3, category: "major", difficulty: 7, prerequisites: ["CRS002"], year: 4, sem: 1, description: "Integrated crop-livestock-aquaculture farming systems and bio-circular economies." },

    // Fourth Year, 2nd Sem
    { id: "GEC131", code: "GEC 131", title: "People and Earth's Ecosystem", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 4, sem: 2, description: "Biosphere conservation, climate resilience, and planetary boundaries." },
    { id: "AEX002", code: "AEX 002", title: "Agricultural Policy and Development", credits: 3, category: "major", difficulty: 7, prerequisites: [], year: 4, sem: 2, description: "Agrarian reform policies, tariffication laws, food sovereignty, and rural subsidies." },
    { id: "AGM199", code: "AGM 199", title: "Undergraduate Thesis: Manuscript Writing & Oral Defense", credits: 3, category: "capstone", difficulty: 9, prerequisites: ["AGM195"], year: 4, sem: 2, description: "Final thesis manuscript publication readiness and oral defense before the academic committee." }
  ],

  // =========================================================================
  // BACHELOR OF ELEMENTARY EDUCATION (BEEd)
  // =========================================================================
  beed: [
    // First Year, 1st Sem
    { id: "GEC101", code: "GEC 101", title: "Understanding the Self", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Nature of identity, factors affecting personal development and psychological wellness." },
    { id: "GEC105", code: "GEC 105", title: "Readings in Philippine History", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Analysis of Philippine history through primary sources." },
    { id: "GEC102", code: "GEC 102", title: "Purposive Communication", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Writing, speaking, and presenting for academic and professional educational settings." },
    { id: "GEC103", code: "GEC 103", title: "The Contemporary World", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Globalization, international educational trends, and global governance." },
    { id: "CPE100", code: "CPE 100", title: "The Child & Adolescent Learners and Learning Principles", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Physical, cognitive, and socio-emotional development of children and youth." },
    { id: "CPE101", code: "CPE 101", title: "The Teaching Profession", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 1, sem: 1, description: "Historical, philosophical, and legal foundations of teaching; code of ethics for teachers." },
    { id: "GEC120", code: "GEC 120", title: "Wika at Kultura sa Mapayapang Lipunan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 1, description: "Kultura at wika tungo sa pambansang pagkakaunawaan." },
    { id: "PED011", code: "PED 011", title: "PATHFit 1: Movement Competency Training", credits: 2, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Movement biomechanics and physical fitness foundations." },
    { id: "NST001", code: "NST 001", title: "National Service Training Program 1", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 1, description: "Civic welfare and literacy training service." },

    // First Year, 2nd Sem
    { id: "GEC110", code: "GEC 110", title: "History of Muslim Filipinos and IPs of MINSUPALA", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Mindanao, Sulu, Palawan socio-cultural history, peace education, and indigenous rights." },
    { id: "CPE102", code: "CPE 102", title: "The Teacher and the Community, School Culture & Leadership", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE101"], year: 1, sem: 2, description: "School-community partnerships, organizational leadership, and professional school ethics." },
    { id: "CPE104", code: "CPE 104", title: "Facilitating Learner-Centered Teaching", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE100"], year: 1, sem: 2, description: "Constructivism, metacognition, diverse learning styles, and motivation strategies." },
    { id: "GEC106", code: "GEC 106", title: "Art Appreciation", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 1, sem: 2, description: "Visual and performing arts appreciation and creative integration in classrooms." },
    { id: "GED111", code: "GED 111", title: "Edukasyong Pantahanan at Pangkabuhayan", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 1, sem: 2, description: "Foundations of Home Economics, Industrial Arts, and Agri-Fishery Arts for elementary school." },
    { id: "GEC109", code: "GEC 109", title: "Life and Works of Rizal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Rizal's life, writings, and moral-intellectual contribution to Philippine nationhood." },
    { id: "GED117", code: "GED 117", title: "Good Manners and Right Conduct (Edukasyon sa Pagpapakatao)", credits: 3, category: "education", difficulty: 4, prerequisites: [], year: 1, sem: 2, description: "Values education, moral development, character formation, and civics in primary education." },
    { id: "PED012", code: "PED 012", title: "PATHFit 2: Exercise-based Fitness Activities", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED011"], year: 1, sem: 2, description: "Cardiovascular and muscular endurance training." },
    { id: "NST002", code: "NST 002", title: "National Service Training Program 2", credits: 3, category: "general", difficulty: 3, prerequisites: ["NST001"], year: 1, sem: 2, description: "Community literacy service and youth empowerment." },

    // Second Year, 1st Sem
    { id: "GEC107", code: "GEC 107", title: "Ethics", credits: 3, category: "general", difficulty: 5, prerequisites: [], year: 2, sem: 1, description: "Moral philosophies, professional ethical dilemmas, and values integration." },
    { id: "GEC108", code: "GEC 108", title: "Science, Technology and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Intersections of science, technology, ethics, and contemporary society." },
    { id: "GEC104", code: "GEC 104", title: "Mathematics in the Modern World", credits: 3, category: "math", difficulty: 5, prerequisites: [], year: 2, sem: 1, description: "Patterns, reasoning, and statistical analysis applied to educational data." },
    { id: "CPE105", code: "CPE 105", title: "Assessment in Learning 1", credits: 3, category: "education", difficulty: 7, prerequisites: ["CPE100"], year: 2, sem: 1, description: "Formative and summative tests, rubric construction, item analysis, validity, and reliability." },
    { id: "CPE108", code: "CPE 108", title: "The Teacher and the School Curriculum", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE101", "CPE102"], year: 2, sem: 1, description: "Curriculum design, implementation, and Philippine Matatag / K-12 curriculum evaluation." },
    { id: "GED103", code: "GED 103", title: "Teaching Social Studies in Elementary (Phil History & Gov)", credits: 3, category: "education", difficulty: 6, prerequisites: ["GEC110"], year: 2, sem: 1, description: "Pedagogical methodologies for Araling Panlipunan, citizenship, and geography." },
    { id: "GEC130", code: "GEC 130", title: "Ekokritisismo at Pagpapahalaga sa Kalikasan", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 1, description: "Eko-literasi at pangangalaga sa kapaligiran sa pamamagitan ng panitikan." },
    { id: "PED013", code: "PED 013", title: "PATHFit 3: Individual – Dual Sports & Dance", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 1, description: "Dual sports, rhythmic activities, and recreational movements." },

    // Second Year, 2nd Sem
    { id: "GED101", code: "GED 101", title: "Teaching Science in Elementary (Biology and Chemistry)", credits: 3, category: "education", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Inquiry-based primary science instruction, experiments, and STEM pedagogical approaches." },
    { id: "FIL103", code: "FIL 103", title: "Inobasyon sa Wikang Filipino", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 2, sem: 2, description: "Modernong paggamit ng Filipino sa pagtuturo, midya, at teknolohiya." },
    { id: "CPE106", code: "CPE 106", title: "Assessment in Learning 2", credits: 3, category: "education", difficulty: 7, prerequisites: ["CPE105"], year: 2, sem: 2, description: "Authentic, portfolio, and diagnostic assessment, affective learning evaluation." },
    { id: "CPE109", code: "CPE 109", title: "Building and Enhancing New Literacies Across Curriculum", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE101", "CPE102"], year: 2, sem: 2, description: "Digital literacy, media literacy, eco-literacy, financial literacy, and multicultural education." },
    { id: "CPE110", code: "CPE 110", title: "School-Community Linkages", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE101", "CPE102"], year: 2, sem: 2, description: "PTA collaborations, barangay linkages, and community-engaged educational programming." },
    { id: "GED109", code: "GED 109", title: "Teaching Math in the Primary Grades", credits: 3, category: "education", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Concrete-Pictorial-Abstract (CPA) framework for Grades 1-3 numeracy and problem solving." },
    { id: "GED115", code: "GED 115", title: "Teaching Beginning Reading", credits: 3, category: "education", difficulty: 6, prerequisites: [], year: 2, sem: 2, description: "Phonemic awareness, phonics, sight words, reading diagnostics, and guided reading." },
    { id: "PED014", code: "PED 014", title: "PATHFit 4: Team Sports, Outdoor and Adventure", credits: 2, category: "general", difficulty: 3, prerequisites: ["PED012"], year: 2, sem: 2, description: "Team games, tactical athletics, and outdoor recreational leadership." },

    // Second Year, Summer
    { id: "GED106", code: "GED 106", title: "Pagtuturo ng Filipino sa Elementary (I) - Estruktura at Gamit", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 2, sem: 3, description: "Estruktura, gramatika, at metodolohiya sa pagtuturo ng wikang Filipino sa primarya." },
    { id: "CPE107", code: "CPE 107", title: "Technology for Teaching and Learning 1", credits: 3, category: "education", difficulty: 5, prerequisites: ["CPE100"], year: 2, sem: 3, description: "Educational technology, digital instructional design, and ICT tools in classroom pedagogy." },

    // Third Year, 1st Sem
    { id: "GED105", code: "GED 105", title: "Technology for Teaching and Elementary Grades", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE107"], year: 3, sem: 1, description: "Subject-specific educational tech applications for elementary mathematics, science, and reading." },
    { id: "GED104", code: "GED 104", title: "Teaching Social Studies (Culture and Geography)", credits: 3, category: "education", difficulty: 6, prerequisites: ["GED103"], year: 3, sem: 1, description: "Cultural diversity, geography, and civic instruction in intermediate elementary grades." },
    { id: "GED107", code: "GED 107", title: "Pagtuturo ng Filipino sa Elementarya (II) - Panitikan ng Pilipinas", credits: 3, category: "education", difficulty: 6, prerequisites: ["GED106"], year: 3, sem: 1, description: "Paggamit ng katutubo at kontemporaryong panitikan sa pagpapaunlad ng literasi." },
    { id: "GED108", code: "GED 108", title: "Teaching PE and Health in the Elementary Grades", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 3, sem: 1, description: "Health education, motor skills, lead-up games, and wellness curricula in primary schools." },
    { id: "GED110", code: "GED 110", title: "Teaching Math in the Intermediate Grades", credits: 3, category: "education", difficulty: 7, prerequisites: ["GED109"], year: 3, sem: 1, description: "Fractions, decimals, geometry, measurement, and algebra basics for Grades 4-6." },
    { id: "GED113", code: "GED 113", title: "Teaching English in Elementary Grades (Language Arts)", credits: 3, category: "education", difficulty: 6, prerequisites: [], year: 3, sem: 1, description: "Communicative language teaching, oral fluency, vocabulary, and grammar pedagogy." },
    { id: "GED116", code: "GED 116", title: "Content and Pedagogy for the Mother-Tongue", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 3, sem: 1, description: "Mother Tongue-Based Multilingual Education (MTB-MLE) policies and pedagogical practices." },
    { id: "GED119", code: "GED 119", title: "Teaching Multi-Grade Classes", credits: 3, category: "education", difficulty: 6, prerequisites: [], year: 3, sem: 1, description: "Classroom organization, differentiated instruction, and timetable design for multi-grade schools." },

    // Third Year, 2nd Sem
    { id: "CPE103", code: "CPE 103", title: "Foundation of Inclusive and Special Education", credits: 3, category: "education", difficulty: 6, prerequisites: ["CPE100"], year: 3, sem: 2, description: "IEP formulation, modifications, and inclusive support for learners with special needs." },
    { id: "GED114", code: "GED 114", title: "Teaching English in Elementary Grades Through Literature", credits: 3, category: "education", difficulty: 6, prerequisites: ["GED113"], year: 3, sem: 2, description: "Children's literature, storybook integration, readers' theatre, and critical thinking." },
    { id: "GED118", code: "GED 118", title: "Edukasyong Pantahanan at Pangkabuhayan with Entrepreneurship", credits: 3, category: "education", difficulty: 6, prerequisites: ["GED111"], year: 3, sem: 2, description: "Livelihood skills, financial literacy, and entrepreneurship integration in elementary EPP." },
    { id: "GED120", code: "GED 120", title: "Teaching Music in the Elementary Grades", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 3, sem: 2, description: "Kodály, Orff, and Dalcroze methodologies, rhythm, melody, and elementary musical notation." },
    { id: "GED102", code: "GED 102", title: "Teaching Science in Elementary (Physics, Earth and Space)", credits: 3, category: "education", difficulty: 6, prerequisites: ["GED101"], year: 3, sem: 2, description: "Hands-on physics, simple machines, weather, astronomy, and planetary science for children." },
    { id: "GED112", code: "GED 112", title: "Teaching Arts in the Elementary Grades", credits: 3, category: "education", difficulty: 5, prerequisites: [], year: 3, sem: 2, description: "Visual arts pedagogies, printmaking, indigenous crafts, and creative child expression." },
    { id: "GED198", code: "GED 198", title: "Research in Education", credits: 3, category: "research", difficulty: 8, prerequisites: ["CPE106"], year: 3, sem: 2, description: "Classroom action research design, data gathering, intervention testing, and writing." },
    { id: "FPE101", code: "FPE 101", title: "Fundamentals of Peace Education", credits: 3, category: "general", difficulty: 3, prerequisites: [], year: 3, sem: 2, description: "Cultivating peace values, non-violent communication, and empathy in early education." },

    // Third Year, Summer
    { id: "GEC123", code: "GEC 123", title: "Gender and Society", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 3, description: "Gender equality, child protection policies, and gender-fair teaching practices." },
    { id: "HAL101", code: "HAL 101", title: "Fundamentals of Halal", credits: 3, category: "general", difficulty: 4, prerequisites: [], year: 3, sem: 3, description: "Cultural awareness, Halal principles, and intercultural respect in education." },

    // Fourth Year, 1st Sem
    { id: "ELC101", code: "ELC 101", title: "Field Study 1: Observation in Actual School Environment", credits: 3, category: "capstone", difficulty: 8, prerequisites: ["CPE103", "CPE104", "CPE106", "CPE107"], year: 4, sem: 1, description: "Systematic observational field immersion in partner elementary schools and reflection." },
    { id: "ELC102", code: "ELC 102", title: "Field Study 2: Participating & Teaching Assistantship", credits: 3, category: "capstone", difficulty: 8, prerequisites: ["CPE103", "CPE104", "CPE106", "CPE107"], year: 4, sem: 1, description: "Lesson planning assistance, teaching aid preparation, and guided micro-teaching." },
    { id: "GED199", code: "GED 199", title: "Undergraduate Thesis in Elementary Education", credits: 3, category: "capstone", difficulty: 9, prerequisites: ["GED198"], year: 4, sem: 1, description: "Formal presentation and defense of classroom action research or educational study." },

    // Fourth Year, 2nd Sem
    { id: "ELC197", code: "ELC 197", title: "Teaching Internship (Full-Time School Immersion)", credits: 6, category: "capstone", difficulty: 9, prerequisites: ["ELC101", "ELC102"], year: 4, sem: 2, description: "Intensive full-semester pre-service student teaching immersion in partner laboratory schools." }
  ]
};

// Career specialization tracks available per program at MSU Naawan
export const MSU_CAREER_TRACKS = {
  bsba_marketing: [
    {
      id: "brand_strategy",
      title: "Brand Strategist & Product Lead",
      targetGoalCourseId: "MKT199",
      description: "Master new product development, pricing models, integrated advertising campaigns, and market positioning.",
      color: "#6366f1",
      icon: "TrendingUp"
    },
    {
      id: "digital_ecommerce",
      title: "Digital & E-Commerce Director",
      targetGoalCourseId: "MKT134",
      description: "Command omnichannel distribution, social media algorithms, growth hacking, and influencer partnerships.",
      color: "#06b6d4",
      icon: "Globe"
    },
    {
      id: "market_analyst",
      title: "Marketing Research & Business Analyst",
      targetGoalCourseId: "MKT198",
      description: "Harness big data analytics, consumer psychological models, econometrics, and predictive customer lifetime value.",
      color: "#10b981",
      icon: "BarChart3"
    },
    {
      id: "corporate_practicum",
      title: "Executive Marketing Practicum",
      targetGoalCourseId: "MKT197",
      description: "Culminate in a rigorous 600-hour corporate internship, gaining hands-on enterprise leadership and real-world execution.",
      color: "#f59e0b",
      icon: "Briefcase"
    }
  ],

  bs_marine_science: [
    {
      id: "marine_ecologist",
      title: "Marine Protected Areas & Ecology Lead",
      targetGoalCourseId: "MRB148",
      description: "Pioneer ridge-to-reef conservation, coral reef monitoring, remote sensing GIS, and marine sanctuary networks.",
      color: "#3b82f6",
      icon: "Compass"
    },
    {
      id: "oceanographer",
      title: "Physical & Chemical Oceanographer",
      targetGoalCourseId: "OCN121",
      description: "Investigate ocean circulation, thermal properties, biogeochemical cycling, and marine climate impacts.",
      color: "#06b6d4",
      icon: "Waves"
    },
    {
      id: "marine_scientist",
      title: "Senior Marine Research Fellow",
      targetGoalCourseId: "MRB199",
      description: "Original scientific research, deep-sea exploration, experimental assays, and peer-reviewed thesis defense.",
      color: "#a855f7",
      icon: "Microscope"
    }
  ],

  bs_fisheries: [
    {
      id: "aquaculture_specialist",
      title: "Commercial Aquaculture Engineer",
      targetGoalCourseId: "FIS131",
      description: "Design fish hatcheries, recirculating aquaculture systems, water quality management, and broodstock genetics.",
      color: "#10b981",
      icon: "Anchor"
    },
    {
      id: "fisheries_manager",
      title: "Coastal Resource & Capture Fisheries Lead",
      targetGoalCourseId: "FIS142",
      description: "Enforce fisheries laws, maximum sustainable yield (MSY), quota allocation, and marine sanctuary zoning.",
      color: "#3b82f6",
      icon: "Navigation"
    },
    {
      id: "fisheries_scientist",
      title: "Senior Fisheries Research Fellow",
      targetGoalCourseId: "FIS199",
      description: "Independent scientific thesis research in fish nutrition, disease pathology, and sustainable aquaculture.",
      color: "#f59e0b",
      icon: "Award"
    }
  ],

  bs_agriculture: [
    {
      id: "agronomic_consultant",
      title: "Professional Licensed Agriculturist",
      targetGoalCourseId: "AGM199",
      description: "Field plot research, advanced plant breeding, crop physiology, and Board Licensure for Agriculturists.",
      color: "#f59e0b",
      icon: "Sprout"
    },
    {
      id: "crop_protection",
      title: "Plant Protection & Pest Manager",
      targetGoalCourseId: "AGM101",
      description: "IPM strategies, biological control of weeds, soil fertility preservation, and precision agronomy.",
      color: "#10b981",
      icon: "ShieldCheck"
    }
  ],

  beed: [
    {
      id: "elementary_master_teacher",
      title: "Licensed Professional Elementary Teacher",
      targetGoalCourseId: "ELC197",
      description: "Complete 6-unit full-time pre-service teaching internship, student teaching assistantship, and board exam mastery.",
      color: "#a855f7",
      icon: "GraduationCap"
    },
    {
      id: "stem_reading_specialist",
      title: "Primary Math & Reading Specialist",
      targetGoalCourseId: "GED110",
      description: "Specialize in foundational early numeracy, concrete-pictorial-abstract mathematics, and beginning literacy.",
      color: "#6366f1",
      icon: "BookOpen"
    },
    {
      id: "educational_researcher",
      title: "Educational Action Researcher",
      targetGoalCourseId: "GED199",
      description: "Author and defend original classroom action research, diagnostic assessments, and pedagogical innovations.",
      color: "#10b981",
      icon: "FileText"
    }
  ]
};

export const DEFAULT_CATEGORY_COLOR = {
  bg: "rgba(99, 102, 241, 0.15)",
  border: "#6366f1",
  text: "#a5b4fc",
  label: "Major Professional"
};

export const CATEGORY_COLORS = {
  major: { bg: "rgba(99, 102, 241, 0.15)", border: "#6366f1", text: "#a5b4fc", label: "Major Professional" },
  general: { bg: "rgba(148, 163, 184, 0.15)", border: "#94a3b8", text: "#cbd5e1", label: "General Education" },
  math: { bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7", text: "#c084fc", label: "Mathematics & Stats" },
  science: { bg: "rgba(6, 182, 212, 0.15)", border: "#06b6d4", text: "#67e8f9", label: "Natural Science" },
  physics: { bg: "rgba(59, 130, 246, 0.15)", border: "#3b82f6", text: "#60a5fa", label: "Physics & Engineering" },
  finance: { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", text: "#fcd34d", label: "Accounting & Finance" },
  management: { bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", text: "#6ee7b7", label: "Management & Strategy" },
  research: { bg: "rgba(236, 72, 153, 0.15)", border: "#ec4899", text: "#f472b6", label: "Research Methods" },
  tech: { bg: "rgba(14, 165, 233, 0.15)", border: "#0ea5e9", text: "#7dd3fc", label: "Technology & Analytics" },
  coding: { bg: "rgba(14, 165, 233, 0.15)", border: "#0ea5e9", text: "#7dd3fc", label: "Programming & Code" },
  theory: { bg: "rgba(234, 88, 12, 0.15)", border: "#ea580c", text: "#fdba74", label: "Economic Theory" },
  education: { bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7", text: "#c084fc", label: "Professional Education" },
  capstone: { bg: "rgba(244, 63, 94, 0.15)", border: "#f43f5e", text: "#fda4af", label: "Thesis & Practicum" },
  elective: { bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7", text: "#c084fc", label: "Elective Course" },
  default: DEFAULT_CATEGORY_COLOR
};

export function getCategoryTheme(catKey) {
  if (catKey && CATEGORY_COLORS[catKey]) {
    return CATEGORY_COLORS[catKey];
  }
  return {
    ...DEFAULT_CATEGORY_COLOR,
    label: catKey ? (catKey.charAt(0).toUpperCase() + catKey.slice(1)) : "Course"
  };
}

// Export default catalog for fallback
export const COURSE_CATALOG = MSU_NAAWAN_COURSES.bsba_marketing;
export const CAREER_TRACKS = MSU_CAREER_TRACKS.bsba_marketing;
