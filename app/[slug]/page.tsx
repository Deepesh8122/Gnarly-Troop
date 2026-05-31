import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import CmsStaticPage from "@/components/cms/CmsStaticPage";
import { getPageBySlug } from "@gnarly/lib";

type Params = { params: Promise<{ slug: string }> };

/** Slugs handled by dedicated app routes — never treat as CMS pages. */
const RESERVED = new Set([
  "admin",
  "api",
  "leadership",
  "collaboration",
  "registration",
  "4cvision",
  "home",
]);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo?.meta_title ?? `${page.title} — Gnarly Troop`,
    description: page.seo?.meta_description ?? undefined,
  };
}

export default async function CmsPageBySlug({ params }: Params) {
  const { slug } = await params;

  if (slug === "home") redirect("/");
  if (RESERVED.has(slug)) notFound();

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <Header />
      <main style={{ paddingTop: 100, minHeight: "60vh", background: "#f8fafc" }}>
        <CmsStaticPage title={page.title} sections={page.sections} />
      </main>
      <Footer />
    </>
  );
}
