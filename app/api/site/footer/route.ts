import { NextResponse } from "next/server";
import { getFooterSiteMeta } from "@/lib/cms/site-settings";

export const revalidate = 60;

export async function GET() {
  const meta = await getFooterSiteMeta();
  return NextResponse.json(meta);
}
