export interface Leader {
  id: string;
  name: string;
  designation: string;
  image: string;
  profileUrl: string;
  category: string;
  categoryName?: string;
  division?: string;
  region?: string;
  short?: string;
}

export type LeadershipCategoryGroup = {
  slug: string;
  name: string;
  displayStyle: "carousel" | "grid";
  sortOrder: number;
  description?: string | null;
  members: Leader[];
};

/** CMS `team_categories.description` value for a separate bottom grid section */
export function isStandaloneCategory(category: {
  description?: string | null;
}): boolean {
  return category.description?.trim().toLowerCase() === "standalone";
}
