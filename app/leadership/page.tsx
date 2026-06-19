import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import LeadershipPage from "@/components/LeadershipPage";
import { getPageBySlug } from "@gnarly/lib";
import { getLeadershipByCategories } from "@/src/lib/leadership";

export const revalidate = 60;

export const metadata = {
  title: "Leadership — Gnarly Troop",
  description:
    "Meet the executive councils, strategic teams, and program leaders of Gnarly Troop Global Federation.",
};

function parseIntroParagraphs(content: Record<string, unknown> | undefined): string[] {
  if (!content) return [];

  const paragraphs = content.paragraphs;
  if (Array.isArray(paragraphs)) {
    return paragraphs
      .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      .map((p) => p.trim());
  }

  const bodyHtml = content.body_html;
  if (typeof bodyHtml !== "string" || !bodyHtml.trim()) return [];

  const matches = bodyHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (!matches?.length) {
    const plain = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return plain ? [plain] : [];
  }

  return matches
    .map((block) =>
      block
        .replace(/<\/?p[^>]*>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export default async function LeadershipRoutePage() {
  const [data, page] = await Promise.all([
    getLeadershipByCategories(),
    getPageBySlug("leadership"),
  ]);

  const total = data?.categories.reduce((n, c) => n + c.members.length, 0) ?? 0;

  const introSection =
    page?.sections.find((s) => s.section_type === "custom_html") ?? page?.sections[0];
  const introFromCms = parseIntroParagraphs(introSection?.content);
  const introParagraphs =
    introFromCms.length > 0
      ? introFromCms
      : page?.seo?.meta_description
        ? [page.seo.meta_description]
        : [
            "Gnarly Troop Global Federation is guided by leaders committed to youth empowerment, cultural diplomacy, and measurable community impact across India and partner nations.",
            "Our councils and teams deliver the 4C vision—Climate, Community, Culture, and Cooperation—under the Troop Spirit: My Country, My Responsibility, My Pride.",
          ];
  const listSection = page?.sections.find(
    (s) => s.title?.trim().toLowerCase() === "meet our leaders",
  );

  return (
    <div className="bg-white">
      <Header />
      {!data || total === 0 ? (
        <p className="mx-auto max-w-lg p-16 text-center text-zinc-600">
          No leadership profiles published yet. Use Admin → Team Members → Import GTGF Portal
          document, or add members manually.
        </p>
      ) : (
        <LeadershipPage
          categories={data.categories}
          divisions={data.divisions}
          regions={data.regions}
          pageTitle={page?.title ?? "Leadership"}
          introParagraphs={introParagraphs}
          listSectionTitle={listSection?.title ?? "Meet our leaders"}
        />
      )}
      <MoreAboutFoundation />
      <Footer />
    </div>
  );
}
