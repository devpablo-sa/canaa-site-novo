import { SectionHeading } from "canaa";

function Default() {
  return (
    <SectionHeading
      eyebrow="Controladoria"
      title="Decisões orientadas por dados, não por achismo"
      lede="Transformamos os números da sua operação em informação clara para decidir com segurança."
    />
  );
}

function Centered() {
  return (
    <SectionHeading
      eyebrow="Nossas soluções"
      title="Um método, oito frentes de trabalho"
      lede="Cada solução resolve uma dor específica da gestão financeira."
      align="center"
    />
  );
}

function Dark() {
  return (
    <div className="bg-navy-900 p-8">
      <SectionHeading
        eyebrow="Resultado"
        title="Crescimento sustentável, mês após mês"
        lede="Acompanhamento contínuo do resultado acumulado da sua empresa."
        dark
      />
    </div>
  );
}

export { Default, Centered, Dark };
