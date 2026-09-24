import Image from "next/image";
import Link from "next/link";
import type { PostRecord } from "@/lib/blog";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function PostCard({ post }: { post: PostRecord }) {
  const category = post.categories[0];
  return (
    <Link
      href={post.path}
      className="group flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-200">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ember-600">{category.name}</span>
        )}
        <h3 className="mt-2 font-display text-lg leading-snug text-navy-800">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600 line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-navy-500">
          <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
          <span className="font-semibold text-ember-600 group-hover:underline">Leia mais →</span>
        </div>
      </div>
    </Link>
  );
}
