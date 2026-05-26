import { notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import LeadershipProfile from "@/components/sections/leadership/LeadershipProfile";
import {
  getLeadershipItem,
  getLeadershipStaticParams,
} from "@/src/lib/leadership";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getLeadershipStaticParams();
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const person = await getLeadershipItem(slug);
  if (!person) return { title: "Leadership — Gnarly Troop" };
  return {
    title: `${person.name} — Leadership — Gnarly Troop`,
    description: person.short ?? person.title,
  };
}

export default async function LeadershipDetailPage({ params }: Params) {
  const { slug } = await params;
  const person = await getLeadershipItem(slug);
  if (!person) notFound();

  return (
    <>
      <Header />
      <LeadershipProfile person={person} />
      <Footer />
    </>
  );
}
