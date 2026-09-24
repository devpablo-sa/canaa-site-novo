// One-off extraction: cleans WordPress post HTML (strips Elementor/plugin
// cruft, the ez-toc block, inline styles/classes) and writes normalized JSON
// used to seed the blog database. Keeps the exact original URL path so SEO
// rankings on existing posts/pages survive the migration.
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SRC = "C:\\escopo\\canaa-content-export.json";
const OUT = path.join(__dirname, "..", "content", "data", "posts.json");
const OUT_META = path.join(__dirname, "..", "content", "data", "taxonomy.json");

const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));

const ALLOWED_TAGS = new Set([
  "p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "strong", "em", "b", "i",
  "a", "img", "blockquote", "br", "figure", "figcaption", "hr", "table", "thead",
  "tbody", "tr", "td", "th",
]);

function cleanHtml(html) {
  // strip leftover WP/Elementor shortcodes like [elementor-template id="1963"]
  // that only ever worked inside the page builder and now render as literal text
  const withoutShortcodes = html.replace(/\[[a-z0-9_-]+(?:\s+[a-z0-9_-]+=(?:"[^"]*"|'[^']*'|\S+))*\s*\]/gi, "");
  const $ = cheerio.load(withoutShortcodes, { decodeEntities: false });

  // The ez-toc plugin's own rendered TOC block — we generate our own from headings.
  $("#ez-toc-container, .ez-toc-container-direction, .ez-toc-v2_0_74").remove();
  $("script,style,iframe[src*='ez-toc']").remove();

  $("body").find("*").each((_, el) => {
    if (el.type !== "tag") return;
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      // unwrap unknown wrapper elements (divs/spans from page-builder cruft)
      // but keep their text content in place.
      $(el).replaceWith($(el).contents());
      return;
    }
    const keepAttrs = tag === "img" ? ["src", "alt", "width", "height"] : tag === "a" ? ["href", "target", "rel"] : [];
    const attribs = { ...el.attribs };
    for (const key of Object.keys(attribs)) {
      if (!keepAttrs.includes(key)) $(el).removeAttr(key);
    }
  });

  // drop empty paragraphs left behind by widget scaffolding
  $("p").each((_, el) => {
    const $el = $(el);
    if (!$el.text().trim() && $el.find("img").length === 0) $el.remove();
  });

  return $("body").html().trim();
}

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractToc(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const toc = [];
  $("h2,h3").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    if (!text) return;
    const id = slugifyHeading(text);
    $el.attr("id", id);
    toc.push({ level: el.tagName.toLowerCase(), text, id });
  });
  return { html: $("body").html().trim(), toc };
}

function readingTime(html) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
  return Math.max(1, Math.round(words / 200));
}

function pathOf(link) {
  const pathname = new URL(link).pathname.replace(/\/$/, "");
  return pathname
    .split("/")
    .map((seg) => (seg ? decodeURIComponent(seg) : seg))
    .join("/");
}

const catBySlug = new Map(data.categories.map((c) => [c.name, c.slug]));
const tagBySlug = new Map(data.tags.map((t) => [t.name, t.slug]));

const posts = data.posts.map((p) => {
  let cleaned;
  try {
    cleaned = cleanHtml(p.content_html || "");
  } catch (e) {
    console.error("FAILED on post", p.id, p.title, e.message);
    throw e;
  }
  const { html: withIds, toc } = extractToc(cleaned);
  const urlPath = pathOf(p.link);
  const segs = urlPath.split("/").filter(Boolean);

  return {
    id: p.id,
    title: p.title,
    slug: segs[1] || p.slug,
    path: urlPath,
    categorySlug: segs[0],
    date: p.date,
    modified: p.modified,
    status: p.status,
    categories: p.categories.map((name) => ({ name, slug: catBySlug.get(name) || slugifyHeading(name) })),
    tags: p.tags.map((name) => ({ name, slug: tagBySlug.get(name) || slugifyHeading(name) })),
    featuredImage: p.featured_image || null,
    seoTitle: p.seo_title || p.title,
    seoDescription: p.seo_description || "",
    focusKeyword: p.focus_keyword || null,
    excerpt: cheerio.load(p.excerpt_html || "")("body").text().trim().slice(0, 220),
    contentHtml: withIds,
    toc,
    readingTimeMinutes: readingTime(withIds),
  };
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(posts, null, 2), "utf-8");
fs.writeFileSync(
  OUT_META,
  JSON.stringify({ categories: data.categories, tags: data.tags }, null, 2),
  "utf-8"
);

console.log(`wrote ${posts.length} posts -> ${OUT}`);
