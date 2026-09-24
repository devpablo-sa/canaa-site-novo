import { listAllCategories } from "@/lib/admin-blog";
import { PostEditorForm } from "@/components/admin/PostEditorForm";

export default function NewPostPage() {
  const categories = listAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl text-navy-800 mb-8">Novo post</h1>
      <PostEditorForm
        categories={categories}
        initial={{
          title: "",
          slug: "",
          primaryCategorySlug: categories[0]?.slug || "",
          status: "draft",
          publishedAt: null,
          seoTitle: "",
          seoDescription: "",
          focusKeyword: "",
          excerpt: "",
          contentHtml: "",
          featuredImage: null,
          categoryIds: [],
          tagNames: [],
        }}
      />
    </div>
  );
}
