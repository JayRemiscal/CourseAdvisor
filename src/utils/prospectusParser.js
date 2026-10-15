/**
 * Prospectus Parser & Validator
 * Allows students to import their own degree prospectuses via JSON or CSV.
 * Validates prerequisite chains, units, codes, and semester distributions.
 */

/**
 * Normalizes course code to alphanumeric ID
 * e.g., "IT 101" -> "IT101", "CS-201.1" -> "CS2011"
 */
export function normalizeCourseId(code) {
  if (!code) return "";
  return String(code).trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/**
 * Parses prerequisite strings from CSV or JSON
 * Handles comma, semicolon, slash, and 'and' separated values.
 */
export function parsePrerequisites(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(p => normalizeCourseId(p)).filter(Boolean);
  }
  if (typeof raw !== "string") return [];

  // Split by comma, semicolon, slash, or the word 'and'
  return raw
    .split(/[,;/]|\band\b/i)
    .map(p => normalizeCourseId(p))
    .filter(p => p.length > 0 && p !== "NONE" && p !== "N/A" && p !== "NO");
}

/**
 * Validates and normalizes raw courses array into engine-compliant format
 */
export function validateAndNormalizeCourses(rawCourses, meta = {}) {
  if (!Array.isArray(rawCourses) || rawCourses.length === 0) {
    throw new Error("No courses found in the imported file.");
  }

  const warnings = [];
  const normalized = [];
  const seenIds = new Set();

  rawCourses.forEach((c, idx) => {
    const rawCode = c.code || c.course_code || c.Code || c.courseCode || c.id || `CRS${idx + 1}`;
    const id = normalizeCourseId(c.id || rawCode);

    if (!id) {
      warnings.push(`Row ${idx + 1}: Skipped course with missing course code.`);
      return;
    }

    if (seenIds.has(id)) {
      warnings.push(`Duplicate course code "${rawCode}" detected. Duplicate was skipped.`);
      return;
    }
    seenIds.add(id);

    const title = String(c.title || c.name || c.CourseTitle || c.course_title || c.Title || rawCode).trim();
    const credits = Number(c.credits || c.units || c.Credits || c.Units || c.credit_units || 3);
    const validCredits = !isNaN(credits) && credits > 0 ? credits : 3;

    const rawPrereqs = c.prerequisites || c.prereqs || c.preReqs || c.Prerequisites || c.Prereq || [];
    const prerequisites = parsePrerequisites(rawPrereqs);

    const year = Number(c.year || c.Year || c.level || 1);
    const sem = Number(c.sem || c.semester || c.Sem || c.Semester || 1);
    const difficulty = Number(c.difficulty || c.Difficulty || 5);
    const category = String(c.category || c.Category || "major").toLowerCase();
    const description = String(c.description || c.Description || `${title} (${rawCode})`).trim();

    normalized.push({
      id,
      code: String(rawCode).trim(),
      title,
      credits: validCredits,
      prerequisites,
      year: isNaN(year) || year < 1 ? 1 : Math.min(year, 5),
      sem: isNaN(sem) || sem < 1 ? 1 : Math.min(sem, 3),
      difficulty: isNaN(difficulty) ? 5 : Math.max(1, Math.min(10, difficulty)),
      category: ["major", "general", "math", "tech", "finance", "management", "research", "elective"].includes(category)
        ? category
        : "major",
      description
    });
  });

  if (normalized.length === 0) {
    throw new Error("No valid courses could be parsed from the provided data.");
  }

  // Cross-reference prerequisites
  const catalogIds = new Set(normalized.map(c => c.id));
  const missingPrereqMap = new Map();

  normalized.forEach(course => {
    course.prerequisites = course.prerequisites.filter(prereqId => {
      if (!catalogIds.has(prereqId)) {
        if (!missingPrereqMap.has(prereqId)) missingPrereqMap.set(prereqId, []);
        missingPrereqMap.get(prereqId).push(course.code);
        return false; // Remove orphaned prerequisite so schedule solver can still place the course
      }
      return true;
    });
  });

  if (missingPrereqMap.size > 0) {
    const missingList = Array.from(missingPrereqMap.entries())
      .slice(0, 5)
      .map(([missing, usedIn]) => `"${missing}" (required by ${usedIn.join(", ")})`)
      .join(", ");
    warnings.push(
      `Notice: Some prerequisites were not found in the prospectus and were treated as already satisfied: ${missingList}${missingPrereqMap.size > 5 ? ` and ${missingPrereqMap.size - 5} more` : ""}.`
    );
  }

  // Identify terminal capstone courses (courses with no dependents or senior year)
  const isPrereqOf = new Set();
  normalized.forEach(c => {
    c.prerequisites.forEach(p => isPrereqOf.add(p));
  });

  const terminalCapstones = normalized
    .filter(c => !isPrereqOf.has(c.id) || /capstone|thesis|practicum|internship|project|seminar/i.test(c.title))
    .map(c => c.id);

  const defaultTarget = terminalCapstones[terminalCapstones.length - 1] || normalized[normalized.length - 1].id;

  const totalUnits = normalized.reduce((sum, c) => sum + c.credits, 0);

  return {
    courses: normalized,
    totalUnits,
    courseCount: normalized.length,
    terminalCapstones: terminalCapstones.length > 0 ? terminalCapstones : [defaultTarget],
    defaultTarget,
    warnings,
    metadata: {
      programName: meta.programName || "Student Imported Curriculum",
      major: meta.major || "Custom Track",
      college: meta.college || "Academic Department",
      reference: meta.reference || `Imported on ${new Date().toLocaleDateString()}`
    }
  };
}

/**
 * Parses JSON prospectus string
 */
export function parseProspectusJson(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Invalid JSON format. Please check for syntax or bracket errors: " + err.message);
  }

  let courses = [];
  let meta = {};

  if (Array.isArray(parsed)) {
    courses = parsed;
  } else if (typeof parsed === "object" && parsed !== null) {
    courses = parsed.courses || parsed.subjects || parsed.curriculum || [];
    meta = {
      programName: parsed.programName || parsed.name || parsed.degree || parsed.title,
      major: parsed.major || parsed.specialization,
      college: parsed.college || parsed.department || parsed.university,
      reference: parsed.reference || parsed.effectiveYear
    };
  } else {
    throw new Error("JSON must be an array of courses or an object containing a 'courses' array.");
  }

  return validateAndNormalizeCourses(courses, meta);
}

/**
 * Parses CSV prospectus string
 */
export function parseProspectusCsv(csvString, meta = {}) {
  const lines = csvString
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith("#"));

  if (lines.length < 2) {
    throw new Error("CSV must contain at least a header row and one course row.");
  }

  // Parse header
  const header = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim().replace(/[\s_-]+/g, ""));

  const codeIdx = header.findIndex(h => ["code", "coursecode", "subjectcode", "id", "courseno"].includes(h));
  const titleIdx = header.findIndex(h => ["title", "coursetitle", "name", "subjecttitle", "description"].includes(h));
  const creditsIdx = header.findIndex(h => ["credits", "units", "credithours", "unit", "credit"].includes(h));
  const prereqIdx = header.findIndex(h => ["prerequisites", "prereq", "prereqs", "prerequisite", "requisites"].includes(h));
  const yearIdx = header.findIndex(h => ["year", "level", "yearlevel"].includes(h));
  const semIdx = header.findIndex(h => ["sem", "semester", "term"].includes(h));
  const catIdx = header.findIndex(h => ["category", "type", "area"].includes(h));

  if (codeIdx === -1 && titleIdx === -1) {
    throw new Error("CSV header must contain at least a 'Code' or 'Title' column (e.g. Code, Title, Units, Prerequisites).");
  }

  const rawCourses = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    if (row.length === 0 || row.every(val => val === "")) continue;

    const code = codeIdx !== -1 ? row[codeIdx] : row[0];
    const title = titleIdx !== -1 ? row[titleIdx] : (row[1] || code);
    const credits = creditsIdx !== -1 ? row[creditsIdx] : 3;
    const prerequisites = prereqIdx !== -1 ? row[prereqIdx] : "";
    const year = yearIdx !== -1 ? row[yearIdx] : 1;
    const sem = semIdx !== -1 ? row[semIdx] : 1;
    const category = catIdx !== -1 ? row[catIdx] : "major";

    if (code || title) {
      rawCourses.push({
        code,
        title,
        credits,
        prerequisites,
        year,
        sem,
        category
      });
    }
  }

  return validateAndNormalizeCourses(rawCourses, meta);
}

/**
 * Splits a single CSV row handling double quotes
 */
function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Sample JSON template string for students to download or inspect
 */
export function getSampleProspectusJson() {
  return JSON.stringify({
    programName: "BS in Information Technology",
    major: "Software & Web Development",
    college: "College of Computing and Information Sciences",
    reference: "CHED CMO 25 s. 2015, Effective AY 2025-2026",
    courses: [
      {
        code: "IT 101",
        title: "Introduction to Computing",
        credits: 3,
        prerequisites: [],
        year: 1,
        sem: 1,
        category: "tech",
        difficulty: 4
      },
      {
        code: "IT 102",
        title: "Computer Programming 1",
        credits: 3,
        prerequisites: [],
        year: 1,
        sem: 1,
        category: "tech",
        difficulty: 5
      },
      {
        code: "MATH 101",
        title: "Discrete Mathematics",
        credits: 3,
        prerequisites: [],
        year: 1,
        sem: 1,
        category: "math",
        difficulty: 6
      },
      {
        code: "IT 103",
        title: "Computer Programming 2 (OOP)",
        credits: 3,
        prerequisites: ["IT 102"],
        year: 1,
        sem: 2,
        category: "tech",
        difficulty: 6
      },
      {
        code: "IT 104",
        title: "Data Structures and Algorithms",
        credits: 3,
        prerequisites: ["IT 103", "MATH 101"],
        year: 2,
        sem: 1,
        category: "tech",
        difficulty: 7
      },
      {
        code: "IT 201",
        title: "Database Management Systems",
        credits: 3,
        prerequisites: ["IT 103"],
        year: 2,
        sem: 1,
        category: "tech",
        difficulty: 6
      },
      {
        code: "IT 202",
        title: "Web Systems and Technologies",
        credits: 3,
        prerequisites: ["IT 201"],
        year: 2,
        sem: 2,
        category: "tech",
        difficulty: 6
      },
      {
        code: "IT 301",
        title: "Information Assurance and Security",
        credits: 3,
        prerequisites: ["IT 201"],
        year: 3,
        sem: 1,
        category: "tech",
        difficulty: 7
      },
      {
        code: "IT 398",
        title: "Methods of Research in Computing",
        credits: 3,
        prerequisites: ["IT 104", "IT 202"],
        year: 3,
        sem: 2,
        category: "research",
        difficulty: 7
      },
      {
        code: "IT 499",
        title: "Capstone Project 1",
        credits: 3,
        prerequisites: ["IT 398"],
        year: 4,
        sem: 1,
        category: "major",
        difficulty: 8
      },
      {
        code: "IT 497",
        title: "Capstone Project 2 & Practicum",
        credits: 6,
        prerequisites: ["IT 499"],
        year: 4,
        sem: 2,
        category: "major",
        difficulty: 8
      }
    ]
  }, null, 2);
}

/**
 * Sample CSV template string for students to download or inspect
 */
export function getSampleProspectusCsv() {
  return [
    "Code,Title,Credits,Prerequisites,Year,Semester,Category,Difficulty",
    "IT 101,Introduction to Computing,3,,1,1,tech,4",
    "IT 102,Computer Programming 1,3,,1,1,tech,5",
    "MATH 101,Discrete Mathematics,3,,1,1,math,6",
    "IT 103,Computer Programming 2 (OOP),3,IT 102,1,2,tech,6",
    "IT 104,Data Structures and Algorithms,3,\"IT 103, MATH 101\",2,1,tech,7",
    "IT 201,Database Management Systems,3,IT 103,2,1,tech,6",
    "IT 202,Web Systems and Technologies,3,IT 201,2,2,tech,6",
    "IT 301,Information Assurance and Security,3,IT 201,3,1,tech,7",
    "IT 398,Methods of Research in Computing,3,\"IT 104, IT 202\",3,2,research,7",
    "IT 499,Capstone Project 1,3,IT 398,4,1,major,8",
    "IT 497,Capstone Project 2 & Practicum,6,IT 499,4,2,major,8"
  ].join("\n");
}
