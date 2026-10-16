import { useMemo } from "react";

/** Mock series in 0..1 (0.5 = zero line). Replace with real data from your API. */
export const walk = (seed, len = 30) => {
  let s = seed, v = 0.5;
  return Array.from({ length: len }, () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    v = Math.min(0.88, Math.max(0.12, v + (s / 4294967296 - 0.5) * 0.3));
    return v;
  });
};

export function Donut({ slices, center }) {
  const R = 78, C = 2 * Math.PI * R, total = slices.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  return (
    <svg className="donut" viewBox="0 0 200 200" role="img" aria-label="Asset allocation">
      <g transform="rotate(-90 100 100)" fill="none" strokeWidth="34">
        {slices.map((s) => {
          const len = (s.value / total) * C, el = <circle key={s.name} cx="100" cy="100" r={R} stroke={s.color} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />;
          acc += len;
          return el;
        })}
      </g>
      <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">{center}</text>
    </svg>
  );
}

export function Chart({ series, y, x, className = "" }) {
  const drawn = useMemo(() => series.map((s) => {
    const pts = s.data.map((v, i) => `${(i / (s.data.length - 1)) * 100},${(1 - v) * 100}`).join(" ");
    return { ...s, pts };
  }), [series]);
  return (
    <div className={"chart2 " + className}>
      <div className="chart2__y">{y.map((l) => <span key={l} className={l.startsWith("-") ? "c-down" : l === "0" || l === "0%" ? "" : "c-up"}>{l}</span>)}</div>
      <div className="chart2__plot">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {y.map((_, i) => <line key={i} x1="0" x2="100" y1={(i / (y.length - 1)) * 100} y2={(i / (y.length - 1)) * 100} stroke="var(--neutral-8)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          {drawn.map((s) => <g key={s.name}>
            {s.fill && <polygon points={`0,100 ${s.pts} 100,100`} fill={s.color} opacity=".28" />}
            <polyline points={s.pts} fill="none" stroke={s.color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </g>)}
        </svg>
        <div className="chart2__x">{x.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
    </div>
  );
}