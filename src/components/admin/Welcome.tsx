/**
 * Control Center — the redesigned landing panel at the top of the Payload admin.
 * Gives the client a friendly, visual home base: edit any part of the website,
 * add or remove items, manage media and brand, and jump straight into the live
 * click-to-edit experience. Rendered via `admin.components.beforeDashboard`.
 */

import Link from "next/link";
import { SeedButton } from "./SeedButton";

const ACCENT = "#25c9e2";

type Card = {
  icon: string;
  title: string;
  desc: string;
  edit: string; // primary "Edit / Manage" link
  add?: string; // optional "+ Add new" link
  view?: string; // optional "Preview" link (live site)
};

type Group = { heading: string; blurb: string; cards: Card[] };

const groups: Group[] = [
  {
    heading: "🎨 Edit your website",
    blurb: "Everything is edited visually: pick a page, click any text or image, and type. Drag sections to reorder, add new sections, hide or delete them — separately in Arabic and English.",
    cards: [
      { icon: "🎨", title: "Visual Editor", desc: "Edit every page like a website builder: click anything to edit it, in Arabic & English, add / move / hide / remove sections.", edit: "/editor", view: "/" },
    ],
  },
  {
    heading: "📚 Content library",
    blurb: "Add, edit or remove items. Each one has its own images, text and details — and appears on the site instantly.",
    cards: [
      { icon: "💼", title: "Portfolio", desc: "Projects, covers, galleries & details", edit: "/admin/collections/projects", add: "/admin/collections/projects/create" },
      { icon: "🛠️", title: "Services", desc: "Your services, text & images", edit: "/admin/collections/services", add: "/admin/collections/services/create" },
      { icon: "📈", title: "Case Studies", desc: "Results, metrics & stories", edit: "/admin/collections/case-studies", add: "/admin/collections/case-studies/create" },
      { icon: "👥", title: "Team", desc: "People, photos & roles", edit: "/admin/collections/team", add: "/admin/collections/team/create" },
      { icon: "❓", title: "FAQ", desc: "Questions & answers", edit: "/admin/collections/faqs", add: "/admin/collections/faqs/create" },
      { icon: "💬", title: "Careers", desc: "Open roles & descriptions", edit: "/admin/collections/careers", add: "/admin/collections/careers/create" },
    ],
  },
  {
    heading: "🎨 Brand & settings",
    blurb: "Control the look of the whole site and your business details in one place.",
    cards: [
      { icon: "🌈", title: "Appearance", desc: "Theme, accent colour & background", edit: "/admin/globals/appearance", view: "/?edit=1" },
      { icon: "⚙️", title: "Site Settings", desc: "Logo, contact, socials & footer", edit: "/admin/globals/site-settings" },
      { icon: "🖼️", title: "Media library", desc: "Upload and manage all images", edit: "/admin/collections/media", add: "/admin/collections/media/create" },
    ],
  },
];

const btn = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0.45rem 0.85rem",
  borderRadius: 8,
  fontSize: "0.8rem",
  fontWeight: 600,
  textDecoration: "none",
  background: bg,
  color,
  border: "1px solid transparent",
  lineHeight: 1,
});

export function Welcome() {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      {/* Hero bar */}
      <div
        style={{
          padding: "1.75rem 2rem",
          borderRadius: 16,
          border: "1px solid var(--theme-elevation-150)",
          background: `linear-gradient(135deg, color-mix(in srgb, ${ACCENT} 22%, var(--theme-elevation-50)), var(--theme-elevation-50) 70%)`,
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em", color: ACCENT, textTransform: "uppercase" }}>
            GCC App · Control Center
          </div>
          <h2 style={{ margin: "0.4rem 0 0", fontSize: "1.6rem" }}>Manage your entire website 👋</h2>
          <p style={{ margin: "0.5rem 0 0", color: "var(--theme-elevation-650)", lineHeight: 1.5 }}>
            Every word, image, colour and section is editable. Open the <strong>Visual
            Editor</strong> to edit the home page exactly like a website builder: click any text
            and type, drag sections around, add or remove sections. Changes appear on the real
            site automatically.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Link href="/editor" style={{ ...btn(ACCENT, "#06222a"), padding: "0.7rem 1.1rem", fontSize: "0.9rem" }}>
            🎨 Open Visual Editor
          </Link>
          <a href="/" target="_blank" rel="noreferrer" style={{ ...btn("var(--theme-elevation-0)", "var(--theme-text)"), border: "1px solid var(--theme-elevation-150)", padding: "0.7rem 1.1rem", fontSize: "0.9rem" }}>
            👁️ View website
          </a>
        </div>
      </div>

      {/* Import website content */}
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem 1.25rem",
          borderRadius: 12,
          border: "1px dashed var(--theme-elevation-200)",
          background: "var(--theme-elevation-0)",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontWeight: 650, fontSize: "0.95rem" }}>🗂️ See all your website content here</div>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "var(--theme-elevation-500)", lineHeight: 1.5 }}>
            If your projects, services, FAQ or team look empty in this dashboard, click Import:
            it copies everything currently shown on the website (Arabic + English + images) into
            the dashboard so you can edit it. Collections that already have content are skipped.
          </p>
        </div>
        <SeedButton />
      </div>

      {/* Groups */}
      {groups.map((group) => (
        <div key={group.heading} style={{ marginTop: "2rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{group.heading}</h3>
          <p style={{ margin: "0.25rem 0 1rem", fontSize: "0.85rem", color: "var(--theme-elevation-500)", maxWidth: 720 }}>
            {group.blurb}
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.85rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
          >
            {group.cards.map((c) => (
              <div
                key={c.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1.1rem 1.15rem",
                  borderRadius: 12,
                  border: "1px solid var(--theme-elevation-150)",
                  background: "var(--theme-elevation-0)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      fontSize: "1.05rem",
                      background: `color-mix(in srgb, ${ACCENT} 16%, transparent)`,
                    }}
                  >
                    {c.icon}
                  </span>
                  <div style={{ fontWeight: 650, fontSize: "0.98rem" }}>{c.title}</div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--theme-elevation-500)", margin: "0.55rem 0 0.9rem", flex: 1 }}>
                  {c.desc}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <a href={c.edit} style={btn(ACCENT, "#06222a")}>{c.add ? "Manage" : "Edit"}</a>
                  {c.add && (
                    <a href={c.add} style={{ ...btn("transparent", ACCENT), border: `1px solid color-mix(in srgb, ${ACCENT} 45%, transparent)` }}>＋ Add new</a>
                  )}
                  {c.view && (
                    <a href={c.view} target="_blank" rel="noreferrer" style={{ ...btn("transparent", "var(--theme-elevation-600)"), border: "1px solid var(--theme-elevation-150)" }}>Preview</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
