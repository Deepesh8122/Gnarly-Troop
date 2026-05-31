export const TEAM_CATEGORY_SLUGS = [
  "executive",
  "board",
  "advisory",
  "leaders",
  "historical",
] as const;

export const TEAM_CATEGORIES = [
  {
    slug: "executive",
    name: "Executive Policy & Leadership Council",
    display_style: "carousel",
    sort_order: 1,
  },
  {
    slug: "board",
    name: "Strategic Support, Resources & Partnerships Council",
    display_style: "carousel",
    sort_order: 2,
  },
  {
    slug: "advisory",
    name: "Gnarly Governance & Strategic Operations Council (Gnarly Team)",
    display_style: "grid",
    sort_order: 3,
  },
  {
    slug: "leaders",
    name: "Troop Command & Mission Implementation Units (Troop Team)",
    display_style: "grid",
    sort_order: 4,
  },
  {
    slug: "historical",
    name: "Member States, Chapters & Accredited Partners",
    display_style: "grid",
    sort_order: 5,
  },
] as const;

export const TEAM_CATEGORY_SLUG_SET = new Set<string>(TEAM_CATEGORY_SLUGS as readonly string[]);

export function isAllowedTeamCategorySlug(slug: string): boolean {
  return TEAM_CATEGORY_SLUG_SET.has(slug);
}
