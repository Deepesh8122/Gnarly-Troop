import fs from "fs/promises";
import path from "path";
import GallerySections from "./SectionGallery";

const SECTIONS = [
  { id: "climate", imageInitial: "climate", title: "Climate Excellence" },
  { id: "community", imageInitial: "community", title: "Community Engagement" },
  { id: "culture", imageInitial: "culture", title: "Cultural Excellence" },
  {
    id: "cooperation",
    imageInitial: "cooperation",
    title: "Cooperation Excellence",
  },
  { id: "founder", imageInitial: "founder", title: "Founder" },
  {
    id: "honor and pride",
    imageInitial: "honor and pride",
    title: "Honor and Pride",
  },
  { id: "marathon", imageInitial: "marathon", title: "Marathon" },
  { id: "village", imageInitial: "village", title: "Village" },
  {
    id: "vision launch 1st dec",
    imageInitial: "vision-launch",
    title: "Vision Launch 1st Dec",
  },
  { id: "workshop", imageInitial: "workshop", title: "Workshop" },
  {
    id: "youth internship",
    imageInitial: "youth-internship",
    title: "Youth Internship",
  },
  { id: "other", imageInitial: "other", title: "Others" },
];

async function getSections() {
  const base = path.join(process.cwd(), "public/images/gallery");

  const results = await Promise.all(
    SECTIONS.map(async (s) => {
      const dirPath = path.join(base, s.id);

      let files: string[] = [];
      try {
        files = await fs.readdir(dirPath);
      } catch {
        files = [];
      }

      const count = files.filter(
        (f) => /\.(png|jpe?g|webp|gif)$/i.test(f) && f !== "cover.jpg"
      ).length;

      return { ...s, count };
    })
  );

  return results;
}

export default async function SectionGalleryWrapper() {
  const sections = await getSections();

  return <GallerySections sections={sections} />;
}
