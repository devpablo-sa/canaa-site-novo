import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "accent" | "outline" | "ghost-light";

const variants: Record<Variant, string> = {
  accent: "bg-accent text-accent-content hover:bg-ember-700",
  outline: "border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white",
  "ghost-light": "border border-white/40 text-white hover:bg-white hover:text-navy-800",
};

export function CTAButton({
  href,
  children,
  variant = "accent",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
