import Header from "@/components/sections/Header";
import SectionCommunity from "@/components/sections/4CVision/SectionCommunity";
import Footer from "@/components/sections/SectionFooter";
import { getVisionPillarPage } from "@/lib/cms/vision";

export const revalidate = 60;

export default async function FourCVisionCommunity() {
  const cmsData = await getVisionPillarPage("community");

  return (
    <>
      <Header />
      <SectionCommunity cmsData={cmsData} />
      <Footer />
    </>
  );
}
