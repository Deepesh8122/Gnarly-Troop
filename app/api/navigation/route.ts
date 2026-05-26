import { NextResponse } from "next/server";
import { getNavigationByMenuSlug } from "@/lib/cms/navigation";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const menu = searchParams.get("menu") ?? "main-header";
  const items = await getNavigationByMenuSlug(menu);
  return NextResponse.json({ items });
}
