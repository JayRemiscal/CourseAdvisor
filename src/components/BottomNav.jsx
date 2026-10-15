import React from "react";
import { 
  Calendar, 
  GitFork, 
  Sliders, 
  BookMarked, 
  Library 
} from "lucide-react";

export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "planner", label: "Roadmap", icon: Calendar },
    { id: "graph", label: "DAG", icon: GitFork },
    { id: "confidence", label: "Sliders", icon: Sliders },
    { id: "transcript", label: "Passed", icon: BookMarked },
    { id: "catalog", label: "Catalog", icon: Library }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            aria-label={tab.label}
          >
            <div className="icon-wrapper">
              <Icon size={20} color={isActive ? "#818cf8" : "#94a3b8"} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && <div className="active-dot" />}
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
