import { notFound } from "next/navigation";
import VisionStoryArticle from "@/components/4cvision/VisionStoryArticle";
import { resolveVisionStory } from "@/lib/cms/resolve-vision-story";
import styles from "./communityStory.module.css";

export const revalidate = 60;

export default async function CommunityStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await resolveVisionStory("community", slug);
  if (!story) return notFound();

  return <VisionStoryArticle story={story} pillarSlug="community" styles={styles} />;
}
