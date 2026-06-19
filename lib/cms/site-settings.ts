import { isPublicCmsConfigured } from "@/lib/cms/public-read";
import { createPublicSupabaseClient } from "@/lib/supabase/server";

export async function getPublicSiteSetting(key: string): Promise<string | null> {
  if (!isPublicCmsConfigured()) return null;
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (!data?.value) return null;
  const v = data.value;
  if (typeof v === "string") return v.replace(/^"|"$/g, "");
  return String(v);
}

export async function getFooterSiteMeta() {
  const [siteName, tagline, donationUrl] = await Promise.all([
    getPublicSiteSetting("site_name"),
    getPublicSiteSetting("footer_tagline"),
    getPublicSiteSetting("donation_url"),
  ]);
  return {
    siteName: siteName ?? "Gnarly Troop Global Federation",
    tagline: tagline ?? "Welcome to My Country, India",
    donationUrl: donationUrl ?? "/collaboration/donation",
    copyright: `© ${new Date().getFullYear()} ${siteName ?? "Gnarly Troop Global Federation"}. All rights reserved.`,
  };
}
