import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import SectionLeadershipListing from "@/components/sections/leadership/SectionLeadershipListing";
import {
  getLeadershipBySection,
  getDivisions,
  getRegions,
} from "@/src/lib/leadership";

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

  return (
    <>
      <Header />
      <SectionLeadershipListing
        executive={executive}
        board={board}
        advisory={advisory}
        leaders={leaders}
        historical={historical}
        divisions={divisions}
        regions={regions}
      />
      <MoreAboutFoundation />
      <Footer />
    </>
  );
}
