import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { site } from "@/lib/site";

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <a href={`tel:+55${site.phoneWhatsapp.slice(2)}`} className="font-mono text-sm tabular-nums text-navy-700">
            {site.phoneDisplay}
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-navy-900 py-8 text-center text-xs text-white/60">
        <p>
          {site.name}. Copyright © {new Date().getFullYear()}. Todos os direitos reservados. ·{" "}
          <Link href="/politica-de-privacidade-2" className="underline hover:text-white">
            Política de Privacidade
          </Link>
        </p>
      </footer>
    </>
  );
}
