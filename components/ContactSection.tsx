"use client";

import { useEffect, useState } from "react";

// 아이콘 모양(선 1.5)을 가림막으로 써서, 그 안에 버튼 테두리와 같은 그라데이션을 칠함 → 호버 시 함께 쉬머
const LINKEDIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"/><path d="M6 9H2V21H6V9Z"/><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"/></svg>`;
const MAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/><path d="M22 6L12 13L2 6"/></svg>`;

function GradientIcon({ svg }: { svg: string }) {
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return <span className="ct-icon" aria-hidden="true" style={{ maskImage: url, WebkitMaskImage: url }} />;
}

// 피그마 유리 효과(219:959) 값
const GLASS = {
  width: 80,
  height: 64,
  frost: 6, // 흐림 반경
  refraction: 0.7, // 굴절 70%
  depth: 30, // 가장자리에서 안쪽으로 굴절이 일어나는 두께
  dispersion: 0.2, // 빛 번짐(색 갈라짐) 20%
};

// 알약 모양 가장자리일수록 안쪽 배경을 끌어와 보이게 하는 굴절 지도(빨강=가로, 초록=세로 이동량)
function buildRefractionMap(w: number, h: number, depth: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const r = h / 2;
  // 둥근 사각형까지의 거리(안쪽은 음수)
  const sdf = (x: number, y: number) => {
    const qx = Math.abs(x - w / 2) - (w / 2 - r);
    const qy = Math.abs(y - h / 2) - (h / 2 - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5, py = y + 0.5;
      const d = -sdf(px, py); // 가장자리에서 안쪽으로 들어온 거리
      let dx = 0, dy = 0;
      if (d > 0 && d < depth) {
        const nx = sdf(px + 0.5, py) - sdf(px - 0.5, py);
        const ny = sdf(px, py + 0.5) - sdf(px, py - 0.5);
        const len = Math.hypot(nx, ny) || 1;
        const m = Math.pow(1 - d / depth, 2); // 가장자리에 가까울수록 강하게
        dx = -(nx / len) * m;
        dy = -(ny / len) * m;
      }
      const i = (y * w + x) * 4;
      img.data[i] = Math.round(128 + dx * 127);
      img.data[i + 1] = Math.round(128 + dy * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export default function ContactSection() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // (실험) 맨 위로 버튼을 화면 맨 아래 가운데에 고정 — 메인 화면(아래 가운데 버튼과 겹침)을 절반 넘게 지나면 나타남
  const [topBtnShown, setTopBtnShown] = useState(false);
  // 버튼이 검은 컨택트 영역 위에 있을 때는 화살표를 흰색으로
  const [overContact, setOverContact] = useState(false);
  useEffect(() => {
    const update = () => {
      setTopBtnShown(window.scrollY > window.innerHeight * 0.5);
      const contact = document.getElementById("contact");
      const btnCenterY = window.innerHeight - (window.innerWidth >= 640 ? 32 : 24) - 32; // 아래 여백 + 버튼 높이 절반
      setOverContact(!!contact && contact.getBoundingClientRect().top < btnCenterY);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // 진짜 굴절은 크롬 계열 브라우저만 지원 → 그 외(사파리 등)는 흐림만 적용
  const [refractionMap, setRefractionMap] = useState<string | null>(null);
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands ?? [];
    if (!brands.some((b) => b.brand === "Chromium")) return;
    setRefractionMap(buildRefractionMap(GLASS.width, GLASS.height, GLASS.depth));
  }, []);
  const dispScale = GLASS.refraction * 80; // 가장자리 최대 이동 = 약 28px

  return (
    <section id="contact" className="ct-root">
      <style>{`
        .ct-root {
          width: 100%;
          background: #0a0a0a;
          font-family: var(--font-display);
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px 24px 48px;
          min-height: 400px;
        }

        .ct-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .ct-title {
          font-size: 40px;
          font-weight: 500;
          letter-spacing: -0.05em;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
        }

        .ct-social {
          display: flex;
          flex-direction: row;
          gap: 12px;
        }

        /* 버튼: 흰 바탕 + 파랑→푸른 보라 그라데이션 테두리(1.5)·아이콘.
           호버하면 테두리·아이콘 색이 왼쪽→오른쪽으로 흐르는 쉬머 + 버튼 확대 + 옆 버튼 살짝 밀림 */
        .ct-social {
          --ct-grad: linear-gradient(90deg, #2f7fd1 0%, #6f72ec 30%, #a9d8ff 50%, #6f72ec 70%, #2f7fd1 100%);
        }
        @keyframes ct-shimmer-ltr {
          from { background-position: 100% 50%; }
          to { background-position: 0% 50%; }
        }
        .ct-social-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 24px;
          background: #ffffff;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ct-social-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px; /* 테두리 두께 */
          background: var(--ct-grad);
          background-size: 250% 100%;
          background-position: 100% 50%; /* 평소: 파랑→푸른 보라 구간만 보임 */
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          pointer-events: none;
        }
        .ct-icon {
          display: block;
          width: 24px;
          height: 24px;
          background: var(--ct-grad);
          background-size: 250% 100%;
          background-position: 100% 50%;
          mask-size: 100% 100%;
          -webkit-mask-size: 100% 100%;
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
        }
        .ct-social-btn:hover::before,
        .ct-social-btn:hover .ct-icon {
          animation: ct-shimmer-ltr 1.6s ease-in-out infinite;
        }
        .ct-social-btn:hover {
          transform: scale(1.12);
        }
        /* 옆 버튼은 반대쪽으로 살짝 밀림 */
        .ct-social-btn:hover ~ .ct-social-btn {
          transform: translateX(6px);
        }
        .ct-social-btn:has(~ .ct-social-btn:hover) {
          transform: translateX(-6px);
        }

        .ct-copyright {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: #787878;
          line-height: 1.6;
          margin: 0;
          max-width: 560px;
          word-break: keep-all;
        }

        /* 맨 위로 버튼 — 피그마 background(219:957): 80×64 알약 리퀴드 글래스 + 화살표 32
           (실험) 화면 맨 아래 가운데 고정 */
        .ct-top-btn {
          position: fixed;
          left: 50%;
          bottom: 24px;
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 64px;
          padding: 0;
          border: none;
          border-radius: 1000px;
          /* 피그마 채움 4겹이 섞인 결과를 한 겹으로 환산(뒤 배경 위 반투명 밝은 회색) */
          background: rgba(242, 242, 242, 0.55);
          /* 유리 효과: 흐림 6 (크롬 계열은 아래 .has-refraction 에서 굴절까지) */
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          box-shadow:
            /* 피그마 테두리·그림자 */
            1.25px 0 0 -0.75px #d0d0d0,
            -1.25px 0 0 -0.75px #d0d0d0,
            0 0 0 0.5px #e8e8e8,
            0 8px 15px 0 rgba(0, 0, 0, 0.02),
            /* 피그마 안쪽 그림자: 위아래 가장자리 밝게(더하기 #282828), 위쪽 살짝 어둡게(#e6e6e6 굽기) */
            inset 0 40px 10px -40px rgba(255, 255, 255, 0.16),
            inset 0 -40px 10px -40px rgba(255, 255, 255, 0.16),
            inset 0 40px 30px -40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, 12px);
          transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        }
        .ct-top-btn.has-refraction {
          backdrop-filter: url(#ct-glass-refraction);
        }
        .ct-top-btn.is-shown {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 0);
        }
        /* 빛(피그마 빛 세기 25%, 위에서 비춤): 위쪽 둥근 하이라이트 */
        .ct-top-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(120% 70% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%),
            radial-gradient(90% 50% at 50% 110%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
        }
        .ct-top-btn img {
          position: relative;
          z-index: 1;
          display: block;
          width: 32px;
          height: 32px;
          transition: opacity 0.25s ease;
        }
        /* 화살표 두 장(회색·흰색)을 겹쳐 두고 컨택트 영역 위에서는 흰색으로 */
        .ct-top-btn .ct-arrow-white {
          position: absolute;
          left: 24px;
          top: 16px;
          opacity: 0;
        }
        .ct-top-btn.is-over-dark .ct-arrow-white { opacity: 1; }
        .ct-top-btn.is-over-dark .ct-arrow-gray { opacity: 0; }
        .ct-top-btn.is-shown:hover {
          opacity: 0.7;
        }

        @media (min-width: 640px) {
          .ct-root {
            padding: 90px 72px 48px;
            min-height: 550px;
          }

          .ct-title {
            font-size: 48px;
          }

          .ct-content {
            gap: 48px;
          }

          .ct-copyright {
            font-size: 20px;
            line-height: 1.6;
            max-width: none;
            white-space: nowrap;
          }

          .ct-top-btn {
            bottom: 32px;
          }
        }
      `}</style>

      <div className="ct-content">
        <h2 className="ct-title">Contact</h2>

        <div className="ct-social">
          <a href="https://www.linkedin.com/in/jaeieekim" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="LinkedIn">
            <GradientIcon svg={LINKEDIN_SVG} />
          </a>
          <a href="mailto:jaeieekim.ux@gmail.com" className="ct-social-btn" aria-label="Email">
            <GradientIcon svg={MAIL_SVG} />
          </a>
        </div>

        <p className="ct-copyright">
          2026 Jaeiee Kim. All rights reserved. Built with Figma, Claude code and Cursor AI.
        </p>
      </div>

      {refractionMap && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="ct-glass-refraction" x="0" y="0" width={GLASS.width} height={GLASS.height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={GLASS.frost / 2} result="frost" />
            <feImage href={refractionMap} x="0" y="0" width={GLASS.width} height={GLASS.height} preserveAspectRatio="none" result="map" />
            {/* 빛 번짐: 빨강·초록·파랑을 조금씩 다르게 굴절시켜 가장자리에 색이 살짝 갈라지게 */}
            <feDisplacementMap in="frost" in2="map" scale={dispScale * (1 + GLASS.dispersion / 2)} xChannelSelector="R" yChannelSelector="G" result="dr" />
            <feDisplacementMap in="frost" in2="map" scale={dispScale} xChannelSelector="R" yChannelSelector="G" result="dg" />
            <feDisplacementMap in="frost" in2="map" scale={dispScale * (1 - GLASS.dispersion / 2)} xChannelSelector="R" yChannelSelector="G" result="db" />
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feComposite in="r" in2="g" operator="arithmetic" k2="1" k3="1" result="rg" />
            <feComposite in="rg" in2="b" operator="arithmetic" k2="1" k3="1" />
          </filter>
        </svg>
      )}
      <button className={`ct-top-btn${topBtnShown ? " is-shown" : ""}${refractionMap ? " has-refraction" : ""}${overContact ? " is-over-dark" : ""}`} onClick={scrollToTop} aria-label="맨 위로" tabIndex={topBtnShown ? 0 : -1}>
        <img className="ct-arrow-gray" src="/icons/chevron-up-32.svg" alt="" width={32} height={32} />
        <img className="ct-arrow-white" src="/icons/chevron-up-32-white.svg" alt="" width={32} height={32} />
      </button>
    </section>
  );
}
