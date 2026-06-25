"use client";
import { useState } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

const FILTERS = ["All", "Team project", "Personal project", "Work", "AI experiment"] as const;
type FilterType = (typeof FILTERS)[number];

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
      <path d="M15 7h2a5 5 0 1 1 0 10h-2"/>
      <line x1="11" y1="12" x2="13" y2="12"/>
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

export default function ProjectSection() {
  const [active, setActive] = useState<FilterType>("All");

  const visible =
    active === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === active);

  return (
    <section id="project" className="ps-root">
      <style>{`
        /* ── 모바일 기본 (앱 프레임 기준) ── */
        .ps-root {
          width: 100%;
          background-color: #ffffff;
          font-family: var(--font-display);
          padding: 120px 24px 200px;
          box-sizing: border-box;
        }

        .ps-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-label);
          font-family: var(--font-display);
          margin-bottom: 16px;
        }

        .ps-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-bottom: 24px;
        }

        .ps-filter-btn {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 400;
          font-family: var(--font-display);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, border-radius 0.2s ease;
          border: 1px solid rgba(10, 10, 10, 0.15);
          background: transparent;
          color: var(--color-label);
          white-space: nowrap;
        }
        .ps-filter-btn.active {
          background: #12110e;
          border-color: #12110e;
          border-radius: 16px;
          color: #ffffff;
          font-weight: 500;
        }

        .ps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .ps-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid var(--color-card-border);
          border-radius: 8px;
          overflow: hidden;
          cursor: default;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .ps-card:hover {
          transform: scale(1.015);
          border-color: var(--color-accent);
        }

        .ps-thumb {
          width: 100%;
          aspect-ratio: 342 / 195;
          background: var(--color-card-thumb);
          flex-shrink: 0;
          object-fit: cover;
          display: block;
        }

        .ps-card-info {
          display: flex;
          flex-direction: column;
          padding: 12px 16px 18px;
          gap: 6px;
        }

        .ps-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ps-card-idx {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-fg-dark);
          font-family: var(--font-display);
          flex-shrink: 0;
        }

        .ps-card-name {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--color-fg-dark);
          font-family: var(--font-display);
          margin: 0;
          word-break: keep-all;
          flex-shrink: 1;
        }

        .ps-type-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 6px;
          border: none;
          border-radius: 4px;
          background: var(--color-badge-bg);
          font-size: 10px;
          font-weight: 400;
          color: var(--color-label);
          font-family: var(--font-display);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ps-card-period {
          font-size: 11px;
          color: var(--color-label);
          font-family: var(--font-display);
        }

        .ps-card-summary {
          font-size: 13px;
          line-height: 1.6;
          color: #555555;
          font-family: var(--font-display);
          word-break: keep-all;
          margin: 0;
        }

        .ps-card-actions {
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding: 8px 16px 16px;
          margin-top: auto;
        }

        .ps-btn {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.15px;
          font-family: var(--font-display);
          cursor: pointer;
          border: 1px solid rgba(10, 10, 10, 0.15);
          text-decoration: none;
          white-space: nowrap;
        }
        .ps-btn-project {
          background: #0a0a0a;
          color: #ffffff;
          transition: color 0.2s ease;
        }
        .ps-btn-project:hover {
          color: var(--color-accent);
        }
        .ps-btn-service {
          background: var(--color-badge-bg);
          color: #555555;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .ps-btn-service:hover {
          background: #DAE0E6;
          border-color: var(--color-accent);
        }
        .ps-btn-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── 데스크톱: 3단 (데스크톱 프레임 기준) ── */
        @media (min-width: 640px) {
          .ps-root {
            padding: 120px 72px 240px;
          }
          .ps-label {
            margin-bottom: 20px;
          }
          .ps-filters {
            margin-bottom: 40px;
            gap: 8px;
          }
          .ps-filter-btn {
            font-size: 13px;
            padding: 8px 16px;
            color: #555555;
          }
          .ps-filter-btn.active {
            border-radius: 20px;
          }
          .ps-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
          .ps-card {
            border-radius: 16px;
          }
          .ps-thumb {
            aspect-ratio: 420 / 239;
          }
          .ps-card-info {
            padding: 16px 24px 24px;
            gap: 10px;
          }
          .ps-card-idx {
            font-size: 17px;
          }
          .ps-card-name {
            font-size: 20px;
            letter-spacing: -0.03em;
          }
          .ps-type-badge {
            font-size: 13px;
            color: #555555;
          }
          .ps-card-period {
            font-size: 13px;
            color: #555555;
          }
          .ps-card-summary {
            font-size: 15px;
          }
          .ps-card-actions {
            flex-direction: row;
            padding: 8px 24px 24px;
          }
          .ps-btn {
            flex: none;
          }
        }
      `}</style>

      <span className="ps-label">02F. PROJECT</span>

      {/* Filter chips */}
      <div className="ps-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`ps-filter-btn${active === f ? " active" : ""}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="ps-grid">
        {visible.map((p) => (
          <div key={p.idx} className="ps-card">
            {p.image
              ? <img src={p.image} alt={p.name} className="ps-thumb" />
              : <div className="ps-thumb" />
            }
            <div className="ps-card-info">
              <div className="ps-card-header">
                <span className="ps-card-idx">{p.idx}</span>
                <h3 className="ps-card-name">{p.name}</h3>
                <span className="ps-type-badge">{p.type}</span>
              </div>
              <p className="ps-card-period">{p.period}</p>
              <p className="ps-card-summary">{p.summary}</p>
            </div>
            <div className="ps-card-actions">
              {!p.hideDetail && (
                <Link href={`/project/${p.slug}`} className="ps-btn ps-btn-project">
                  <span className="ps-btn-inner"><FolderIcon />프로젝트</span>
                  <ArrowUpRightIcon />
                </Link>
              )}
              {p.serviceLink && (
                <a href={p.serviceLink} target="_blank" rel="noopener noreferrer" className="ps-btn ps-btn-service">
                  <span className="ps-btn-inner"><LinkIcon />서비스 링크</span>
                  <ArrowUpRightIcon />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
