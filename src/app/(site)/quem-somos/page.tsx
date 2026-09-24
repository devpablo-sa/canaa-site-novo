import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTAButton } from "@/components/site/CTAButton";
import { PostCard } from "@/components/blog/PostCard";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { getRecentPosts } from "@/lib/blog";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Controladoria para Resultados: Quem Somos e Como Atuamos",
  description:
    "Com mais de uma década de atuação, a Canaã é uma empresa de controladoria para resultados que impulsiona o crescimento das empresas.",
};

const softSkills = [
  {
    title: "Comunicação assertiva",
    body: "Priorizamos uma comunicação clara e objetiva, facilitando o entendimento e a tomada de decisões.",
  },
  {
    title: "Método ágil de gestão",
    body: "Utilizamos metodologias ágeis para garantir que os projetos sejam gerenciados de forma eficiente. Fazemos acontecer.",
  },
];

const hardSkills = [
  {
    title: "Inteligência financeira e de controladoria",
    body: "Profundo conhecimento em relatórios financeiros, usando BI, SQL e queries para entregar informações completas.",
  },
  {
    title: "Expertise para aumento de resultado",
    body: "Identificamos e implementamos estratégias que aumentam significativamente os resultados financeiros.",
  },
  {
    title: "Gestão de times em Squad",
    body: "Criação e gestão de squads focados na melhoria contínua dos resultados e na eficiência dos processos.",
  },
  {
    title: "Domínio de KPIs e OKRs",
    body: "Trabalhamos com a direção para monitorar indicadores e alinhar todas as áreas aos objetivos estratégicos.",
  },
];

export default function QuemSomosPage() {
  const posts = getRecentPosts(3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-3">Quem somos</p>
          <h1 className="font-display text-4xl leading-tight text-navy-800">
            Da consultoria financeira tradicional a soluções tangíveis em controladoria
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-600">
            Para atender às demandas práticas do mercado, migramos da consultoria financeira tradicional para
            fornecer soluções tangíveis em controladoria e resultados. Atuamos como um braço de controladoria
            complementar ou como equipe de outsourcing, monitorando de perto os indicadores essenciais para que
            você possa concentrar-se no seu negócio e alcançar crescimento efetivo.
          </p>
        </div>
      </section>

      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Proposta de valor" title="Nossos soft skills" dark />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {softSkills.map((s) => (
              <div key={s.title} className="border-l-2 border-accent pl-4">
                <h3 className="font-display text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-mist-light">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading eyebrow="Proposta de valor" title="Nossos hard skills" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {hardSkills.map((s) => (
            <div key={s.title} className="rounded-box border border-base-300 p-6">
              <h3 className="font-display text-lg text-navy-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionHeading
            align="center"
            eyebrow="Nosso compromisso"
            title="Você livre para gerir e expandir o seu negócio"
            lede="Estamos comprometidos em fornecer soluções de controladoria que permitem que você se concentre no que faz de melhor. Com nossa abordagem, você terá uma equipe dedicada e altamente qualificada ao seu lado, pronta para impulsionar seu crescimento e sucesso."
          />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Blog" title="Artigos recentes" lede="Conteúdos sobre controladoria e finanças empresariais produzidos por especialistas." />
            <CTAButton href="/blog" variant="outline">Visite nosso blog</CTAButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section id="proposta" className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Solicite uma proposta"
            title="Solicite uma proposta com a Canaã"
            lede="Preencha o formulário e retornaremos seu contato o quanto antes."
          />
          <div className="rounded-box border border-base-300 bg-base-100 p-8">
            <ProposalForm source="quem-somos" />
          </div>
        </div>
      </section>
    </>
  );
}
