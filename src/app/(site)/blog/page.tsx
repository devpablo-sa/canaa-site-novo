import type { Metadata } from "next";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryPills } from "@/components/blog/CategoryPills";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { listPublishedPosts, searchPosts } from "@/lib/blog";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog",
  description: "Visite o Blog da Canaã Controladoria! Mergulhe na teoria e prática com nossos conteúdos especializados para sua empresa.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;
  const posts = q || categoria ? searchPosts(q ?? "", categoria) : listPublishedPosts();

  return (
    <>
      <section className="border-b border-base-300 bg-base-200">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-3">Blog</p>
          <h1 className="font-display text-4xl leading-tight text-navy-800">
            Controladoria e Inteligência Financeira
          </h1>
          <p className="mt-4 text-lg text-navy-600">Mergulhe na teoria e prática com nossos conteúdos especializados.</p>

          <form action="/blog" method="get" className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Buscar por palavra-chave…"
              className="input input-bordered w-full bg-base-100"
            />
            <button type="submit" className="btn bg-navy-800 text-white hover:bg-navy-700 border-none">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <CategoryPills active={categoria} query={q} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            {posts.length === 0 ? (
              <p className="text-navy-600">Nenhum artigo encontrado para essa busca.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
          <BlogSidebar activeCategory={categoria} />
        </div>
      </section>
    </>
  );
}
