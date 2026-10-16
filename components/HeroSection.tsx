"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const NAV_ITEMS = [
  { id: "main", label: "Main" },
  { id: "project", label: "Project" },
  { id: "about", label: "About me" },
  { id: "contact", label: "Contact" },
];

// Tunable knobs for the three hero background layers (gradient+blobs,
// center ripples, cursor bubbles). Change values here, not in the CSS/JS below.
const BG_CONFIG = {
  blob: {
    count: 3,
    durationMinS: 20,
    durationMaxS: 30,
    blurPx: 90,
    opacity: 0.3, // kept low — at 0.8 the blob's white wash was flattening the ripples' contrast
  },
  ripple: {
    maxConcurrent: 4,
    durationS: 7, // within the 6-8s spec range
    staggerS: 1.75, // within the 1.5-2s spec range; staggerS * maxConcurrent ≈ durationS keeps exactly `maxConcurrent` rings visible at once
    edgeColor: "30, 56, 112", // navy tint
    opacityMin: 0.14,
    opacityMax: 0.34, // calibrated against the live pastel gradient — the spec's literal 4-8% was invisible in practice once blurred
    glowOpacity: 0.06, // faint navy wash just inside each ring
    borderWidthPx: 2,
    blurPx: 2, // heavier blur (the original 8px) diluted the already-faint ring to nothing
    maxScale: 3.4,
    baseSizePx: "clamp(180px, 30vmin, 320px)",
  },
  // Cursor push: only the part of a ring near the pointer bends outward,
  // like a finger pressing the water surface. Nothing else moves.
  interact: {
    radiusPx: 140, // push area radius around the pointer
    strengthPx: 26, // max displacement of the ring at the push peak
    followEase: 0.18, // how quickly the push spot tracks the pointer
    fadeEase: 0.08, // how quickly the push appears / releases
  },
  bubble: {
    maxConcurrent: 8,
    mobileMax: 2,
    sizeMinPx: 40,
    sizeMaxPx: 70,
    growMin: 1.5,
    growMax: 2,
    durationMinMs: 600,
    durationMaxMs: 1000,
    spawnThrottleMs: 90,
    borderOpacity: 0.48, // 커서 파동 흰 테두리 진하기
    fillOpacity: 0.28,
  },
};

type Bubble = { id: number; x: number; y: number; size: number; grow: number; duration: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

let bubbleIdSeq = 0;

export default function HeroSection() {
  const [active, setActive] = useState("main");
  const [mounted, setMounted] = useState(false);
  const [projectInView, setProjectInView] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastSpawnRef = useRef(0);
  const rippleLayerRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const pushImgRef = useRef<SVGFEImageElement>(null);

  useEffect(() => setMounted(true), []);

  // 프로젝트 섹션이 화면 맨 위 띠(상단 메뉴가 놓이는 자리, 위에서 96px)를 덮고 있는 동안에만
  // 상단 메뉴를 숨김 → 그 구간에서는 카테고리 칩바가 상단 고정 메뉴 역할을 하고, 둘이 동시에 보이지 않음
  useEffect(() => {
    const el = document.getElementById("project");
    if (!el) return;
    const NAV_BAND_PX = 96;
    let observer: IntersectionObserver | null = null;
    const setup = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => setProjectInView(entry.isIntersecting),
        { rootMargin: `0px 0px -${Math.max(window.innerHeight - NAV_BAND_PX, 0)}px 0px`, threshold: 0 }
      );
      observer.observe(el);
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.3, 0.5, 0.7] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const btn = nav.querySelector<HTMLButtonElement>(`[data-nav="${active}"]`);
    if (!btn) return;
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.left = `${btn.offsetLeft}px`;
  }, [active, mounted]);

  useEffect(() => {
    const spawnBubble = (x: number, y: number, max: number) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < BG_CONFIG.bubble.spawnThrottleMs) return;
      lastSpawnRef.current = now;
      setBubbles((prev) => {
        if (prev.length >= max) return prev;
        const bubble: Bubble = {
          id: bubbleIdSeq++,
          x,
          y,
          size: rand(BG_CONFIG.bubble.sizeMinPx, BG_CONFIG.bubble.sizeMaxPx),
          grow: rand(BG_CONFIG.bubble.growMin, BG_CONFIG.bubble.growMax),
          duration: rand(BG_CONFIG.bubble.durationMinMs, BG_CONFIG.bubble.durationMaxMs),
        };
        return [...prev, bubble];
      });
    };

    // Viewport-relative (not hs-root-relative): the bubble layer is portaled
    // to document.body as position:fixed so this trail works across the
    // whole site, not just while scrolled to the Hero section.
    const onMouseMove = (e: MouseEvent) => {
      spawnBubble(e.clientX, e.clientY, BG_CONFIG.bubble.maxConcurrent);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      spawnBubble(t.clientX, t.clientY, BG_CONFIG.bubble.mobileMax);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // Push map: neutral gray (no displacement) everywhere except a radial
  // bump that bends whatever sits near its center outward. Built once.
  const [pushMap, setPushMap] = useState<string | null>(null);
  useEffect(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(size, size);
    const half = size / 2;
    const peak = (1 / 3) * (2 / 3) ** 2; // max of t(1-t)^2
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = half - (x + 0.5);
        const dy = half - (y + 0.5);
        const d = Math.hypot(dx, dy);
        const t = Math.min(d / half, 1);
        const f = t >= 1 || d === 0 ? 0 : (t * (1 - t) ** 2) / peak;
        // Sampling toward the center = content pushed away from the pointer
        const i = (y * size + x) * 4;
        img.data[i] = Math.round(128 + 127 * f * (dx / (d || 1)));
        img.data[i + 1] = Math.round(128 + 127 * f * (dy / (d || 1)));
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    setPushMap(c.toDataURL());
  }, []);

  useEffect(() => {
    if (!pushMap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cfg = BG_CONFIG.interact;
    let raf = 0;
    let filterOn = false;
    let inside = false;
    let tx = 0, ty = 0, cx = 0, cy = 0, amt = 0;

    const onPointer = (clientX: number, clientY: number) => {
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      const wasInside = inside;
      inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      tx = clientX - r.left;
      ty = clientY - r.top;
      if (inside && !wasInside && amt < 0.05) { cx = tx; cy = ty; }
    };

    const tick = () => {
      cx += (tx - cx) * cfg.followEase;
      cy += (ty - cy) * cfg.followEase;
      amt += ((inside ? 1 : 0) - amt) * cfg.fadeEase;
      const layer = rippleLayerRef.current;
      if (layer) {
        // Only keep the (costly) SVG filter attached while something is pushed
        const want = amt > 0.01;
        if (want !== filterOn) {
          filterOn = want;
          layer.style.filter = want ? "url(#hs-water-push)" : "none";
        }
      }
      const img = pushImgRef.current;
      if (img && filterOn) {
        img.setAttribute("x", (cx - cfg.radiusPx).toFixed(1));
        img.setAttribute("y", (cy - cfg.radiusPx).toFixed(1));
        dispRef.current?.setAttribute("scale", (cfg.strengthPx * 2 * amt).toFixed(2));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onLeave = () => { inside = false; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, [pushMap]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hs-root" ref={rootRef}>
      <style>{`
        .hs-root {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        /* ── Layer 1: base gradient + drifting frosted blobs ── */
        .hs-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #D6EEF5 0%, #F4F7FB 100%);
        }
        .hs-blob {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%);
          filter: blur(${BG_CONFIG.blob.blurPx}px);
          opacity: ${BG_CONFIG.blob.opacity};
          animation-name: hs-blob-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes hs-blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -6%) scale(1.08); }
          66% { transform: translate(-5%, 4%) scale(0.95); }
        }

        /* ── Layer 2: center water ripples ── */
        .hs-ripple-layer {
          position: absolute;
          inset: 0;
          will-change: transform;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .hs-ripple {
          position: absolute;
          width: ${BG_CONFIG.ripple.baseSizePx};
          height: ${BG_CONFIG.ripple.baseSizePx};
          border-radius: 50%;
          border: ${BG_CONFIG.ripple.borderWidthPx}px solid rgba(${BG_CONFIG.ripple.edgeColor}, ${BG_CONFIG.ripple.opacityMax});
          background: radial-gradient(circle, rgba(${BG_CONFIG.ripple.edgeColor}, 0) 55%, rgba(${BG_CONFIG.ripple.edgeColor}, ${BG_CONFIG.ripple.glowOpacity}) 100%);
          filter: blur(${BG_CONFIG.ripple.blurPx}px);
          animation-name: hs-ripple-expand;
          animation-duration: ${BG_CONFIG.ripple.durationS}s;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes hs-ripple-expand {
          0% { transform: scale(0.3, 0.3) rotate(0deg); opacity: ${BG_CONFIG.ripple.opacityMax}; }
          50% { transform: scale(1.4, 1.46) rotate(-1.5deg); opacity: ${BG_CONFIG.ripple.opacityMin}; }
          100% { transform: scale(${BG_CONFIG.ripple.maxScale}, ${BG_CONFIG.ripple.maxScale - 0.06}) rotate(1deg); opacity: 0; }
        }

        /* ── Layer 3: cursor glass bubbles ──
           Fixed + portaled to document.body (not inside hs-root) so the
           trail follows the cursor across the whole site, not just the
           Hero section's bounds. */
        .hs-bubble-layer {
          position: fixed;
          inset: 0;
          z-index: 900;
          pointer-events: none;
        }
        .hs-bubble {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, ${BG_CONFIG.bubble.borderOpacity});
          background: rgba(255, 255, 255, ${BG_CONFIG.bubble.fillOpacity});
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          transform: translate(-50%, -50%) scale(1);
          animation-name: hs-bubble-grow;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
          pointer-events: none;
        }
        @keyframes hs-bubble-grow {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(var(--hs-bubble-grow)); }
        }

        .hs-nav-wrap {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hs-nav-wrap--hidden {
          transform: translateX(-50%) translateY(-140%);
          opacity: 0;
          pointer-events: none;
        }
        .hs-nav {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          height: 48px;
          padding: 0 6px;
          border-radius: var(--glass-radius-pill);
          background: var(--glass-bg-strong);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.04);
        }
        .hs-nav-pill {
          position: absolute;
          top: 6px;
          height: 36px;
          border-radius: var(--glass-radius-pill);
          background: rgba(0, 0, 0, 0.06);
          transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hs-nav-btn {
          position: relative;
          z-index: 1;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0 16px;
          height: 36px;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 13px;
          letter-spacing: -0.02em;
          color: #1b1b1b;
          white-space: nowrap;
        }

        .hs-status {
          position: absolute;
          top: 88px; /* 4px 아래로 */
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px 8px;
          z-index: 1;
          font-family: var(--font-display);
          font-size: 11px;
          letter-spacing: 0.15px;
          color: var(--color-meta);
          text-align: center;
        }
        /* 위치 아이콘과 BASED IN SEOUL 사이: 기본 간격 8에서 4 더 가깝게 = 4 */
        .hs-status > svg {
          margin-right: -4px;
        }
        /* 파란 점: 부드럽게 두 번 깜빡이고(0.8초) 1.5초 켜진 채로 쉬었다 반복 — 한 마디 2.3초 */
        @keyframes hs-dot-blink {
          0%     { opacity: 1; }
          8.7%   { opacity: 0.1; }  /* 0.2초 */
          17.4%  { opacity: 1; }    /* 0.4초 */
          26.1%  { opacity: 0.1; }  /* 0.6초 */
          34.8%  { opacity: 1; }    /* 0.8초 */
          100%   { opacity: 1; }    /* 1.5초 쉼 */
        }
        .hs-status-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #0f9bea;
          flex-shrink: 0;
          margin-left: 16px; /* BASED IN SEOUL과 (점 + CURRENTLY OPEN TO WORK) 사이 24 = 기본 간격 8 + 16 */
          animation: hs-dot-blink 2.3s ease-in-out infinite;
        }

        @media (min-width: 640px) {
          .hs-nav-wrap { top: 32px; }
          .hs-status {
            top: 100px;
            font-size: 11px;
          }
        }

        @media (min-width: 1280px) {
          .hs-status {
            top: 44px;
            left: auto;
            right: 72px;
            transform: none;
            width: auto;
            flex-wrap: nowrap;
          }
        }
      `}</style>

      <div className="hs-bg-gradient" />

      {Array.from({ length: BG_CONFIG.blob.count }).map((_, i) => {
        const duration = BG_CONFIG.blob.durationMinS + (i / Math.max(BG_CONFIG.blob.count - 1, 1)) * (BG_CONFIG.blob.durationMaxS - BG_CONFIG.blob.durationMinS);
        const positions = [
          { left: "6%", top: "4%", size: "46vmax" },
          { left: "52%", top: "18%", size: "38vmax" },
          { left: "14%", top: "52%", size: "42vmax" },
        ];
        const pos = positions[i % positions.length];
        return (
          <div
            key={i}
            className="hs-blob"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.size,
              height: pos.size,
              animationDuration: `${duration}s`,
              // negative delay starts each blob mid-cycle so they never drift in sync
              animationDelay: `-${(duration / BG_CONFIG.blob.count) * i}s`,
            }}
          />
        );
      })}

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter
          id="hs-water-push"
          x="0" y="0" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodColor="rgb(128,128,128)" result="neutral" />
          {pushMap && (
            <feImage
              ref={pushImgRef}
              href={pushMap}
              x="0" y="0"
              width={BG_CONFIG.interact.radiusPx * 2}
              height={BG_CONFIG.interact.radiusPx * 2}
              preserveAspectRatio="none"
              result="bump"
            />
          )}
          <feComposite in="bump" in2="neutral" operator="over" result="map" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="hs-ripple-layer" ref={rippleLayerRef}>
        {Array.from({ length: BG_CONFIG.ripple.maxConcurrent }).map((_, i) => (
          <div
            key={i}
            className="hs-ripple"
            style={{ animationDelay: `-${i * BG_CONFIG.ripple.staggerS}s` }}
          />
        ))}
      </div>

      {mounted &&
        createPortal(
          <div className="hs-bubble-layer">
            {bubbles.map((b) => (
              <div
                key={b.id}
                className="hs-bubble"
                style={{
                  left: b.x,
                  top: b.y,
                  width: b.size,
                  height: b.size,
                  animationDuration: `${b.duration}ms`,
                  ["--hs-bubble-grow" as string]: b.grow,
                }}
                onAnimationEnd={() => setBubbles((prev) => prev.filter((x) => x.id !== b.id))}
              />
            ))}
          </div>,
          document.body
        )}

      {mounted &&
        createPortal(
          <div className={`hs-nav-wrap${projectInView ? " hs-nav-wrap--hidden" : ""}`}>
            <div className="hs-nav" ref={navRef}>
              <div className="hs-nav-pill" ref={pillRef} />
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  data-nav={item.id}
                  className="hs-nav-btn"
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}

      <div className="hs-status">
        <MapPinIcon />
        <span>BASED IN SEOUL</span>
        <span className="hs-status-dot" />
        <span>CURRENTLY OPEN TO WORK</span>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-meta)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
