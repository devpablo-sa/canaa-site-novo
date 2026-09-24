// Signature visual: an ascending result line over a ledger grid — the one
// recurring motif tying "controladoria" (control/measurement) to growth.
export function LedgerChart() {
  const points = "0,150 60,132 120,140 180,96 240,104 300,60 360,70 420,24";

  return (
    <div className="relative rounded-box bg-navy-900 p-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(141,162,208,0.6) 0, rgba(141,162,208,0.6) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(141,162,208,0.6) 0, rgba(141,162,208,0.6) 1px, transparent 1px, transparent 40px)",
        }}
      />
      <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-blue-mist mb-6">
        Resultado acumulado · 12 meses
      </p>
      <svg viewBox="0 0 420 170" className="relative w-full h-auto" role="img" aria-label="Gráfico ilustrativo de crescimento de resultado ao longo de 12 meses">
        <polyline
          points={points}
          fill="none"
          stroke="#ed5b31"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ledger-chart-line"
          style={{ "--line-length": 900 } as React.CSSProperties}
        />
        {points.split(" ").map((pt, i, arr) => {
          const [x, y] = pt.split(",").map(Number);
          const isLast = i === arr.length - 1;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isLast ? 5 : 3}
              fill={isLast ? "#fcbc45" : "#8da2d0"}
            />
          );
        })}
      </svg>
      <div className="relative mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-3xl text-white tabular-nums">+32%</p>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-blue-mist-light">margem líquida</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-white tabular-nums">+10</p>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-blue-mist-light">anos de atuação</p>
        </div>
      </div>
    </div>
  );
}
