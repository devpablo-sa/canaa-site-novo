import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-base-300 bg-navy-900 p-6 text-white sm:flex">
          <span className="font-display text-xl">
            Cana<span className="text-amber-400">ã</span> <span className="text-sm text-blue-mist-light">admin</span>
          </span>
          <nav className="mt-10 flex flex-col gap-1">
            <Link href="/admin/posts" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
              Posts do blog
            </Link>
            <Link href="/admin/posts/new" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
              Novo post
            </Link>
            <Link href="/blog" target="_blank" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10">
              Ver blog público ↗
            </Link>
          </nav>
          <div className="mt-auto pt-10">
            <p className="text-xs text-blue-mist-light">{session.sub}</p>
            <LogoutButton />
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
