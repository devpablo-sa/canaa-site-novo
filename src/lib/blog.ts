import "server-only";
import { getDb } from "./db";

export type PostStatus = "draft" | "published";

export interface PostRecord {
  id: number;
  title: string;
  slug: string;
  path: string;
  primaryCategorySlug: string;
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  excerpt: string | null;
  contentHtml: string;
  featuredImage: string | null;
  readingTimeMinutes: number;
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  toc: { level: "h2" | "h3"; text: string; id: string }[];
}

function extractToc(html: string): PostRecord["toc"] {
  const toc: PostRecord["toc"] = [];
  const re = /<h([23])[^>]*\sid="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const level = match[1] === "2" ? "h2" : "h3";
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (text) toc.push({ level, id, text });
  }
  return toc;
}

interface PostRow {
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

function toRecord(row: PostRow): PostRecord {
  const db = getDb();
  const categories = db
    .prepare(
      `SELECT c.name, c.slug FROM categories c
       JOIN post_categories pc ON pc.category_id = c.id
       WHERE pc.post_id = ? ORDER BY c.name`
    )
    .all(row.id) as { name: string; slug: string }[];
  const tags = db
    .prepare(
      `SELECT t.name, t.slug FROM tags t
       JOIN post_tags pt ON pt.tag_id = t.id
       WHERE pt.post_id = ? ORDER BY t.name`
    )
    .all(row.id) as { name: string; slug: string }[];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    path: `/${row.primary_category_slug}/${row.slug}`,
    primaryCategorySlug: row.primary_category_slug,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    focusKeyword: row.focus_keyword,
    excerpt: row.excerpt,
    contentHtml: row.content_html,
    featuredImage: row.featured_image,
    readingTimeMinutes: row.reading_time_minutes,
    categories,
    tags,
    toc: extractToc(row.content_html),
  };
}

export function listPublishedPosts(): PostRecord[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC`)
    .all() as PostRow[];
  return rows.map(toRecord);
}

export function getPostByPath(categorySlug: string, slug: string): PostRecord | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT * FROM posts WHERE primary_category_slug = ? AND slug = ? AND status = 'published'`
    )
    .get(categorySlug, slug) as PostRow | undefined;
  return row ? toRecord(row) : null;
}

export function getAllCategoriesWithCounts() {
  const db = getDb();
  return db
    .prepare(
      `SELECT c.id, c.name, c.slug,
              (SELECT COUNT(*) FROM post_categories pc
               JOIN posts p ON p.id = pc.post_id
               WHERE pc.category_id = c.id AND p.status = 'published') AS count
       FROM categories c
       ORDER BY c.name`
    )
    .all() as { id: number; name: string; slug: string; count: number }[];
}

export function searchPosts(query: string, categorySlug?: string): PostRecord[] {
  const db = getDb();
  const like = `%${query.toLowerCase()}%`;
  let rows: PostRow[];
  if (categorySlug) {
    rows = db
      .prepare(
        `SELECT DISTINCT p.* FROM posts p
         JOIN post_categories pc ON pc.post_id = p.id
         JOIN categories c ON c.id = pc.category_id
         WHERE p.status = 'published' AND c.slug = ?
         AND (LOWER(p.title) LIKE ? OR LOWER(p.excerpt) LIKE ?)
         ORDER BY p.published_at DESC`
      )
      .all(categorySlug, like, like) as PostRow[];
  } else {
    rows = db
      .prepare(
        `SELECT * FROM posts WHERE status = 'published'
         AND (LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ?)
         ORDER BY published_at DESC`
      )
      .all(like, like) as PostRow[];
  }
  return rows.map(toRecord);
}

export function listPostsByCategory(categorySlug: string): PostRecord[] {
  return searchPosts("", categorySlug);
}

export function getRelatedPosts(post: PostRecord, limit = 3): PostRecord[] {
  const db = getDb();
  const categoryIds = db
    .prepare(`SELECT category_id FROM post_categories WHERE post_id = ?`)
    .all(post.id) as { category_id: number }[];
  const tagIds = db
    .prepare(`SELECT tag_id FROM post_tags WHERE post_id = ?`)
    .all(post.id) as { tag_id: number }[];

  if (categoryIds.length === 0 && tagIds.length === 0) return [];

  const catPlaceholders = categoryIds.map(() => "?").join(",") || "NULL";
  const tagPlaceholders = tagIds.map(() => "?").join(",") || "NULL";

  const rows = db
    .prepare(
      `SELECT p.*,
        (SELECT COUNT(*) FROM post_categories pc WHERE pc.post_id = p.id AND pc.category_id IN (${catPlaceholders})) * 2 +
        (SELECT COUNT(*) FROM post_tags pt WHERE pt.post_id = p.id AND pt.tag_id IN (${tagPlaceholders})) AS score
       FROM posts p
       WHERE p.status = 'published' AND p.id != ?
       ORDER BY score DESC, p.published_at DESC
       LIMIT ?`
    )
    .all(...categoryIds.map((c) => c.category_id), ...tagIds.map((t) => t.tag_id), post.id, limit) as (PostRow & {
    score: number;
  })[];

  return rows.filter((r) => r.score > 0).map(toRecord);
}

export function getRecentPosts(limit = 5): PostRecord[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT ?`)
    .all(limit) as PostRow[];
  return rows.map(toRecord);
}

export function getMostReadPosts(days = 30, limit = 5): PostRecord[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT p.*, COUNT(v.id) AS views
       FROM posts p
       JOIN post_views v ON v.post_id = p.id
       WHERE p.status = 'published' AND v.viewed_at >= datetime('now', ?)
       GROUP BY p.id
       ORDER BY views DESC
       LIMIT ?`
    )
    .all(`-${days} days`, limit) as (PostRow & { views: number })[];

  if (rows.length === 0) {
    // cold start: no view data yet, fall back to most recent
    return getRecentPosts(limit);
  }
  return rows.map(toRecord);
}

export function recordPostView(postId: number) {
  const db = getDb();
  db.prepare(`INSERT INTO post_views (post_id) VALUES (?)`).run(postId);
}
