## Setup

No provider or root wrapper is required — these components read no React
context. Load once per page:

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

```jsx
const { SectionHeading, LedgerChart } = window.Canaa;
```

## Styling idiom: Tailwind v4 utilities + daisyUI, brand tokens as color names

This system styles with **Tailwind utility classes directly on elements** —
no CSS-in-JS, no styled-components, no BEM. Brand colors are exposed as
named Tailwind color scales (defined via `@theme` in the source, verbatim in
`_ds_bundle.css`), and structural chrome (inputs, file pickers) comes from
daisyUI component classes layered under the same utility system. Compose
new layout/glue the same way: pick classes from this vocabulary, don't
invent new hex values or px paddings.

**Brand color scale** (use these over raw hex):

| Class | Value | Use |
|---|---|---|
| `bg-navy-900` / `text-navy-900` | `#10172e` | darkest brand navy — page-level dark bands (footer, chart panels) |
| `bg-navy-800` / `text-navy-800` | `#171f30` | primary heading/body text on light backgrounds |
| `text-navy-600` | `#2c3e63` | secondary/muted text on light backgrounds |
| `text-blue-mist` / `text-blue-mist-light` | `#8da2d0` / `#dce4f4` | muted text and eyebrows *on dark backgrounds* |
| `bg-accent` / `text-ember-600` | `#cb5f08` | brand accent — primary CTAs, links, active states |
| `bg-ember-700` | `#a3490a` | accent hover state |
| `bg-base-100` / `bg-base-200` / `border-base-300` | `#fff` / `#f4f6fb` / `#e3e8f3` | daisyUI neutral surface scale — cards, page background, borders |

**daisyUI semantic roles** (theme `canaa`, also usable): `primary`
(`#1f3153`), `secondary` (`#8da2d0`), `accent` (`#cb5f08`), `success`
(`#1f8a5b`), `warning` (`#fcbc45`), `error` (`#c33628`) — each has a
matching `-content` foreground color (e.g. `text-accent-content` on
`bg-accent`).

**Structural classes**: `rounded-box` (the brand corner radius — prefer over
`rounded-lg`/`rounded-xl`), `input input-bordered`, `file-input
file-input-bordered`, `carousel` / `carousel-item` (daisyUI), `font-display`
(headings — Fraunces), `font-mono` (eyebrows/labels — IBM Plex Mono, used
with `uppercase tracking-wide`), default body text is IBM Plex Sans (no
class needed).

**Dark-context components**: some components (e.g. `NewsletterForm`) are
authored assuming a `bg-navy-900` parent and use white/translucent text —
they render unstyled-looking on a plain white background by design. Wrap
them in a `bg-navy-900` container, matching how the source app composes
them (inside its `Footer`).

## Where the truth lives

Read `_ds_bundle.css` (via `styles.css`'s import) for the full compiled
Tailwind + daisyUI output — every class and token above is verbatim from
there. Per-component usage examples: `components/<group>/<Name>/<Name>.prompt.md`.

## Example

```jsx
const { SectionHeading, LedgerChart } = window.Canaa;

function ResultsSection() {
  return (
    <section className="bg-base-100 p-8">
      <SectionHeading
        eyebrow="Resultado"
        title="Crescimento sustentável, mês após mês"
        lede="Acompanhamento contínuo do resultado acumulado da sua empresa."
      />
      <div className="mt-6 max-w-xl">
        <LedgerChart />
      </div>
    </section>
  );
}
```
