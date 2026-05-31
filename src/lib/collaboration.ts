import type {
  CollaborationDetail,
  CollaborationInitiative,
} from "../data/collaborationData";
import { getSupabaseEnv } from "@/lib/env";
import {
  fetchCmsCollaborationDetail,
  fetchCmsCollaborationInitiatives,
  fetchCmsCollaborationSlugs,
  fetchCollaborationLanding,
} from "@/lib/cms/collaboration";

export type { CollaborationDetail, CollaborationInitiative };

function useCms() {
  return getSupabaseEnv().configured;
}

export async function getCollaborationLandingContent() {
  if (!useCms()) return null;
  return fetchCollaborationLanding();
}

export async function getCollaborationInitiatives(): Promise<CollaborationInitiative[]> {
  if (!useCms()) return [];
  const cms = await fetchCmsCollaborationInitiatives();
  return cms ?? [];
}

export async function getCollaborationDetailBySlug(
  slug: string,
): Promise<CollaborationDetail | null> {
  if (!useCms()) return null;
  return fetchCmsCollaborationDetail(slug);
}

export async function getCollaborationSlugs(): Promise<string[]> {
  if (!useCms()) return [];
  return fetchCmsCollaborationSlugs();
}
