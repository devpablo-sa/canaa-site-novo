const paths: Record<string, string> = {
  "report-estrategico": "M4 19V9m6 10V5m6 14v-7m6 7V3", // BI bars
  "cubo-de-resultado": "M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v18M4 7.5 12 12m8-4.5L12 12",
  "gestao-por-squad": "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 12a7 7 0 0 1 14 0M5 20v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1",
  "gestao-para-giro": "M4 12a8 8 0 0 1 14.9-4M20 12a8 8 0 0 1-14.9 4M15 4v4h4M9 20v-4H5",
  "gestao-de-futuro": "M3 12h4l3-8 4 16 3-8h4",
  valuation: "M12 3v18M6 8l6-5 6 5M4 20h16M6 8v6a2 2 0 0 0 2 2h2M18 8v6a2 2 0 0 1-2 2h-2",
  "estrutura-de-controladoria": "M12 4v4M6 12H2m20 0h-4M12 20v-4M7 7l2.5 2.5M17 7l-2.5 2.5M7 17l2.5-2.5M17 17l-2.5-2.5",
  training: "M22 9 12 5 2 9l10 4 10-4Zm-16 3.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-4.5",
};

export function SolutionIcon({ slug, className = "h-6 w-6" }: { slug: string; className?: string }) {
  const d = paths[slug] ?? paths["report-estrategico"];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
