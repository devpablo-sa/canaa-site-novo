import type { Metadata } from "next";
import { JobApplicationForm } from "@/components/forms/JobApplicationForm";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description: "Envie sua candidatura para o Programa de Trainee Canaã e faça parte do time de controladoria para resultados.",
};

export default function TrabalheConoscoPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-3">Trabalhe conosco</p>
      <h1 className="font-display text-4xl leading-tight text-navy-800">Programa de Trainee Canaã</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-600">
        Estamos sempre em busca de gente boa para compor squads multidisciplinares de controladoria, FP&amp;A e
        business intelligence. Envie sua candidatura e conte para a gente o que você faz de melhor.
      </p>

      <div className="mt-10 rounded-box border border-base-300 bg-base-200 p-8">
        <h2 className="font-display text-xl text-navy-800 mb-6">Envie sua candidatura</h2>
        <JobApplicationForm />
      </div>
    </section>
  );
}
