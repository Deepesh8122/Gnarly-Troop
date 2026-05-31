import { revalidatePath } from "next/cache";

export function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/leadership");
  revalidatePath("/leadership/[slug]", "page");
  revalidatePath("/collaboration");
  revalidatePath("/collaboration/[slug]", "page");
  revalidatePath("/collaboration/donation");
  revalidatePath("/registration");
  revalidatePath("/4cvision", "layout");
  revalidatePath("/4cvision/[pillar]", "page");
  revalidatePath("/", "layout");
}

export function revalidateCmsPageSlug(slug: string | null | undefined) {
  if (!slug || slug === "home") return;
  revalidatePath(`/${slug}`);
}
