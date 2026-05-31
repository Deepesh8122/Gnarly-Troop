import leadershipData from "@/src/data/leadershipData";
import {
  collaborationDetails,
  collaborationInitiatives,
  collaborationLanding,
} from "@/src/data/collaborationData";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { TEAM_CATEGORIES } from "@/lib/team-categories";

const DEFAULT_TEAM_CATEGORIES = TEAM_CATEGORIES as unknown as {
  slug: string;
  name: string;
  display_style: string;
  sort_order: number;
}[];

const DEFAULT_COLLAB_CATEGORIES = [
  { slug: "economic-opportunity", name: "Economic Opportunity", sort_order: 1 },
  { slug: "youth-partnerships", name: "Youth Partnerships", sort_order: 2 },
  { slug: "humanitarian", name: "Humanitarian", sort_order: 3 },
  { slug: "academic", name: "Academic & Innovation", sort_order: 4 },
];

function siteImagePath(image: string): string {
  return image.startsWith("/") ? image : `/images/leadership/${image}`;
}

async function ensureCategories(supabase: ReturnType<typeof createServiceRoleClient>) {
  const warnings: string[] = [];

  for (const cat of DEFAULT_TEAM_CATEGORIES) {
    const { error } = await supabase.from("team_categories").upsert(cat, { onConflict: "slug" });
    if (error) warnings.push(`team_categories ${cat.slug}: ${error.message}`);
  }

  for (const cat of DEFAULT_COLLAB_CATEGORIES) {
    const { error } = await supabase.from("collaboration_categories").upsert(cat, {
      onConflict: "slug",
    });
    if (error) warnings.push(`collaboration_categories ${cat.slug}: ${error.message}`);
  }

  return warnings;
}

export async function migrateStaticContentToSupabase(): Promise<{
  ok: boolean;
  message: string;
  counts?: Record<string, number>;
  warnings?: string[];
}> {
  const supabase = createServiceRoleClient();
  const warnings = await ensureCategories(supabase);

  const { data: categories, error: catErr } = await supabase
    .from("team_categories")
    .select("id, slug");
  if (catErr) throw new Error(catErr.message);
  if (!categories?.length) {
    throw new Error("No team_categories found. Run supabase/seed.sql first.");
  }

  const catMap = new Map(categories.map((c) => [c.slug, c.id]));
  const skippedMembers: string[] = [];

  let members = 0;
  for (const item of leadershipData) {
    const categoryId = catMap.get(item.section);
    if (!categoryId) {
      skippedMembers.push(`${item.slug} (unknown section: ${item.section})`);
      continue;
    }

    const legacyImage = siteImagePath(item.image);

    const { data: member, error } = await supabase
      .from("team_members")
      .upsert(
        {
          category_id: categoryId,
          slug: item.slug,
          full_name: item.name,
          designation: item.title,
          division: item.division ?? null,
          region: item.region ?? null,
          bio_paragraphs: item.bioParagraphs ?? (item.bio ? [item.bio] : []),
          education: item.education ?? null,
          linkedin_url: item.linkedin ?? null,
          legacy_image_path: legacyImage,
          image_media_id: null,
          sort_order: members,
          is_enabled: true,
          status: "published",
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error) {
      if (error.message.includes("legacy_image_path")) {
        throw new Error(
          `${error.message} — Run supabase/migrations/20260527120000_legacy_image_paths.sql in the SQL Editor.`,
        );
      }
      throw new Error(`team_members ${item.slug}: ${error.message}`);
    }

    await supabase.from("team_member_articles").delete().eq("team_member_id", member.id);

    if (item.articles?.length) {
      const { error: artErr } = await supabase.from("team_member_articles").insert(
        item.articles.map((a, i) => ({
          team_member_id: member.id,
          title: a.title,
          excerpt: a.excerpt,
          href: a.href,
          article_type: a.type ?? "Article",
          sort_order: i,
          is_enabled: true,
        })),
      );
      if (artErr) warnings.push(`articles ${item.slug}: ${artErr.message}`);
    }

    members += 1;
  }

  const { data: collabCats } = await supabase.from("collaboration_categories").select("id, slug");
  const collabCatMap = new Map((collabCats ?? []).map((c) => [c.slug, c.id]));

  let partners = 0;
  for (const init of collaborationInitiatives) {
    const detail = collaborationDetails.find((d) => d.slug === init.slug);
    const categorySlug = init.slug.includes("economic")
      ? "economic-opportunity"
      : init.slug.includes("youth")
        ? "youth-partnerships"
        : init.slug.includes("humanitarian")
          ? "humanitarian"
          : "academic";

    const { error } = await supabase.from("collaboration_partners").upsert(
      {
        slug: init.slug,
        name: init.title,
        short_description: init.excerpt,
        category_id: collabCatMap.get(categorySlug) ?? null,
        legacy_image_path: siteImagePath(init.imageSrc),
        logo_media_id: null,
        detail_content: detail ?? {},
        sort_order: partners,
        is_enabled: true,
        status: "published",
      },
      { onConflict: "slug" },
    );

    if (error) {
      if (error.message.includes("legacy_image_path")) {
        throw new Error(
          `${error.message} — Run supabase/migrations/20260527120000_legacy_image_paths.sql in the SQL Editor.`,
        );
      }
      throw new Error(`collaboration_partners ${init.slug}: ${error.message}`);
    }
    partners += 1;
  }

  const { error: landingErr } = await supabase.from("site_settings").upsert(
    {
      key: "collaboration_landing",
      value: collaborationLanding,
      description: "Collaboration landing page content (hero, narratives, stats)",
    },
    { onConflict: "key" },
  );
  if (landingErr) throw new Error(`site_settings: ${landingErr.message}`);

  await supabase.from("site_settings").upsert(
    {
      key: "last_content_import",
      value: {
        at: new Date().toISOString(),
        members,
        partners,
        skippedMembers,
      },
      description: "Last static content import metadata",
    },
    { onConflict: "key" },
  );

  if (skippedMembers.length) {
    warnings.push(`Skipped ${skippedMembers.length} members: ${skippedMembers.join(", ")}`);
  }

  if (members === 0) {
    throw new Error(
      "No leadership members imported. Ensure team_categories exist (run seed.sql) and leadershipData sections match category slugs.",
    );
  }

  const visionWarnings = await importVisionStories(supabase);
  warnings.push(...visionWarnings);

  return {
    ok: true,
    message: `Imported ${members} team members, ${partners} partners, landing content, and 4C vision stories.`,
    counts: { members, partners },
    warnings: warnings.length ? warnings : undefined,
  };
}

async function importVisionStories(
  supabase: ReturnType<typeof createServiceRoleClient>,
): Promise<string[]> {
  const warnings: string[] = [];
  const pillars = ["climate", "community", "culture", "cooperation"] as const;
  const storyModules = {
    climate: () => import("@/app/data/climateStories"),
    community: () => import("@/app/data/communityStories"),
    culture: () => import("@/app/data/cultureStories"),
    cooperation: () => import("@/app/data/cooperationStories"),
  };

  for (const pillarSlug of pillars) {
    const { data: pillar } = await supabase
      .from("vision_items")
      .select("id")
      .eq("slug", pillarSlug)
      .maybeSingle();
    if (!pillar) {
      warnings.push(`vision_items missing: ${pillarSlug}`);
      continue;
    }

    await supabase.from("vision_item_blocks").delete().eq("vision_item_id", pillar.id);

    const mod = await storyModules[pillarSlug]();
    const featured = mod.featuredStory;
    const large = mod.largeCards ?? [];
    const small = mod.smallCards ?? [];
    let order = 0;

    const rows = [
      { ...featured, block_type: "featured" as const },
      ...large.map((c: { slug: string }) => ({ ...c, block_type: "large" as const })),
      ...small.map((c: { slug: string }) => ({ ...c, block_type: "story" as const })),
    ];

    for (const row of rows) {
      const r = row as {
        slug: string;
        title: string;
        imageSrc: string;
        caption?: string;
        body: string;
        author?: string;
        readTime?: string | number;
        block_type: string;
      };
      const { error } = await supabase.from("vision_item_blocks").insert({
        vision_item_id: pillar.id,
        slug: r.slug,
        block_type: r.block_type,
        title: r.title,
        excerpt: r.caption ?? null,
        body: r.body,
        legacy_image_path: r.imageSrc?.startsWith("/") ? r.imageSrc : `/${r.imageSrc}`,
        author: r.author ?? null,
        read_time: r.readTime ? Number(r.readTime) : null,
        sort_order: order++,
        is_enabled: true,
      });
      if (error) {
        warnings.push(`vision block ${pillarSlug}/${r.slug}: ${error.message}`);
      }
    }
  }

  return warnings;
}
