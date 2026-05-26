import { notFound } from "next/navigation";
import VisionStoryArticle from "@/components/4cvision/VisionStoryArticle";
import { resolveVisionStory } from "@/lib/cms/resolve-vision-story";
import styles from "./cultureStory.module.css";

export const revalidate = 60;

export default async function CultureStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await resolveVisionStory("culture", slug);
  if (!story) return notFound();

  return <VisionStoryArticle story={story} pillarSlug="culture" styles={styles} />;
}
