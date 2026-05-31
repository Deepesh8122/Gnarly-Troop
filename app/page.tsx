import StaticHomePage from "@/components/pages/StaticHomePage";
import DynamicHomePage from "@/components/cms/DynamicHomePage";
import { getSupabaseEnv } from "@/lib/env";

export const revalidate = 60;

export default async function Page() {
  const env = getSupabaseEnv();

  if (env.configured) {
    try {
      const { getHomePage } = await import("@gnarly/lib");
      const page = await getHomePage();
      if (page?.sections?.length) {
        return <DynamicHomePage />;
      }
    } catch (err) {
      console.error("[CMS] Home page load error:", err);
    }
  }

  return <StaticHomePage />;
}
