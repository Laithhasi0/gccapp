import { HomeRenderer } from "@/components/home/HomeRenderer";
import { getHomePage } from "@/lib/homePage";

// Renders CMS content at request time (updates with no redeploy).
export const dynamic = "force-dynamic";

/**
 * Home page — fully section-based. The order, visibility and content of every
 * section comes from the `home-page` global, managed visually at /editor
 * (add, remove, reorder, hide and edit sections in place).
 */
export default async function Home() {
  const { sections } = await getHomePage();
  return <HomeRenderer sections={sections} />;
}
