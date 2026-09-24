// One-off content extraction: reads the WordPress export and dumps a clean,
// readable text version of each institutional page so real copy/images can
// be pulled into hand-built React components (see content/extracted/*.md).
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const SRC = "C:\\escopo\\canaa-content-export.json";
const OUT_DIR = path.join(__dirname, "..", "content", "extracted");

const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));

function extract(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const lines = [];

  $("body")
    .find("h1,h2,h3,h4,h5,h6,p,li,img,a.elementor-button,blockquote,figcaption")
    .each((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();

      if (tag === "img") {
        const src = $el.attr("src");
        const alt = $el.attr("alt") || "";
        if (src && !src.includes("data:image")) lines.push(`[IMG] ${src} :: alt="${alt}"`);
        return;
      }
      if (tag === "a" && $el.hasClass("elementor-button")) {
        const txt = $el.text().trim();
        const href = $el.attr("href");
        if (txt) lines.push(`[BUTTON] "${txt}" -> ${href}`);
        return;
      }
      const text = $el.clone().children("img").remove().end().text().replace(/\s+/g, " ").trim();
      if (!text) return;

      if (/^h[1-6]$/.test(tag)) {
        lines.push(`\n${"#".repeat(Number(tag[1]))} ${text}`);
      } else if (tag === "li") {
        lines.push(`- ${text}`);
      } else if (tag === "blockquote") {
        lines.push(`> ${text}`);
      } else {
        lines.push(text);
      }
    });

  // Also collect form field labels/placeholders (mf-* elementor widgets = MetForm)
  const formFields = [];
  $('[data-widget_type^="mf-"]').each((_, el) => {
    const $el = $(el);
    const label = $el.find("label").first().text().trim();
    const placeholder = $el.find("input,textarea,select").first().attr("placeholder");
    const widget = $el.attr("data-widget_type");
    formFields.push(`${widget}: label="${label}" placeholder="${placeholder || ""}"`);
  });
  if (formFields.length) {
    lines.push("\n---FORM FIELDS---");
    formFields.forEach((f) => lines.push(f));
  }

  return lines.join("\n");
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const page of data.pages) {
  const text = extract(page.content_html);
  const header = `TITLE: ${page.title}\nSLUG: ${page.slug}\nLINK: ${page.link}\nSEO_TITLE: ${page.seo_title || ""}\nSEO_DESC: ${page.seo_description || ""}\n\n====\n\n`;
  fs.writeFileSync(path.join(OUT_DIR, `${page.slug}.md`), header + text, "utf-8");
  console.log("wrote", page.slug, `(${text.length} chars)`);
}
