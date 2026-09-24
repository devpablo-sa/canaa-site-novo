import Image from "next/image";
import { CTAButton } from "@/components/site/CTAButton";
import { LedgerChart } from "@/components/site/LedgerChart";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SolutionCard } from "@/components/site/SolutionCard";
import { Testimonials } from "@/components/site/Testimonials";
import { PostCard } from "@/components/blog/PostCard";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { solutions } from "@/lib/site";
import { getRecentPosts } from "@/lib/blog";

export const revalidate = 0;

const solutionCopy: Record<string, string> = {
  "report-estrategico": "Escolhemos os principais reports para o sucesso da sua empresa, em uma única tela de comando.",
  "cubo-de-resultado": "Enxergue seu resultado por produto, cliente, vendedor, região e ramo de negócio.",
  "gestao-por-squad": "Equipe direcionada para gerar resultado através de OKRs e KPIs, com método ágil.",
  "gestao-para-giro": "Gestão de caixa levada a sério para a sustentabilidade financeira da sua empresa.",
  "gestao-de-futuro": "Orçamento bottom-up, cenários e projeções para decisões conscientes sobre o amanhã.",
  valuation: "Metodologias consagradas — DCF e múltiplos — para saber quanto vale o seu negócio.",
  "estrutura-de-controladoria": "Formação de equipe, diagnóstico e implantação do setor de FP&A.",
  training: "Capacitação de gestores e equipes com foco em performance financeira.",
};

const reasons = [
  {
    title: "Segurança e credibilidade",
    body: "Uma empresa confiável e experiente com os desafios das médias e grandes organizações.",
  },
  {
    title: "Mais viável economicamente",
    body: "Menos tempo e custo do que montar e treinar uma equipe interna — com visão de fora que não tem medo de cobrar resultado.",
  },
  {
    title: "Acompanhamento constante",
    body: "Compromisso com resultados mensuráveis, indicadores e reuniões presenciais com sua equipe.",
  },
  {
    title: "Metodologia que fica com você",
    body: "Criamos uma cultura de rotinas e processos financeiros — uma metodologia viva dentro da sua empresa.",
  },
  {
    title: "Você livre para o seu negócio",
    body: "Expertise financeira dedicada à saúde da sua organização, enquanto você foca no core business.",
  },
];

const clientLogos = Array.from({ length: 32 }, (_, i) => `logo${i + 1}`);

export default async function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="fade-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-600 mb-4">
              Controladoria para resultados · Ribeirão Preto, SP
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] text-navy-800">
              Trabalhamos com passado e futuro para sua empresa crescer com resultado
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-600">
              Contar com a consultoria financeira da Canaã é investir em eficiência e visão de futuro. Com uma
              gestão orientada por indicadores, metas claras e foco em resultado, sua empresa ganha tempo, reduz
              riscos e toma decisões mais seguras.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="/lp-controller-cfo">Solicitar proposta</CTAButton>
              <CTAButton href="/solucoes" variant="outline">
                Conheça nossas soluções
              </CTAButton>
            </div>
          </div>
          <div className="fade-rise" style={{ animationDelay: "0.15s" }}>
            <LedgerChart />
          </div>
        </div>
      </section>

      {/* Value belt */}
      <section className="bg-navy-900 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Inteligência financeira",
              body: "BI, SQL e queries para otimizar a análise e a apresentação dos dados.",
            },
            {
              title: "Expertise em resultado",
              body: "Identificação de oportunidades e implementação de estratégias eficazes.",
            },
            {
              title: "Domínio de indicadores",
              body: "KPIs e OKRs como ferramentas essenciais para monitorar desempenho.",
            },
            {
              title: "Gestão de times em squad",
              body: "Formação de squads focados em otimizar processos e aumentar resultado.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div className="ledger-rule ledger-rule--dark mb-4" />
              <h3 className="font-display text-lg text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-mist-light">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Nossas soluções"
          title="Conheça as soluções que fazem sua empresa crescer com resultado e sustentabilidade"
          lede="Conhecemos os desafios das médias empresas e atuamos para a melhoria de seu desempenho."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} slug={s.slug} title={s.title} description={solutionCopy[s.slug]} />
          ))}
        </div>
      </section>

      {/* Why hire us */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Por que nos contratar"
            title="Mais de uma década atuando no mercado de consultoria financeira"
            lede="Conhecemos bem os desafios das médias empresas e atuamos para a melhoria de seu desempenho."
          />
          <ul className="grid gap-6 sm:grid-cols-2">
            {reasons.map((r) => (
              <li key={r.title} className="border-l-2 border-accent pl-4">
                <h3 className="font-display text-base text-navy-800">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy-900 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Depoimentos" title="O que dizem nossos clientes" dark />
          <div className="mt-10">
            <Testimonials />
          </div>
          <div className="relative mt-14 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy-900 to-transparent" />
            <div className="flex w-max animate-marquee items-center gap-4">
              {[...clientLogos, ...clientLogos].map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="relative h-14 w-28 shrink-0 rounded-box bg-base-100 p-2 transition-transform duration-200 hover:scale-110"
                >
                  <Image
                    src={`https://canaacontroladoria.com.br/wp-content/uploads/2024/05/${name}.png`}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain p-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog preview */}
      {recentPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Blog"
              title="Conteúdos sobre controladoria e finanças empresariais"
              lede="Produzidos por especialistas para ajudar sua empresa a crescer com clareza."
            />
            <CTAButton href="/blog" variant="outline">
              Ver todos os artigos
            </CTAButton>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Proposal form */}
      <section id="proposta" className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Solicite uma proposta"
            title="Fale com nossos especialistas"
            lede="Preencha o formulário e retornaremos seu contato o quanto antes. Nossos especialistas em controladoria financeira para resultados estão preparados para ajudar você e sua empresa a atingirem seus objetivos."
          />
          <div className="rounded-box border border-base-300 bg-base-100 p-8">
            <ProposalForm source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
