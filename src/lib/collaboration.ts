import type {
  CollaborationDetail,
  CollaborationInitiative,
  CollaborationLandingContent,
  CollaborationLandingSections,
} from "../data/collaborationData";
import { normalizeCollaborationLanding } from "@/lib/cms/normalizeCollaborationLanding";
import { getSupabaseEnv } from "@/lib/env";
import {
  fetchCmsCollaborationDetail,
  fetchCmsCollaborationInitiatives,
  fetchCmsCollaborationSlugs,
  fetchCollaborationLanding,
} from "@/lib/cms/collaboration";

export type { CollaborationDetail, CollaborationInitiative, CollaborationLandingContent, CollaborationLandingSections };

function useCms() {
  return getSupabaseEnv().configured;
}

/** CMS-first; merges saved JSON with defaults so the page always renders. */
export async function getCollaborationLandingContent(): Promise<CollaborationLandingContent> {
  if (useCms()) {
    const cms = await fetchCollaborationLanding();
    if (cms) return cms;
  }
  return normalizeCollaborationLanding({});
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
