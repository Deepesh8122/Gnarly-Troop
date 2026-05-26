import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import SectionLeadershipListing from "@/components/sections/leadership/SectionLeadershipListing";
import {
  getLeadershipBySection,
  getDivisions,
  getRegions,
} from "@/src/lib/leadership";

export const revalidate = 60;

export const metadata = {
  title: "Leadership — Gnarly Troop",
  description:
    "Meet the executive team, governing board, and program leaders of Gnarly Troop Global Federation.",
};

export default async function LeadershipPage() {
  const [executive, board, advisory, leaders, historical, divisions, regions] =
    await Promise.all([
      getLeadershipBySection("executive"),
      getLeadershipBySection("board"),
      getLeadershipBySection("advisory"),
      getLeadershipBySection("leaders"),
      getLeadershipBySection("historical"),
      getDivisions(),
      getRegions(),
    ]);

  const total =
    executive.length +
    board.length +
    advisory.length +
    leaders.length +
    historical.length;

  return (
    <>
      <Header />
      {total === 0 ? (
        <p className="mx-auto max-w-lg p-16 text-center text-zinc-600">
          No leadership profiles published yet. Use Admin → Dashboard → Import static
          content, or add members under Leadership.
        </p>
      ) : (
      <SectionLeadershipListing
        executive={executive}
        board={board}
        advisory={advisory}
        leaders={leaders}
        historical={historical}
        divisions={divisions}
        regions={regions}
      />
      )}
      <MoreAboutFoundation />
      <Footer />
    </>
  );
}
