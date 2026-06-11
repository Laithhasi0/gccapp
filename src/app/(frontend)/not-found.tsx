import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getLocale } from "@/lib/getLocale";
import { getUI } from "@/lib/i18n";

export default async function NotFound() {
  const t = getUI(await getLocale());
  return (
    <Section className="text-center">
      <div className="mx-auto max-w-lg">
        <Badge>{t.pages.notFound.badge}</Badge>
        <h1 className="mt-6">{t.pages.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg">
          {t.pages.notFound.body}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button href="/">{t.pages.notFound.backHome}</Button>
          <Button href="/contact" variant="ghost">
            {t.pages.notFound.contactUs}
          </Button>
        </div>
      </div>
    </Section>
  );
}
