interface PageSectionProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  bg?: string;
}

export default function PageSection({ id, title, children, bg }: PageSectionProps) {
  return (
    <section
      id={id}
      style={{
        position: "relative",
        zIndex: 10,
        backgroundColor: bg ?? "var(--color-bg)",
        padding: "10vh 5vw",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 4rem)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          marginBottom: "2rem",
          color: "var(--color-fg)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "var(--font-size-md)",
          lineHeight: "var(--line-height-body)",
          maxWidth: 600,
          color: "var(--color-meta)",
        }}
      >
        {children ?? <p>{title} section content.</p>}
      </div>
    </section>
  );
}
