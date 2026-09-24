import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { listAllPostsAdmin, createPost } from "@/lib/admin-blog";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  primaryCategorySlug: z.string().min(1),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  excerpt: z.string().optional(),
  contentHtml: z.string(),
  featuredImage: z.string().optional().nullable(),
  categoryIds: z.array(z.number()),
  tagNames: z.array(z.string()),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ posts: listAllPostsAdmin() });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const id = createPost(parsed.data);
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao criar post" }, { status: 400 });
  }
}
