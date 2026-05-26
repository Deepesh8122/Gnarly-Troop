import Header from "@/components/sections/Header";
import SectionCooperation from "@/components/sections/4CVision/SectionCooperation";
import Footer from "@/components/sections/SectionFooter";
import { getVisionPillarPage } from "@/lib/cms/vision";

export const revalidate = 60;

export default async function FourCVisionCooperation() {
  const cmsData = await getVisionPillarPage("cooperation");

  return (
    <>
      <Header />
      <SectionCooperation cmsData={cmsData} />
      <Footer />
    </>
  );
}
