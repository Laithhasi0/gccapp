import Image from "next/image";
import { Mail } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import type { TeamMember } from "@/content/types";

function Socials({ member }: { member: TeamMember }) {
  const s = member.socials;
  if (!s) return null;
  const links: { key: string; href: string; label: string; icon: React.ReactNode }[] = [];
  if (s.linkedin) links.push({ key: "linkedin", href: s.linkedin, label: `${member.name} on LinkedIn`, icon: <SocialIcon name="linkedin" /> });
  if (s.x) links.push({ key: "x", href: s.x, label: `${member.name} on X`, icon: <SocialIcon name="twitter" /> });
  if (s.github) links.push({ key: "github", href: s.github, label: `${member.name} on GitHub`, icon: <SocialIcon name="github" /> });
  if (s.email) links.push({ key: "email", href: `mailto:${s.email}`, label: `Email ${member.name}`, icon: <Mail className="h-5 w-5" /> });
  if (!links.length) return null;

  return (
    <div className="mt-3 flex gap-2">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          aria-label={l.label}
          target={l.key === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  const hasReveal = Boolean(member.bio || member.socials);

  return (
    <article
      tabIndex={hasReveal ? 0 : undefined}
      className="group hover-lift flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Square photo / initials avatar */}
      <div className="relative aspect-square w-full overflow-hidden bg-accent-soft">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.alt || member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl font-semibold text-accent/70">
              {member.initials}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base">{member.name}</h3>
        <p className="mt-0.5 text-sm font-medium text-accent">{member.role}</p>

        {member.workingOn && (
          <span className="mt-3 inline-flex w-fit items-center rounded-full bg-surface-tint px-2.5 py-1 text-xs text-muted">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {member.workingOn}
          </span>
        )}

        {/* Calm reveal of bio + socials on hover / keyboard focus */}
        {hasReveal && (
          <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-[var(--dur)] ease-soft group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100">
            <div className="overflow-hidden">
              {member.bio && <p className="pt-3 text-sm">{member.bio}</p>}
              <Socials member={member} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
