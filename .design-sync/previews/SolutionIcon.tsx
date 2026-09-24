import { SolutionIcon } from "canaa";

const slugs = [
  "report-estrategico",
  "cubo-de-resultado",
  "gestao-por-squad",
  "gestao-para-giro",
  "gestao-de-futuro",
  "valuation",
  "estrutura-de-controladoria",
  "training",
];

// Real usage always composes SolutionIcon inside a circular navy badge
// (see SolutionCard.tsx / solucoes/[slug]/page.tsx) — the bare SVG alone
// isn't how this component is ever actually shown.
function BadgeSet() {
  return (
    <div className="flex flex-wrap gap-4">
      {slugs.map((slug) => (
        <span
          key={slug}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-800 text-blue-mist-light"
        >
          <SolutionIcon slug={slug} />
        </span>
      ))}
    </div>
  );
}

function HeroBadge() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-blue-mist-light">
      <SolutionIcon slug="valuation" />
    </span>
  );
}

export { BadgeSet, HeroBadge };
