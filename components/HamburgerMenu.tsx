"use client";
import { useState, useEffect } from "react";

const NAV = [
  { label: "01F. MAIN",     href: "#main"    },
  { label: "02F. PROJECT",  href: "#project" },
  { label: "03F. ABOUT ME", href: "#about"   },
  { label: "04F. CONTACT",  href: "#contact" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // #main 섹션이 화면을 벗어나면 햄버거 표시
  useEffect(() => {
    const mainEl = document.getElementById("main");
    if (!mainEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(mainEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 320);
  };

  return (
    <>
      <style>{`
        /* ── Toggle button ── */
        .hm-btn {
          position: fixed;
          top: 28px;
          right: 24px;
          z-index: 200;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .hm-btn.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .hm-line {
          height: 2px;
          background: var(--color-fg);
          display: block;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
          transform-origin: center center;
          width: 22px;
        }

        .hm-btn.open .hm-l1 {
          transform: translateY(8px) rotate(-45deg);
        }
        .hm-btn.open .hm-l2 {
          opacity: 0;
        }
        .hm-btn.open .hm-l3 {
          transform: translateY(-8px) rotate(45deg);
        }

        @media (min-width: 640px) {
          .hm-btn { top: 36px; right: 72px; }
        }

        /* ── Full-screen overlay ── */
        .hm-overlay {
          position: fixed;
          inset: 0;
          background: var(--color-bg);
          z-index: 150;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 clamp(24px, 5vw, 72px);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .hm-overlay.open {
          opacity: 1;
          pointer-events: all;
          transform: translateY(0);
        }

        /* ── Nav items ── */
        .hm-nav {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hm-nav-item {
          font-family: var(--font-display);
          font-size: clamp(28px, 4.5vw, 52px);
          font-weight: 500;
          letter-spacing: -0.04em;
          color: var(--color-meta);
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          padding: 20px 0;
          text-align: left;
          transition: color 0.2s ease;
          width: 100%;
        }
        .hm-nav-item:first-child {
          border-top: 1px solid var(--color-border);
        }
        .hm-nav-item:hover {
          color: var(--color-accent);
        }
      `}</style>

      {/* Hamburger toggle */}
      <button
        className={`hm-btn${open ? " open" : ""}${visible ? " visible" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
      >
        <span className="hm-line hm-l1" />
        <span className="hm-line hm-l2" />
        <span className="hm-line hm-l3" />
      </button>

      {/* Overlay */}
      <div className={`hm-overlay${open ? " open" : ""}`} aria-hidden={!open}>
        <nav className="hm-nav">
          {NAV.map((item) => (
            <button
              key={item.href}
              className="hm-nav-item"
              onClick={() => handleNav(item.href)}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
