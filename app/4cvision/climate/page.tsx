import Header from "@/components/sections/Header";
import SectionClimate from "@/components/sections/4CVision/SectionClimate";
import Footer from "@/components/sections/SectionFooter";
import { getVisionPillarPage } from "@/lib/cms/vision";

export const revalidate = 60;

export default async function FourCVisionClimate() {
  const cmsData = await getVisionPillarPage("climate");

  return (
    <>
      <Header />
      <SectionClimate cmsData={cmsData} />
      <Footer />
    </>
  );
}
