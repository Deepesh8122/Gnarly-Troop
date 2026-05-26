interface LargeCard {
  id: number;
  kicker: string;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string; 
  body: string; 
  slug:string;
  author:string;
  readTime:string;
}

export interface SmallCard {
  id: number;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string; 
  body: string; 
  slug:string;
  author:string;
  readTime:string;
}

export interface StoryForModal {
  title: string;
  imageSrc: string;
  alt: string;
  body: string;
}
export interface FeaturedStory {
  slug: string;
  title: string;
  imageSrc: string;
  alt: string;
  caption: string;
  body: string;
  author:string;
  readTime:string;
}

export const featuredStory = {
  slug:"cooeration-global-call", 
  title: "COOPERATION: A GLOBAL CALL FOR UNITY & RESPONSIBILITY",
  imageSrc: "/images/visions/cooperation/feature-article.jpg",
  alt: "COOPERATION: A GLOBAL CALL FOR UNITY & RESPONSIBILITY",
  caption:
    "In an increasingly fragmented and polarised world, the need for genuine cooperation has never been more urgent. Political divisions, climate emergencies, cultural misunderstandings, economic inequality and social unrest continue to challenge the...",
  body: `
In an increasingly fragmented and polarised world, the need for genuine cooperation has never been more urgent. Political divisions, climate emergencies, cultural misunderstandings, economic inequality and social unrest continue to challenge the collective progress of humanity. At this defining moment in history, Gnarly Troop Global Federation rises with a powerful vision of Cooperation, rooted in India’s timeless wisdom of “Vasudhaiva Kutumbakam – The world is one family.”
Through its flagship movement, “Welcome to My Country – India (Padharo Mhare Desh Bharat) – Global Leadership Summit & Cultural Exchange,” cooperation is transformed from a philosophy into a living, action-based framework. This movement does not focus on a single city, region or people. It builds a global alliance that unites nations, institutions, youth leaders, defence forces, educators, entrepreneurs, farmers, artists, diplomats, NGOs and visionaries across the world.
Cooperation in the Gnarly Troop vision is not symbolic—it is practical, participatory and transformative. It is about creating a shared roadmap for peace, sustainability, mutual respect and collective growth. It recognises that a developed India (Viksit Bharat) cannot rise in isolation. It will rise when the world rises together with India — connected by understanding, respect, collaboration and purpose.
By providing a common platform for international dialogue, youth leadership, climate action, cultural revival and rural empowerment, Gnarly Troop is building a new model of global cooperation — one that transcends borders, religions, languages and ideologies.
This is not just an initiative.
It is a global movement for unity, peace and collective responsibility.
`,
    author: "Gnarly Troop",
    readTime: "4 min read",
};

export const largeCards: LargeCard[] = [
  {
    slug:"national-cooperation",
    id: 1,
    kicker: "COOPERATION AS NATIONAL & GLOBAL RESPONSIBILITY",
    title: "For centuries, India’s villages have preserved its soul.",
    imageSrc: "/images/visions/cooperation/section-1.jpg",
    alt: "Section 1 image",
    caption:
      "India’s leadership in the 21st century is not defined by power alone, but by its ability to unite nations through compassion...",
    body: `India’s leadership in the 21st century is not defined by power alone, but by its ability to unite nations through compassion, dialogue and inclusive progress. Gnarly Troop Global Federation recognises that true development means building bridges, not boundaries. Cooperation, therefore, becomes both a national duty and a global responsibility.
Under the mission “Viksit Bharat with Gnarly Troop”, the initiative builds meaningful partnerships with governments, educational institutions, social organisations, corporate leaders, rural communities and international delegations. These alliances focus on shared learning, sustainable development, innovation exchange and community upliftment.
By promoting cross-border collaboration, the movement strengthens people-to-people diplomacy while contributing to global peace and inclusive growth. It reinforces the understanding that no nation thrives alone; progress is most powerful when achieved together.
Gnarly Troop is creating a platform where ideas, resources, skills and cultures converge. This unified ecosystem is shaping a more responsible, empathetic and cooperative global society, with India serving as a guiding light of unity.
 
.`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"future-garden",
    id: 2,
    kicker: "THE GARDEN OF THE FUTURE",
    title: "HOW SMALL CHANGES CREATE BIG IMPACTS",
    imageSrc: "/images/visions/cooperation/section-2.jpg",
    alt: "Section 2 image",
    caption:
      "Gnarly Troop Global Federation champions Cooperation as the force that transforms vision into reality....",
    body: `Gnarly Troop Global Federation champions Cooperation as the
                  force that transforms vision into reality. Through “Welcome to
                  My Country – India (Padharo Mhare Desh Bharat) – Global
                  Leadership Summit & Cultural Exchange,” governments,
                  international institutions, social leaders, educators,
                  military forces, NGOs, entrepreneurs, and youth networks unite
                  to co-create solutions for a better world. These strategic
                  alliances strengthen diplomatic relations, promote sustainable
                  development, foster academic and cultural exchange, and build
                  cross-border innovation platforms. Each partnership is driven
                  by the shared objective of peace, progress, and planetary
                  well-being. By uniting local action with international
                  solidarity, Gnarly Troop sets a new model of people-led global
                  diplomacy, reinforcing India’s leadership in building a
                  cooperative, inclusive, and development-focused global
                  community under the Viksit Bharat Mission..
`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
];

export const smallCards: SmallCard[] = [
  {
    slug:"leadership-summit",
    id: 1,
    title: "THE ANNUAL GLOBAL LEADERSHIP SUMMIT & CULTURAL EXCHANGE",
    imageSrc: "/images/visions/cooperation/img-1.jpg",
    alt: "THE ANNUAL GLOBAL LEADERSHIP SUMMIT & CULTURAL EXCHANGE",
    caption:
      "At the heart of the cooperation movement is the Annual Global Leadership Summit & Cultural Exchange — a powerful...",
    body: `At the heart of the cooperation movement is the Annual Global Leadership Summit & Cultural Exchange — a powerful convergence of thinkers, leaders, visionaries and change-makers from around the world.
This global platform brings together:
• International youth leaders and students
• Rural farmers, artisans and community leaders
• Defence, police and civil administration representatives
• Corporate innovators and entrepreneurs
• Cultural ambassadors, historians and artists
• NGOs, activists and policymakers
• Diplomats and international delegates
The summit becomes a space for co-created solutions, cross-cultural dialogue, leadership strategy and global partnerships. It is here that ideas transform into action, and visions become collaborative missions.
Each year, this gathering reaffirms India’s role as a centre of wisdom, peace, sustainability and cultural unity, aligned with the philosophy “Act Locally, Think Globally.”
The summit is not just an event; it is a living symbol of cooperation in action.

`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"cooperation-youth-leadership",
    id: 2,
    title: "COOPERATION THROUGH YOUTH LEADERSHIP & VOLUNTEERING",
    imageSrc: "/images/visions/cooperation/img-2.jpg",
    alt: "COOPERATION THROUGH YOUTH LEADERSHIP & VOLUNTEERING",
    caption:
      "The foundation of global cooperation lies in empowering the youth. Gnarly Troop integrates Youth Internships...",
    body: `The foundation of global cooperation lies in empowering the youth. Gnarly Troop integrates Youth Internships, Community Volunteering, Cycling Missions, Troop Camping and Leadership Bootcamps into its cooperative framework.
Young participants from India and across the world engage in:
• Rural development programs
• Cultural immersion experiences
• Environmental conservation projects
• Education campaigns
• Women empowerment initiatives
• Indigenous knowledge preservation
• Sustainable tourism models
• Clean Air & Blue Skies missions
Living and working together in diverse environments, the youth develop empathy, leadership, global awareness and shared responsibility. They do not simply study cooperation; they live it, experience it, and carry it forward.
This experiential learning creates a new generation of ethical international leaders — connected by service, unity and purpose.

`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"cooperation-touch",
    id: 3,
    title: "COOPERATION THROUGH CULTURAL UNDERSTANDING",
    imageSrc: "/images/visions/cooperation/img-3.jpg",
    alt: "COOPERATION THROUGH CULTURAL UNDERSTANDING",
    caption:
      "Many conflicts in the world arise from misunderstanding and disconnection. The Gnarly Troop initiative...",
    body: `Many conflicts in the world arise from misunderstanding and disconnection. The Gnarly Troop initiative addresses this by promoting inter-regional and international cultural exchanges that nurture mutual respect and appreciation.
Through:
• Traditional music and dance workshops
• Heritage exploration journeys
• Language exchange programs
• Spiritual philosophy sessions
• Handicraft exhibitions
• Indigenous knowledge sharing
• Global culinary festivals
Cultures come together in celebration rather than conflict. These experiences create emotional bridges, replacing fear with friendship and division with dialogue.
India’s rich civilisational heritage becomes a global classroom, teaching the world about harmony, unity and inclusive identity.
Through cultural cooperation, humanity rediscovers its shared roots.
.`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"cooperation-climate",
    id: 4,
    title: "COOPERATION THROUGH CLIMATE ACTION & SUSTAINABILITY",
    imageSrc: "/images/visions/cooperation/img-4.jpg",
    alt: "COOPERATION THROUGH CLIMATE ACTION & SUSTAINABILITY",
    caption:
      "Climate change is a global crisis that demands collective action. Under the allied mission...",
    body: `Climate change is a global crisis that demands collective action. Under the allied mission “Clean Air and Blue Skies”, Gnarly Troop introduces cooperation through environmental responsibility.
Key initiatives include:
• Annual Marathons for awareness
• Cycling expeditions across regions
• Tree plantation of fruit-bearing and native trees
• River and soil conservation drives
• Waste management programs
• Sustainability workshops in schools and corporates
Participants from many nations work side by side in protecting the earth. These initiatives demonstrate that when the world cooperates, the planet heals.
India, through Gnarly Troop, is not only contributing but leading global environmental collaboration.
`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"cooperation-institution",
    id: 5,
    title: "COOPERATION THROUGH INSTITUTIONAL & CORPORATE ALLIANCES",
    imageSrc: "/images/visions/cooperation/img-5.jpg",
    alt: "COOPERATION THROUGH INSTITUTIONAL & CORPORATE ALLIANCES",
    caption:
      "Systemic change occurs when institutions unite. Gnarly Troop Global Federation builds bridges with...",
    body: `Systemic change occurs when institutions unite. Gnarly Troop Global Federation builds bridges with:
• Universities and research centres
• Government ministries
• Corporate CSR divisions
• Defence and paramilitary forces
• Tourism boards and cultural councils
• National and international NGOs
These partnerships enable:
• Skill development for rural and urban youth
• Joint sustainability projects
• Cultural preservation initiatives
• Technology and innovation exchange
• Inclusive growth programs
By working hand-in-hand, institutions create lasting impact, benefiting both local communities and global stakeholders.
This model of cooperation introduces a future where competition is replaced by collaboration for the greater good.
`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
  {
    slug:"cooperation-viksit-bharat",
    id: 6,
    title: "COOPERATION AS A PATH TO PEACE & VIKSIT BHARAT",
    imageSrc: "/images/visions/cooperation/img-6.jpg",
    alt: "COOPERATION AS A PATH TO PEACE & VIKSIT BHARAT",
    caption:
      "In a world often shaped by conflict, cooperation becomes the most powerful path to peace. Gnarly...",
    body: `In a world often shaped by conflict, cooperation becomes the most powerful path to peace. Gnarly Troop’s vision is rooted in non-violence, unity, mutual respect and spiritual wisdom drawn from India’s heritage.
By bringing together people of different nations, faiths, cultures and ideologies, the initiative becomes a bridge for understanding and reconciliation. It proves that peace is not an abstract dream — it is created when people unite in purpose.
Cooperation, therefore, is not just a principle of the 4C’s Vision —
It is the soul of the Gnarly Troop Movement.
As India rises as a Viksit Bharat, it does so not alone, but alongside the world. Gnarly Troop offers a global invitation:
“Walk together. Learn together. Protect together. Rise together.”
When nations cooperate, civilizations evolve, humanity heals, and a new world is born.`,
    author: "Gnarly Troop",
    readTime: "4 min read",
  },
];