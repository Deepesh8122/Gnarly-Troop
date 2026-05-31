/** GTGF Position Team Web Portal — category definitions */

export type PortalCategoryDef = {
  slug: string;
  name: string;
  display_style: "carousel" | "grid";
  sort_order: number;
};

export const TEAM_PORTAL_CATEGORIES: PortalCategoryDef[] = [
  {
    slug: "executive-policy-leadership",
    name: "Executive Policy & Leadership Council",
    display_style: "carousel",
    sort_order: 1,
  },
  {
    slug: "strategic-support-partnerships",
    name: "Strategic Support, Resources & Partnerships Council",
    display_style: "grid",
    sort_order: 2,
  },
  {
    slug: "gnarly-governance-operations",
    name: "Gnarly Governance & Strategic Operations Council (GNARLY TEAM)",
    display_style: "grid",
    sort_order: 3,
  },
  {
    slug: "troop-command-mission",
    name: "Troop Command & Mission Implementation Units (TROOP TEAM)",
    display_style: "grid",
    sort_order: 4,
  },
  {
    slug: "member-states-chapters",
    name: "Member States, Chapters & Accredited Partners",
    display_style: "grid",
    sort_order: 5,
  },
];

export type PortalMemberDef = {
  categorySlug: string;
  slug: string;
  full_name: string;
  designation: string;
  sort_order: number;
  bio_paragraphs: string[];
};

function m(
  categorySlug: string,
  slug: string,
  full_name: string,
  designation: string,
  sort_order: number,
  ...bio_paragraphs: string[]
): PortalMemberDef {
  return { categorySlug, slug, full_name, designation, sort_order, bio_paragraphs };
}

/** Team members sourced from GTGF Position Team Web Portal document */
export const TEAM_PORTAL_MEMBERS: PortalMemberDef[] = [
  // ——— Executive Policy & Leadership Council ———
  m(
    "executive-policy-leadership",
    "op-sharma",
    "Professor Group Captain O.P. Sharma",
    "Chief Adviser – Gnarly Troop Global Federation; Director General, Maharishi University of Information Technology",
    1,
    "Professor Group Captain O.P. Sharma is a nationally celebrated educationist, motivator, jurist, and spiritual thinker whose visionary leadership continues to influence institutions across India and abroad.",
    "Honored with the Pride of Nation Award, Saraswati Samman, Best Higher Education Professional EduTech Award, and Lifetime Achievement Award from Chicago University, USA, he serves as Chief Advisor to multiple national and international foundations.",
    "A prolific author of 26 books on value education, leadership, and spirituality, he champions the Gnarly Troop mission of value-based leadership and holistic development under the motto My Country, My Responsibility, My Pride.",
  ),
  m(
    "executive-policy-leadership",
    "amarjeet-gnarly",
    "Mr. Amarjeet Gnarly",
    "Founder President – Gnarly Troop Global Federation",
    2,
    "Mr. Amarjeet Kr. Thakur, popularly known as Amarjeet Gnarly, is one of India's most dynamic youth leaders, social entrepreneurs, and cultural diplomats. As Founder President of the Gnarly Troop Global Federation, he leads the national flagship initiative Padharo Mhare Desh Bharat (Welcome to My Country, India), recognized by the Hon'ble Union Minister of Culture & Tourism, Government of India.",
    "Under his stewardship, the initiative projects Bharat's spiritual wisdom, cultural heritage, and the 4C's Vision – Climate, Community, Culture, and Cooperation – on the global stage, guided by the Troop Spirit motto: My Country, My Responsibility, My Pride.",
    "Amarjeet has personally led and moderated more than 150 Visionary & Leadership Talk Shows engaging political leaders, ambassadors, senior government officials, and global thought leaders. He is the architect of the GT20 Summit and author of Emptiness of Pride.",
    "The upcoming Summit at Bharat Mandapam, New Delhi (February 2026) stands as a milestone in his mission of sustainable development, cultural exchange, and cooperative diplomacy for Viksit Bharat.",
  ),
  m(
    "executive-policy-leadership",
    "hari-shanker-singh",
    "Shri Hari Shanker Singh",
    "National President, Mahamana Malaviya Mission; Patron & Executive Committee Member – GTGF",
    3,
    "Shri Hari Shanker Singh is a distinguished nationalist thinker, institution builder, and visionary leader committed to India's civilizational values and nation-building ethos. An alumnus of Banaras Hindu University, he leads the Mahamana Malaviya Mission.",
    "Under his leadership, the monumental Mahamana Malaviya Vangmay project was released by the Hon'ble Prime Minister (2023) and Hon'ble Vice President (2025). He is spearheading the Madan Mohan Library & Research Centre for inclusive education nationwide.",
    "As Patron and Executive Committee Member of GTGF, he provides strategic guidance to Padharo Mhare Desh Bharat aligned with the national vision of Viksit Bharat.",
  ),
  m(
    "executive-policy-leadership",
    "rama-dutt",
    "Mrs. Rama Dutt",
    "Chief Executive Mentor – Gnarly Troop Global Federation",
    4,
    "Mrs. Rama Dutt is a distinguished educationist with over 37 years transforming education across India. She founded Mahaveer Public School, Jaipur, served as Principal of Sanskar School, and is Executive Trustee of the Maharaja Sawai Man Singh II Museum.",
    "Her accolades include the Women Empowerment Award, Bharat Vidya Shiromani Award, and Shree Radhakrishnan Samman. Under her leadership, Sanskar School earned the British Council International School Award.",
    "Her lifelong commitment to holistic, value-based education aligns with Gnarly Troop's mission through the Padharo Mhare Desh Bharat initiative.",
  ),
  m(
    "executive-policy-leadership",
    "mahadeo-jaiswal",
    "Prof. (Dr.) Mahadeo Jaiswal",
    "Executive Chair – Strategic Management, Gnarly Troop Global Federation; Director, IIM Sambalpur",
    5,
    "Prof. (Dr.) Mahadeo Jaiswal is the Founding Director of IIM Sambalpur and a global academic leader with a Ph.D. from Delhi University, PGPX from MIT, and Senior Fulbright Fellowship from Carnegie Mellon University.",
    "With 100+ research publications and seven books, his expertise spans digital innovation, social entrepreneurship, and e-governance. He pioneered the Flipped Classroom pedagogy in India and strengthens GTGF's 4C vision and Padharo Mhare Desh Bharat mission.",
  ),

  // ——— Strategic Support, Resources & Partnerships Council ———
  m(
    "strategic-support-partnerships",
    "js-dhull",
    "Major General (Dr.) J.S. Dhull, VSM (Retd.)",
    "Strategic Leader – Gnarly Troop Global Federation",
    1,
    "Major General (Dr.) J.S. Dhull, VSM (Retd.) served 37.5 years in the Indian Army and is honored with the Vishisht Seva Medal. He is Director of the Amity Institute of Defence Technology.",
    "Holding a Ph.D. in Human Resources and an MBA in HRM, he contributes profoundly to youth empowerment and global cooperation through Padharo Mhare Desh Bharat.",
  ),
  m(
    "strategic-support-partnerships",
    "sanjeev-chopra",
    "Brigadier (Dr.) Sanjeev Chopra (Veteran)",
    "Executive Director – Strategic Relations, Gnarly Troop Global Federation",
    2,
    "Brigadier (Dr.) Sanjeev Chopra is a decorated Army Veteran and global ESG & sustainability expert with over 30 years of distinguished service in military command and international diplomacy.",
    "A Ph.D. scholar in Climate Change and International Business Strategy, he aligns deeply with Gnarly Troop's 4C vision—Climate, Community, Culture, and Cooperation.",
  ),
  m(
    "strategic-support-partnerships",
    "vinod-kumar-mall",
    "Shri Vinod Kumar Mall, IPS (Retd.)",
    "Global Committee Member – Gnarly Troop Global Federation; Former DGP",
    3,
    "Shri Vinod Kumar Mall is a distinguished IPS officer and former Director General of Police with decades of exemplary service in national security, law enforcement, and public administration.",
    "He strengthens GTGF's global mission of peace, discipline, and responsible citizenship through Padharo Mhare Desh Bharat.",
  ),
  m(
    "strategic-support-partnerships",
    "jitendra-shekhawat",
    "Brig. Jitendra Shekhawat",
    "Troops Mission Director – Gnarly Troop Global Federation",
    4,
    "Brig. Jitendra Shekhawat (SC, VSM) is a decorated Indian Army veteran, strategist, and mentor drawing from Kautilya's Arthashastra and ancient Indian governance texts.",
    "As Troops Mission Director, he leads the mission of creating a Global Network for Active and Responsible Leadership amongst Youths (GNARLY) under the 4C's Vision.",
  ),
  m(
    "strategic-support-partnerships",
    "anand-sahu",
    "Shri Anand Sahu",
    "Executive Committee Member – Padharo Mhare Desh Bharat",
    5,
    "Shri Anand Sahu Ji is a dynamic social thinker and cultural bridge-builder, Aircraft Engineer by education from HIET, Chennai, with diaspora involvement across 50+ countries.",
    "As Executive Committee Member of Padharo Mhare Desh Bharat, he steers India's cultural resurgence and global outreach aligned with Viksit Bharat 2047 and the 4C's Vision.",
  ),
  m(
    "strategic-support-partnerships",
    "kamal-khandelwal",
    "H.E. Dr. Kamal K. Khandelwal",
    "Executive Committee Member – Welcome to My Country India",
    6,
    "H.E. Dr. Kamal K. Khandelwal is a distinguished Diplomat, Economist, and International Financial Advisor who has served across the USA, Latin America, Africa, the UAE, India, and Southeast Asia.",
    "His expertise in finance, infrastructure, education, and healthcare, combined with his role as International Arbitrator, strengthens GTGF's commitment to global cooperation and economic harmony.",
  ),
  m(
    "strategic-support-partnerships",
    "bp-singh",
    "Prof. (Dr.) B.P. Singh",
    "Executive Director – Cultural Learning, Gnarly Troop Global Federation; Vice-Chancellor, MUIT",
    7,
    "Prof. (Dr.) B.P. Singh is Vice-Chancellor of Maharishi University of Information Technology and Best Vice-Chancellor of the Year (2022). He champions holistic education integrating Transcendental Meditation.",
    "His leadership aligns with GTGF's mission of nurturing ethical, conscious, and globally responsible youth through Padharo Mhare Desh Bharat.",
  ),
  m(
    "strategic-support-partnerships",
    "mahendra-rajput",
    "Shri Mahendra K. Rajput",
    "Executive Chair – Governance, Gnarly Troop Global Federation",
    8,
    "Shri Mahendra K. Rajput leads Padharo Mhare Desh Bharat – Welcome to My Country India as Executive Chair for Governance, focusing on education, health, innovation, and Viksit Bharat.",
    "His dedication to scientific research and sustainable development fuels the Explore Bharat Campaign under the Troop motto My Country, My Responsibility, My Pride.",
  ),
  m(
    "strategic-support-partnerships",
    "arunkumar-nair",
    "Arunkumar Ayyappan Nair",
    "Vice President – Gnarly Troop Global Federation",
    9,
    "Mr. Arunkumar Ayyappan Nair brings over 25 years of experience in Operations, Sales, and Infrastructure Development. As Vice President, he drives national collaborations and global partnerships under GTGF's mission.",
  ),
  m(
    "strategic-support-partnerships",
    "devendra-goswami",
    "Dr. Devendra Goswami",
    "Executive Committee Member & Spiritual Mentor – Gnarly Troop Global Federation",
    10,
    "Dr. Devendra Goswami, Deputy Registrar at Madan Mohan Malaviya University of Technology, serves as Spiritual Mentor for Youth Cultural Exchange programs.",
    "He inspires youth to embrace compassion, mindfulness, and ethical living aligned with GTGF's 4C's Vision and Sanatan values.",
  ),
  m(
    "strategic-support-partnerships",
    "aparna-magee",
    "Ms. Aparna Magee",
    "Community Outreach Director – Gnarly Troop Global Federation",
    11,
    "Ms. Aparna Magee is Principal of Delhi Public School, Sushant Lok (Gurugram) with over three decades of academic leadership. Recipient of the World 100 21st Century Education Award.",
    "As Community Outreach Director, she spearheads educational collaboration, rural outreach, and youth engagement under GTGF's mission.",
  ),
  m(
    "strategic-support-partnerships",
    "manisha-singh",
    "Smt. Manisha Singh",
    "Executive Planning Director – Gnarly Troop Global Federation",
    12,
    "Smt. Manisha Singh is Principal of Sainik School & Shri Bhawani Niketan Public School, Jaipur. As Executive Planning Director, she drives strategic planning for Padharo Mhare Desh Bharat.",
  ),
  m(
    "strategic-support-partnerships",
    "shilpi-shekhawat",
    "Dr. Shilpi Singh Shekhawat",
    "Executive Association Director – Gnarly Troop Global Federation",
    13,
    "Dr. Shilpi Singh Shekhawat is Principal of Shri Ramrikhdas Poddar Bal Vidya Mandir and recipient of Swami Vivekanand National Principals Award 2024 and Jaipur Ratan Samman (2023).",
    "She spearheads the Gnarly Troop Adopted Village & Joy of Giving Campaign for sustainable rural development across Bharat.",
  ),
  m(
    "strategic-support-partnerships",
    "avani-shukla",
    "Mr. Avani Kumar Shukla",
    "Executive Member & Chief Administrative Officer (Voluntary) – Welcome to My Country, India",
    14,
    "Mr. Avani Kumar Shukla brings over 25 years in Operations, Sales, and Infrastructure Development across Luminous Electronics, Genus Power, and Advon Industries Limited.",
    "A respected mentor and motivational speaker, he supports GTGF through his voluntary role as Chief Administrative Officer, advancing the 4C Vision framework.",
  ),
  m(
    "strategic-support-partnerships",
    "manoj-vajpayee",
    "Prof. Manoj Vajpayee",
    "Executive Committee Member – Gnarly Troop Global Federation",
    15,
    "Prof. Manoj Vajpayee has over 32 years in higher education as Vice Chancellor, Pro-Chancellor, and Senior Director. He is Advisor to Jharkhand State Open University and Director of Sanskar Shiksha Bharti (NEP 2020).",
    "An advocate of inclusive education aligned with NEP 2020 and GTGF's youth empowerment mission.",
  ),
  m(
    "strategic-support-partnerships",
    "rishabh-chaturvedi",
    "Mr. Rishabh Vijay Chaturvedi",
    "Executive Committee Member – Gnarly Troop Global Federation; Founder, Braj Heritage Foundation",
    16,
    "Mr. Rishabh Vijay Chaturvedi is Founder of the Braj Heritage and Environment Foundation, dedicated to preserving Braj Bhoomi's spiritual and cultural heritage.",
    "The Braj Aashtha Mahakumbh collaboration with Welcome to My Country, India strengthens GTGF's 4C's Vision of Climate, Community, Culture, and Cooperation.",
  ),
  m(
    "strategic-support-partnerships",
    "mayank-chaubey",
    "Colonel Mayank Chaubey (Retd.)",
    "Executive Committee Member – Community Outreach in Foreign Countries",
    17,
    "Colonel Mayank Chaubey (Retd.) served over three decades in the Indian Army and as Director at SSIFS, Ministry of External Affairs, mentoring diplomats in geopolitical strategy.",
    "He leads Community Outreach in Foreign Countries under Welcome to My Country, India, strengthening India's cultural diplomacy and diaspora engagement.",
  ),

  // ——— GNARLY TEAM — Strategic Command roles + named officers ———
  m(
    "gnarly-governance-operations",
    "gnarly-commander",
    "Gnarly Commander (Gnarly 3.1)",
    "Chief Commanding Officer / Mission Director – Strategic Command Level A",
    1,
    "As the highest command authority, the Gnarly Commander leads from vision to execution, ensuring all initiatives from Welcome to My Country, India to global leadership summits are implemented with operational clarity and ethical integrity.",
  ),
  m(
    "gnarly-governance-operations",
    "gnarly-visionary-officer",
    "Visionary Officer (Gnarly 3.2)",
    "Chief Strategic & Policy Officer – Strategic Command Level A",
    2,
    "Tasked with shaping the Federation's long-term strategic direction, integrating the 4C's Vision into all policies, programs, and global initiatives including cultural diplomacy and climate action.",
  ),
  m(
    "gnarly-governance-operations",
    "gnarly-cfo",
    "Chief Financial Officer (Gnarly 3.3)",
    "Financial Controller / Quartermaster-General – Strategic Command Level A",
    3,
    "Oversees financial strategy, compliance, and resource planning for rural development programs, international internships, and global partnerships with transparency and audit standards.",
  ),
  m(
    "gnarly-governance-operations",
    "shivani-rai",
    "Shivani Rai",
    "Central Troop Coordinator (Gnarly 3.9) – Strategic Command Level A",
    9,
    "Shivani Rai is a graduate and MBA, serving as Central Troop Coordinator—the vital link between strategic leadership and on-ground execution across national and global campaigns.",
    "She coordinates Troop units nationwide, consolidates operational reports, and advances the 4C vision of Climate, Community, Culture, and Cooperation in action.",
  ),
  m(
    "gnarly-governance-operations",
    "akanksha-singh",
    "Akanksha Singh",
    "International Cooperation Officer (Gnarly 3.14) – Strategic Command Level A",
    14,
    "Akanksha Singh is a PhD Scholar in International Relations, published author, and former associate of the Ministry of External Affairs with the Uttar Pradesh Government.",
    "At Gnarly Troop, she strengthens global partnerships, promotes cross-cultural dialogue, and advances meaningful missions with worldwide impact.",
  ),

  // ——— TROOP TEAM — Field Operations roles ———
  m(
    "troop-command-mission",
    "troop-senior-patrol-leader",
    "Senior Patrol Leader (Troop 4.1)",
    "Field Unit Commander – Operational Authority Level B",
    1,
    "The Senior Patrol Leader drives mission execution in operational theatres, leading troop activities, climate action camps, rural empowerment drives, and youth training cohorts under strategic directives.",
  ),
  m(
    "troop-command-mission",
    "troop-vice-coordinator",
    "Troop Vice Coordinator (Troop 4.2)",
    "Deputy Field Commander – Operational Authority Level B",
    2,
    "Ensures continuity of operations, manages logistics coordination, and supervises multiple field units across overlapping national campaigns.",
  ),
  m(
    "troop-command-mission",
    "troop-environmental-officer",
    "Weather & Environmental Officer (Troop 4.6)",
    "Environmental Risk & Safety Officer – Operational Authority Level B",
    6,
    "Aligned with the Climate dimension of the 4C's Vision, monitors climate conditions, assesses terrain risks, and embeds sustainability protocols into field programming.",
  ),

  // ——— Member States, Chapters & Partners ———
  m(
    "member-states-chapters",
    "state-secretaries-network",
    "Member State Secretaries Network",
    "Regional Representation – 28 States & Chapters",
    1,
    "The Member States, Chapters & Accredited Partners network provides regional representation, stakeholder participation, and grassroots integration across India and accredited international chapters.",
    "State Secretaries coordinate chapter activities, youth mobilisation, and local implementation of Padharo Mhare Desh Bharat under the Troop Spirit of My Country, My Responsibility, My Pride.",
  ),
];
