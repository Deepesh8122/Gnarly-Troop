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

export const featuredStory: FeaturedStory = {
  slug:"feature-story",
  title:
    "COMMUNITY — Building Resilient, Values-Driven Communities Where Every Citizen Contributes to a Thriving, Self-Reliant, and Dignified India",
  imageSrc: "/images/visions/community/feature-article.jpg",
  alt: "Featured article image",
  caption:
    "India’s true strength has always lived in its communities — in the quiet resilience of its villages, the wisdom of its elders, the dreams of its youth, and the collective spirit that binds people together beyond caste, class, or region...",
  body: `
India’s true strength has always lived in its communities — in the quiet resilience of its villages, the wisdom of its elders, the dreams of its youth, and the collective spirit that binds people together beyond caste, class, or region. Yet in the age of rapid urbanisation, digital isolation, and economic imbalance, that spirit has been gradually weakened. Villages are losing their youth, traditions are fading, and communities that once thrived on cooperation now struggle with dependency, fragmentation, and loss of identity.
It is in this crucial moment that Gnarly Troop Global Federation, under its flagship initiative “Welcome to My Country – India (Padharo Mhare Desh Bharat)” – Global Leadership Summit & Cultural Exchange, has ignited a new national model of community revival. This is not charity. This is not aid. This is awakening. A return to values. A movement to rebuild India from its roots — village by village, youth by youth, family by family.
The Community Pillar of the 4C Vision is built on a simple but powerful belief:
If the village stands strong, the nation stands invincible.
This mission is about creating self-reliant, values-driven, knowledge-empowered and dignity-centred communities where every citizen is not merely a resident — but a nation-builder. Sustainability, education, healthcare, entrepreneurship, cultural identity, women empowerment, youth leadership and environmental consciousness are woven into one integrated structure.
Through real participation, local ownership, leadership training and global cultural exchange, ordinary villagers become extraordinary contributors to India’s destiny. Children begin to see themselves as leaders. Women rise as community guides. Elders are honoured as guardians of wisdom. Youth become ambassadors of Viksit Bharat.
This is not a project.
This is civilisation-building in action.
“My Country. My Responsibility. My Pride.” is no longer a slogan.
It becomes a living truth.`,
author:"Amarjeet",
readTime:""
};

export const largeCards: LargeCard[] = [
  {
    slug:"reality-indian",
    id: 1,
    kicker: "The Reality Facing Rural India Today",
    title: "For centuries, India’s villages have preserved its soul.",
    imageSrc: "/images/visions/community/section-1.jpg",
    alt: "Section 1 image",
    caption:
      "One of the most powerful symbols of Gnarly Troop’s Climate mission is the Annual Marathon for Clean Air and Blue Skies...",
    body: `They hold ancestral knowledge, agricultural wisdom, collective harmony and living traditions. Yet modern pressures have triggered a silent crisis: migration in search of employment, abandonment of traditional skills, lack of quality education, inadequate healthcare, poor sanitation and declining community cohesion.
The brightest minds leave.
The land grows silent.
The culture fades.
Rural youth feel disconnected from national purpose. Women remain under-represented. Opportunities appear distant and unreachable. A sense of inferiority replaces the pride of identity. Villages begin to view themselves as forgotten corners of the country instead of its foundation.
Gnarly Troop recognised that the question was not “How do we save villages?”
But rather “How do we make villages lead again?”
The answer lay in empowerment, dignity, opportunity and leadership — not dependency. By restoring confidence, knowledge, skills and self-belief, villages could be transformed into centres of productivity, wisdom and inspiration.
And so began one of India’s most visionary grassroots missions: to create replicated Model Communities of National Pride — starting with one village, and growing into a nationwide movement.`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"community-transformation",
    id: 2,
    kicker:
      "Muzaffarpur, Bihar — A Living Laboratory of Community Transformation",
    title:
      "The adopted village in Muzaffarpur district became the living foundation of the Community Pillar",
    imageSrc: "/images/visions/community/section-2.jpg",
    alt: "Section 2 image",
    caption:
      "Instead of imposing solutions, Gnarly Troop began by listening — to farmers, mothers, elders, youth, children and local leaders...",
    body: `Instead of imposing solutions, Gnarly Troop began by listening — to farmers, mothers, elders, youth, children and local leaders. Needs were mapped not only in material terms but in emotional and psychological dimensions as well.
Through community meetings, youth circles, women’s gatherings and elder consultations, the real obstacles emerged: lack of confidence, lack of exposure, lack of structure. But what also surfaced was hope — the quiet but burning desire for change.
Youth groups were formed. Women were encouraged to speak. Elders were honoured as knowledge keepers. Surveys, dialogues and vision workshops created a sense of ownership, belonging and responsibility.
And something unseen before happened: the village began to believe in itself again.
Cleanliness drives started. Learning circles formed. Gardens were planted. Walls were painted with messages of discipline, unity and national pride. Every step, small in size but massive in significance, moved the community from dependence to dignity.
Trust built participation.
Participation built ownership.
Ownership began transformation.
`,
author:"Amarjeet",
readTime:""
  },
];

export const smallCards: SmallCard[] = [
  {
    slug:"community-education",
    id: 1,
    title: "The Troop Academy — Educating for Life, Leadership & Nation",
    imageSrc: "/images/visions/community/img-1.jpg",
    alt: "The Troop Academy — Educating for Life, Leadership & Nation",
    caption:
      "The Troop Academy represents a revolutionary model of rural education. It is not about memorising books...",
    body: `The Troop Academy represents a revolutionary model of rural education. It is not about memorising books for exams — it is about building conscious citizens for India’s future. Here, children are taught not only to succeed individually, but to serve collectively.
Key focus areas include:
• Values-based education – integrity, discipline, respect, nationalism
• Leadership development – teamwork, communication, responsibility
• Digital literacy – technology, online learning, AI awareness
• Environmental stewardship – sustainable living, climate care
• Cultural revival – music, art, folklore, heritage knowledge
• Civic and constitutional awareness – rights, duties, democracy
Students no longer see limitations. They see possibilities. They understand that leadership is not defined by location but by mindset.
“I am not just from a village.
I am from India.
And I am responsible for her future.”
The Troop Academy plants this belief into every young heart, shaping a new generation of community leaders, innovators, protectors and ambassadors of Viksit Bharat.
 
`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"rural-development",
    id: 2,
    title: "Rural Development Centre — Skills, Sustainability & Self-Reliance",
    imageSrc: "/images/visions/community/img-2.jpg",
    alt: "Rural Development Centre — Skills, Sustainability & Self-Reliance",
    caption:
      "The Rural Development Centre turns vision into livelihood. It is the economic engine of...",
    body: `The Rural Development Centre turns vision into livelihood. It is the economic engine of the community model. Skills are identified, developed and transformed into sustainable opportunities.
Key initiatives include:
• Organic farming & soil regeneration
• Handicraft & artisan development
• Digital skills & remote micro-work
• Start-up training & entrepreneurship support
• Women’s self-help & leadership groups
• Financial literacy & savings culture
• Sustainable agriculture & water conservation
For the first time, the community does not wait for external jobs. It creates its own wealth, rooted in local knowledge and innovation.
Women become micro-entrepreneurs. Youth become trainers. Farmers become researchers. The village becomes an Atmanirbhar ecosystem with dignity and pride.
This is not poverty management.
This is prosperity engineering.
`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"healthy-living",
    id: 3,
    title: " Healthy Living & Mindset Transformation",
    imageSrc: "/images/visions/community/img-3.jpg",
    alt: " Healthy Living & Mindset Transformation",
    caption:
      "No community can grow without physically and mentally healthy citizens. That is why Gnarly...",
    body: `No community can grow without physically and mentally healthy citizens. That is why Gnarly Troop integrates traditional and modern healthcare awareness into daily village life:
• Yoga & meditation practices
• Ayurveda & local healing traditions
• Clean water & hygiene awareness
• Sanitation infrastructure building
• Mental wellness & stress management
• Anti-addiction and positive mindset campaigns
Slowly, change becomes visible — in cleaner surroundings, healthier families, disciplined routines and renewed self-respect. The culture of responsibility replaces helplessness. A powerful realisation emerges:
A healthy mind builds a healthy village.
A healthy village builds a strong nation.`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"measurable-impact",
    id: 4,
    title: "Measurable Impact — A Living Model of Hope",
    imageSrc: "/images/visions/community/img-4.jpg",
    alt: "Measurable Impact — A Living Model of Hope",
    caption:
      "The results, though still in growth phase, are already transformational:...",
    body: `The results, though still in growth phase, are already transformational:
• Increased school participation
• Rise in women-led initiatives
• Improved cleanliness and environment
• Stronger digital literacy
• Greater unity and discipline
• Renewed national pride
A once-forgotten village now stands as a model of hope — proving that when people are empowered, the impossible becomes possible.
Muzaffarpur is no longer just a location.
It is a message to India: transformation begins at home.`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"next-mission",
    id: 5,
    title: "The Next Mission — 28 Model Villages in 28 States",
    imageSrc: "/images/visions/community/img-5.jpg",
    alt: "The Next Mission — 28 Model Villages in 28 States",
    caption:
      "The next phase of “Welcome to My Country – India” will establish 28 Model Villages across 28 States...",
    body: `Muzaffarpur is only the beginning.
The next phase of “Welcome to My Country – India” will establish 28 Model Villages across 28 States, each becoming:
• A Troop Academy hub
• A Rural Development Centre
• A cultural & environmental learning zone
• A youth leadership exchange unit
• A global collaboration model
Interconnected through leadership camps, cultural exchange, digital classrooms and volunteer missions, this village network will become India’s first youth-led national community alliance.
From a single village to an entire nation — and from a nation to the global stage — India will redefine what true community leadership looks like.
Act locally. Heal nationally. Inspire globally.
This is not just development.
This is India reclaiming her civilisational strength.
My Country. My Responsibility. My Pride.`,
author:"Amarjeet",
readTime:""
  },
  {
    slug:"generational-promise",
    id: 6,
    title: "Guided by a Generational Promise",
    imageSrc: "/images/visions/community/img-6.jpg",
    alt: "Message to India and the world",
    caption:
      "Guided by its flagship campaign, “Welcome to My Country – India (Padharo Mhare Desh Bharat)...",
    body: `Guided by its flagship campaign, “Welcome to My Country –
                  India (Padharo Mhare Desh Bharat) – Global Leadership Summit &
                  Cultural Exchange,” Gnarly Troop Global Federation stands as a
                  global force for local rural empowerment. Scheduled annually,
                  this visionary platform brings international leaders, youth
                  changemakers, artisans, farmers, and social entrepreneurs
                  together to build a resilient, self-reliant, and inclusive
                  Bharat. Through cultural exchange, skill development,
                  sustainable livelihood initiatives, and community-based
                  tourism, Gnarly Troop transforms rural India into a global
                  model of unity, resilience, and innovation. This movement
                  strengthens grassroots leadership while advancing the national
                  mission of Viksit Bharat, reinforcing the belief that
                  empowered communities build powerful nations.`,
                  author:"Amarjeet",
readTime:""
  },
];