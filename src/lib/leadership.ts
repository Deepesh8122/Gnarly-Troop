import { getSupabaseEnv } from "@/lib/env";
import {
  fetchCmsLeadership,
  fetchCmsLeadershipMember,
} from "@/lib/cms/leadership";
import type { LeadershipSection } from "../data/leadershipData";

export type { LeadershipSection };

export type LeadershipArticle = {
  title: string;
  excerpt: string;
  href: string;
  type?: "Article" | "Video" | "Story";
};

export type LeadershipItem = {
  slug: string;
  src: string;
  filename: string;
  title: string;
  alt: string;
  name: string;
  division?: string;
  /** Category slug from team_categories */
  section: string;
  categoryName?: string;
  region?: string;
  short?: string;
  bio?: string;
  bioParagraphs?: string[];
  education?: string;
  linkedin?: string;
  articles?: LeadershipArticle[];
};

function useCms() {
  return getSupabaseEnv().configured;
}

export async function getLeadershipItems(): Promise<LeadershipItem[]> {
  if (!useCms()) return [];
  const cms = await fetchCmsLeadership();
  if (!cms) return [];
  return Object.values(cms.bySection).flat();
}

export async function getLeadershipItem(slug: string): Promise<LeadershipItem | null> {
  if (!useCms()) return null;
  return fetchCmsLeadershipMember(slug);
}

export async function getLeadershipBySection(section: string): Promise<LeadershipItem[]> {
  if (!useCms()) return [];
  const cms = await fetchCmsLeadership();
  return cms?.bySection[section] ?? [];
}

export async function getLeadershipByCategories() {
  if (!useCms()) return null;
  const { fetchCmsLeadershipByCategories } = await import("@/lib/cms/leadership");
  return fetchCmsLeadershipByCategories();
}

export async function getDivisions(): Promise<string[]> {
  if (!useCms()) return [];
  const cms = await fetchCmsLeadership();
  return cms?.divisions ?? [];
}

export async function getRegions(): Promise<string[]> {
  if (!useCms()) return [];
  const cms = await fetchCmsLeadership();
  return cms?.regions ?? [];
}

export async function getLeadershipStaticParams() {
  if (!useCms()) return [];
  const cms = await fetchCmsLeadership();
  return (cms?.slugs ?? []).map((slug) => ({ slug }));
}
