import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, PROJECTS } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
      <path d="M15 7h2a5 5 0 1 1 0 10h-2"/>
      <line x1="11" y1="12" x2="13" y2="12"/>
    </svg>
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="pd-root">
      <style>{`
        * { box-sizing: border-box; }

        .pd-root {
          min-height: 100vh;
          background: #ffffff;
          font-family: var(--font-display);
        }

        /* ── 헤더 ── */
        .pd-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(10,10,10,0.08);
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pd-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 400;
          color: var(--color-meta);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pd-back:hover { color: var(--color-fg-dark); }

        .pd-header-idx {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-label);
          letter-spacing: 0.05em;
        }

        /* ── 본문 ── */
        .pd-body {
          padding: 40px 24px 80px;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* ── 프로젝트 헤더 ── */
        .pd-title-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pd-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pd-idx {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-label);
        }

        .pd-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: var(--color-badge-bg);
          font-size: 12px;
          font-weight: 400;
          color: var(--color-label);
        }

        .pd-title {
          font-size: 32px;
          font-weight: 500;
          letter-spacing: -0.04em;
          color: var(--color-fg-dark);
          margin: 0;
          line-height: 1.2;
          word-break: keep-all;
        }

        .pd-period {
          font-size: 13px;
          color: var(--color-label);
        }

        /* ── 설명 ── */
        .pd-summary {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          color: #555555;
          word-break: keep-all;
          margin: 8px 0 0;
        }

        /* ── 풀블리드 블록 스트립 ── */
        .pd-blocks {
          display: flex;
          flex-direction: column;
        }

        .pd-img-block {
          width: 100%;
          background: var(--color-card-thumb);
          display: block;
        }
        .pd-img-block img {
          width: 100%;
          display: block;
        }

        .pd-video-block {
          width: 100%;
          background: #000;
          display: block;
        }
        .pd-video-block video {
          width: 100%;
          display: block;
        }

        .pd-overlay-block {
          position: relative;
          width: 100%;
        }
        .pd-overlay-block img {
          width: 100%;
          display: block;
        }
        .pd-overlay-video {
          position: absolute;
          top: calc(62% + 10px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .pd-overlay-video video {
          width: 100%;
          display: block;
        }

        /* ── 액션 버튼 ── */
        .pd-actions {
          display: flex;
          flex-direction: row;
          gap: 12px;
          flex-wrap: wrap;
        }

        .pd-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 400;
          font-family: var(--font-display);
          cursor: pointer;
          border: 1px solid rgba(10,10,10,0.15);
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .pd-btn-primary {
          background: #0a0a0a;
          color: #ffffff;
        }
        .pd-btn-primary:hover { color: var(--color-accent); }
        .pd-btn-secondary {
          background: var(--color-badge-bg);
          color: #555555;
        }
        .pd-btn-secondary:hover {
          background: #DAE0E6;
          border-color: var(--color-accent);
        }

        @media (min-width: 640px) {
          .pd-header { padding: 0 72px; height: 64px; }

          .pd-body {
            padding: 60px 72px 120px;
            max-width: 1000px;
            gap: 40px;
          }

          .pd-title { font-size: 44px; }
          .pd-summary { font-size: 18px; }
        }
      `}</style>

      {/* 헤더 */}
      <header className="pd-header">
        <Link href="/#project" className="pd-back">
          <ArrowLeftIcon />
          프로젝트 목록
        </Link>
      </header>

      {/* 타이틀 블록 */}
      <div className="pd-body">
        <div className="pd-title-block">
          <div className="pd-meta-row">
            <span className="pd-idx">{project.idx}</span>
            <span className="pd-badge">{project.type}</span>
          </div>
          <h1 className="pd-title">{project.name}</h1>
          <p className="pd-period">{project.period}</p>
          <p className="pd-summary">{project.summary}</p>
        </div>

        {/* 액션 버튼 — 설명 바로 아래 */}
        {(project.projectLink || project.serviceLink) && (
          <div className="pd-actions">
            {project.projectLink && project.projectLink !== "#" && (
              <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn-primary">
                <FolderIcon />
                프로젝트 보기
                <ArrowUpRightIcon />
              </a>
            )}
            {project.serviceLink && (
              <a href={project.serviceLink} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn-secondary">
                <LinkIcon />
                서비스 링크
                <ArrowUpRightIcon />
              </a>
            )}
          </div>
        )}
      </div>

      {/* 풀블리드 블록 스트립 */}
      {project.blocks && project.blocks.length > 0 && (
        <div className="pd-blocks">
          {project.blocks.map((block, i) =>
            block.type === "video" ? (
              <div key={i} className="pd-video-block">
                <video src={block.src} controls muted playsInline />
              </div>
            ) : block.type === "image-video" ? (
              <div key={i} className="pd-overlay-block">
                <img src={block.imageSrc} alt={`${project.name} ${i + 1}`} />
                <div className="pd-overlay-video">
                  <video src={block.videoSrc} autoPlay loop muted playsInline />
                </div>
              </div>
            ) : (
              <div key={i} className="pd-img-block">
                <img src={block.src} alt={`${project.name} ${i + 1}`} />
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}
