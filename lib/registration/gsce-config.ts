/** GSCE summit registration — categories, fee tiers, and section metadata. */

export type FeeTierSlug =
  | "complimentary"
  | "business_delegate"
  | "nri_foreign"
  | "institutional"
  | "youth"
  | "volunteer"
  | "sponsor";

export type AccredCategory = {
  slug: string;
  label: string;
  group: string;
  feeTier: FeeTierSlug;
};

export const FEE_TIERS: Record<
  FeeTierSlug,
  { label: string; amountPaise: number; description: string }
> = {
  complimentary: {
    label: "Complimentary",
    amountPaise: 0,
    description: "Heads of State, Ministers, Ambassadors, Speakers, Guests of Honour, Invited Dignitaries",
  },
  business_delegate: {
    label: "Business Delegate",
    amountPaise: 1_500_000,
    description: "₹15,000 — Business & corporate delegates",
  },
  nri_foreign: {
    label: "NRI / Foreign Delegate",
    amountPaise: 1_500_000,
    description: "₹15,000 — International participants",
  },
  institutional: {
    label: "Institutional Representative",
    amountPaise: 500_000,
    description: "₹5,000 — NGOs, academia, chambers, institutions",
  },
  youth: {
    label: "Youth Delegate",
    amountPaise: 100_000,
    description: "₹1,000 — Youth & student delegates",
  },
  volunteer: {
    label: "Volunteer",
    amountPaise: 50_000,
    description: "₹500 — Summit volunteers",
  },
  sponsor: {
    label: "Sponsor Delegate",
    amountPaise: 0,
    description: "As per sponsorship package — contact secretariat",
  },
};

export const ACCREDITATION_CATEGORIES: AccredCategory[] = [
  // DIPLOMATIC & GOVERNMENT — complimentary
  { slug: "head_of_state", label: "Head of State / Government", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "governor", label: "Governor", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "union_minister", label: "Union Minister", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "state_minister", label: "State Minister", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "member_of_parliament", label: "Member of Parliament", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "ambassador", label: "Ambassador / High Commissioner", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "consul_general", label: "Consul General", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "embassy_representative", label: "Embassy Representative", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "government_official", label: "Government Official", group: "Diplomatic & Government", feeTier: "complimentary" },
  { slug: "defence_representative", label: "Defence Representative", group: "Diplomatic & Government", feeTier: "complimentary" },
  // LEADERSHIP & POLICY
  { slug: "speaker", label: "Speaker", group: "Leadership & Policy", feeTier: "complimentary" },
  { slug: "moderator", label: "Moderator", group: "Leadership & Policy", feeTier: "complimentary" },
  { slug: "think_tank", label: "Think Tank Representative", group: "Leadership & Policy", feeTier: "institutional" },
  { slug: "policy_expert", label: "Policy Expert", group: "Leadership & Policy", feeTier: "institutional" },
  { slug: "academic_leader", label: "Academic Leader", group: "Leadership & Policy", feeTier: "institutional" },
  { slug: "intl_org", label: "International Organization Representative", group: "Leadership & Policy", feeTier: "institutional" },
  // BUSINESS & DEVELOPMENT
  { slug: "business_delegate", label: "Business Delegate", group: "Business & Development", feeTier: "business_delegate" },
  { slug: "ceo_founder", label: "CEO / Founder", group: "Business & Development", feeTier: "business_delegate" },
  { slug: "corporate_executive", label: "Corporate Executive", group: "Business & Development", feeTier: "business_delegate" },
  { slug: "csr_representative", label: "CSR Representative", group: "Business & Development", feeTier: "institutional" },
  { slug: "investor", label: "Investor", group: "Business & Development", feeTier: "business_delegate" },
  { slug: "chamber_delegate", label: "Chamber of Commerce Delegate", group: "Business & Development", feeTier: "institutional" },
  // CIVIL SOCIETY & CULTURE
  { slug: "cultural_ambassador", label: "Cultural Ambassador", group: "Civil Society & Culture", feeTier: "complimentary" },
  { slug: "ngo_representative", label: "NGO Representative", group: "Civil Society & Culture", feeTier: "institutional" },
  { slug: "heritage_leader", label: "Heritage Leader", group: "Civil Society & Culture", feeTier: "institutional" },
  { slug: "tourism_representative", label: "Tourism Representative", group: "Civil Society & Culture", feeTier: "institutional" },
  { slug: "spiritual_leader", label: "Spiritual Leader", group: "Civil Society & Culture", feeTier: "complimentary" },
  // YOUTH & EDUCATION
  { slug: "youth_delegate", label: "Youth Delegate", group: "Youth & Education", feeTier: "youth" },
  { slug: "student_leader", label: "Student Leader", group: "Youth & Education", feeTier: "youth" },
  { slug: "research_scholar", label: "Research Scholar", group: "Youth & Education", feeTier: "institutional" },
  { slug: "volunteer", label: "Volunteer", group: "Youth & Education", feeTier: "volunteer" },
  // SPECIAL
  { slug: "guest_of_honour", label: "Guest of Honour", group: "Invited Dignitaries", feeTier: "complimentary" },
  { slug: "invited_dignitary", label: "Invited Dignitary", group: "Invited Dignitaries", feeTier: "complimentary" },
  { slug: "nri_foreign_delegate", label: "NRI / Foreign Delegate", group: "International", feeTier: "nri_foreign" },
  { slug: "media_press", label: "Media / Press", group: "Media", feeTier: "complimentary" },
  { slug: "sponsor_delegate", label: "Sponsor Delegate", group: "Sponsors", feeTier: "sponsor" },
];

export const ACCREDITATION_GROUPS = [
  "Diplomatic & Government",
  "Leadership & Policy",
  "Business & Development",
  "Civil Society & Culture",
  "Youth & Education",
  "International",
  "Invited Dignitaries",
  "Media",
  "Sponsors",
] as const;

export const DAY1_SESSIONS = [
  { id: "d1_registration", label: "Delegate Registration & Traditional Welcome (09:00–10:00 AM)" },
  { id: "d1_inaugural", label: "Inaugural Ceremony & Lamp Lighting (10:00–10:45 AM)" },
  { id: "d1_parliamentary", label: "Parliamentary Talk — Preserving Heritage (10:45–11:45 AM)" },
  { id: "d1_leaders", label: "Leaders Talk — Reimagining Bharat (11:45–12:45 PM)" },
  { id: "d1_lunch", label: "Networking Lunch & Exhibition (12:45–01:30 PM)" },
  { id: "d1_ambassadors", label: "Ambassadors Talk — Youth Leadership (01:30–02:45 PM)" },
  { id: "d1_recognition", label: "Distinguished Recognition Ceremony (02:45–03:00 PM)" },
  { id: "d1_ministers", label: "Ministers Talk — Leadership Awards (03:00–04:30 PM)" },
  { id: "d1_cultural", label: "Rangilo Bharat Cultural Showcase (04:30–06:30 PM)" },
  { id: "d1_dinner", label: "Gala Diplomatic Dinner (06:30–07:30 PM)" },
] as const;

export const DAY2_SESSIONS = [
  { id: "d2_registration", label: "Registration & Morning Tea (09:00–10:00 AM)" },
  { id: "d2_youth", label: "Youth Dialogue Forum (10:00–10:45 AM)" },
  { id: "d2_parliamentary", label: "Parliamentary Talk — Sustainability & Tourism (10:45–11:45 AM)" },
  { id: "d2_awards", label: "National Awards Ceremony (11:45–12:30 PM)" },
  { id: "d2_ambassadors", label: "Ambassadors Forum — Youth for Global India (12:30–02:00 PM)" },
  { id: "d2_leaders", label: "Leaders Talk — Heritage & Business (02:00–03:00 PM)" },
  { id: "d2_flagoff", label: "Grand Flag-Off Ceremony — Explore Bharat (03:00–03:30 PM)" },
  { id: "d2_dialogues", label: "Cultural Exchange Dialogues (03:30–05:00 PM)" },
  { id: "d2_evening", label: "Inter-Cultural Evening & Diplomatic Reception (05:00 PM onwards)" },
] as const;

export function getAccreditationCategory(slug: string): AccredCategory | undefined {
  return ACCREDITATION_CATEGORIES.find((c) => c.slug === slug);
}

export function categoriesByGroup(group: string): AccredCategory[] {
  return ACCREDITATION_CATEGORIES.filter((c) => c.group === group);
}

export function accreditationLabel(slug: string | null | undefined): string {
  if (!slug) return "—";
  return getAccreditationCategory(slug)?.label ?? slug;
}

export function resolveRegistrationFee(slug: string): {
  feeTier: FeeTierSlug;
  amountPaise: number;
  label: string;
  requiresPayment: boolean;
} {
  const category = getAccreditationCategory(slug);
  const feeTier = category?.feeTier ?? "institutional";
  const tier = FEE_TIERS[feeTier];
  const requiresPayment = tier.amountPaise > 0 && feeTier !== "sponsor";
  return {
    feeTier,
    amountPaise: tier.amountPaise,
    label: tier.label,
    requiresPayment,
  };
}

export function formatFeeInr(amountPaise: number): string {
  if (amountPaise === 0) return "Complimentary";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

export function generateDelegateId(registrationId: string, eventYear = "2026"): string {
  const compact = registrationId.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `GSCE-${eventYear}-${compact}`;
}

/** Legacy eligibility mapping for backward compatibility */
export function mapAccreditationToLegacyEligibility(slug: string): string {
  const cat = getAccreditationCategory(slug);
  if (!cat) return "other";
  if (cat.group === "Diplomatic & Government") return "parliamentarians";
  if (cat.slug === "ambassador" || cat.slug === "consul_general") return "ambassadors";
  if (cat.group === "Business & Development") return "ceos";
  if (cat.group === "Leadership & Policy") return "academicians";
  if (cat.slug === "youth_delegate" || cat.slug === "student_leader") return "youth";
  if (cat.slug === "media_press") return "media";
  return "delegate";
}
