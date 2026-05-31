import Header from "@/components/sections/Header";
import SectionFooter from "@/components/sections/SectionFooter";
import { SectionRenderer } from "@/components/cms/SectionRenderer";
import CmsHomeBanner from "@/components/cms/CmsHomeBanner";
import { getHomePage } from "@gnarly/lib";
import { loadSectionData } from "@gnarly/lib";

export const revalidate = 60;

export default async function DynamicHomePage() {
  const page = await getHomePage();

  if (!page?.sections?.length) {
    return null;
  }

  const sectionsWithData = await Promise.all(
    page.sections.map(async (section) => ({
      section,
      data: await loadSectionData(section),
    })),
  );

  return (
    <>
      <Header />
      {process.env.NODE_ENV === "development" && <CmsHomeBanner />}
      <main>
        {sectionsWithData.map(({ section, data }) => (
          <SectionRenderer key={section.id} section={section} data={data} />
        ))}
      </main>
      <SectionFooter />
    </>
  );
}
