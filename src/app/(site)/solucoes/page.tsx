import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SolutionCard } from "@/components/site/SolutionCard";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { solutions } from "@/lib/site";
import { solutionsContent } from "@/lib/solutions-content";

export const metadata: Metadata = {
  title: "Soluções em controladoria para empresas com a Canaã",
  description:
    "Conhecemos os desafios das médias empresas e atuamos para melhorar seu desempenho. Descubra nossas soluções em controladoria para empresas!",
};

export default function SolucoesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-3">
            Mais de uma década atuando no mercado de consultoria financeira
          </p>
          <h1 className="font-display text-4xl leading-tight text-navy-800">
            Transforme dados em decisões estratégicas
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-600">
            Com a Canaã Controladoria, você pode aprimorar a gestão financeira, projetar cenários futuros, otimizar
            resultados, reduzir riscos, melhorar processos e tomar decisões de forma prática, segura e assertiva.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} slug={s.slug} title={s.title} description={solutionsContent[s.slug].heroLede.slice(0, 110) + "…"} />
          ))}
        </div>
      </section>

      <section id="proposta" className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Solicite uma proposta"
            title="Proposta de soluções em controladoria para empresas"
            lede="Preencha o formulário e retornaremos seu contato o quanto antes. Nossos especialistas em controladoria financeira para resultados estão preparados para ajudar você e sua empresa a atingirem seus objetivos."
          />
          <div className="rounded-box border border-base-300 bg-base-100 p-8">
            <ProposalForm source="solucoes" />
          </div>
        </div>
      </section>
    </>
  );
}
