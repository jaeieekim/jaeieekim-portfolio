"use client";

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"/>
      <path d="M6 9H2V21H6V9Z"/>
      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
      <path d="M22 6L12 13L2 6"/>
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="40" height="16" viewBox="0 0 40 16" fill="none" aria-hidden="true">
      <path
        d="M2 14L20 2L38 14"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactSection() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

        .ct-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 24px;
          background: #ff4000;
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity 0.2s ease;
        }
        .ct-social-btn:hover {
          opacity: 0.85;
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

        .ct-top-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          align-self: center;
          margin-top: 48px;
          transition: opacity 0.2s ease;
        }
        .ct-top-btn:hover {
          opacity: 0.6;
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
            margin-top: 60px;
          }
        }
      `}</style>

      <div className="ct-content">
        <h2 className="ct-title">Contact</h2>

        <div className="ct-social">
          <a href="https://www.linkedin.com/in/jaeieekim" target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="mailto:jaeieekim.ux@gmail.com" className="ct-social-btn" aria-label="Email">
            <MailIcon />
          </a>
        </div>

        <p className="ct-copyright">
          2026 Jaeiee Kim. All rights reserved. Built with Figma, Claude code and Cursor AI.
        </p>
      </div>

      <button className="ct-top-btn" onClick={scrollToTop} aria-label="맨 위로">
        <ChevronUpIcon />
      </button>
    </section>
  );
}
