import type {
  CollaborationDetail,
  CollaborationInitiative,
} from "@/src/data/collaborationData";
import { collaborationLanding as staticLanding } from "@/src/data/collaborationData";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { isPublicCmsConfigured } from "@/lib/cms/public-read";
import { getPublicMediaUrl } from "@gnarly/lib";

function normalizePartnerLogo(
  logo: { bucket: string; storage_path: string } | { bucket: string; storage_path: string }[] | null | undefined,
): { bucket: string; storage_path: string } | null {
  if (!logo) return null;
  const row = Array.isArray(logo) ? logo[0] : logo;
  if (!row?.storage_path) return null;
  return row;
}

function partnerImageSrc(row: {
  legacy_image_path?: string | null;
  logo: { bucket: string; storage_path: string } | null;
}): string {
  if (row.legacy_image_path) {
    return row.legacy_image_path.startsWith("/")
      ? row.legacy_image_path
      : `/${row.legacy_image_path}`;
  }
  const logo = row.logo;
  if (!logo?.storage_path) return "/images/logos/logo-2.png";
  if (logo.bucket === "site" || logo.storage_path.startsWith("/")) {
    return logo.storage_path.startsWith("/")
      ? logo.storage_path
      : `/${logo.storage_path}`;
  }
  return getPublicMediaUrl(logo);
}

export async function hasCmsCollaboration(): Promise<boolean> {
  if (!isPublicCmsConfigured()) return false;
  try {
    const supabase = createPublicSupabaseClient();
    const { count, error } = await supabase
      .from("collaboration_partners")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true);
    if (error) {
      console.error("[hasCmsCollaboration]", error.message);
      return false;
    }
    return (count ?? 0) > 0;
  } catch (error) {
    console.error("[hasCmsCollaboration]", error);
    return false;
  }
}

export async function fetchCollaborationLanding(): Promise<
  typeof staticLanding | null
> {
  if (!isPublicCmsConfigured()) return null;
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "collaboration_landing")
    .maybeSingle();

  if (error) {
    console.error("[fetchCollaborationLanding]", error.message);
    return null;
  }

  if (!data?.value || typeof data.value !== "object") return null;
  return data.value as typeof staticLanding;
}

export async function fetchCmsCollaborationInitiatives(): Promise<
  CollaborationInitiative[] | null
> {
  if (!isPublicCmsConfigured()) return null;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("collaboration_partners")
    .select(
      "slug, name, short_description, legacy_image_path, logo:media_library!collaboration_partners_logo_media_id_fkey(bucket, storage_path)",
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  if (error) {
    console.error("[fetchCmsCollaborationInitiatives]", error.message);
    return null;
  }

  if (!data?.length) return null;

  return data.map((p) => {
    const logo = normalizePartnerLogo(p.logo);
    return {
      slug: p.slug,
      title: p.name,
      excerpt: p.short_description ?? "",
      imageSrc: partnerImageSrc({ legacy_image_path: p.legacy_image_path, logo }),
      alt: p.name,
    };
  });
}

export async function fetchCmsCollaborationDetail(
  slug: string,
): Promise<CollaborationDetail | null> {
  if (!isPublicCmsConfigured()) return null;

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("collaboration_partners")
    .select("slug, name, short_description, detail_content")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

  if (error) {
    console.error("[fetchCmsCollaborationDetail]", slug, error.message);
    return null;
  }

  if (!data) return null;

  const detail = data.detail_content as Partial<CollaborationDetail> | null;
  if (detail && detail.title) {
    return {
      slug: data.slug,
      title: detail.title,
      subtitle: detail.subtitle ?? data.short_description ?? "",
      lead: detail.lead ?? [],
      heroVideo: detail.heroVideo,
      heroImage: detail.heroImage,
      stat: detail.stat,
      whyTitle: detail.whyTitle,
      whyBullets: detail.whyBullets ?? [],
      pullQuote: detail.pullQuote ?? "",
      howWeWork: detail.howWeWork ?? [],
      body: detail.body ?? "",
      relatedStories: detail.relatedStories ?? [],
    };
  }

  return {
    slug: data.slug,
    title: data.name,
    subtitle: data.short_description ?? "",
    lead: [],
    whyBullets: [],
    pullQuote: "",
    howWeWork: [],
    body: "",
    relatedStories: [],
  };
}

export async function fetchCmsCollaborationSlugs(): Promise<string[]> {
  if (!isPublicCmsConfigured()) return [];
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("collaboration_partners")
    .select("slug")
    .eq("status", "published")
    .eq("is_enabled", true);

  if (error) {
    console.error("[fetchCmsCollaborationSlugs]", error.message);
    return [];
  }

  return (data ?? []).map((r) => r.slug);
}
