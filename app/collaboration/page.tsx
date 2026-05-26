import Header from "@/components/sections/Header";
import Footer from "@/components/sections/SectionFooter";
import SectionCollaborationLanding from "@/components/sections/collaboration/SectionCollaborationLanding";
import MoreAboutFoundation from "@/components/sections/shared/MoreAboutFoundation";
import { getCollaborationInitiatives } from "@/src/lib/collaboration";

export const metadata = {
  title: "Collaboration — Gnarly Troop",
  description:
    "Partnerships and collaborative initiatives advancing youth leadership and global cooperation.",
};

export default async function CollaborationPage() {
  const initiatives = await getCollaborationInitiatives();

  return (
    <>
      <Header />
      <SectionCollaborationLanding initiatives={initiatives} />
      <MoreAboutFoundation />
      <Footer />
    </>
  );
}
