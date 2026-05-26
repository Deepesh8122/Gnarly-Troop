import Header from "@/components/sections/Header";
import SectionCulture from "@/components/sections/4CVision/SectionCulture";
import Footer from "@/components/sections/SectionFooter";
import { getVisionPillarPage } from "@/lib/cms/vision";

export const revalidate = 60;

export default async function FourCVisionCulture() {
  const cmsData = await getVisionPillarPage("culture");

  return (
    <>
      <Header />
      <SectionCulture cmsData={cmsData} />
      <Footer />
    </>
  );
}
