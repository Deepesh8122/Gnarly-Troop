import type {
  CollaborationDetail,
  CollaborationInitiative,
} from "@/src/data/collaborationData";
import { collaborationLanding as staticLanding } from "@/src/data/collaborationData";
import { getSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPublicMediaUrl } from "@gnarly/lib";

function partnerImageSrc(row: {
  legacy_image_path?: string | null;
  logo: { bucket: string; storage_path: string } | null;
}): string {
  if (row.legacy_image_path) {
    return row.legacy_image_path.startsWith("/")
      ? row.legacy_image_path
      : `/${row.legacy_image_path}`;
  }
  if (!row.logo) return "/images/logos/logo-2.png";
  if (row.logo.bucket === "site" || row.logo.storage_path.startsWith("/")) {
    return row.logo.storage_path.startsWith("/")
      ? row.logo.storage_path
      : `/${row.logo.storage_path}`;
  }
  return getPublicMediaUrl(row.logo);
}

export async function hasCmsCollaboration(): Promise<boolean> {
  if (!getSupabaseEnv().configured) return false;
  try {
    const supabase = await createServerSupabaseClient();
    const { count } = await supabase
      .from("collaboration_partners")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("is_enabled", true);
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function fetchCollaborationLanding(): Promise<
  typeof staticLanding | null
> {
  if (!getSupabaseEnv().configured) return null;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "collaboration_landing")
    .maybeSingle();

  if (!data?.value || typeof data.value !== "object") return null;
  return data.value as typeof staticLanding;
}

export async function fetchCmsCollaborationInitiatives(): Promise<
  CollaborationInitiative[] | null
> {
  if (!(await hasCmsCollaboration())) return null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("collaboration_partners")
    .select(
      "slug, name, short_description, legacy_image_path, logo:media_library!collaboration_partners_logo_media_id_fkey(bucket, storage_path)",
    )
    .eq("status", "published")
    .eq("is_enabled", true)
    .order("sort_order");

  if (!data?.length) return null;

  return data.map((p) => {
    const logo = Array.isArray(p.logo) ? p.logo[0] : p.logo;
    return {
      slug: p.slug,
      title: p.name,
      excerpt: p.short_description ?? "",
      imageSrc: partnerImageSrc({ logo: logo ?? null }),
      alt: p.name,
    };
  });
}

export async function fetchCmsCollaborationDetail(
  slug: string,
): Promise<CollaborationDetail | null> {
  if (!(await hasCmsCollaboration())) return null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("collaboration_partners")
    .select("slug, name, short_description, detail_content")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_enabled", true)
    .maybeSingle();

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
  if (!(await hasCmsCollaboration())) return [];
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("collaboration_partners")
    .select("slug")
    .eq("status", "published")
    .eq("is_enabled", true);
  return (data ?? []).map((r) => r.slug);
}
