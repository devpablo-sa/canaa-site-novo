import { NextResponse } from "next/server";
import { recordPostView } from "@/lib/blog";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  recordPostView(postId);
  return NextResponse.json({ ok: true });
}
