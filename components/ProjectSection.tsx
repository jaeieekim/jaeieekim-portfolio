"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/lib/projects";

const FILTERS = ["All", "Team project", "Personal project", "Work", "AI experiment"] as const;
type FilterType = (typeof FILTERS)[number];

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
  const router = useRouter();
  const [active, setActive] = useState<FilterType>("All");
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersFit, setFiltersFit] = useState(true);
  const staticFiltersRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [floatShown, setFloatShown] = useState(false);

  // 배경 모서리 원형 그라데이션: 프로젝트 섹션 시작이 화면 가운데보다 위로 올라오면 보이고, 메인이 화면 절반 이상이면 숨김
  useEffect(() => {
    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      document.body.classList.toggle("bg-glow-on", sec.getBoundingClientRect().top < window.innerHeight / 2);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.body.classList.remove("bg-glow-on");
    };
  }, []);

  // 제자리 칩이 화면 맨 위에 닿는 순간 위 고정 칩 줄로 바로 교체 (둘이 동시에 보이지 않게 제자리 칩은 숨김)
  useEffect(() => {
    const update = () => {
      const st = staticFiltersRef.current, sec = sectionRef.current;
      if (!st || !sec) return;
      setFloatShown(st.getBoundingClientRect().top <= 0 && sec.getBoundingClientRect().bottom > 120);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // 칩 전체 폭이 가운데 정렬 공간(칩바 폭 − 왼쪽 비움 폭)에 들어가는지 확인
  useEffect(() => {
    const el = filtersRef.current;
    if (!el) return;
    const check = () => {
      const chips = el.querySelectorAll<HTMLElement>(".ps-filter-btn");
      if (!chips.length) return;
      const first = chips[0], last = chips[chips.length - 1];
      const needed = last.offsetLeft + last.offsetWidth - first.offsetLeft;
      const iconGap = parseFloat(getComputedStyle(el).getPropertyValue("--ps-icon-gap")) || 0;
      setFiltersFit(needed <= el.clientWidth - iconGap);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible =
    active === "All" ? PROJECTS : PROJECTS.filter((p) => p.type === active);

  const renderChips = () =>
    FILTERS.map((f) => (
      <button
        key={f}
        className={`ps-filter-btn${active === f ? " active" : ""}`}
        onClick={() => {
          setActive(f);
          // 섹션 위 여백(160px)까지 보이지 않도록 제목이 화면 위에서 40px(모바일 24px)에 오게 맞춤
          const heading = document.querySelector<HTMLElement>(".ps-heading");
          if (heading) {
            const offset = window.innerWidth >= 640 ? 40 : 24;
            window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
          }
        }}
      >
        <span className="ps-filter-label">{f}</span>
      </button>
    ));

  return (
    <section id="project" className="ps-root" ref={sectionRef}>
      <style>{`
        /* ── 모바일 기본 (앱 프레임 기준) ── */
        .ps-root {
          width: 100%;
          /* 첫 레이어: 메인 배경 하단색(#F4F7FB)에서 시작해 자연스럽게 섞이도록 — 섹션 경계 가로선 제거 */
          background-image:
            linear-gradient(180deg, #f4f7fb 0px, rgba(244, 247, 251, 0) 320px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.6) 100%),
            linear-gradient(90deg, #d7edff 1%, #effbff 36%, #effbff 65%, #ede6ff 100%);
          font-family: var(--font-display);
          padding: 100px 24px 120px;
          box-sizing: border-box;
        }

        .ps-heading {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 36px;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 24px;
          width: fit-content; /* 그라데이션을 글자 폭 기준으로 (어바웃미 헤딩과 동일 스타일) */
          background-image: linear-gradient(90deg, #252628 0%, #3785c7 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        /* 제자리 칩: 프로젝트 영역에서는 줄바꿈해서 모든 칩이 다 보이게 */
        .ps-filters-static {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 8px;
          margin: 0 0 32px;
          padding: 16px 0;
        }

        /* 위 고정 칩 줄: 제자리 칩이 화면 위로 지나간 뒤에만 나타남. 한 줄 유지, 오른쪽은 메뉴 아이콘 자리 비움 */
        .ps-float {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          padding: 0 24px;
          visibility: hidden;
          pointer-events: none;
        }
        .ps-float.is-shown {
          visibility: visible;
          pointer-events: auto;
        }
        .ps-filters-static.is-hidden {
          visibility: hidden;
        }

        .ps-filters {
          display: flex;
          flex-wrap: nowrap;
          /* 한 줄 유지: 다 들어가면 가운데, 넘치면 왼쪽부터 시작해 옆으로 밀어서 봄 */
          justify-content: flex-start;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 8px;
          /* 메뉴 아이콘을 없애서 오른쪽에 따로 비워 둘 자리 없음 */
          --ps-icon-gap: 0px;
          margin: 0 var(--ps-icon-gap) 0 0;
          padding: 16px 0;
        }
        /* 칩이 한 줄에 다 들어갈 때: 왼쪽에도 같은 폭을 비워 화면 정가운데 정렬 */
        .ps-filters.is-fit {
          justify-content: center;
          padding-left: var(--ps-icon-gap);
        }

        .ps-filters::-webkit-scrollbar { display: none; }
        .ps-filter-btn { flex-shrink: 0; }

        @keyframes ps-card-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ps-card {
          animation: ps-card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ps-filter-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          border-radius: var(--glass-radius-pill);
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-display);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.04);
          color: #1b1b1b;
          white-space: nowrap;
        }
        /* 칩 호버: 글자 중앙에서 바깥으로 퍼지는 파동형 컬러 쉬머 (선택된 칩 제외) */
        @property --ps-ring {
          syntax: "<length>";
          inherits: false;
          initial-value: 0px;
        }
        @keyframes ps-ring-out {
          from { --ps-ring: 0px; }
          to { --ps-ring: 72px; }
        }
        .ps-filter-label {
          --ps-ring: 0px;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            #1b1b1b calc(var(--ps-ring) - 72px),
            #0083f2 calc(var(--ps-ring) - 54px),
            #3fb5ff calc(var(--ps-ring) - 36px),
            #1e5a99 calc(var(--ps-ring) - 18px),
            #1b1b1b var(--ps-ring)
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: inherit;
        }
        @media (hover: hover) and (pointer: fine) {
          .ps-filter-btn:not(.active):hover .ps-filter-label {
            color: transparent;
            animation: ps-ring-out 1.6s linear infinite;
          }
        }
        .ps-filter-btn.active {
          background: #12110e;
          border-color: #12110e;
          color: #ffffff;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0px 8px 15px 0px rgba(0, 0, 0, 0.1);
        }

        .ps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 400px; /* 1열일 때 카드 최대 400px = 2열 카드 최소 크기와 동일 */
          margin: 0 auto;
        }

        .ps-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(145deg, var(--card-from), var(--card-to));
          border-radius: 56px;
          padding: 36px 20px;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease;
          container: ps-card / inline-size;
        }
        .ps-card:hover {
          transform: scale(1.012);
        }

        /* 호버 시 파란 테두리 + 밝은 빛 띠가 반시계 방향으로 도는 쉬머 (어바웃미 펼친 블록과 같은 모션) */
        @property --ps-border-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes ps-border-spin-ccw {
          from { --ps-border-angle: 360deg; }
          to { --ps-border-angle: 0deg; }
        }
        .ps-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 3; /* 사진·호버 정보 위에 테두리만 */
          border-radius: inherit;
          padding: 1.5px; /* 테두리 두께 */
          /* 빛 띠 두 개를 반대편(180도 간격)에 두어 함께 같은 방향으로 돎 */
          background: conic-gradient(from var(--ps-border-angle), #367eba 0deg, #367eba 120deg, #a8dcff 150deg, #367eba 180deg, #367eba 300deg, #a8dcff 330deg, #367eba 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .ps-card:hover::after {
            opacity: 0.8; /* 살짝 연하게 */
            animation: ps-border-spin-ccw 3s linear infinite;
          }
        }

        /* ── Card visual ──
           project.image fallback (projects without a finished Figma card)
           is a pre-composed mockup render shown as-is inside the accent
           gradient. project.cardImage is the user's exact exported Figma
           card art (gradient + phones already baked in, native aspect
           ratio) — it replaces the accent gradient entirely and fills the
           card edge-to-edge, no letterboxing. */
        .ps-card-exact {
          padding: 0;
          background-image: none;
          background-color: #fff;
        }
        .ps-thumb {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .ps-card-exact .ps-thumb {
          object-fit: cover;
        }
        /* 그림 대신 글자로 채우는 카드 (예: UX 라이팅 생성기) */
        .ps-card-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
          font-family: var(--font-display);
        }
        .ps-card-text-eyebrow {
          font-size: clamp(13px, 3.4cqw, 18px);
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #2f7fd1;
        }
        .ps-card-text-title {
          margin: 0;
          font-size: clamp(30px, 9cqw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          color: #1d2126;
          word-break: keep-all;
        }

        /* ── Hover-reveal info overlay ──
           Matches the Figma hover-state reference exactly: a light frosted
           glass wash (not a dark scrim) with three zones — header pinned
           top, action buttons vertically centered, period+summary pinned
           bottom. */
        .ps-card-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding: 40px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          opacity: 1;
          transition: opacity 0.25s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .ps-card-overlay {
            opacity: 0;
          }
          .ps-card:hover .ps-card-overlay,
          .ps-card:focus-within .ps-card-overlay {
            opacity: 1;
          }
        }

        .ps-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ps-card-name {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #0a0a0a;
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
          background: rgba(10, 10, 10, 0.08);
          font-size: 11px;
          font-weight: 400;
          color: #555;
          font-family: var(--font-display);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .ps-card-footer {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ps-card-period {
          font-size: 12px;
          color: #555;
          font-family: var(--font-display);
        }

        .ps-card-summary {
          font-size: 12px;
          line-height: 1.6;
          color: #0a0a0a;
          font-family: var(--font-display);
          word-break: keep-all;
          margin: 0;
        }

        .ps-card-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: auto 0;
        }

        .ps-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 8px 24px;
          border-radius: var(--glass-radius-pill);
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-display);
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          width: fit-content;
          max-width: 100%;
          border: 1.5px solid #555555;
          background-color: transparent;
          transition: border-color 0.2s ease;
        }
        /* 쉬머: 이미지 절반 주기로 반복되는 그라데이션을 왼쪽→오른쪽으로 이동 */
        @keyframes ps-shimmer-ltr {
          from { background-position: 100% 50%; }
          to { background-position: 0% 50%; }
        }
        .ps-btn-label {
          background-image: linear-gradient(90deg, #0a0a0a 0%, #999999 25%, #0a0a0a 50%, #999999 75%, #0a0a0a 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: ps-shimmer-ltr 3s linear infinite;
          transition: color 0.2s ease;
        }
        .ps-btn svg {
          color: #0a0a0a;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }
        .ps-btn:hover {
          border-color: #0083f2;
        }
        .ps-btn:hover .ps-btn-label {
          background-image: none;
          animation: none;
          color: #0083f2;
          -webkit-text-fill-color: #0083f2;
        }
        .ps-btn:hover svg {
          color: #0083f2;
        }

        /* ── 데스크톱 ── */
        @media (min-width: 640px) {
          .ps-root {
            padding: 160px 72px 200px;
          }
          .ps-heading {
            font-size: 64px;
            letter-spacing: -0.02em;
            margin-bottom: 40px;
          }
          .ps-filters {
            margin: 0 var(--ps-icon-gap) 0 0;
            padding: 20px 0;
            gap: 10px;
          }
          .ps-float {
            padding: 0 72px;
          }
          .ps-filters-static {
            justify-content: center;
            margin-bottom: 56px;
            padding: 20px 0;
            gap: 10px;
          }
          .ps-filter-btn {
            font-size: 15px;
            padding: 10px 20px;
          }
          .ps-grid {
            gap: 24px;
          }
          .ps-card:not(.ps-card-exact) {
            padding: 48px;
          }
        }

        /* 2열: 카드가 400px 이상 확보되는 너비부터 (좌우 여백 72px×2 + 간격 24px + 카드 400px×2 = 968px) */
        @media (min-width: 968px) {
          .ps-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: none;
          }
        }

        /* 카드 내부(호버 정보)는 화면 너비가 아니라 카드 자체 너비 기준 — 작은 카드는 모바일 크기 유지 */
        @container ps-card (min-width: 440px) {
          .ps-card-overlay {
            padding: 64px;
          }
          .ps-card-name {
            font-size: 28px;
          }
          .ps-type-badge {
            font-size: 13px;
          }
          .ps-card-period {
            font-size: 14px;
          }
          .ps-card-summary {
            font-size: 14px;
          }
          .ps-card-actions {
            gap: 16px;
          }
          .ps-btn {
            font-size: 17px;
            padding: 12px 32px;
            gap: 20px;
          }
        }
      `}</style>

      <h2 className="ps-heading">Product Design</h2>

      {/* Filter chips — 제자리(다 보임) + 위 고정 줄(지나간 뒤) */}
      <div className={`ps-filters-static${floatShown ? " is-hidden" : ""}`} ref={staticFiltersRef}>
        {renderChips()}
      </div>
      <div className={`ps-float${floatShown ? " is-shown" : ""}`} inert={!floatShown}>
        <div className={`ps-filters${filtersFit ? " is-fit" : ""}`} ref={filtersRef}>
          {renderChips()}
        </div>
      </div>

      {/* Project grid */}
      <div className="ps-grid" key={active}>
        {visible.map((p, i) => {
          const thumb = p.cardImage ?? p.image;
          return (
          <div
            key={p.idx}
            className={`ps-card${p.cardImage ? " ps-card-exact" : ""}`}
            style={{
              "--card-from": p.accentFrom,
              "--card-to": p.accentTo,
              animationDelay: `${Math.min(i, 6) * 45}ms`,
            } as CSSProperties}
            onClick={() => {
              if (!p.hideDetail) router.push(`/project/${p.slug}`);
              else if (p.serviceLink) window.open(p.serviceLink, "_blank", "noopener,noreferrer");
            }}
          >
            {p.cardText ? (
              <div className="ps-card-text">
                <span className="ps-card-text-eyebrow">{p.cardText.eyebrow}</span>
                <p className="ps-card-text-title">{p.cardText.title}</p>
              </div>
            ) : (
              thumb && <img src={thumb} alt={p.name} className="ps-thumb" />
            )}

            <div className="ps-card-overlay">
              <div className="ps-card-header">
                <h3 className="ps-card-name">{p.name}</h3>
                <span className="ps-type-badge">{p.type}</span>
              </div>

              <div className="ps-card-actions">
                {!p.hideDetail && (
                  <Link
                    href={`/project/${p.slug}`}
                    className="ps-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="ps-btn-label">View project</span>
                    <ArrowUpRightIcon />
                  </Link>
                )}
                {p.serviceLink && (
                  <a
                    href={p.serviceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ps-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="ps-btn-label">Service link</span>
                    <LinkIcon />
                  </a>
                )}
              </div>

              <div className="ps-card-footer">
                <p className="ps-card-period">{p.period}</p>
                <p className="ps-card-summary">{p.summary}</p>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
