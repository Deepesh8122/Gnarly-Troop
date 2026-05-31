export type LeadershipSection =
  | "executive"
  | "board"
  | "advisory"
  | "leaders"
  | "historical";

export type LeadershipArticle = {
  title: string;
  excerpt: string;
  href: string;
  type?: "Article" | "Video" | "Story";
};

export type LeadershipDataItem = {
  slug: string;
  name: string;
  title: string;
  division?: string;
  section: LeadershipSection;
  region?: string;
  image: string;
  short?: string;
  bio?: string;
  bioParagraphs?: string[];
  education?: string;
  linkedin?: string;
  articles?: LeadershipArticle[];
};

const leadershipData: LeadershipDataItem[] = [
  {
    slug: "rajesh-kumar",
    name: "Rajesh Kumar",
    title: "President & Founder",
    division: "Executive Leadership",
    section: "executive",
    region: "India",
    image: "/images/visions/cooperation/feature-article.jpg",
    short:
      "Leads the global federation’s vision for youth empowerment, cultural diplomacy, and Viksit Bharat.",
    bioParagraphs: [
      "Rajesh Kumar serves as President of Gnarly Troop Global Federation, guiding strategy across climate, community, culture, and cooperation initiatives.",
      "With decades of experience in defence outreach, youth programs, and international summits, he champions the motto: My Country, My Responsibility, My Pride.",
      "He holds advanced credentials in public administration and has advised institutions on diaspora engagement and rural adoption programs.",
    ],
    education:
      "MBA in Public Administration; Fellow, International Leadership & Rural Development",
    linkedin: "https://www.linkedin.com",
    articles: [
      {
        title: "Global Leadership Summit opens new chapter for youth diplomacy",
        excerpt:
          "Delegates from 40+ nations convene under Padharo Mhare Desh Bharat to co-create action plans.",
        href: "/4cvision/cooperation/cooeration-global-call",
        type: "Article",
      },
      {
        title: "Village adoption model scales across northern India",
        excerpt:
          "Troop chapters report measurable gains in education access and eco-restoration.",
        href: "/4cvision/community",
        type: "Story",
      },
    ],
  },
  {
    slug: "priya-sharma",
    name: "Priya Sharma",
    title: "Executive Director",
    division: "Executive Leadership",
    section: "executive",
    region: "India",
    image: "/images/visions/community/feature-article.jpg",
    short:
      "Oversees program delivery, partnerships, and the annual Global Leadership Summit.",
    bioParagraphs: [
      "Priya Sharma directs day-to-day operations for GTGF, aligning Troop chapters, partner institutions, and government collaborations.",
      "She previously led national youth volunteering grids and innovation hubs connected to Digital India and Make in India.",
      "Priya is a graduate in international relations and public policy, with fellowships in community development and gender-inclusive leadership.",
    ],
    education:
      "MA International Relations & Public Policy; Certified Program Director, Youth Leadership",
    linkedin: "https://www.linkedin.com",
    articles: [
      {
        title: "How Troop fellowships turn service into national impact",
        excerpt:
          "A look at certified volunteering pathways connected to Digital India and Make in India.",
        href: "/4cvision/community",
        type: "Article",
      },
    ],
  },
  {
    slug: "amit-verma",
    name: "Amit Verma",
    title: "Chief Operating Officer",
    division: "Executive Leadership",
    section: "executive",
    region: "India",
    image: "/images/visions/climate/feature-article.jpg",
    short:
      "Ensures operational excellence across summits, field programs, and humanitarian deployments.",
    bioParagraphs: [
      "Amit Verma manages logistics, volunteer coordination, and measurable outcomes for Troop initiatives nationwide.",
      "His background includes disaster response planning, NCC partnership programs, and corporate social responsibility alliances.",
    ],
  },
  {
    slug: "neha-gupta",
    name: "Neha Gupta",
    title: "Board Chair",
    division: "Governing Board",
    section: "board",
    region: "India",
    image: "/images/visions/culture/feature-article.jpg",
    short:
      "Provides governance oversight and stewards the federation’s ethical and financial standards.",
    bioParagraphs: [
      "Neha Gupta chairs the Governing Board, ensuring transparency, accountability, and alignment with GTGF’s charitable mission.",
      "She brings experience from education philanthropy and cross-sector boards focused on sustainable development.",
    ],
  },
  {
    slug: "david-chen",
    name: "David Chen",
    title: "Board Member",
    division: "Governing Board",
    section: "board",
    region: "United States",
    image: "/images/visions/cooperation/feature-article.jpg",
    short:
      "Advances international partnerships and diaspora engagement for cultural exchange programs.",
    bioParagraphs: [
      "David Chen supports global outreach, connecting universities, embassies, and youth delegates to Bharat immersion experiences.",
    ],
    linkedin: "https://www.linkedin.com",
  },
  {
    slug: "ananya-reddy",
    name: "Dr. Ananya Reddy",
    title: "Scientific Advisory Lead",
    division: "Scientific Advisory Committee",
    section: "advisory",
    region: "India",
    image: "/images/visions/climate/feature-article.jpg",
    short:
      "Guides research priorities in climate, health, and education metrics for Troop programs.",
    bioParagraphs: [
      "Dr. Ananya Reddy leads the Scientific Advisory Committee, reviewing evidence frameworks for afforestation, clean air, and learning outcomes.",
      "She has published extensively on environmental health and youth civic engagement.",
    ],
  },
  {
    slug: "vikram-singh",
    name: "Vikram Singh",
    title: "Regional Director — North",
    division: "Regional Leadership",
    section: "leaders",
    region: "India",
    image: "/images/visions/community/feature-article.jpg",
    short:
      "Coordinates Troop chapters, village adoption, and summit outreach across northern states.",
    bioParagraphs: [
      "Vikram Singh works with state partners to scale youth leadership camps, eco-initiatives, and defence alumni mentorship.",
    ],
  },
  {
    slug: "meera-nair",
    name: "Meera Nair",
    title: "Director — Culture & Heritage",
    division: "Program Leadership",
    section: "leaders",
    region: "India",
    image: "/images/visions/culture/feature-article.jpg",
    short:
      "Revives endangered traditions and cultural leadership zones across 28 states.",
    bioParagraphs: [
      "Meera Nair directs culture programs that reconnect youth to India’s heritage through performances, archives, and leadership training.",
    ],
  },
  {
    slug: "james-wilson",
    name: "James Wilson",
    title: "International Partnerships",
    division: "Global Cooperation",
    section: "leaders",
    region: "United Kingdom",
    image: "/images/visions/cooperation/feature-article.jpg",
    short:
      "Builds cooperation frameworks with NGOs, universities, and youth delegations abroad.",
    bioParagraphs: [
      "James Wilson fosters cross-border collaboration for peace missions, climate dialogues, and summit exchanges.",
    ],
    linkedin: "https://www.linkedin.com",
  },
  {
    slug: "founding-chair-emeritus",
    name: "Founding Chair Emeritus",
    title: "Honorary Leadership",
    division: "Historical Leadership",
    section: "historical",
    region: "India",
    image: "/images/logos/logo-2.png",
    short:
      "Honouring the visionaries who established GTGF’s commitment to global active and responsible youth leadership.",
    bioParagraphs: [
      "The founding chair emeritus role recognizes early leaders who shaped the federation’s charter, summit tradition, and 4C vision.",
    ],
  },
];

export default leadershipData;
