import { revalidatePath } from "next/cache";

export function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/leadership");
  revalidatePath("/leadership/[slug]", "page");
  revalidatePath("/collaboration");
  revalidatePath("/collaboration/[slug]", "page");
}
