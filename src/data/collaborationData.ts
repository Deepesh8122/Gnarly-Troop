export type CollaborationNarrative = {
  heading: string;
  paragraphs: string[];
  imageSrc: string;
  imageOnRight: boolean;
};

export type CollaborationStat = {
  value: string;
  label: string;
};

export const collaborationLanding = {
  heroVideo: "/hero.mp4",
  heroPoster: "/images/visions/cooperation/feature-article.jpg",
  heroLabel: "Collaboration",
  heroTitle: "PROGRESS IS POSSIBLE",
  heroBody:
    "Gnarly Troop Global Federation unites youth, institutions, and partners worldwide to build a future where every child can live, learn, and thrive—regardless of where they are born.",
  heroCtaLabel: "Explore our collaborations",
  heroCtaHref: "#progress-in-action",
  missionQuote:
    "By 2045, we believe where a child is born will no longer determine whether they live, learn, and thrive.",
  missionAttr: "Gnarly Troop Global Federation",
  narratives: [
    {
      heading: "BUILDING INCLUSIVE COMMUNITIES",
      paragraphs: [
        "Through village adoption, Troop chapters, and humanitarian grids, we connect local action with global responsibility.",
        "Partners share resources, knowledge, and mentorship so rural and urban youth grow as leaders together.",
      ],
      imageSrc: "/images/visions/community/feature-article.jpg",
      imageOnRight: false,
    },
    {
      heading: "CULTURE AS A BRIDGE",
      paragraphs: [
        "Cultural exchange is not performance—it is diplomacy. Summits, fellowships, and heritage programs reconnect youth to Bharat while welcoming the world.",
        "When culture leads, borders become meeting points for understanding and shared progress.",
      ],
      imageSrc: "/images/visions/culture/feature-article.jpg",
      imageOnRight: true,
    },
    {
      heading: "COOPERATION THAT MEASURES IMPACT",
      paragraphs: [
        "Every collaboration sets clear outcomes: who benefits, how success is tracked, and what scales next.",
        "From climate action to education access, we document results and publish learnings for partners everywhere.",
      ],
      imageSrc: "/images/visions/climate/feature-article.jpg",
      imageOnRight: false,
    },
  ] as CollaborationNarrative[],
  highlight: {
    title: "WE'RE ON THE CLOCK",
    body: "The challenges are urgent—but so is our commitment. Every partnership, summit, and field program moves us closer to Viksit Bharat and a world that rises together.",
  },
  achievement: {
    title: "WHAT WE'VE ACHIEVED SO FAR",
    body: "Troop chapters, global summits, afforestation drives, and cross-border fellowships are delivering measurable outcomes in education, climate, and community service.",
    ctaLabel: "Read our impact stories",
    ctaHref: "/4cvision/cooperation",
  },
  tracking: {
    title: "TRACKING PROGRESS OVER TIME",
    body: "We measure what matters—learning outcomes, trees planted, youth placed in leadership roles, and communities reached through collaboration.",
    stats: [
      { value: "28", label: "States with active Troop programs" },
      { value: "120+", label: "Partner institutions worldwide" },
      { value: "50K+", label: "Youth engaged in annual summits & service" },
    ] as CollaborationStat[],
  },
  roadTo2045: {
    title: "THE ROAD TO 2045",
    body: "Our long-term vision aligns national development with global cooperation—so progress is shared, sustainable, and led by the next generation.",
    imageSrc: "/images/visions/cooperation/feature-article.jpg",
    ctaLabel: "Learn about our vision",
    ctaHref: "/#sectionVisions",
  },
};

export type CollaborationInitiative = {
  slug: string;
  title: string;
  imageSrc: string;
  alt: string;
  excerpt: string;
};

export type CollaborationWorkPillar = {
  title: string;
  body: string;
};

export type CollaborationStoryCard = {
  slug: string;
  title: string;
  imageSrc: string;
  type: string;
  caption: string;
};

export type CollaborationDetail = {
  slug: string;
  title: string;
  subtitle: string;
  lead: string[];
  heroVideo?: string;
  heroImage?: string;
  stat?: { value: string; label: string; source?: string };
  whyTitle?: string;
  whyBullets: string[];
  pullQuote: string;
  howWeWork: CollaborationWorkPillar[];
  body: string;
  relatedStories: CollaborationStoryCard[];
};

export const collaborationInitiatives: CollaborationInitiative[] = [
  {
    slug: "expanding-economic-opportunity",
    title: "Expanding Economic Opportunity",
    imageSrc: "/images/visions/cooperation/feature-article.jpg",
    alt: "Partners working together in the field",
    excerpt:
      "Building inclusive economic systems that expand access to food, quality education, and opportunity.",
  },
  {
    slug: "global-youth-partnerships",
    title: "Global Youth Partnerships",
    imageSrc: "/images/visions/community/feature-article.jpg",
    alt: "Youth leaders collaborating across borders",
    excerpt:
      "Connecting young leaders, institutions, and communities through shared missions and cultural exchange.",
  },
  {
    slug: "humanitarian-collaboration",
    title: "Humanitarian Collaboration",
    imageSrc: "/images/visions/climate/feature-article.jpg",
    alt: "Community outreach and humanitarian support",
    excerpt:
      "Uniting NGOs, defence forces, educators, and diaspora networks for measurable community impact.",
  },
  {
    slug: "academic-and-innovation-hubs",
    title: "Academic & Innovation Hubs",
    imageSrc: "/images/visions/culture/feature-article.jpg",
    alt: "Academic collaboration and innovation",
    excerpt:
      "Fostering research partnerships, fellowships, and innovation aligned with Viksit Bharat.",
  },
];

export const collaborationDetails: CollaborationDetail[] = [
  {
    slug: "expanding-economic-opportunity",
    title: "EXPANDING ECONOMIC OPPORTUNITY",
    subtitle: "A world where everyone has a chance to shape their own future",
    lead: [
      "Gnarly Troop collaborates with partners across agriculture, education, and digital public infrastructure to help communities build resilient livelihoods.",
      "Our work connects rural empowerment, youth leadership, and international cooperation so progress is shared—not concentrated.",
    ],
    heroVideo: "/hero.mp4",
    stat: {
      value: "$196T",
      label:
        "Universal foundational learning could unlock $196 trillion in GDP over 30 years.",
      source: "Source: World Bank / Learning Poverty estimates",
    },
    whyTitle: "Why economic opportunity matters:",
    whyBullets: [
      "Inclusive growth reduces inequality and strengthens democratic institutions.",
      "Youth employment and skills training create long-term community stability.",
      "Cross-border partnerships multiply impact beyond what any single organisation can achieve.",
      "Sustainable agriculture and education are foundations for national development.",
    ],
    pullQuote:
      "Our goal is to help build inclusive, resilient economic systems that expand access to food, quality education, and opportunity—so people thrive and communities grow stronger.",
    howWeWork: [
      {
        title: "Agricultural Development",
        body: "Supporting farmers and rural cooperatives with training, climate-smart practices, and market access.",
      },
      {
        title: "Education",
        body: "Expanding foundational learning, digital literacy, and leadership programs for youth nationwide.",
      },
      {
        title: "Digital Public Infrastructure",
        body: "Enabling secure, inclusive digital systems that connect underserved communities to services and opportunity.",
      },
    ],
    body: `Through the Welcome to My Country – India movement, Gnarly Troop Global Federation brings together governments, institutions, and grassroots leaders to co-create solutions for economic inclusion.

Collaboration is practical and participatory: partners align on measurable outcomes, share knowledge across regions, and invest in youth as agents of change. From village adoption programs to global summits, every initiative is designed to turn dialogue into action.

By integrating culture, climate responsibility, and community service into economic programs, we ensure development is holistic—rooted in Indian values and open to the world.`,
    relatedStories: [
      {
        slug: "global-youth-partnerships",
        title: "Youth leaders launch cross-border fellowship network",
        imageSrc: "/images/visions/community/feature-article.jpg",
        type: "Article",
        caption: "A new cohort connects rural India with diaspora mentors.",
      },
      {
        slug: "humanitarian-collaboration",
        title: "Field partners scale emergency relief collaboration",
        imageSrc: "/images/visions/climate/feature-article.jpg",
        type: "Video",
        caption: "Humanitarian teams coordinate supplies and volunteer grids.",
      },
      {
        slug: "academic-and-innovation-hubs",
        title: "Universities join innovation hub for rural startups",
        imageSrc: "/images/visions/culture/feature-article.jpg",
        type: "Article",
        caption: "Research labs and Troop chapters co-design green solutions.",
      },
    ],
  },
  {
    slug: "global-youth-partnerships",
    title: "GLOBAL YOUTH PARTNERSHIPS",
    subtitle: "Connecting the next generation of cultural and civic leaders",
    lead: [
      "Youth exchanges, Troop fellowships, and summit delegations create lasting ties between India and partner nations.",
      "Participants learn leadership through service—adopting villages, leading eco-initiatives, and representing Bharat globally.",
    ],
    heroImage: "/images/visions/community/feature-article.jpg",
    stat: {
      value: "120+",
      label: "Partner institutions and youth chapters engaged in annual exchange programs.",
    },
    whyBullets: [
      "Youth diplomacy builds trust across cultures and borders.",
      "Hands-on service develops discipline, empathy, and civic responsibility.",
      "Mentorship from defence alumni and educators strengthens national values.",
    ],
    pullQuote:
      "When young people lead with purpose, collaboration becomes a living bridge between nations—not a slogan on a page.",
    howWeWork: [
      {
        title: "Summit & Exchange",
        body: "Annual Global Leadership Summit convenes delegates for dialogue, awards, and joint action plans.",
      },
      {
        title: "Fellowships",
        body: "Structured programs place youth in communities for measurable social impact projects.",
      },
      {
        title: "Diaspora Engagement",
        body: "NRIs and global influencers participate in Bharat immersion and mentorship tracks.",
      },
    ],
    body: `Gnarly Troop’s youth grid links campuses, Troop chapters, and international partners under one cooperative framework. Each collaboration is documented, evaluated, and scaled where it succeeds.

From NCC cadet showcases to innovation hackathons, youth see themselves as stakeholders in Viksit Bharat—and as ambassadors of Vasudhaiva Kutumbakam.`,
    relatedStories: collaborationInitiatives.slice(0, 3).map((i) => ({
      slug: i.slug,
      title: i.title,
      imageSrc: i.imageSrc,
      type: "Article",
      caption: i.excerpt,
    })),
  },
  {
    slug: "humanitarian-collaboration",
    title: "HUMANITARIAN COLLABORATION",
    subtitle: "Shared responsibility for communities in need",
    lead: [
      "Humanitarian collaboration unites NGOs, defence forces, medical teams, and volunteer networks for rapid, dignified response.",
      "GTGF coordinates resources, training, and long-term recovery—not only emergency relief.",
    ],
    heroImage: "/images/visions/climate/feature-article.jpg",
    whyBullets: [
      "Coordinated supply chains reduce duplication and reach villages faster.",
      "Volunteer grids trained in first aid and logistics strengthen local resilience.",
      "Partnerships with institutions ensure accountability and transparency.",
    ],
    pullQuote:
      "Compassion scales when organisations align on standards, share data, and put community dignity first.",
    howWeWork: [
      {
        title: "Relief Coordination",
        body: "Rapid deployment of food, medicine, and shelter with local leadership at the center.",
      },
      {
        title: "Health & Wellness",
        body: "Medical camps, mental health support, and preventive care in underserved areas.",
      },
      {
        title: "Recovery & Rebuild",
        body: "Long-term programs for livelihood restoration and climate-resilient infrastructure.",
      },
    ],
    body: `Through Padharo Mhare Desh Bharat initiatives, humanitarian collaboration is embedded in the movement’s 4C vision—Climate, Community, Culture, and Cooperation.

Every partner agrees to measurable commitments: who benefits, how funds are used, and what success looks like six months after deployment.`,
    relatedStories: collaborationInitiatives.slice(0, 3).map((i) => ({
      slug: i.slug,
      title: i.title,
      imageSrc: i.imageSrc,
      type: "Article",
      caption: i.excerpt,
    })),
  },
  {
    slug: "academic-and-innovation-hubs",
    title: "ACADEMIC & INNOVATION HUBS",
    subtitle: "Research, startups, and skills for a developed India",
    lead: [
      "Universities, industry, and Troop innovation hubs collaborate on green tech, rural enterprise, and digital skills.",
      "Internships and certified volunteering turn classroom learning into national service.",
    ],
    heroImage: "/images/visions/culture/feature-article.jpg",
    whyBullets: [
      "Innovation hubs anchor startups in real community needs.",
      "Academic partnerships globalise Indian research and culture.",
      "Skills programs align with Digital India, Make in India, and Fit India.",
    ],
    pullQuote:
      "Innovation thrives when campuses, villages, and global partners solve problems together.",
    howWeWork: [
      {
        title: "Research Partnerships",
        body: "Joint studies on climate, health, education, and cultural preservation.",
      },
      {
        title: "Startup Incubation",
        body: "Mentorship, seed support, and market links for youth-led enterprises.",
      },
      {
        title: "Green Campuses",
        body: "Institutions adopt Troop Green standards—solar, water harvesting, zero waste.",
      },
    ],
    body: `Academic collaboration is a pillar of Gnarly Troop’s cooperation strategy. Partner institutions host summits, field labs, and exchange programs that connect students to Bharat’s villages and global dialogues.

The outcome is a generation of leaders who think globally, act locally, and build enterprises that serve people and planet.`,
    relatedStories: collaborationInitiatives.slice(0, 3).map((i) => ({
      slug: i.slug,
      title: i.title,
      imageSrc: i.imageSrc,
      type: "Article",
      caption: i.excerpt,
    })),
  },
];

export function getCollaborationDetail(slug: string) {
  return collaborationDetails.find((d) => d.slug === slug) ?? null;
}

export function getAllCollaborationSlugs() {
  return collaborationDetails.map((d) => d.slug);
}
