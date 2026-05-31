import { notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import SectionNewsletterSignup from "@/components/sections/SectionNewsletterSignup";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import SectionCollaborationDetail from "@/components/sections/collaboration/SectionCollaborationDetail";
import {
  getCollaborationDetailBySlug,
  getCollaborationSlugs,
} from "@/src/lib/collaboration";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCollaborationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const detail = await getCollaborationDetailBySlug(slug);
  if (!detail) return { title: "Collaboration — Gnarly Troop" };
  return {
    title: `${detail.title} — Gnarly Troop`,
    description: detail.subtitle,
  };
}

export default async function CollaborationDetailPage({ params }: Params) {
  const { slug } = await params;
  const detail = await getCollaborationDetailBySlug(slug);
  if (!detail) notFound();

  return (
    <>
      <Header />
      <SectionCollaborationDetail detail={detail} />
      <SectionNewsletterSignup />
      <MoreAboutFoundation />
      <Footer />
    </>
  );
}
