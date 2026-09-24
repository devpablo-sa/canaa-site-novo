import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group inline-flex flex-col leading-none" aria-label="Canaã Controladoria — início">
      <span
        className={`font-display text-[1.7rem] tracking-tight ${dark ? "text-white" : "text-navy-700"}`}
      >
        Cana<span className="text-ember-600">ã</span>
      </span>
      <span
        className={`font-mono text-[0.55rem] font-medium uppercase tracking-[0.28em] ${
          dark ? "text-blue-mist" : "text-navy-500"
        }`}
      >
        Controladoria p/ resultados
      </span>
    </Link>
  );
}
