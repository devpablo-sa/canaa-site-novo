import { useState } from "react";
import { ImageUploadField } from "canaa";

function Empty() {
  const [value, setValue] = useState<string | null>(null);
  return <ImageUploadField value={value} onChange={setValue} />;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="800" height="450" fill="#171f30"/><text x="50%" y="50%" fill="#8da2d0" font-family="sans-serif" font-size="28" text-anchor="middle">Imagem destacada</text></svg>',
  );

function Filled() {
  const [value, setValue] = useState<string | null>(PLACEHOLDER);
  return <ImageUploadField value={value} onChange={setValue} />;
}

export { Empty, Filled };
