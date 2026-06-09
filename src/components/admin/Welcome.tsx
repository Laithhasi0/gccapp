/**
 * Custom panel shown at the top of the Payload admin dashboard.
 * Gives the client a friendly overview + quick links to everything editable.
 */
const sections: { title: string; desc: string; href: string }[] = [
  { title: "Site Settings", desc: "Logo, contact, socials & footer", href: "/admin/globals/site-settings" },
  { title: "Home Hero", desc: "Headline, buttons, background & stats", href: "/admin/globals/home-hero" },
  { title: "What we do", desc: "Capability panels & images", href: "/admin/globals/home-capabilities" },
  { title: "Process", desc: "The 'how we work' steps", href: "/admin/globals/home-process" },
  { title: "Appearance", desc: "Theme, accent colour & background", href: "/admin/globals/appearance" },
  { title: "Services", desc: "Your services, text & images", href: "/admin/collections/services" },
  { title: "Portfolio", desc: "Projects, covers & details", href: "/admin/collections/projects" },
  { title: "Case Studies", desc: "Results, metrics & stories", href: "/admin/collections/case-studies" },
  { title: "FAQ", desc: "Questions & answers", href: "/admin/collections/faqs" },
  { title: "Careers", desc: "Open roles", href: "/admin/collections/careers" },
  { title: "Team", desc: "People, photos & roles", href: "/admin/collections/team" },
  { title: "Media", desc: "Upload and manage images", href: "/admin/collections/media" },
];

export function Welcome() {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          padding: "1.5rem 1.75rem",
          borderRadius: 12,
          border: "1px solid var(--theme-elevation-150)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, #25c9e2 14%, var(--theme-elevation-50)), var(--theme-elevation-50))",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Welcome to your GCC App CMS 👋</h2>
        <p style={{ margin: "0.5rem 0 0", maxWidth: 640, color: "var(--theme-elevation-650)" }}>
          Everything on your website is editable here — text, images, contact details,
          colours and more. Pick a section below to get started. Changes appear on the
          live site automatically.
        </p>
      </div>

      <div
        style={{
          marginTop: "1.25rem",
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {sections.map((s) => (
          <a
            key={s.href}
            href={s.href}
            style={{
              display: "block",
              padding: "1rem 1.1rem",
              borderRadius: 10,
              border: "1px solid var(--theme-elevation-150)",
              background: "var(--theme-elevation-0)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600 }}>{s.title}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--theme-elevation-500)", marginTop: 2 }}>
              {s.desc}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
