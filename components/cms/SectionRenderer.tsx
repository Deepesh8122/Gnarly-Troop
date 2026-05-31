import type { PageSection } from "@gnarly/types";
import { SECTION_COMPONENT_MAP } from "@gnarly/types";
import type { MinisterCard } from "@gnarly/lib";
import SectionHeroVideo from "@/components/sections/SectionHeroVideo";
import SectionAbout from "@/components/sections/SectionAbout";
import SectionTimeline from "@/components/sections/SectionTimeline";
import SectionVisions from "@/components/sections/4CVision/SectionVisions";
import SectionVisionsResponsive from "@/components/sections/4CVision/SectionVisionsResponsive";
import SectionMinisterLetter from "@/components/sections/SectionMinisterLetter";
import SectionMinistries from "@/components/sections/SectionMinistries";
import SectionPartners from "@/components/sections/SectionPartners";
import SectionGallery from "@/components/sections/Gallery/SectionGalleryWrapper";
import SectionSchedules from "@/components/sections/Summit/SectionSchedules";
import SummitSection1 from "@/components/sections/Summit/SummitSection1";
import SectionSikkimTrain from "@/components/sections/Darjeeling & Sikkim/SectionSikkimTrain";
import SectionSikkimPackage from "@/components/sections/Darjeeling & Sikkim/SectionSikkimPackage";
import SectionSikkimCircles from "@/components/sections/Darjeeling & Sikkim/SectionSikkimCircles";

type SectionRendererProps = {
  section: PageSection;
  data: Record<string, unknown>;
};

function config(data: Record<string, unknown>): Record<string, unknown> {
  return (data.config as Record<string, unknown>) ?? data;
}

export function SectionRenderer({ section, data }: SectionRendererProps) {
  const key = SECTION_COMPONENT_MAP[section.section_type];
  const cfg = config(data);

  switch (key) {
    case "SectionHeroVideo":
      return (
        <SectionHeroVideo
          videoSrc={(data.videoSrc as string) ?? (cfg.videoSrc as string) ?? "/hero.mp4"}
          founderImg={
            (data.founderImg as string) ??
            (cfg.founderImg as string) ??
            "/images/sections/founder-img.png"
          }
          pmImg={
            (data.pmImg as string) ?? (cfg.pmImg as string) ?? "/images/sections/pm-img.png"
          }
        />
      );
    case "SectionAbout":
      return (
        <SectionAbout
          titleHi={cfg.titleHi as string | undefined}
          titleEn={cfg.titleEn as string | undefined}
          subtitle={cfg.subtitle as string | undefined}
          estd={cfg.estd as string | undefined}
          backgroundImage={cfg.backgroundImage as string | undefined}
        />
      );
    case "SectionTimeline":
      return <SectionTimeline />;
    case "SectionVisions": {
      const cmsItems = data.items as
        | {
            slug: string;
            title: string;
            short_description: string | null;
            theme_color: string | null;
            detail_page_slug: string | null;
          }[]
        | undefined;
      return (
        <>
          <SectionVisionsResponsive cmsPillars={cmsItems} />
          <SectionVisions cmsPillars={cmsItems} />
        </>
      );
    }
    case "SectionMinisterLetter":
      return (
        <SectionMinisterLetter
          staticImage={
            (data.staticImage as string) ??
            (cfg.staticImage as string) ??
            "/images/sections/img-globe-girl-flag-2.png"
          }
          cards={(data.cards as MinisterCard[]) ?? (cfg.cards as MinisterCard[]) ?? []}
        />
      );
    case "SectionMinistries":
      return <SectionMinistries />;
    case "SummitSection1":
      return <SummitSection1 />;
    case "SectionSchedules":
      return <SectionSchedules />;
    case "SectionSikkimTrain":
      return <SectionSikkimTrain />;
    case "SectionSikkimPackage":
      return <SectionSikkimPackage />;
    case "SectionSikkimCircles":
      return <SectionSikkimCircles />;
    case "SectionPartners":
      return <SectionPartners />;
    case "SectionGallery":
      return <SectionGallery />;
    default:
      if (process.env.NODE_ENV === "development") {
        return (
          <div style={{ padding: 24, background: "#fff3cd", margin: 16 }}>
            CMS section <strong>{section.section_type}</strong> ({key}) — adapter pending
          </div>
        );
      }
      return null;
  }
}
