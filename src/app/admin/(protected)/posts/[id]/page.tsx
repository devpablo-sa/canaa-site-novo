import { notFound } from "next/navigation";
import { listAllCategories, getPostByIdAdmin } from "@/lib/admin-blog";
import { PostEditorForm } from "@/components/admin/PostEditorForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostByIdAdmin(Number(id));
  if (!post) notFound();
  const categories = listAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-800 mb-8">Editar post</h1>
      <PostEditorForm
        categories={categories}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          primaryCategorySlug: post.primary_category_slug,
          status: post.status,
          publishedAt: post.published_at,
          seoTitle: post.seo_title || "",
          seoDescription: post.seo_description || "",
          focusKeyword: post.focus_keyword || "",
          excerpt: post.excerpt || "",
          contentHtml: post.content_html,
          featuredImage: post.featured_image,
          categoryIds: post.categoryIds,
          tagNames: post.tagNames,
        }}
      />
    </div>
  );
}
