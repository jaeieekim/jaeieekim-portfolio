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
  AI: ["Claude code", "Cursor", "Open AI", "Lovable", "Gemini"],
  Document: ["Powerpoint", "Ms Excel", "Spreadsheet", "Notion"],
};

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="ab-root">
      <style>{`
        .ab-root {
          width: 100%;
          background: #ffffff;
          font-family: var(--font-display);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        /* ── 모바일 (스택) ── */
        .ab-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-label);
          font-family: 'Inter', var(--font-display);
          padding: 36px 24px 40px;
        }

        .ab-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* ── 오른쪽 (프로필 + 정보) ── */
        .ab-right {
          padding: 28px 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ab-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .ab-photo {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          background: var(--color-card-thumb);
        }

        .ab-name {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.05em;
          color: var(--color-fg-dark);
          margin: 0;
        }

        .ab-role {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: -0.05em;
          color: var(--color-meta);
          margin: 4px 0 0;
        }

        .ab-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
        }

        .ab-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.015em;
          color: var(--color-meta);
        }

        /* ── 왼쪽 (인트로 + 버튼) ── */
        .ab-left {
          padding: 0 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .ab-intro {
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.05em;
          line-height: 1.75;
          color: var(--color-fg-dark);
          margin: 0;
          word-break: keep-all;
        }

        .ab-download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 56px;
          border-radius: 100px;
          border: 1px solid var(--color-accent);
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          color: var(--color-fg-dark);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.015px;
          font-family: var(--font-display);
          transition: background 0.2s ease;
          white-space: nowrap;
          width: 100%;
          max-width: 373px;
          box-sizing: border-box;
        }
        .ab-download-btn:hover {
          background: rgba(255, 64, 0, 0.05);
        }
        .ab-download-inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Highlight 카드 ── */
        .ab-highlight-card {
          border: 1px solid rgba(10, 10, 10, 0.15);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ab-section-title {
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.05em;
          color: var(--color-fg-dark);
          margin: 0 0 4px;
        }

        .ab-award-row {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 2px 0;
          font-size: 13px;
          line-height: 1.7;
          word-break: keep-all;
        }

        .ab-award-title {
          font-weight: 500;
          color: var(--color-fg-dark);
          letter-spacing: -0.03em;
          margin-right: 4px;
        }

        .ab-award-meta {
          font-weight: 500;
          color: var(--color-meta);
          letter-spacing: -0.03em;
          white-space: nowrap;
        }

        /* ── Skills ── */
        .ab-skills {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ab-skill-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ab-skill-label {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.03em;
          color: var(--color-fg-dark);
        }

        .ab-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .ab-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 50px;
          background: var(--color-badge-bg);
          font-size: 13px;
          font-weight: 400;
          color: var(--color-meta);
          font-family: 'Inter', var(--font-display);
          white-space: nowrap;
        }

        /* ── 데스크톱 (2단) ── */
        @media (min-width: 640px) {
          .ab-label {
            padding: 36px 72px 0;
          }

          .ab-body {
            flex-direction: row;
            height: calc(100vh - 85px);
          }

          .ab-left {
            width: 50%;
            flex-shrink: 0;
            padding: 48px 80px 80px 72px;
            justify-content: flex-start;
            gap: 32px;
          }

          .ab-intro {
            font-size: 24px;
            line-height: 1.8;
          }

          .ab-right {
            width: 50%;
            flex-shrink: 0;
            padding: 48px 72px 80px 89px;
            overflow-y: auto;
            gap: 32px;
          }

          .ab-photo {
            width: 140px;
            height: 130px;
            border-radius: 4px;
          }

          .ab-name {
            font-size: 20px;
          }

          .ab-role {
            font-size: 20px;
          }

          .ab-meta {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px 24px;
            margin-top: 0;
          }

          .ab-section-title {
            font-size: 20px;
          }

          .ab-award-row {
            font-size: 15px;
            line-height: 1.8;
          }

          .ab-skill-label {
            font-size: 15px;
          }

          .ab-download-btn {
            font-size: 17px;
            max-width: 480px;
            width: auto;
            align-self: flex-start;
            gap: 24px;
          }
          .ab-download-btn svg:last-child {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
          }
        }
      `}</style>

      <span className="ab-label">03F. ABOUT ME</span>

      <div className="ab-body">
        {/* ── 왼쪽: 인트로 + 다운로드 ── */}
        <div className="ab-left">
          <p className="ab-intro">
            사용성과 구현을 고려한 화면 구조를 기획하며 대기업 시스템을 경험했고, 사이드 프로젝트에서 문제 발견과 검증, 테스트 반복 과정을 통해 효율적인 데이터 기반 의사결정 디자인 과정을 체득했습니다. 나아가 AI 기술을 실험하며, 변화하는 환경에 빠르게 적응하는 프로덕트 디자이너로서 혁신적인 사용자 경험을 만들어가고자 합니다.
          </p>
          <a href="/resume.pdf" download="김재이_이력서.pdf" className="ab-download-btn">
            <span className="ab-download-inner">
              <FileTextIcon />
              Resume download
            </span>
            <DownloadIcon />
          </a>
        </div>

        {/* ── 오른쪽: 프로필 + 정보 ── */}
        <div className="ab-right">
          {/* 프로필 */}
          <div className="ab-profile">
            <img src="/images/profile.png" alt="김재이 프로필" className="ab-photo" />
            <div>
              <h2 className="ab-name">김재이 Jaeiee Kim</h2>
              <p className="ab-role">Product Designer, UX/UI Designer</p>
            </div>
            <div className="ab-meta">
              <span className="ab-meta-item"><MapPinIcon />BASED IN SEOUL, INCHEON</span>
              <span className="ab-meta-item"><MailIcon />jaeieekim.ux@gmail.com</span>
              <span className="ab-meta-item"><BookOpenIcon />Duksung Women University</span>
            </div>
          </div>

          {/* Highlight 카드 */}
          <div className="ab-highlight-card">
            <h3 className="ab-section-title">Highlight</h3>
            {AWARDS.map((a, i) => (
              <div key={i} className="ab-award-row">
                <span className="ab-award-title">{a.title}</span>
                {a.org && <span className="ab-award-meta">&nbsp;ㆍ&nbsp;{a.org}</span>}
                <span className="ab-award-meta">&nbsp;ㆍ&nbsp;{a.date}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="ab-highlight-card">
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
