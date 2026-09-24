import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { getDb } from "../src/lib/db";

interface RawPost {
  id: number;
  title: string;
  slug: string;
  path: string;
  categorySlug: string;
  date: string;
  modified: string;
  status: string;
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  featuredImage: string | null;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string | null;
  excerpt: string;
  contentHtml: string;
  readingTimeMinutes: number;
}

interface Taxonomy {
  categories: { id: number; name: string; slug: string; count: number }[];
  tags: { id: number; name: string; slug: string; count: number }[];
}

const posts: RawPost[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "content", "data", "posts.json"), "utf-8")
);
const taxonomy: Taxonomy = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "content", "data", "taxonomy.json"), "utf-8")
);

const db = getDb();

function upsertCategory(name: string, slug: string): number {
  db.prepare(`INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)`).run(name, slug);
  return (db.prepare(`SELECT id FROM categories WHERE slug = ?`).get(slug) as { id: number }).id;
}

function upsertTag(name: string, slug: string): number {
  db.prepare(`INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)`).run(name, slug);
  return (db.prepare(`SELECT id FROM tags WHERE slug = ?`).get(slug) as { id: number }).id;
}

const seedAll = db.transaction(() => {
  for (const c of taxonomy.categories) upsertCategory(c.name, c.slug);
  for (const t of taxonomy.tags) upsertTag(t.name, t.slug);

  const insertPost = db.prepare(`
    INSERT INTO posts (
      title, slug, primary_category_slug, status, published_at, updated_at,
      seo_title, seo_description, focus_keyword, excerpt, content_html,
      featured_image, reading_time_minutes
    ) VALUES (@title, @slug, @primaryCategorySlug, @status, @publishedAt, @updatedAt,
      @seoTitle, @seoDescription, @focusKeyword, @excerpt, @contentHtml,
      @featuredImage, @readingTimeMinutes)
    ON CONFLICT(primary_category_slug, slug) DO UPDATE SET
      title=excluded.title, status=excluded.status, published_at=excluded.published_at,
      updated_at=excluded.updated_at, seo_title=excluded.seo_title,
      seo_description=excluded.seo_description, focus_keyword=excluded.focus_keyword,
      excerpt=excluded.excerpt, content_html=excluded.content_html,
      featured_image=excluded.featured_image, reading_time_minutes=excluded.reading_time_minutes
  `);

  const linkCategory = db.prepare(
    `INSERT OR IGNORE INTO post_categories (post_id, category_id) VALUES (?, ?)`
  );
  const linkTag = db.prepare(`INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)`);
  const getPostId = db.prepare(
    `SELECT id FROM posts WHERE primary_category_slug = ? AND slug = ?`
  );

  let inserted = 0;
  for (const p of posts) {
    insertPost.run({
      title: p.title,
      slug: p.slug,
      primaryCategorySlug: p.categorySlug,
      status: p.status === "publish" ? "published" : "draft",
      publishedAt: p.date,
      updatedAt: p.modified,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      focusKeyword: p.focusKeyword,
      excerpt: p.excerpt,
      contentHtml: p.contentHtml,
      featuredImage: p.featuredImage,
      readingTimeMinutes: p.readingTimeMinutes,
    });
    const row = getPostId.get(p.categorySlug, p.slug) as { id: number };
    for (const c of p.categories) {
      const catId = upsertCategory(c.name, c.slug);
      linkCategory.run(row.id, catId);
    }
    for (const t of p.tags) {
      const tagId = upsertTag(t.name, t.slug);
      linkTag.run(row.id, tagId);
    }
    inserted++;
  }
  return inserted;
});

const count = seedAll();
console.log(`Seeded ${count} posts, ${taxonomy.categories.length} categories, ${taxonomy.tags.length} tags.`);

// seed admin user
const adminEmail = process.env.ADMIN_EMAIL || "pablo.devbr0@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || null;

if (adminPassword) {
  const hash = bcrypt.hashSync(adminPassword, 10);
  db.prepare(
    `INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`
  ).run(adminEmail, hash, "Canaã Admin");
  console.log(`Admin user ready: ${adminEmail}`);
} else {
  console.log("No ADMIN_PASSWORD set — skipping admin user seed (run again with it set in .env.local).");
}
