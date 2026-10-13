// Comprehensive Course Catalog for Computer Science & Software Engineering Curriculum
// Adheres to Adjacency List & Junction Graph Schema in CourseAdvisor Specification

export const COURSE_CATALOG = [
  // 100-Level: Foundational
  {
    id: "MATH101",
    code: "MATH 101",
    title: "Calculus I: Differential Calculus",
    credits: 4,
    category: "math",
    difficulty: 6,
    prerequisites: [],
    termAvailability: ["Fall", "Spring"],
    description: "Limits, continuity, differentiation of algebraic and transcendental functions, optimization and curve sketching.",
    skills: ["Calculus", "Analytical Thinking", "Limits"]
  },
  {
    id: "CS101",
    code: "CS 101",
    title: "Introduction to Programming & Problem Solving",
    credits: 3,
    category: "coding",
    difficulty: 4,
    prerequisites: [],
    termAvailability: ["Fall", "Spring"],
    description: "Fundamentals of algorithmic problem solving, control structures, basic data types, and modular code design.",
    skills: ["Python", "Control Flow", "Problem Decomposition"]
  },
  {
    id: "ENG101",
    code: "ENG 101",
    title: "Technical Writing & Engineering Ethics",
    credits: 3,
    category: "general",
    difficulty: 3,
    prerequisites: [],
    termAvailability: ["Fall", "Spring"],
    description: "Professional technical communication, specifications, peer review, and ethical dilemmas in software engineering.",
    skills: ["Technical Writing", "Ethics", "Documentation"]
  },
  {
    id: "PHYS101",
    code: "PHYS 101",
    title: "General Physics: Mechanics",
    credits: 4,
    category: "math",
    difficulty: 7,
    prerequisites: ["MATH101"],
    termAvailability: ["Fall", "Spring"],
    description: "Newtonian mechanics, kinematics, work-energy theorem, conservation of momentum, and rotational dynamics.",
    skills: ["Mechanics", "Kinematics", "Physical Modeling"]
  },

  // 100/200-Level: Core Foundations
  {
    id: "MATH102",
    code: "MATH 102",
    title: "Calculus II: Integral Calculus & Series",
    credits: 4,
    category: "math",
    difficulty: 8,
    prerequisites: ["MATH101"],
    termAvailability: ["Fall", "Spring"],
    description: "Techniques of integration, improper integrals, infinite sequences, Taylor series, and parametric equations.",
    skills: ["Integration", "Series Expansions", "Differential Equations"]
  },
  {
    id: "CS102",
    code: "CS 102",
    title: "Object-Oriented Design & Data Structures",
    credits: 4,
    category: "coding",
    difficulty: 6,
    prerequisites: ["CS101"],
    termAvailability: ["Fall", "Spring"],
    description: "Encapsulation, inheritance, polymorphism, abstract data types, linked lists, stacks, queues, and unit testing.",
    skills: ["OOP", "Java / C++", "Abstract Data Types"]
  },
  {
    id: "CS205",
    code: "CS 205",
    title: "Discrete Mathematics & Proof Theory",
    credits: 3,
    category: "theory",
    difficulty: 7,
    prerequisites: ["CS101", "MATH101"],
    termAvailability: ["Fall", "Spring"],
    description: "Propositional and predicate logic, induction, sets, relations, combinatorics, graph theory basics, and proofs.",
    skills: ["Boolean Logic", "Proof Writing", "Graph Basics"]
  },

  // 200-Level: Intermediate Systems & Theory
  {
    id: "CS210",
    code: "CS 210",
    title: "Computer Organization & Systems Architecture",
    credits: 4,
    category: "systems",
    difficulty: 7,
    prerequisites: ["CS102"],
    termAvailability: ["Fall", "Spring"],
    description: "Digital logic, CPU datapath, pipelining, memory hierarchy, cache coherence, and assembly language programming.",
    skills: ["Assembly", "CPU Architecture", "Caches", "Memory Hierarchy"]
  },
  {
    id: "CS220",
    code: "CS 220",
    title: "Data Structures & Algorithm Analysis",
    credits: 4,
    category: "coding",
    difficulty: 8,
    prerequisites: ["CS102", "CS205"],
    termAvailability: ["Fall", "Spring"],
    description: "Asymptotic notation, balanced search trees, heaps, hash tables, graph traversals, and dynamic programming.",
    skills: ["Big-O Analysis", "Trees & Graphs", "Dynamic Programming"]
  },
  {
    id: "MATH201",
    code: "MATH 201",
    title: "Linear Algebra & Matrix Computation",
    credits: 3,
    category: "math",
    difficulty: 7,
    prerequisites: ["MATH102"],
    termAvailability: ["Fall", "Spring"],
    description: "Vector spaces, linear transformations, matrices, determinants, eigenvalues, eigenvectors, and singular value decomposition.",
    skills: ["Linear Algebra", "Eigenvalues", "Matrix Factorization"]
  },
  {
    id: "MATH205",
    code: "MATH 205",
    title: "Probability & Statistics for Engineers",
    credits: 3,
    category: "math",
    difficulty: 6,
    prerequisites: ["MATH102"],
    termAvailability: ["Fall", "Spring"],
    description: "Probability axioms, random variables, joint distributions, hypothesis testing, and Bayesian estimation.",
    skills: ["Probability", "Bayesian Stats", "Hypothesis Testing"]
  },

  // 300-Level: Advanced Systems, Software & AI Foundations
  {
    id: "CS301",
    code: "CS 301",
    title: "Operating Systems & Concurrency",
    credits: 4,
    category: "systems",
    difficulty: 9,
    prerequisites: ["CS210", "CS220"],
    termAvailability: ["Fall", "Spring"],
    description: "Process synchronization, deadlocks, virtual memory, file systems, IPC, multi-threading, and kernel primitives.",
    skills: ["Threads", "Locks & Mutexes", "Virtual Memory", "POSIX API"]
  },
  {
    id: "CS310",
    code: "CS 310",
    title: "Database Management Systems",
    credits: 3,
    category: "systems",
    difficulty: 6,
    prerequisites: ["CS220"],
    termAvailability: ["Fall", "Spring"],
    description: "Relational algebra, SQL, B+ Tree indexing, query optimization, ACID transactions, and normalization.",
    skills: ["SQL", "Relational Algebra", "Indexing", "ACID Transactions"]
  },
  {
    id: "CS325",
    code: "CS 325",
    title: "Software Engineering & Lifecycle Design",
    credits: 3,
    category: "coding",
    difficulty: 5,
    prerequisites: ["CS220"],
    termAvailability: ["Fall", "Spring"],
    description: "Agile methodologies, design patterns, CI/CD pipelines, automated testing, and software architectural models.",
    skills: ["Design Patterns", "Agile", "CI/CD", "Software Architecture"]
  },
  {
    id: "CS330",
    code: "CS 330",
    title: "Theory of Computation & Automata",
    credits: 3,
    category: "theory",
    difficulty: 8,
    prerequisites: ["CS205", "CS220"],
    termAvailability: ["Fall", "Spring"],
    description: "Finite automata, context-free grammars, Turing machines, decidability, halting problem, and P vs NP complexity.",
    skills: ["Automata", "Turing Machines", "Complexity Theory"]
  },
  {
    id: "CS340",
    code: "CS 340",
    title: "Computer Networks & Distributed Protocols",
    credits: 3,
    category: "systems",
    difficulty: 7,
    prerequisites: ["CS210"],
    termAvailability: ["Fall", "Spring"],
    description: "OSI and TCP/IP stack, socket programming, routing algorithms, congestion control, and application protocols.",
    skills: ["TCP/IP", "Sockets", "Routing Protocols", "HTTP/DNS"]
  },
  {
    id: "CS360",
    code: "CS 360",
    title: "Artificial Intelligence Principles",
    credits: 3,
    category: "theory",
    difficulty: 7,
    prerequisites: ["CS220", "MATH205"],
    termAvailability: ["Fall", "Spring"],
    description: "Heuristic search, A* algorithm, constraint satisfaction, adversarial game trees, Markov Decision Processes.",
    skills: ["A* Search", "MDP", "Heuristics", "Constraint Satisfaction"]
  },

  // 400-Level: Senior Capstones & Specializations
  {
    id: "CS410",
    code: "CS 410",
    title: "Machine Learning & Statistical Modeling",
    credits: 4,
    category: "theory",
    difficulty: 9,
    prerequisites: ["CS360", "MATH201", "MATH205"],
    termAvailability: ["Fall", "Spring"],
    description: "Supervised and unsupervised learning, gradient descent, SVMs, decision trees, neural network backpropagation.",
    skills: ["Machine Learning", "Gradient Descent", "Supervised Learning"]
  },
  {
    id: "CS455",
    code: "CS 455",
    title: "Cybersecurity & Applied Cryptography",
    credits: 3,
    category: "systems",
    difficulty: 8,
    prerequisites: ["CS301", "CS340"],
    termAvailability: ["Fall", "Spring"],
    description: "Symmetric and asymmetric ciphers, PKI, threat modeling, buffer overflows, web security, and network defenses.",
    skills: ["Cryptography", "PKI", "Threat Modeling", "Penetration Testing"]
  },
  {
    id: "CS460",
    code: "CS 460",
    title: "Cloud Computing & Distributed Systems",
    credits: 3,
    category: "systems",
    difficulty: 8,
    prerequisites: ["CS301", "CS310", "CS340"],
    termAvailability: ["Fall", "Spring"],
    description: "CAP theorem, consensus protocols (Raft/Paxos), microservices, containerization, serverless, and cloud resilience.",
    skills: ["Distributed Systems", "Raft Consensus", "Docker/K8s", "Microservices"]
  },
  {
    id: "CS470",
    code: "CS 470",
    title: "Big Data Architecture & Data Engineering",
    credits: 3,
    category: "systems",
    difficulty: 7,
    prerequisites: ["CS310", "CS325"],
    termAvailability: ["Fall", "Spring"],
    description: "Data warehousing, stream processing, MapReduce, Apache Spark, distributed columnar stores, and data pipelines.",
    skills: ["Data Pipelines", "Spark", "NoSQL", "Stream Processing"]
  },
  {
    id: "CS480",
    code: "CS 480",
    title: "Deep Learning Systems & Transformers",
    credits: 4,
    category: "theory",
    difficulty: 9,
    prerequisites: ["CS410"],
    termAvailability: ["Fall", "Spring"],
    description: "Deep neural networks, CNNs, RNNs, Transformer architectures, self-attention mechanisms, GPU acceleration, and LLM tuning.",
    skills: ["PyTorch", "Transformers", "Self-Attention", "GPU Optimization"]
  },
  {
    id: "CS490",
    code: "CS 490",
    title: "Senior Capstone Software Engineering Project",
    credits: 4,
    category: "capstone",
    difficulty: 8,
    prerequisites: ["CS301", "CS310", "CS325"],
    termAvailability: ["Fall", "Spring"],
    description: "Comprehensive end-to-end industry or research software engineering project, architecture defense, and final deployment.",
    skills: ["System Architecture", "Team Leadership", "Full-Stack Deployment", "Senior Defense"]
  }
];

export const CAREER_TRACKS = [
  {
    id: "ai_ml",
    title: "AI & Machine Learning Engineer",
    icon: "Brain",
    targetGoalCourseId: "CS480",
    description: "Master modern AI, deep learning systems, neural architectures, and mathematical statistical modeling.",
    recommendedFocus: ["math", "theory"],
    keyCourses: ["MATH201", "MATH205", "CS360", "CS410", "CS480"],
    color: "#6366f1"
  },
  {
    id: "full_stack",
    title: "Full-Stack & Cloud Systems Architect",
    icon: "Server",
    targetGoalCourseId: "CS490",
    description: "Design robust, scalable distributed applications, modern cloud infrastructure, and enterprise databases.",
    recommendedFocus: ["systems", "coding"],
    keyCourses: ["CS210", "CS301", "CS310", "CS325", "CS460", "CS490"],
    color: "#06b6d4"
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Defense Specialist",
    icon: "ShieldAlert",
    targetGoalCourseId: "CS455",
    description: "Protect critical infrastructure through applied cryptography, low-level OS security, and network defenses.",
    recommendedFocus: ["systems"],
    keyCourses: ["CS210", "CS301", "CS340", "CS455"],
    color: "#10b981"
  },
  {
    id: "data_engineering",
    title: "Big Data & Data Systems Architect",
    icon: "Database",
    targetGoalCourseId: "CS470",
    description: "Architect high-throughput data processing systems, distributed storage, and analytics pipelines.",
    recommendedFocus: ["systems", "coding"],
    keyCourses: ["CS220", "CS310", "CS325", "CS470"],
    color: "#f59e0b"
  }
];

export const CATEGORY_COLORS = {
  coding: { bg: "rgba(59, 130, 246, 0.15)", border: "#3b82f6", text: "#60a5fa", label: "Programming & Code" },
  math: { bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7", text: "#c084fc", label: "Mathematics & Physics" },
  systems: { bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", text: "#34d399", label: "Systems & Architecture" },
  theory: { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", text: "#fbbf24", label: "Theory & AI" },
  general: { bg: "rgba(148, 163, 184, 0.15)", border: "#94a3b8", text: "#cbd5e1", label: "General & Ethics" },
  capstone: { bg: "rgba(236, 72, 153, 0.15)", border: "#ec4899", text: "#f472b6", label: "Senior Capstone" }
};
