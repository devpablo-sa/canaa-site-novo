import "server-only";
import slugify from "slugify";
import { getDb } from "./db";
import type { PostStatus } from "./blog";

export interface AdminPostInput {
  title: string;
  slug?: string;
  primaryCategorySlug: string;
  status: PostStatus;
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  excerpt?: string;
  contentHtml: string;
  featuredImage?: string | null;
  categoryIds: number[];
  tagNames: string[];
}

export interface AdminPostRow {
  id: number;
  title: string;
  slug: string;
  primary_category_slug: string;
  status: PostStatus;
  published_at: string | null;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  excerpt: string | null;
  content_html: string;
  featured_image: string | null;
  reading_time_minutes: number;
}

function slugifyHeading(text: string) {
  return slugify(text, { lower: true, strict: true });
}

function injectHeadingIds(html: string): string {
  const seen = new Set<string>();
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/g, (full, tag, attrs, inner) => {
    if (/\sid="/.test(attrs)) return full;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return full;
    let id = slugifyHeading(text) || "secao";
    let n = 2;
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`;
    seen.add(id);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
}

function readingTimeFromHtml(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
  return Math.max(1, Math.round(words / 200));
}

function uniqueSlug(db: ReturnType<typeof getDb>, categorySlug: string, base: string, excludeId?: number) {
  let candidate = base;
  let n = 2;
  for (;;) {
    const row = db
      .prepare(
        `SELECT id FROM posts WHERE primary_category_slug = ? AND slug = ? ${excludeId ? "AND id != ?" : ""}`
      )
      .get(...(excludeId ? [categorySlug, candidate, excludeId] : [categorySlug, candidate])) as
      | { id: number }
      | undefined;
    if (!row) return candidate;
    candidate = `${base}-${n++}`;
  }
}

export function listAllPostsAdmin() {
  const db = getDb();
  return db.prepare(`SELECT * FROM posts ORDER BY updated_at DESC`).all() as AdminPostRow[];
}

export function getPostByIdAdmin(id: number) {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(id) as AdminPostRow | undefined;
  if (!row) return null;
  const categories = db
    .prepare(`SELECT category_id as id FROM post_categories WHERE post_id = ?`)
    .all(id) as { id: number }[];
  const tags = db.prepare(`SELECT t.name FROM tags t JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = ?`).all(id) as {
    name: string;
  }[];
  return { ...row, categoryIds: categories.map((c) => c.id), tagNames: tags.map((t) => t.name) };
}

export function listAllCategories() {
  const db = getDb();
  return db.prepare(`SELECT id, name, slug FROM categories ORDER BY name`).all() as {
    id: number;
    name: string;
    slug: string;
  }[];
}

function getOrCreateTag(db: ReturnType<typeof getDb>, name: string): number {
  const trimmed = name.trim();
  const slug = slugify(trimmed, { lower: true, strict: true });
  db.prepare(`INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)`).run(trimmed, slug);
  return (db.prepare(`SELECT id FROM tags WHERE slug = ?`).get(slug) as { id: number }).id;
}

export function createPost(input: AdminPostInput): number {
  const db = getDb();
  const category = db.prepare(`SELECT slug FROM categories WHERE slug = ?`).get(input.primaryCategorySlug) as
    | { slug: string }
    | undefined;
  if (!category) throw new Error("Categoria principal inválida");

  const baseSlug = slugify(input.slug || input.title, { lower: true, strict: true });
  const slug = uniqueSlug(db, input.primaryCategorySlug, baseSlug);
  const contentHtml = injectHeadingIds(input.contentHtml);
  const readingTime = readingTimeFromHtml(contentHtml);

  const result = db
    .prepare(
      `INSERT INTO posts (
        title, slug, primary_category_slug, status, published_at, updated_at,
        seo_title, seo_description, focus_keyword, excerpt, content_html,
        featured_image, reading_time_minutes
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.title,
      slug,
      input.primaryCategorySlug,
      input.status,
      input.status === "published" ? input.publishedAt || new Date().toISOString() : null,
      input.seoTitle || input.title,
      input.seoDescription || "",
      input.focusKeyword || null,
      input.excerpt || "",
      contentHtml,
      input.featuredImage || null,
      readingTime
    );

  const postId = Number(result.lastInsertRowid);
  syncTaxonomy(db, postId, input.categoryIds, input.tagNames);
  return postId;
}

export function updatePost(id: number, input: AdminPostInput) {
  const db = getDb();
  const existing = db.prepare(`SELECT slug, primary_category_slug, published_at FROM posts WHERE id = ?`).get(id) as
    | { slug: string; primary_category_slug: string; published_at: string | null }
    | undefined;
  if (!existing) throw new Error("Post não encontrado");

  const category = db.prepare(`SELECT slug FROM categories WHERE slug = ?`).get(input.primaryCategorySlug) as
    | { slug: string }
    | undefined;
  if (!category) throw new Error("Categoria principal inválida");

  const desiredBase = slugify(input.slug || input.title, { lower: true, strict: true });
  const slugChanged = desiredBase !== existing.slug || input.primaryCategorySlug !== existing.primary_category_slug;
  const slug = slugChanged ? uniqueSlug(db, input.primaryCategorySlug, desiredBase, id) : existing.slug;

  const publishedAt =
    input.status === "published" ? input.publishedAt || existing.published_at || new Date().toISOString() : null;

  const contentHtml = injectHeadingIds(input.contentHtml);
  const readingTime = readingTimeFromHtml(contentHtml);

  db.prepare(
    `UPDATE posts SET
      title = ?, slug = ?, primary_category_slug = ?, status = ?, published_at = ?,
      updated_at = datetime('now'), seo_title = ?, seo_description = ?, focus_keyword = ?,
      excerpt = ?, content_html = ?, featured_image = ?, reading_time_minutes = ?
    WHERE id = ?`
  ).run(
    input.title,
    slug,
    input.primaryCategorySlug,
    input.status,
    publishedAt,
    input.seoTitle || input.title,
    input.seoDescription || "",
    input.focusKeyword || null,
    input.excerpt || "",
    contentHtml,
    input.featuredImage || null,
    readingTime,
    id
  );

  syncTaxonomy(db, id, input.categoryIds, input.tagNames);
}

function syncTaxonomy(db: ReturnType<typeof getDb>, postId: number, categoryIds: number[], tagNames: string[]) {
  db.prepare(`DELETE FROM post_categories WHERE post_id = ?`).run(postId);
  db.prepare(`DELETE FROM post_tags WHERE post_id = ?`).run(postId);
  const linkCategory = db.prepare(`INSERT OR IGNORE INTO post_categories (post_id, category_id) VALUES (?, ?)`);
  for (const catId of categoryIds) linkCategory.run(postId, catId);
  const linkTag = db.prepare(`INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)`);
  for (const name of tagNames) {
    if (!name.trim()) continue;
    linkTag.run(postId, getOrCreateTag(db, name));
  }
}

export function deletePost(id: number) {
  const db = getDb();
  db.prepare(`DELETE FROM posts WHERE id = ?`).run(id);
}
