"use client";

import { useEffect, useState } from "react";

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MainSection() {
  const [stats, setStats] = useState({ total: "—", today: "—", lastVisit: "—" });

  useEffect(() => {
    fetch("/api/track", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        setStats({
          total: d.total.toLocaleString(),
          today: d.today.toLocaleString(),
          lastVisit: d.lastVisit ? timeAgo(d.lastVisit) : "—",
        });
      })
      .catch(() => {});
  }, []);

  const scrollToProject = () => {
    document.getElementById("project")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ms-root">
      <style>{`
        .ms-root {
          position: absolute;
          inset: 0;
          background: transparent;
          font-family: var(--font-display);
          pointer-events: none;
          z-index: 10;
        }

        /* ── Header ── */
        .ms-header {
          position: absolute;
          top: 28px; left: 24px; right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
        }
        .ms-header-name {
          font-size: 13px;
          letter-spacing: 0.15px;
          color: var(--color-meta);
          text-transform: uppercase;
          font-family: var(--font-display);
        }

        /* ── Title + Description 컨테이너 ── */
        .ms-content {
          position: absolute;
          top: 60px;
          left: 24px;
          right: 24px;
          max-width: calc(100vw - 48px);
        }

        /* ── Title ── */
        .ms-title {
          font-size: 26px;
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: -0.04em;
          color: var(--color-fg);
          margin: 0;
          font-family: var(--font-display);
          word-break: keep-all;
        }

        /* ── Description ── */
        .ms-desc {
          margin-top: 24px;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.8;
          color: var(--color-meta);
          font-family: var(--font-display);
          word-break: keep-all;
        }

        /* ── Analytics ── */
        .ms-analytics {
          position: absolute;
          bottom: 24vh;
          left: 24px;
        }
        .ms-analytics-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15px;
          color: var(--color-fg);
          text-transform: uppercase;
          margin: 0 0 14px 0;
          font-family: var(--font-display);
        }
        .ms-stat-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .ms-stat-label {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15px;
          color: var(--color-meta);
          text-transform: uppercase;
          font-family: var(--font-display);
        }
        .ms-stat-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-meta);
          font-family: var(--font-display);
        }

        /* ── Status ── */
        .ms-status {
          position: absolute;
          bottom: 13.6vh;
          left: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ms-status-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ms-status-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--color-meta);
          flex-shrink: 0;
        }
        .ms-status-text {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.15px;
          color: var(--color-meta);
          text-transform: uppercase;
          font-family: var(--font-display);
        }

        /* ── Arrow ── */
        .ms-arrow {
          position: absolute;
          bottom: calc(7.6vh - 6px);
          left: 50%;
          transform: translateX(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        /* ── Desktop (≥640px) ── */
        @media (min-width: 640px) {
          .ms-header {
            top: 36px;
            left: 72px; right: 72px;
          }

          .ms-content {
            top: 120px;
            left: 72px;
            right: auto;
            max-width: 682px;
          }

          .ms-title {
            font-size: 48px;
            line-height: 1.4;
          }

          .ms-desc {
            max-width: 425px;
            font-size: 17px;
            color: var(--color-fg);
          }

          .ms-analytics {
            bottom: 27.7vh;
            left: 72px;
          }

          .ms-status {
            bottom: 13.3vh;
            left: 72px;
          }

          .ms-arrow {
            bottom: 7.5vh;
            left: 48.5%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="ms-header">
        <span className="ms-header-name">JAEIEE KIM</span>
      </div>

      {/* Title + Description */}
      <div className="ms-content">
        <h2 className="ms-title">
          프로덕트의 단단한 기반이 되는<br />
          주춧돌 같은 디자이너, 김재이입니다.
        </h2>
        <p className="ms-desc">
          <span style={{ whiteSpace: "nowrap" }}>데이터를 통해 문제의 맥락을 짚어내고 화면 구조를 설계합니다.</span><br />
          단단한 기획력을 바탕으로 미세한 예외 상황까지 고민하고,{" "}
          끊임없이 실험하고 배우며 탄탄한 경험을 쌓아가는 프로덕트 디자이너 김재이입니다.
        </p>
      </div>

      {/* Analytics */}
      <div className="ms-analytics">
        <p className="ms-analytics-label">ANALYTICS</p>
        {[
          { label: "TODAY'S VIEWS", value: stats.today },
          { label: "TOTAL VIEWS",   value: stats.total },
          { label: "LAST VISITOR",  value: stats.lastVisit },
        ].map((stat) => (
          <div key={stat.label} className="ms-stat-row">
            <span className="ms-stat-label">{stat.label}</span>
            <span className="ms-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="ms-status">
        <div className="ms-status-row">
          <MapPinIcon />
          <span className="ms-status-text">BASED IN SEOUL</span>
        </div>
        <div className="ms-status-row">
          <div className="ms-status-dot" />
          <span className="ms-status-text">CURRENTLY OPEN TO WORK</span>
        </div>
      </div>

      {/* Chevron → Project 섹션 */}
      <button
        className="ms-arrow"
        onClick={scrollToProject}
        aria-label="프로젝트 섹션으로 이동"
      >
        <ChevronDown />
      </button>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="11" height="13"
      viewBox="0 0 11 13"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M5.5 0.5C3.015 0.5 1 2.515 1 5C1 8.375 5.5 12.5 5.5 12.5C5.5 12.5 10 8.375 10 5C10 2.515 7.985 0.5 5.5 0.5Z"
        stroke="var(--color-meta)"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="5.5" cy="5" r="1.5" fill="var(--color-meta)" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="40" height="16"
      viewBox="0 0 40 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2L20 14L38 2"
        stroke="var(--color-fg)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
