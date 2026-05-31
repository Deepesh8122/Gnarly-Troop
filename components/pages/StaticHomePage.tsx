import Header from "@/components/sections/Header";
import SectionHeroVideo from "@/components/sections/SectionHeroVideo";
import SectionAbout from "@/components/sections/SectionAbout";
import SectionVisions from "@/components/sections/4CVision/SectionVisions";
import SectionVisionsResponsive from "@/components/sections/4CVision/SectionVisionsResponsive";
import SectionTimeline from "@/components/sections/SectionTimeline";
import SectionMinisterLetter from "@/components/sections/SectionMinisterLetter";
import SectionMinistries from "@/components/sections/SectionMinistries";
import SectionPartners from "@/components/sections/SectionPartners";
import SectionFooter from "@/components/sections/SectionFooter";
import SectionSchedules from "@/components/sections/Summit/SectionSchedules";
import SectionGallery from "@/components/sections/Gallery/SectionGalleryWrapper";
import SectionSummit1 from "@/components/sections/Summit/SummitSection1";
import SectionSikkimPackage from "@/components/sections/Darjeeling & Sikkim/SectionSikkimPackage";
import SectionSikkimTrain from "@/components/sections/Darjeeling & Sikkim/SectionSikkimTrain";
import SectionSikkimCircles from "@/components/sections/Darjeeling & Sikkim/SectionSikkimCircles";

const ministerCards = [
  {
    id: 1,
    name: "Shri Gajendra Singh Shekhawat",
    title: "Hon'ble Union Minister of Culture & Tourism | Govt of India",
    image: "/images/crousel/ministers/img-shri-gajendra-singh-shekhawat.png",
    certificateUrl:
      "/images/crousel/letters/img-letter-gajendra-singh-shekhawat.jpg",
  },
  {
    id: 2,
    name: "Shri Bhajan Lal Sharma",
    title: "Hon'ble Chief Minister | Rajasthan",
    image: "/images/crousel/ministers/img-shri-bhajan-lal-sharma.png",
    certificateUrl: "/images/crousel/letters/img-letter-bhajan-lal-sharma.png",
  },
  {
    id: 3,
    name: "Shri Jhabar Singh Kharra",
    title: "Hon'ble Minister of State for Urban Housing | Government of India",
    image: "/images/crousel/ministers/img-shri-jhabar-singh-kharra.png",
    certificateUrl: "/images/crousel/letters/img-letter-jhabbar-kharra.png",
  },
  {
    id: 4,
    name: "Swami Balmukundacharya Ji Maharaj",
    title: "Hon'ble Member of the Legislative Assembly Rajasthan",
    image:
      "/images/crousel/ministers/img-swami-balmukundacharya-ji-maharaj.png",
    certificateUrl: "/images/crousel/letters/img-letter-balmukundacharya.png",
  },
];

/** Current static homepage — preserved until CMS migration is complete */
export default function StaticHomePage() {
  return (
    <>
      <Header />
      <SectionHeroVideo
        videoSrc="/hero.mp4"
        founderImg="/images/sections/founder-img.png"
        pmImg="/images/sections/pm-img.png"
      />
      <main>
        <SectionAbout />
        <SectionMinisterLetter
          staticImage="/images/sections/img-globe-girl-flag-2.png"
          cards={ministerCards}
        />
        <SectionTimeline />
        <SectionVisionsResponsive />
        <SectionVisions />
        <SectionMinistries />
        <SectionSummit1 />
        <SectionSchedules />
        <SectionSikkimTrain />
        <SectionSikkimPackage />
        <SectionSikkimCircles />
        <SectionPartners />
        <SectionGallery />
        <SectionFooter />
      </main>
    </>
  );
}
