import type { LeadershipItem } from "@/src/lib/leadership";
import type { Leader, LeadershipCategoryGroup } from "@/components/leadership/types";

export function toLeader(item: LeadershipItem): Leader {
  return {
    id: item.slug,
    name: item.name,
    designation: item.title,
    image: item.src,
    profileUrl: `/leadership/${item.slug}`,
    category: item.section,
    categoryName: item.categoryName,
    division: item.division,
    region: item.region,
    short: item.short,
  };
}

export function mapCategoryGroup(
  group: {
    slug: string;
    name: string;
    displayStyle: "carousel" | "grid";
    sortOrder: number;
    description?: string | null;
    members: LeadershipItem[];
  },
): LeadershipCategoryGroup {
  return {
    slug: group.slug,
    name: group.name,
    displayStyle: group.displayStyle,
    sortOrder: group.sortOrder,
    description: group.description,
    members: group.members.map(toLeader),
  };
}
