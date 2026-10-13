import React, { useState, useEffect } from "react";
import { DownloadCloud, Smartphone, X, Check } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone app mode
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS and not installed, show after 3 seconds
    if (isIosDevice && !window.navigator.standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "calc(100% - 32px)",
        maxWidth: "460px",
        background: "rgba(17, 24, 39, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(99, 102, 241, 0.4)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.25)",
        borderRadius: "14px",
        padding: "0.85rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        animation: "fadeIn 0.3s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1, #06b6d4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Smartphone size={20} color="#ffffff" />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f8fafc" }}>
            Install CourseAdvisor App
          </div>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            {isIOS ? "Tap Share ⎋ then 'Add to Home Screen'" : "Fast standalone mobile application"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="btn-primary"
            style={{ fontSize: "0.75rem", padding: "0.4rem 0.75rem", whiteSpace: "nowrap" }}
          >
            <DownloadCloud size={13} /> Install
          </button>
        )}

        <button
          onClick={() => setShowPrompt(false)}
          style={{
            padding: "0.35rem",
            color: "#64748b",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.05)"
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
