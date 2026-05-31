import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import SectionCollaborationLanding from "@/components/sections/collaboration/SectionCollaborationLanding";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import {
  getCollaborationInitiatives,
  getCollaborationLandingContent,
} from "@/src/lib/collaboration";

export const revalidate = 60;

export const metadata = {
  title: "Collaboration — Gnarly Troop",
  description:
    "Partnerships and collaborative initiatives advancing youth leadership and global cooperation.",
};

export default async function CollaborationPage() {
  const [initiatives, landing] = await Promise.all([
    getCollaborationInitiatives(),
    getCollaborationLandingContent(),
  ]);

  return (
    <>
      <Header />
      <SectionCollaborationLanding initiatives={initiatives} landing={landing ?? null} />
      <MoreAboutFoundation />
      <Footer />
    </>
  );
}
