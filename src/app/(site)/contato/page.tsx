import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Estamos prontos para atender sua empresa com a metodologia Canaã. Entre em contato com nossos especialistas e descubra como podemos ajudar!",
};

export default function ContatoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-3">Fale conosco</p>
          <h1 className="font-display text-4xl leading-tight text-navy-800">Entre em contato com a Canaã Controladoria</h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-600">
            Estamos prontos para atender sua empresa com a metodologia Canaã.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-navy-500">Endereço</dt>
              <dd className="mt-1 text-navy-800">{site.address}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-navy-500">Telefone</dt>
              <dd className="mt-1 text-navy-800 tabular-nums">{site.phoneDisplay}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-navy-500">Horário de atendimento</dt>
              <dd className="mt-1 text-navy-800">{site.hours}.</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-navy-500">Mídias sociais</dt>
              <dd className="mt-1 flex gap-4 text-navy-800">
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
                  LinkedIn
                </a>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
                  Instagram
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-box border border-base-300 bg-base-200 p-8">
          <SectionHeading title="Envie uma mensagem" />
          <div className="mt-6">
            <ProposalForm source="contato" />
          </div>
        </div>
      </div>
    </section>
  );
}
