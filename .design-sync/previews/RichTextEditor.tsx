import { useState } from "react";
import { RichTextEditor } from "canaa";

function Empty() {
  const [value, setValue] = useState("");
  return <RichTextEditor value={value} onChange={setValue} />;
}

const SAMPLE = `
  <h2>Como a controladoria orienta decisões</h2>
  <p>Um <strong>report estratégico</strong> bem estruturado transforma dados operacionais em decisões de negócio. Veja os pilares principais:</p>
  <ul>
    <li>Margem de contribuição por linha de produto</li>
    <li>Capital de giro e ciclo financeiro</li>
    <li>Indicadores de performance por squad</li>
  </ul>
  <blockquote>"Controladoria não é sobre o passado — é sobre decidir o futuro com dados."</blockquote>
`;

function WithContent() {
  const [value, setValue] = useState(SAMPLE);
  return <RichTextEditor value={value} onChange={setValue} />;
}

export { Empty, WithContent };
