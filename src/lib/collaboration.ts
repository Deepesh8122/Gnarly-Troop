import {
  collaborationDetails,
  collaborationInitiatives,
  getCollaborationDetail,
  getAllCollaborationSlugs,
  type CollaborationDetail,
  type CollaborationInitiative,
} from "../data/collaborationData";

export type { CollaborationDetail, CollaborationInitiative };

export async function getCollaborationInitiatives(): Promise<CollaborationInitiative[]> {
  return collaborationInitiatives;
}

export async function getCollaborationDetailBySlug(
  slug: string,
): Promise<CollaborationDetail | null> {
  return getCollaborationDetail(slug);
}

export async function getCollaborationSlugs(): Promise<string[]> {
  return getAllCollaborationSlugs();
}
