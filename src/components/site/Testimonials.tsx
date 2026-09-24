"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "No final de 2022 conhecemos a Canaã e a parceria gerou tantos frutos que estamos completando 3 anos produzindo cada vez mais informações fidedignas da nossa operação. Isso nos possibilita tomar decisões mais assertivas e antever dificuldades que anteriormente nos pegavam desprevenidos.",
    author: "Diretor Financeiro",
    company: "Grupo Rib Silk",
  },
  {
    quote:
      "Temos hoje mais controle administrativo, o que torna mais fácil delegar e cobrar resultados. Quando precisamos de mais atenção em algum setor, eles prontamente estruturam um plano de ação.",
    author: "Presidente",
    company: "Ipê Golf Club",
  },
  {
    quote:
      "Optamos pela terceirização da controladoria que tem mais profissionais com uma visão e conhecimento mais amplos. O que mais nos ajudou foi segurança nas informações para a tomada de decisão.",
    author: "Diretoria",
    company: "Happening Logística",
  },
];

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const itemWidth = container.querySelector("div")?.clientWidth ?? 0;
      const gap = 24; // matches gap-6
      const step = itemWidth + gap;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      container.scrollTo({
        left: atEnd ? 0 : container.scrollLeft + step,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      ref={containerRef}
      className="carousel w-full gap-6 pb-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {testimonials.map((t, i) => (
        <div key={i} id={`depoimento-${i}`} className="carousel-item w-full sm:w-[520px]">
          <figure className="flex h-full w-full flex-col justify-between rounded-box border border-base-300 bg-base-100 p-8">
            <blockquote className="font-display text-lg italic leading-relaxed text-navy-800">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 font-mono text-xs uppercase tracking-wide text-navy-500">
              {t.author} · {t.company}
            </figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}
