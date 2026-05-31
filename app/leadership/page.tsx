import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import SectionLeadershipListing from "@/components/sections/leadership/SectionLeadershipListing";
import { getLeadershipByCategories } from "@/src/lib/leadership";

export const revalidate = 60;

export const metadata = {
  title: "Leadership — Gnarly Troop",
  description:
    "Meet the executive councils, strategic teams, and program leaders of Gnarly Troop Global Federation.",
};

export default async function LeadershipPage() {
  const data = await getLeadershipByCategories();

  const total = data?.categories.reduce((n, c) => n + c.members.length, 0) ?? 0;

  return (
    <div className="bg-white">
      <Header />
      {!data || total === 0 ? (
        <p className="mx-auto max-w-lg p-16 text-center text-zinc-600">
          No leadership profiles published yet. Use Admin → Team Members → Import GTGF Portal
          document, or add members manually.
        </p>
      ) : (
        <SectionLeadershipListing
          categories={data.categories}
          divisions={data.divisions}
          regions={data.regions}
        />
      )}
      <MoreAboutFoundation />
      <Footer />
    </div>
  );
}
