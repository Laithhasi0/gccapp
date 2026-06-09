import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <Section className="text-center">
      <div className="mx-auto max-w-lg">
        <Badge>404</Badge>
        <h1 className="mt-6">This page wandered off</h1>
        <p className="mx-auto mt-4 max-w-md text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on track.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>
      </div>
    </Section>
  );
}
