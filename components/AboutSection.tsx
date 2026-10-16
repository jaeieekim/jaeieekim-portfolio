"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const HIGHLIGHT_BLOCKS: { title: string; body?: string[] }[] = [
  {
    title: "0 to 1 출시부터 데이터 기반\n디자인 반복 개선까지 경험",
    body: [
      "Figma와 PPT를 활용해 유형별 플로우와 화면 구조를 설계하며, 정책 기준과 예외 케이스를 화면 단위로 정리했습니다.",
      "기능별 동작 기준과 조건을 구체화하고, 개발 가능한 형태로 문서로 구조화해 개발 핸드오프를 지원했습니다.",
      "개발 디자인 QA 3건에서 약 500개의 오류 케이스와 발생 조건을 공유 문서로 관리하고, 기준을 세워 우선순위를 부여해 출시 품질을 관리했습니다.",
    ],
  },
  {
    title: "약 1년 간 실무 환경에서\n맥락에 맞는 UX 전략과 화면 설계",
    body: [
      "UX 기획자로 근무하며 중고차 커머스 플랫폼 KB차차차 커뮤니티의 웹, 모바일, 내부 어드민 제품을 구축했습니다.",
      "PO, 개발 부서와 소통하며 기술적 제약에 맞는 전략과 UX 대안을 제시하고, 우선순위를 조율해 왔습니다.",
      "중고차 딜러 회원 홈 개선과 차량 판매•영업 관리 시각화를 통해 정보 밀도 높은 데이터를 유저 맥락에 맞는 구조로 설계했습니다.",
    ],
  },
  {
    title: "복잡한 조건을 실행 가능한\n화면으로 구조화",
    body: [
      "Figma와 PPT를 활용해 유형별 플로우와 화면 구조를 설계하며, 정책 기준과 예외 케이스를 화면 단위로 정리했습니다.",
      "기능별 동작 기준과 조건을 구체화하고, 개발 가능한 형태로 문서로 구조화해 개발 핸드오프를 지원했습니다.",
      "개발 디자인 QA 3건에서 약 500개의 오류 케이스와 발생 조건을 공유 문서로 관리하고, 기준을 세워 우선순위를 부여해 출시 품질을 관리했습니다.",
    ],
  },
];


const AWARDS = [
  {
    title: "'KB 차차차' 사업 UX/UI 전략 및 화면 기획 설계",
    org: "포인트뱅크",
    date: "22.06 — 23.04",
  },
  {
    title: "한국디자인진흥원 주관 제 58회 대한민국전람회 제품디자인 수상",
    date: "23.11",
  },
  {
    title: "25 충북 공공데이터 창업 경진대회 서비스 아이디어 기획 우수상",
    date: "25.08",
  },
  {
    title: "비사이드 네이버클라우드 주관 '포텐데이' 해커톤 데모데이 1위 수상",
    date: "25.08",
  },
];

const SKILLS: Record<string, string[]> = {
  Design: ["Figma", "Photoshop", "Illustrator", "Premiere pro"],
  AI: ["Claude code", "Cursor", "Open AI", "Lovable", "Antigravity"],
  Document: ["Powerpoint", "Ms Excel", "Spreadsheet", "Notion"],
  Data: ["GA4", "Mixpanel"],
};

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hlGridRef = useRef<HTMLDivElement>(null);
  const [hlOpenHeight, setHlOpenHeight] = useState<number | null>(null);

  // 펼침 높이 = 위 여백 + 제목 + 설명 + 아래 여백. 세 블록 중 가장 긴 내용 기준으로 맞춰
  // 어느 블록을 펼쳐도 같은 크기가 되게 함 (화면이 좁아지면 글이 늘어나니 다시 계산)
  useEffect(() => {
    const grid = hlGridRef.current;
    if (!grid) return;
    const measure = () => {
      let max = 0;
      grid.querySelectorAll<HTMLElement>(".ab-hl-card").forEach((card) => {
        const cs = getComputedStyle(card);
        // 닫힘은 위아래 여백이 달라서, 펼침 여백 값을 따로 읽어 계산
        const openPad = parseFloat(cs.getPropertyValue("--hl-open-pad")) || 0;
        const title = card.querySelector<HTMLElement>(".ab-hl-title");
        const body = card.querySelector<HTMLElement>(".ab-hl-reveal > div");
        const h =
          openPad * 2 +
          parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) +
          (title?.offsetHeight ?? 0) + (body?.scrollHeight ?? 0);
        max = Math.max(max, h);
      });
      setHlOpenHeight(Math.ceil(max));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);
  // 펼친 블록을 화면 가운데에 오도록 스크롤 맞춤 (위 고정 메뉴 90을 뺀 보이는 영역 기준)
  const fitOpenedCard = (i: number) => {
    const card = hlGridRef.current?.querySelectorAll<HTMLElement>(".ab-hl-card")[i];
    if (!card) return;
    const top = 90;
    const space = window.innerHeight - top;
    const r = card.getBoundingClientRect();
    // 블록이 보이는 영역보다 크면 블록 위를 메뉴 바로 아래에, 아니면 가운데에
    const targetTop = r.height >= space ? top : top + (space - r.height) / 2;
    window.scrollTo({ top: window.scrollY + r.top - targetTop, behavior: "smooth" });
  };

  const toggle = (i: number) => {
    const opening = openIndex !== i;
    setOpenIndex(opening ? i : null);
    // 펼침·다른 블록 접힘 움직임(0.35초)이 끝난 뒤 위치 계산
    if (opening) window.setTimeout(() => fitOpenedCard(i), 380);
  };

  return (
    <section id="about" className="ab-root">
      <style>{`
        /* 피그마 About me 프레임(202:1922) 기준 — 1920 화면 */
        .ab-root {
          width: 100%;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%),
            linear-gradient(90deg, rgb(215, 237, 255) 1.15%, rgb(239, 251, 255) 35.74%, rgb(239, 251, 255) 65.4%, rgb(237, 230, 255) 100%);
          font-family: var(--font-display);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 72px 24px 96px;
        }

        /* ── 상단: 타이틀 → 소개 → 이력서 다운로드 (세로 배치) ── */
        .ab-top {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .ab-headline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 40px;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 20px;
          width: fit-content; /* 프로덕트 디자인 헤딩과 동일 스타일 */
          background: linear-gradient(90deg, #252628 0%, #3785c7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ab-lead {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.8;
          color: var(--color-fg-dark);
          margin: 0;
          word-break: keep-all;
          max-width: 1035px;
        }

        .ab-resume-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 16px; /* 글자와 아이콘 사이 */
          margin-top: 40px;
          padding: 16px 32px;
          position: relative;
          border-radius: var(--glass-radius-pill);
          border: none;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          font-family: var(--font-display);
          white-space: nowrap;
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        /* 누르면 살짝 확대 */
        .ab-resume-btn:active { transform: scale(1.08); }
        /* 글자: 진한 남색 위로 밝은 파랑 빛 띠가 왼쪽→오른쪽으로 지나가는 쉬머, 무한 반복 */
        @keyframes ab-shimmer-ltr {
          from { background-position: 100% 50%; }
          to { background-position: 0% 50%; }
        }
        .ab-resume-label {
          background-image: linear-gradient(90deg, #263643 0%, #263643 30%, #6fb6f2 42%, #263643 54%, #263643 100%);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ab-shimmer-ltr 2.4s ease-in-out infinite;
        }
        /* 테두리(1.5): 글자와 같은 빛 띠가 같은 속도로 왼쪽→오른쪽 */
        .ab-resume-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(90deg, #2d7ab8 0%, #2d7ab8 30%, #a8dcff 42%, #2d7ab8 54%, #2d7ab8 100%);
          background-size: 250% 100%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          animation: ab-shimmer-ltr 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        .ab-resume-btn svg {
          color: #2d7ab8;
          flex-shrink: 0;
        }

        /* ── 3블록 ── */
        .ab-hl-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 64px;
        }
        /* 세로 배치(1024 미만)일 때 블록 가로 폭 제한 — 화면 가득 늘어나지 않게 */
        .ab-hl-grid > .ab-hl-card {
          width: 100%;
          max-width: 400px;
        }

        .ab-hl-card {
          box-sizing: border-box;
          border: 1.5px solid transparent;
          border-radius: 28px;
          --hl-open-pad: 72px; /* 위아래 여백 — 닫힘·펼침 같게 해서 펼칠 때 제목이 안 움직이게 (폰 72) */
          padding: var(--hl-open-pad) 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; /* 닫힘·펼침 모두 내용을 세로 가운데에 — 펼침 높이가 내용보다 크면 남는 공간을 위아래로 나눔 */
          gap: 0;
          text-align: center;
          background: #f3f6fa;
          cursor: pointer;
          transition: min-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease;
        }

        /* 닫힌 블록에 커서를 대면 회색 바탕이 아주 살짝 진해짐 */
        @media (hover: hover) and (pointer: fine) {
          .ab-hl-card:not(.is-open):hover {
            background: #ebeff5;
          }
        }

        /* 펼침: 테두리 파랑 위로 밝은 빛 띠가 반시계 방향으로 한 바퀴씩 도는 쉬머, 무한 반복 */
        @property --ab-border-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes ab-border-spin-ccw {
          from { --ab-border-angle: 360deg; }
          to { --ab-border-angle: 0deg; }
        }
        .ab-hl-card.is-open {
          border-color: transparent;
          background:
            linear-gradient(180deg, #e3eefa 0%, #f3faff 50%, #edf2f8 100%) padding-box,
            conic-gradient(from var(--ab-border-angle), #367eba 0deg, #367eba 300deg, #a8dcff 330deg, #367eba 360deg) border-box;
          animation: ab-border-spin-ccw 3s linear infinite;
        }

        .ab-hl-title {
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.02em;
          line-height: 22px; /* 폰: 제목 2줄 44 + 간격 24 + 화살표 40 = 108 */
          color: #1d2126;
          white-space: pre-line;
          word-break: keep-all;
          margin: 0;
          transition: color 0.2s ease;
        }
        .ab-hl-card.is-open .ab-hl-title,
        .ab-hl-card:hover .ab-hl-title {
          color: #0083f2;
        }

        .ab-hl-reveal {
          display: grid;
          grid-template-rows: 0fr;
          width: 100%;
          transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ab-hl-reveal.is-open {
          grid-template-rows: 1fr;
        }
        .ab-hl-reveal > div {
          overflow: hidden;
        }

        .ab-hl-body {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.7;
          color: var(--color-meta);
          word-break: keep-all;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-top: 20px;
        }

        .ab-hl-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #ffffff;
          color: #8a8f96;
          flex-shrink: 0;
          cursor: pointer;
          margin-top: 24px;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .ab-hl-card:hover .ab-hl-chevron {
          color: #0083f2;
        }
        /* 펼쳐지면 화살표는 숨김 — 카드 자체를 눌러 접음 */
        .ab-hl-chevron.is-open {
          display: none;
        }

        /* ── 하단: 왼쪽 프로필 사진 카드 + 기본 정보 / 오른쪽 Highlight·Skills ── */
        .ab-bottom {
          display: flex;
          flex-direction: column;
          gap: 56px; /* 세로 배치: 기본 정보 ↔ Highlight 사이 */
          margin-top: 160px; /* 세로 배치: 블록 세 개 ↔ 사진 카드 사이 */
          width: 100%;
          max-width: 1224px;
          align-self: center;
        }

        .ab-profile-col {
          display: flex;
          flex-direction: column;
          align-items: center; /* 세로 배치(1100 미만): 사진 카드·기본 정보 가운데 정렬 */
          gap: 40px; /* 사진 카드 ↔ 기본 정보 */
          flex-shrink: 0;
        }

        .ab-photo-card {
          position: relative;
          width: 100%;
          max-width: 396px;
          aspect-ratio: 396 / 560;
          border-radius: 32px;
          overflow: hidden;
          background: linear-gradient(180deg, #f6f8fb 0%, #edf1f6 100%);
          box-shadow: 0 16px 20px -14px rgba(30, 56, 112, 0.14); /* 하단에만 미세한 그림자 */
        }
        /* 사진 이미지가 카드 비율(396:560) 그대로라 카드에 꽉 채움 */
        .ab-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ab-photo-info {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0 12% 40px; /* 사진 아래쪽이 이미 밝게 흐려져 있어 글자 바로 얹음 */
        }

        .ab-name {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--color-fg-dark);
          margin: 0;
        }

        .ab-role {
          font-size: 15px;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: var(--color-meta);
          margin: 10px 0 0;
        }

        .ab-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start; /* 줄끼리는 왼쪽 정렬 */
          align-self: center; /* 세 줄 묶음 전체를 사진 카드 기준 가운데 (모든 화면) */
          gap: 10px; /* 줄 사이 */
        }

        .ab-meta-item {
          display: flex;
          align-items: center;
          gap: 12px; /* 아이콘 ↔ 글자 */
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.015em;
          color: var(--color-meta);
        }
        .ab-meta-item svg { flex-shrink: 0; width: 16px; height: 16px; opacity: 0.95; } /* 아이콘 16, 진하기 95% */
        .ab-meta-item:first-child svg { width: 18px; height: 18px; } /* 위치 아이콘만 2 크게 */

        .ab-info-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
          min-width: 0;
        }

        .ab-info-card {
          border: 1px solid rgba(10, 10, 10, 0.12);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.35);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .ab-section-title {
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.03em;
          color: var(--color-fg-dark);
          margin: 0;
        }

        .ab-awards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ab-award-row {
          font-size: 14px;
          line-height: 1.7;
          word-break: keep-all;
        }

        .ab-award-title {
          font-weight: 500;
          color: var(--color-fg-dark);
          letter-spacing: -0.03em;
        }

        .ab-award-meta {
          font-weight: 500;
          color: var(--color-meta);
          letter-spacing: -0.03em;
          white-space: nowrap;
        }

        .ab-skills {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .ab-skill-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ab-skill-label {
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.03em;
          color: var(--color-fg-dark);
        }

        .ab-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ab-chip {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 50px;
          background: #edf1f7; /* 기본 회색(#eff1f3)에 아주 미세한 파란 기운 */
          font-size: 13px;
          font-weight: 400;
          color: #0083f2; /* 파란 글자 */
          font-family: 'Inter', var(--font-display);
          white-space: nowrap;
        }

        /* ── 태블릿 이상 ── */
        @media (min-width: 640px) {
          .ab-root {
            padding: 120px 72px 160px;
          }
          .ab-headline {
            font-size: 64px;
            margin-bottom: 24px;
          }
          .ab-lead {
            font-size: 20px;
            line-height: 1.9;
          }
          .ab-resume-btn {
            margin-top: 64px;
            padding: 24px 48px;
            gap: 16px;
            font-size: 18px;
          }
          .ab-hl-grid {
            margin-top: 120px;
            gap: 16px;
          }
          .ab-hl-card {
            border-radius: 36px;
            --hl-open-pad: 80px; /* 640~1091 위아래 여백 80 */
            padding: var(--hl-open-pad) 32px;
          }
          .ab-hl-title {
            font-size: 20px;
            line-height: 27px; /* 640~1091: 제목 2줄 54 + 간격 24 + 화살표 40 = 118 */
          }
          .ab-hl-chevron {
            margin-top: 24px;
          }
          .ab-hl-body {
            font-size: 16px;
          }
          .ab-info-card {
            padding: 32px;
            gap: 32px;
          }
          .ab-section-title {
            font-size: 28px;
          }
          .ab-award-row {
            font-size: 16px;
          }
          .ab-skill-label {
            font-size: 16px;
          }
          .ab-chip {
            font-size: 14px;
          }
          .ab-name {
            font-size: 18px;
          }
          .ab-role {
            font-size: 16px;
          }
        }

        /* ── 3블록 가로 배치: 블록 하나가 너무 좁아지지 않는 너비부터 ── */
        /* 블록 하나가 최소 300 확보되는 너비부터 가로 3열 (300×3 + 간격 24×2 + 좌우 여백 72×2 = 1092) */
        @media (min-width: 1092px) {
          .ab-hl-grid {
            flex-direction: row;
            align-items: flex-start;
          }
          .ab-hl-grid {
            gap: 24px;
          }
          .ab-hl-title {
            font-size: clamp(19px, 1.25vw, 24px);
            line-height: 1.5; /* 웹은 기존 줄 간격 유지 */
          }
          .ab-hl-chevron {
            width: 56px;
            height: 56px;
            margin-top: 32px;
          }
          .ab-hl-body {
            padding-top: 40px;
            font-size: 15px; /* 웹(가로 3열) 세부내용 글자 */
          }
          .ab-hl-grid > .ab-hl-card {
            max-width: none;
          }
          .ab-hl-card {
            border-radius: 48px;
            --hl-open-pad: 72px; /* 웹 펼침 위아래 여백 */
            padding: var(--hl-open-pad) 24px; /* 좌우 24 — 블록 최소 300에서도 제목 두 줄 유지 */
            flex: 1 1 0;
            min-width: 0;
            min-height: 320px; /* 닫힘 높이 */
          }
          /* 웹(가로 3열)만 세 블록 펼침 높이를 가장 긴 내용에 맞춰 동일하게. 세로로 쌓이면 각자 내용 높이 */
          .ab-hl-card.is-open {
            min-height: var(--hl-open-h, auto);
          }
        }

        /* ── 하단 2단: 사진 카드(396) + 간격 + 정보 카드 ── */
        @media (min-width: 1100px) {
          .ab-bottom {
            flex-direction: row;
            align-items: flex-start;
            gap: clamp(48px, 7vw, 124px);
            margin-top: 200px;
          }
          .ab-profile-col {
            align-items: stretch; /* 웹 2단: 왼쪽 정렬 그대로 */
            width: 396px;
            gap: 68px; /* 사진 카드 ↔ 기본 정보 */
          }
          .ab-info-col {
            max-width: 704px;
          }
        }
      `}</style>

      <div className="ab-top">
        <h2 className="ab-headline">About me</h2>
        <p className="ab-lead">
          사용성과 구현을 고려한 화면을 설계하며 대기업 시스템을 경험했고, 사이드 프로젝트에서 문제 발견과 검증, 테스트 반복 과정을 통해 효율적인 데이터 기반 의사결정 디자인 과정을 체득했습니다. 나아가 AI 기술을 실험하며, 변화하는 환경에 빠르게 적응하는 프로덕트 디자이너로서 혁신적인 사용자 경험을 만들어가고자 합니다.
        </p>
        <a href="/resume.pdf" download="김재이_이력서.pdf" className="ab-resume-btn">
          <span className="ab-resume-label">이력서 다운로드</span>
          <DownloadIcon />
        </a>
      </div>

      {/* ── 3블록: 경력 하이라이트 (클릭해서 펼치기/접기, 한 번에 하나만) ── */}
      <div
        className="ab-hl-grid"
        ref={hlGridRef}
        style={hlOpenHeight ? ({ "--hl-open-h": `${hlOpenHeight}px` } as CSSProperties) : undefined}
      >
        {HIGHLIGHT_BLOCKS.map((block, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`ab-hl-card${isOpen ? " is-open" : ""}`}
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
            >
              <h3 className="ab-hl-title">{block.title}</h3>
              <div className={`ab-hl-reveal${isOpen ? " is-open" : ""}`}>
                <div>
                  {block.body && (
                    <div className="ab-hl-body">
                      {block.body.map((p, j) => <p key={j} style={{ margin: 0 }}>{p}</p>)}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                className={`ab-hl-chevron${isOpen ? " is-open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(i);
                }}
                aria-hidden={isOpen}
                tabIndex={-1}
              >
                <ChevronDownIcon />
              </button>
            </div>
          );
        })}
      </div>

      <div className="ab-bottom">
        {/* ── 왼쪽: 사진 카드 + 기본 정보 ── */}
        <div className="ab-profile-col">
          <div className="ab-photo-card">
            <img src="/images/profile-photo.png" alt="김재이 프로필 사진" className="ab-photo" />
            <div className="ab-photo-info">
              <h3 className="ab-name">김재이 Jaeiee Kim</h3>
              <p className="ab-role">Product Designer, UX/UI Designer</p>
            </div>
          </div>
          <div className="ab-meta">
            <span className="ab-meta-item"><MapPinIcon />BASED IN SEOUL, INCHEON</span>
            <span className="ab-meta-item"><MailIcon />jaeieekim.ux@gmail.com</span>
            <span className="ab-meta-item"><BookOpenIcon />Duksung Women University</span>
          </div>
        </div>

        {/* ── 오른쪽: Highlight / Skills ── */}
        <div className="ab-info-col">
          <div className="ab-info-card">
            <h3 className="ab-section-title">Highlight</h3>
            <div className="ab-awards">
              {AWARDS.map((a, i) => (
                <div key={i} className="ab-award-row">
                  <span className="ab-award-title">{a.title}</span>{" "}
                  {a.org && <><span className="ab-award-meta">ㆍ&nbsp;{a.org}</span>{" "}</>}
                  <span className="ab-award-meta">ㆍ&nbsp;{a.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-info-card">
            <h3 className="ab-section-title">Skills</h3>
            <div className="ab-skills">
              {Object.entries(SKILLS).map(([category, tools]) => (
                <div key={category} className="ab-skill-group">
                  <span className="ab-skill-label">{category}</span>
                  <div className="ab-chips">
                    {tools.map((t) => (
                      <span key={t} className="ab-chip">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


