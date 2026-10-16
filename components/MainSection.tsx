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

        /* ── Headline ──
           Fixed top/bottom offsets (not vh, not 50%-translate) so this
           reserved band never drifts into the analytics card or CTA
           regardless of viewport height. */
        /* 윗선 고정: 글자가 가장 클 때(52px × 2줄 = 156px) 가운데 오는 자리에 윗선을 두고,
           화면이 좁아져 글자가 작아져도 윗선은 그대로 — 아래쪽만 줄어듦 */
        .ms-headline {
          position: absolute;
          top: max(140px, calc(50vh - 128px));
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 0 24px;
        }
        .ms-headline h1 {
          max-width: 980px;
          width: 100%;
          text-align: center;
          /* 화면 너비에 비례: 첫 줄 너비가 글자 크기의 약 13.5배라 (가용 너비 ÷ 14)로 두 줄 유지, 최대 52px */
          font-size: clamp(18px, calc((100vw - 48px) / 14), 52px);
          font-weight: 700;
          line-height: 1.5;
          letter-spacing: -0.02em;
          margin: 0;
          word-break: keep-all;
          /* 진한 글자 위로 파란 빛 띠가 왼쪽→오른쪽으로 계속 지나가는 쉬머 */
          background-image:
            linear-gradient(180deg, rgba(18, 19, 19, 0.5) 3%, rgba(18, 19, 19, 0) 63%),
            linear-gradient(90deg, #121313 0%, #121313 32%, #206197 42%, #0e8bd3 50%, #206197 58%, #121313 68%, #121313 100%);
          background-size: 100% 100%, 250% 100%;
          background-position: 0% 0%, 100% 50%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation:
            headlineSoak 3.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s 1 both,
            headlineShimmer 4s ease-in-out 0.4s infinite;
        }
        @keyframes headlineShimmer {
          from { background-position: 0% 0%, 100% 50%; }
          to { background-position: 0% 0%, 0% 50%; }
        }

        /* 처음 들어올 때 색이 한 번 물드는 느낌 (쉬머와 별개로 필터만) */
        @keyframes headlineSoak {
          0% {
            filter: saturate(0.1) brightness(1.08);
          }
          100% {
            filter: saturate(1) brightness(1);
          }
        }

        /* ── Analytics (glass card) ── */
        .ms-analytics {
          position: absolute;
          left: 24px;
          bottom: 164px; /* 모바일·데스크톱 동일 높이 */
          width: 190px;
          padding: 20px;
          border-radius: var(--glass-radius-card);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1.8px solid var(--glass-border);
        }
        .ms-analytics-label {
          font-size: 13px;
          font-weight: 600;
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
        .ms-stat-row:last-child { margin-bottom: 0; }
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

        /* ── CTA ── */
        .ms-cta {
          position: absolute;
          bottom: 48px; /* 웹과 같은 아랫선 — 화면을 좁혀도 버튼이 아래로 내려가지 않게 */
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #1b1b1b;
          border: none;
          border-radius: var(--glass-radius-pill);
          padding: 12px 24px;
          cursor: pointer;
          pointer-events: auto;
          white-space: nowrap;
        }
        .ms-cta-label {
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 15px;
          background-image: linear-gradient(90deg, #999 0%, #fff 25%, #999 50%, #fff 75%, #999 100%);
          background-size: 220% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradientFlow 3s linear infinite;
        }

        /* ── Desktop (≥640px) ── */
        @media (min-width: 640px) {
          .ms-headline {
            top: max(160px, calc(50vh - 128px));
          }
          .ms-analytics {
            left: 72px;
          }

          .ms-cta {
            padding: 16px 32px;
          }
          /* 웹(커서 있는 기기): 평소엔 살짝 작게, 커서를 대면 원래 크기로 커짐 */
          @media (hover: hover) and (pointer: fine) {
            .ms-cta {
              transform: translateX(-50%) scale(0.93);
              transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .ms-cta:hover {
              transform: translateX(-50%) scale(1);
            }
          }
          .ms-cta-label {
            font-size: 20px;
          }
        }

        /* Too little vertical room for headline + analytics + CTA to
           all breathe — drop the decorative analytics card first. */
        @media (max-height: 680px) {
          .ms-analytics { display: none; }
        }
      `}</style>

      {/* Headline */}
      <div className="ms-headline">
        <h1>
          일상 속 불편함을 가능성으로 바꾸는<br />
          프로덕트 디자이너 김재이입니다.
        </h1>
      </div>

      {/* Analytics */}
      <div className="ms-analytics">
        <p className="ms-analytics-label">Analytics</p>
        {[
          { label: "TODAY'S VIEWS", value: stats.today },
          { label: "TOTAL VIEWS", value: stats.total },
          { label: "LAST VISITOR", value: stats.lastVisit },
        ].map((stat) => (
          <div key={stat.label} className="ms-stat-row">
            <span className="ms-stat-label">{stat.label}</span>
            <span className="ms-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* CTA → Project 섹션 */}
      <button className="ms-cta" onClick={scrollToProject} aria-label="Project 섹션으로 이동">
        <span className="ms-cta-label">More about me</span>
        <ChevronsDown />
      </button>
    </div>
  );
}

function ChevronsDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6L12 11L17 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
