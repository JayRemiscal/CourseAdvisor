import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import Svg, { Path, Circle, Rect, Text as SvgText, G } from "react-native-svg";
import { COURSE_CATALOG, CAREER_TRACKS, CATEGORY_COLORS } from "./src/data/courses";
import { ScheduleSolver } from "./src/engine/scheduleSolver";
import { MamdaniFuzzyEngine } from "./src/engine/fuzzyInference";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [activeTab, setActiveTab] = useState("roadmap"); // roadmap | dag | confidence | transcript | flowchart | catalog

  // Core Configuration State
  const [selectedTrackId, setSelectedTrackId] = useState("ai_ml");
  const [targetCourseId, setTargetCourseId] = useState("CS480");
  const [completedCourseIds, setCompletedCourseIds] = useState(["MATH101", "CS101"]);
  const [confidenceScores, setConfidenceScores] = useState({
    coding: 8,
    math: 7,
    systems: 6,
    theory: 6
  });
  const [maxAllowedSemesters, setMaxAllowedSemesters] = useState(6);

  // Edge case simulation
  const [isCycleSimulated, setIsCycleSimulated] = useState(false);
  const [expandedReasoningTerm, setExpandedReasoningTerm] = useState(null);
  const [isFuzzyModalVisible, setIsFuzzyModalVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchCatalogText, setSearchCatalogText] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("all");

  // Solver & Engines
  const solver = useMemo(() => new ScheduleSolver(COURSE_CATALOG), []);
  const fuzzyEngine = useMemo(() => new MamdaniFuzzyEngine(), []);

  // Cycle Overrides simulation map
  const customOverrides = useMemo(() => {
    if (!isCycleSimulated) return null;
    const map = new Map();
    map.set("CS101", ["CS102"]);
    map.set("CS102", ["CS101"]);
    return map;
  }, [isCycleSimulated]);

  // Run Schedule Solver
  const scheduleResult = useMemo(() => {
    return solver.generateSchedule({
      targetCourseIds: [targetCourseId],
      completedCourseIds,
      confidenceScores,
      maxAllowedSemesters,
      customOverrides
    });
  }, [solver, targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides]);

  const semesters = scheduleResult.semesters || [];

  // Handlers
  const handleSelectTrack = (track) => {
    setSelectedTrackId(track.id);
    setTargetCourseId(track.targetGoalCourseId);
  };

  const handleToggleCompleted = (courseId) => {
    setCompletedCourseIds((curr) =>
      curr.includes(courseId) ? curr.filter((id) => id !== courseId) : [...curr, courseId]
    );
  };

  const handleUpdateConfidence = (key, delta) => {
    setConfidenceScores((curr) => {
      const newVal = Math.max(1, Math.min(10, (curr[key] || 6) + delta));
      return { ...curr, [key]: newVal };
    });
  };

  // Move course between terms
  const [manualSemesterPlan, setManualSemesterPlan] = useState(null);
  useEffect(() => {
    setManualSemesterPlan(null);
  }, [targetCourseId, completedCourseIds, confidenceScores, maxAllowedSemesters, customOverrides]);

  const activeSemesters = manualSemesterPlan || semesters;

  const handleMoveCourse = (courseId, fromTerm, toTerm) => {
    const newSemesters = JSON.parse(JSON.stringify(activeSemesters));
    const src = newSemesters.find((s) => s.termIndex === fromTerm);
    const dst = newSemesters.find((s) => s.termIndex === toTerm);
    if (!src || !dst) return;

    const idx = src.courses.findIndex((c) => c.id === courseId);
    if (idx === -1) return;

    const [c] = src.courses.splice(idx, 1);
    src.totalCredits -= c.credits;
    dst.courses.push(c);
    dst.totalCredits += c.credits;

    const avgConf =
      (confidenceScores.math + confidenceScores.coding + confidenceScores.systems + confidenceScores.theory) / 4;
    [src, dst].forEach((sem) => {
      if (sem.courses.length > 0) {
        const weightedDiff = sem.courses.reduce((sum, item) => sum + item.difficulty * item.credits, 0);
        sem.averageDifficulty = Math.round((weightedDiff / sem.totalCredits) * 10) / 10;
        sem.stressResult = fuzzyEngine.evaluate(avgConf, sem.averageDifficulty);
      }
    });

    setManualSemesterPlan(newSemesters);
  };

  // Mamdani Radial Gauge Component in Native SVG
  const renderStressGauge = (stressResult, currentCredits, targetCap) => {
    const stress = stressResult?.stressScore ?? 25;
    const statusColor = stressResult?.statusColor ?? "#10b981";
    const statusLabel = stressResult?.statusLabel ?? "Balanced";
    const radius = 42;
    const strokeWidth = 8;
    const arcLength = Math.PI * radius;
    const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, stress))) / 100;

    return (
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeSvgWrapper}>
          <Svg viewBox="0 0 110 65" width={110} height={65}>
            <Path
              d="M 12 55 A 42 42 0 0 1 98 55"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <Path
              d="M 12 55 A 42 42 0 0 1 98 55"
              fill="none"
              stroke={statusColor}
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.gaugeTextOverlay}>
            <Text style={[styles.gaugeValue, { color: statusColor }]}>{stress}%</Text>
            <Text style={styles.gaugeLabel}>STRESS</Text>
          </View>
        </View>

        <View style={styles.gaugeInfoWrapper}>
          <View style={styles.gaugeStatusRow}>
            <View style={[styles.gaugeStatusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.gaugeStatusLabel, { color: statusColor }]}>{statusLabel}</Text>
          </View>
          <Text style={styles.gaugeSubtext}>Target Cap: {targetCap || 15} hrs</Text>
          <View style={styles.gaugeProgressBar}>
            <View
              style={[
                styles.gaugeProgressFill,
                {
                  width: `${Math.min(100, ((currentCredits || 0) / (targetCap || 15)) * 100)}%`,
                  backgroundColor: currentCredits > targetCap ? "#ef4444" : statusColor
                }
              ]}
            />
          </View>
          <Text style={styles.gaugeCreditText}>
            {currentCredits} / {targetCap || 15} credits
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e17" />

      {/* Mobile App Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>🎓</Text>
          </View>
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>CourseAdvisor</Text>
              <View style={styles.badgeVersion}>
                <Text style={styles.badgeVersionText}>ARCH-2026</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>Backward Chaining DAG & Mamdani FIS</Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>&lt;16ms Engine</Text>
        </View>
      </View>

      {/* Main Tab Views */}
      <View style={styles.contentContainer}>
        {/* TAB 1: ROADMAP PLANNER */}
        {activeTab === "roadmap" && (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Circular Dependency Warning */}
            {!scheduleResult.success && scheduleResult.error === "CIRCULAR_DEPENDENCY_DETECTED" && (
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>⚠️ Circular Prerequisite Loop Detected!</Text>
                <Text style={styles.errorDesc}>{scheduleResult.message}</Text>
                <TouchableOpacity style={styles.resetLoopBtn} onPress={() => setIsCycleSimulated(false)}>
                  <Text style={styles.resetLoopBtnText}>Restore Valid Graph</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Unsatisfiable Goal / Critical Path Warning */}
            {scheduleResult.unsatisfiableWarning && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>⚠️ Extended Term Required</Text>
                <Text style={styles.warningDesc}>
                  Longest prerequisite chain is {scheduleResult.criticalPathLength} levels, exceeding your target of{" "}
                  {maxAllowedSemesters} terms. Auto-expanded to {activeSemesters.length} terms.
                </Text>
              </View>
            )}

            {/* Target Career Track Selector */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>🎯 Target Career Milestone</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {CAREER_TRACKS.map((t) => {
                  const isSelected = selectedTrackId === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.trackCard, isSelected && styles.trackCardActive]}
                      onPress={() => handleSelectTrack(t)}
                    >
                      <Text style={styles.trackTitle}>{t.title}</Text>
                      <Text style={styles.trackDesc} numberOfLines={2}>
                        {t.description}
                      </Text>
                      <Text style={styles.trackCapstone}>Capstone: {t.targetGoalCourseId}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* KPI Summary Bar */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiValue}>{activeSemesters.length}</Text>
                <Text style={styles.kpiLabel}>Terms</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={[styles.kpiValue, { color: "#38bdf8" }]}>{scheduleResult.totalScheduleCredits}</Text>
                <Text style={styles.kpiLabel}>Credits</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={[styles.kpiValue, { color: "#a855f7" }]}>{scheduleResult.criticalPathLength}</Text>
                <Text style={styles.kpiLabel}>Critical Path</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={[styles.kpiValue, { color: scheduleResult.maxOverallStress > 70 ? "#ef4444" : "#10b981" }]}>
                  {scheduleResult.maxOverallStress}%
                </Text>
                <Text style={styles.kpiLabel}>Max Stress</Text>
              </View>
            </View>

            {/* Semester Cards List */}
            {activeSemesters.map((term, tIdx) => {
              const targetCap = term.stressResult?.maxCredits || 15;
              const isReasoningOpen = expandedReasoningTerm === term.termIndex;

              return (
                <View key={term.termIndex} style={styles.termCard}>
                  <View style={styles.termHeader}>
                    <View>
                      <View style={styles.termTitleRow}>
                        <Text style={styles.termTitle}>{term.termName}</Text>
                        <View style={styles.seasonBadge}>
                          <Text style={styles.seasonBadgeText}>{term.season}</Text>
                        </View>
                      </View>
                      <Text style={styles.termDifficulty}>Avg Difficulty: {term.averageDifficulty}/10</Text>
                    </View>
                    <Text style={styles.termCredits}>{term.totalCredits} cr</Text>
                  </View>

                  {/* Mamdani Stress Meter */}
                  {renderStressGauge(term.stressResult, term.totalCredits, targetCap)}

                  {/* Courses in Term */}
                  <View style={styles.coursesList}>
                    {term.courses.map((course) => {
                      const cat = CATEGORY_COLORS[course.category] || CATEGORY_COLORS.coding;
                      return (
                        <View key={course.id} style={[styles.courseRow, { borderLeftColor: cat.border }]}>
                          <View style={styles.courseInfo}>
                            <View style={styles.courseHeaderRow}>
                              <Text style={styles.courseCode}>{course.code}</Text>
                              <Text style={styles.courseCredits}>{course.credits} cr</Text>
                            </View>
                            <Text style={styles.courseTitle} numberOfLines={1}>
                              {course.title}
                            </Text>
                          </View>

                          {/* Move Term Controls */}
                          <View style={styles.moveBtnGroup}>
                            {tIdx > 0 && (
                              <TouchableOpacity
                                style={styles.moveBtn}
                                onPress={() => handleMoveCourse(course.id, term.termIndex, term.termIndex - 1)}
                              >
                                <Text style={styles.moveBtnText}>◀</Text>
                              </TouchableOpacity>
                            )}
                            {tIdx < activeSemesters.length - 1 && (
                              <TouchableOpacity
                                style={styles.moveBtn}
                                onPress={() => handleMoveCourse(course.id, term.termIndex, term.termIndex + 1)}
                              >
                                <Text style={styles.moveBtnText}>▶</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Transparent Reasoning Drawer */}
                  {term.reasoningNotes && term.reasoningNotes.length > 0 && (
                    <View style={styles.reasoningDrawer}>
                      <TouchableOpacity
                        style={styles.reasoningToggle}
                        onPress={() => setExpandedReasoningTerm((curr) => (curr === term.termIndex ? null : term.termIndex))}
                      >
                        <Text style={styles.reasoningToggleText}>
                          ✨ Transparent Placement Logic ({term.reasoningNotes.length})
                        </Text>
                        <Text style={styles.reasoningToggleIcon}>{isReasoningOpen ? "▲" : "▼"}</Text>
                      </TouchableOpacity>

                      {isReasoningOpen && (
                        <View style={styles.reasoningContent}>
                          {term.reasoningNotes.map((note) => (
                            <View key={note.courseId} style={styles.reasoningCardItem}>
                              <Text style={styles.reasoningCode}>{note.courseCode}</Text>
                              <Text style={styles.reasoningUnlock}>{note.unlockText}</Text>
                              <Text style={styles.reasoningConfidence}>{note.confidenceNote}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* TAB 2: PREREQUISITE DAG NETWORK */}
        {activeTab === "dag" && (
          <ScrollView style={styles.scrollArea}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>🕸️ Directed Acyclic Graph (DAG)</Text>
              <Text style={styles.cardSubtext}>
                Tap any course node to inspect prerequisites and dependencies. Organised by Topological Tiers.
              </Text>

              {/* Scrollable DAG Map */}
              <ScrollView horizontal style={{ marginTop: 15 }}>
                <View style={{ flexDirection: "row", gap: 15, paddingBottom: 20 }}>
                  {Object.entries(scheduleResult.tierGroups || {}).map(([tier, courses]) => (
                    <View key={`tier-${tier}`} style={styles.dagTierColumn}>
                      <View style={styles.dagTierBadge}>
                        <Text style={styles.dagTierBadgeText}>TIER {tier}</Text>
                      </View>

                      {courses.map((course) => {
                        const isDone = completedCourseIds.includes(course.id);
                        const isTarget = targetCourseId === course.id;
                        const isSelected = selectedNodeId === course.id;

                        return (
                          <TouchableOpacity
                            key={course.id}
                            style={[
                              styles.dagNodeCard,
                              isDone && styles.dagNodeDone,
                              isTarget && styles.dagNodeTarget,
                              isSelected && styles.dagNodeSelected
                            ]}
                            onPress={() => setSelectedNodeId(isSelected ? null : course.id)}
                          >
                            <Text style={styles.dagNodeCode}>{course.code}</Text>
                            <Text style={styles.dagNodeTitle} numberOfLines={2}>
                              {course.title}
                            </Text>
                            <Text style={styles.dagNodeMeta}>
                              {course.credits} cr • Diff {course.difficulty}/10
                            </Text>
                            {isDone && <Text style={styles.dagStatusDone}>✓ Passed</Text>}
                            {isTarget && <Text style={styles.dagStatusTarget}>★ Goal</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* TAB 3: CONFIDENCE & STRESS TUNING */}
        {activeTab === "confidence" && (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>🎛️ Foundational Confidence Controls</Text>
              <Text style={styles.cardSubtext}>
                Rate your confidence (1-10) in core subjects. This feeds into the Mamdani Fuzzy System to calculate credit limits.
              </Text>

              {[
                { key: "coding", label: "Programming & Code", desc: "Python, C++, OOP, Recursion", color: "#3b82f6" },
                { key: "math", label: "Mathematics & Calculus", desc: "Integrals, Derivatives, Linear Algebra", color: "#a855f7" },
                { key: "systems", label: "Systems & Architecture", desc: "OS, Concurrency, Networks, POSIX", color: "#10b981" },
                { key: "theory", label: "Theory & Proof Logic", desc: "Automata, Discrete Proofs, Big-O", color: "#f59e0b" }
              ].map((item) => {
                const score = confidenceScores[item.key] || 6;
                return (
                  <View key={item.key} style={styles.sliderCard}>
                    <View style={styles.sliderHeader}>
                      <Text style={[styles.sliderLabel, { color: item.color }]}>{item.label}</Text>
                      <Text style={styles.sliderScore}>{score}/10</Text>
                    </View>
                    <Text style={styles.sliderDesc}>{item.desc}</Text>

                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleUpdateConfidence(item.key, -1)}
                      >
                        <Text style={styles.stepBtnText}>-</Text>
                      </TouchableOpacity>

                      <View style={styles.sliderBarContainer}>
                        <View style={[styles.sliderBarFill, { width: `${score * 10}%`, backgroundColor: item.color }]} />
                      </View>

                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => handleUpdateConfidence(item.key, 1)}
                      >
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.actionBtn} onPress={() => setIsFuzzyModalVisible(true)}>
                <Text style={styles.actionBtnText}>🔬 Inspect Mamdani Fuzzy Engine (Rules & Defuzzification)</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* TAB 4: TRANSCRIPT CHECKLIST */}
        {activeTab === "transcript" && (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>📝 Completed Transcript Courses</Text>
              <Text style={styles.cardSubtext}>
                Check classes already completed. The Backward Chaining Engine satisfies their dependencies and skips them.
              </Text>

              {/* Quick Presets */}
              <View style={styles.presetRow}>
                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={() => setCompletedCourseIds(["MATH101", "CS101", "ENG101"])}
                >
                  <Text style={styles.presetBtnText}>+ Year 1 Passed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={() => setCompletedCourseIds(["MATH101", "CS101", "ENG101", "MATH102", "CS102", "CS205"])}
                >
                  <Text style={styles.presetBtnText}>+ Year 2 Passed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => setCompletedCourseIds([])}>
                  <Text style={styles.presetBtnText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {/* Course Checklist */}
              {COURSE_CATALOG.map((course) => {
                const isPassed = completedCourseIds.includes(course.id);
                return (
                  <TouchableOpacity
                    key={course.id}
                    style={[styles.checkRow, isPassed && styles.checkRowPassed]}
                    onPress={() => handleToggleCompleted(course.id)}
                  >
                    <View style={[styles.checkBox, isPassed && styles.checkBoxActive]}>
                      {isPassed && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.checkCode, isPassed && { color: "#10b981" }]}>{course.code}</Text>
                      <Text style={styles.checkTitle} numberOfLines={1}>
                        {course.title}
                      </Text>
                    </View>
                    <Text style={styles.checkCredits}>{course.credits} cr</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* TAB 5: SYSTEM FLOWCHART & LOOP TEST */}
        {activeTab === "flowchart" && (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>🔄 Algorithmic Sequence Pipeline</Text>
              <Text style={styles.cardSubtext}>
                Interactive representation of the system flowchart from Document ID ARCH-2026-v2.1
              </Text>

              {/* Edge Case Simulation Test */}
              <View style={styles.simulationBox}>
                <Text style={styles.simulationTitle}>⚡ Edge-Case Loop Testing</Text>
                <Text style={styles.simulationDesc}>
                  Inject a circular dependency (Course A requires B, and B requires A) to test Tarjan's cycle interceptor.
                </Text>
                {isCycleSimulated ? (
                  <TouchableOpacity
                    style={[styles.simBtn, { backgroundColor: "#10b981" }]}
                    onPress={() => setIsCycleSimulated(false)}
                  >
                    <Text style={styles.simBtnText}>✓ Restore Valid Acyclic Graph</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.simBtn, { backgroundColor: "#ef4444" }]}
                    onPress={() => setIsCycleSimulated(true)}
                  >
                    <Text style={styles.simBtnText}>⚠️ Inject Circular Prerequisite Loop</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Flowchart Steps */}
              {[
                { title: "Choose your goal", desc: "Degree or last class", color: "#065f46" },
                { title: "Add passed classes", desc: "The app skips them", color: "#065f46" },
                {
                  title: "Is there a loop?",
                  desc: isCycleSimulated ? "LOOP DETECTED! Halted safely." : "A needs B, B needs A (Validated)",
                  color: isCycleSimulated ? "#991b1b" : "#78350f"
                },
                { title: "Work backward", desc: "What comes before it? (Prereq Stack)", color: "#312e81" },
                { title: "Put classes in levels", desc: "Topological Tiers: 0, 1, 2...", color: "#312e81" },
                { title: "Check stress", desc: "Safe credits and Mamdani stress", color: "#312e81" },
                { title: "Enough semesters?", desc: "Critical path length validation", color: "#78350f" },
                { title: "Build the schedule", desc: "Classes distributed per term", color: "#312e81" },
                { title: "Show your plan", desc: "Map, meter, transparent notes", color: "#065f46" },
                { title: "You change it", desc: "Slider or class (Loops back)", color: "#334155" }
              ].map((step, idx) => (
                <View key={idx} style={{ alignItems: "center", marginBottom: 6 }}>
                  <View style={[styles.flowNode, { backgroundColor: step.color }]}>
                    <Text style={styles.flowNodeTitle}>{step.title}</Text>
                    <Text style={styles.flowNodeDesc}>{step.desc}</Text>
                  </View>
                  {idx < 9 && <Text style={styles.flowArrow}>↓</Text>}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* TAB 6: DEGREE CATALOG */}
        {activeTab === "catalog" && (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>📚 Degree Catalog Repository</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search course code or title..."
                placeholderTextColor="#64748b"
                value={searchCatalogText}
                onChangeText={setSearchCatalogText}
              />

              {COURSE_CATALOG.filter(
                (c) =>
                  c.code.toLowerCase().includes(searchCatalogText.toLowerCase()) ||
                  c.title.toLowerCase().includes(searchCatalogText.toLowerCase())
              ).map((course) => (
                <View key={course.id} style={styles.catalogItem}>
                  <View style={styles.catalogHeader}>
                    <Text style={styles.catalogCode}>{course.code}</Text>
                    <Text style={styles.catalogCredits}>{course.credits} cr • Diff {course.difficulty}/10</Text>
                  </View>
                  <Text style={styles.catalogTitle}>{course.title}</Text>
                  <Text style={styles.catalogDesc}>{course.description}</Text>
                  <Text style={styles.catalogPrereqs}>
                    Prerequisites: {course.prerequisites.length > 0 ? course.prerequisites.join(", ") : "None"}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Fuzzy Math Inspector Modal */}
      <Modal visible={isFuzzyModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mamdani Fuzzy Math Engine</Text>
              <TouchableOpacity onPress={() => setIsFuzzyModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.modalFormula}>
                Centroid Formula: z* = ∫ [x · μ(x)] dx / ∫ [μ(x)] dx
              </Text>
              <Text style={styles.modalText}>
                Translates crisp student confidence [1-10] and course difficulty [1-10] into triangular and trapezoidal membership functions. Evaluates 9 inference rules to calculate safe credit bounds (12-18 hrs) and term stress index (0-100%).
              </Text>

              <Text style={[styles.modalSubheading, { marginTop: 15 }]}>Fuzzy Rules Firing:</Text>
              <Text style={styles.modalRule}>• IF Low Conf & Hard Diff → Stress Very High, Max Credits 12</Text>
              <Text style={styles.modalRule}>• IF High Conf & Easy Diff → Stress Low, Max Credits 18</Text>
              <Text style={styles.modalRule}>• IF Med Conf & Med Diff → Stress Balanced, Max Credits 15</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Mobile Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { key: "roadmap", label: "Roadmap", icon: "📅" },
          { key: "dag", label: "DAG", icon: "🕸️" },
          { key: "confidence", label: "Sliders", icon: "🎛️" },
          { key: "transcript", label: "Passed", icon: "📝" },
          { key: "flowchart", label: "Pipeline", icon: "🔄" },
          { key: "catalog", label: "Catalog", icon: "📚" }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0e17"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "#0d131f"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center"
  },
  logoIconText: {
    fontSize: 20
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f8fafc"
  },
  badgeVersion: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeVersionText: {
    color: "#a5b4fc",
    fontSize: 10,
    fontWeight: "700"
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#94a3b8"
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981"
  },
  statusText: {
    color: "#6ee7b7",
    fontSize: 10,
    fontWeight: "600"
  },
  contentContainer: {
    flex: 1
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30
  },
  errorCard: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14
  },
  errorTitle: {
    color: "#fca5a5",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 4
  },
  errorDesc: {
    color: "#fecaca",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8
  },
  resetLoopBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start"
  },
  resetLoopBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700"
  },
  warningCard: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "#f59e0b",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14
  },
  warningTitle: {
    color: "#fde68a",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 4
  },
  warningDesc: {
    color: "#fef3c7",
    fontSize: 12,
    lineHeight: 18
  },
  card: {
    backgroundColor: "rgba(26, 34, 52, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 4
  },
  cardSubtext: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 12
  },
  horizontalScroll: {
    marginTop: 8
  },
  trackCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 12,
    width: 200,
    marginRight: 10
  },
  trackCardActive: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.15)"
  },
  trackTitle: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 4
  },
  trackDesc: {
    color: "#94a3b8",
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 6
  },
  trackCapstone: {
    color: "#818cf8",
    fontSize: 10,
    fontWeight: "700"
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14
  },
  kpiBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center"
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f8fafc"
  },
  kpiLabel: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 2,
    textTransform: "uppercase"
  },
  termCard: {
    backgroundColor: "rgba(26, 34, 52, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  termHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  termTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  termTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#f8fafc"
  },
  seasonBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  seasonBadgeText: {
    color: "#a5b4fc",
    fontSize: 10,
    fontWeight: "600"
  },
  termDifficulty: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2
  },
  termCredits: {
    fontSize: 15,
    fontWeight: "800",
    color: "#38bdf8"
  },
  gaugeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  gaugeSvgWrapper: {
    position: "relative",
    width: 110,
    height: 65,
    alignItems: "center"
  },
  gaugeTextOverlay: {
    position: "absolute",
    bottom: 2,
    alignItems: "center"
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: "800"
  },
  gaugeLabel: {
    fontSize: 8,
    color: "#94a3b8"
  },
  gaugeInfoWrapper: {
    flex: 1,
    marginLeft: 10
  },
  gaugeStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
  },
  gaugeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  gaugeStatusLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  gaugeSubtext: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 4
  },
  gaugeProgressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden"
  },
  gaugeProgressFill: {
    height: "100%",
    borderRadius: 2
  },
  gaugeCreditText: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 3
  },
  coursesList: {
    gap: 8
  },
  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.025)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderLeftWidth: 3,
    padding: 10,
    borderRadius: 8
  },
  courseInfo: {
    flex: 1
  },
  courseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  courseCode: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700"
  },
  courseCredits: {
    color: "#94a3b8",
    fontSize: 10
  },
  courseTitle: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 2
  },
  moveBtnGroup: {
    flexDirection: "row",
    gap: 4
  },
  moveBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  moveBtnText: {
    color: "#a5b4fc",
    fontSize: 10
  },
  reasoningDrawer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    paddingTop: 8
  },
  reasoningToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  reasoningToggleText: {
    fontSize: 11,
    color: "#a5b4fc",
    fontWeight: "600"
  },
  reasoningToggleIcon: {
    color: "#a5b4fc",
    fontSize: 10
  },
  reasoningContent: {
    marginTop: 8,
    gap: 6
  },
  reasoningCardItem: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 8,
    borderRadius: 6
  },
  reasoningCode: {
    fontSize: 11,
    fontWeight: "700",
    color: "#818cf8"
  },
  reasoningUnlock: {
    fontSize: 10,
    color: "#cbd5e1",
    marginTop: 2
  },
  reasoningConfidence: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2
  },
  dagTierColumn: {
    width: 170,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 10,
    padding: 8,
    gap: 8
  },
  dagTierBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 6
  },
  dagTierBadgeText: {
    color: "#a5b4fc",
    fontSize: 10,
    fontWeight: "800"
  },
  dagNodeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 10
  },
  dagNodeDone: {
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.08)"
  },
  dagNodeTarget: {
    borderColor: "#f59e0b",
    backgroundColor: "rgba(245, 158, 11, 0.08)"
  },
  dagNodeSelected: {
    borderColor: "#38bdf8",
    borderWidth: 2
  },
  dagNodeCode: {
    color: "#f8fafc",
    fontSize: 11,
    fontWeight: "800"
  },
  dagNodeTitle: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 2
  },
  dagNodeMeta: {
    color: "#64748b",
    fontSize: 9,
    marginTop: 4
  },
  dagStatusDone: {
    color: "#10b981",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4
  },
  dagStatusTarget: {
    color: "#f59e0b",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4
  },
  sliderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  sliderScore: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "800"
  },
  sliderDesc: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 2,
    marginBottom: 8
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center"
  },
  stepBtnText: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700"
  },
  sliderBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden"
  },
  sliderBarFill: {
    height: "100%",
    borderRadius: 3
  },
  actionBtn: {
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700"
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  presetBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  presetBtnText: {
    color: "#a5b4fc",
    fontSize: 11,
    fontWeight: "600"
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 6,
    gap: 10
  },
  checkRowPassed: {
    borderColor: "rgba(16, 185, 129, 0.4)",
    backgroundColor: "rgba(16, 185, 129, 0.06)"
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#64748b",
    alignItems: "center",
    justifyContent: "center"
  },
  checkBoxActive: {
    borderColor: "#10b981",
    backgroundColor: "#10b981"
  },
  checkMark: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800"
  },
  checkCode: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700"
  },
  checkTitle: {
    color: "#94a3b8",
    fontSize: 11
  },
  checkCredits: {
    color: "#64748b",
    fontSize: 10
  },
  simulationBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  simulationTitle: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700"
  },
  simulationDesc: {
    color: "#94a3b8",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 8
  },
  simBtn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center"
  },
  simBtnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700"
  },
  flowNode: {
    width: 240,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  flowNodeTitle: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 12
  },
  flowNodeDesc: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    marginTop: 2
  },
  flowArrow: {
    color: "#64748b",
    fontSize: 14,
    marginVertical: 2
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#f8fafc",
    fontSize: 12,
    marginBottom: 12
  },
  catalogItem: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  catalogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  catalogCode: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "800"
  },
  catalogCredits: {
    color: "#94a3b8",
    fontSize: 10
  },
  catalogTitle: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2
  },
  catalogDesc: {
    color: "#64748b",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4
  },
  catalogPrereqs: {
    color: "#818cf8",
    fontSize: 9,
    marginTop: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#0d131f",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.4)"
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f8fafc"
  },
  modalClose: {
    fontSize: 16,
    color: "#94a3b8"
  },
  modalFormula: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#a5b4fc",
    fontSize: 11,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8
  },
  modalText: {
    color: "#cbd5e1",
    fontSize: 11,
    lineHeight: 16
  },
  modalSubheading: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6
  },
  modalRule: {
    color: "#94a3b8",
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 3
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#0d131f",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingBottom: Platform.OS === "ios" ? 18 : 6
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: "#6366f1",
    marginTop: -2
  },
  tabIcon: {
    fontSize: 16
  },
  tabLabel: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2
  },
  tabLabelActive: {
    color: "#818cf8",
    fontWeight: "700"
  }
});
