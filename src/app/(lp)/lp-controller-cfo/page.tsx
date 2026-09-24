import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Testimonials } from "@/components/site/Testimonials";
import { CTAButton } from "@/components/site/CTAButton";
import { ProposalForm } from "@/components/forms/ProposalForm";

export const metadata: Metadata = {
  title: "Gestão Financeira Estratégica | Controller | CFO as a Service",
  description:
    "Tenha controle financeiro total com especialistas em Controladoria, FP&A e Gestão de Caixa. Conte com a Canaã Controladoria!",
};

const benefits = [
  "Controller e CFO as a Service com experiência de mercado",
  "FP&A e XP&A: análises e estratégias financeiras com foco em performance",
  "Gestão de caixa eficiente e previsível",
  "Consultoria financeira sob medida",
  "Relatórios e dashboards para tomada de decisão",
  "Valuation claro para investidores e sócios",
];

const risks = [
  { title: "Fluxo de caixa descontrolado", body: "Sem visão clara de entradas e saídas, decisões viram apostas." },
  { title: "Dúvidas sobre investimentos ou cortes", body: "Faltam dados confiáveis para saber onde cortar ou investir." },
  { title: "Falta de planejamento tributário eficiente", body: "Oportunidades de economia ficam pelo caminho." },
];

export default function LpControllerCfoPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight text-navy-800">
              Controladoria e Consultoria Financeira para empresas
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy-600">
              A Canaã oferece soluções especializadas em Controller, CFO as a Service, BPO de Controladoria, FP&amp;A
              e XP&amp;A. Atuamos como equipe estendida na estruturação e no fortalecimento da área financeira,
              promovendo maior resultado, previsibilidade e suporte à tomada de decisão baseada em dados.
            </p>
            <div className="mt-8">
              <CTAButton href="#proposta">Solicitar proposta</CTAButton>
              <p className="mt-3 text-xs text-navy-500">Ao enviar, você concorda em receber comunicações da Canaã Controladoria.</p>
            </div>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200 p-8">
            <h2 className="font-display text-lg text-navy-800 mb-4">Solicite uma proposta</h2>
            <ProposalForm source="lp-controller-cfo" redirectTo="/tu-lp-diagnostico" compact />
          </div>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Vantagens"
            title="O que sua empresa ganha com a Canaã?"
            lede="Nossos especialistas atuam como parte do seu time, com soluções sob medida para sua empresa de médio porte crescer de forma inteligente e sustentável."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-box border border-base-300 bg-base-100 p-4 text-sm text-navy-700">
                <span className="mt-0.5 text-accent">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-box border border-base-300 p-8">
            <h2 className="font-display text-2xl text-navy-800">CFO as a Service</h2>
            <p className="mt-3 text-navy-600 leading-relaxed">
              Contrate um CFO as a Service ou nossa equipe especializada com foco em planejamento financeiro,
              controle de custos, modelagem de negócios e suporte à tomada de decisão — sem precisar de um
              profissional full time para isso.
            </p>
          </div>
          <div className="rounded-box border border-base-300 p-8">
            <h2 className="font-display text-2xl text-navy-800">XP&amp;A</h2>
            <p className="mt-3 text-navy-600 leading-relaxed">
              A evolução do FP&amp;A. Extended Planning and Analysis: o planejamento em rede, inteligente e
              conectado, com dados integrados, decisões em tempo real e resultados mais precisos.
            </p>
          </div>
        </div>
        <div className="relative mt-10 aspect-[16/7] w-full overflow-hidden rounded-box border border-base-300">
          <Image
            src="https://canaacontroladoria.com.br/wp-content/uploads/2025/03/diagnostico-financeiro-1.png"
            alt="Canaã Controladoria e Diagnóstico Financeiro"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Depoimentos" title="O que dizem nossos clientes" dark />
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <SectionHeading align="center" eyebrow="Um alerta" title="Você sabia que 60% das empresas fecham por falta de controle financeiro?" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {risks.map((r) => (
            <div key={r.title} className="rounded-box border border-base-300 p-5 text-left">
              <h3 className="font-display text-base text-navy-800">{r.title}</h3>
              <p className="mt-1.5 text-sm text-navy-600">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="proposta" className="bg-base-200 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <SectionHeading
            align="center"
            title="Sua empresa merece crescer gerando resultados"
            lede="Agende uma conversa sem compromisso com um especialista e descubra como a Canaã pode ser sua parceira estratégica."
          />
          <div className="mt-8 rounded-box border border-base-300 bg-base-100 p-8 text-left">
            <ProposalForm source="lp-controller-cfo-footer" redirectTo="/tu-lp-diagnostico" />
          </div>
        </div>
      </section>
    </>
  );
}
