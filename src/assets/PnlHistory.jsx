import { useMemo, useState } from "react";
import PageShell from "../auth/PageShell";
import { Chart, walk } from "./charts";
import { AssetTabs } from "./Portfolio";
import "../trading/trading.css";
import "./assets.css";

const n = (v) => v.toLocaleString("en-US");
const BY = { ACB: [1000, 21.75, 800, 21.7, 200, 17360000], HPG: [400, 24.65, 400, 24.7, 0, 9860000], VHM: [300, 45.5, 0, 0, 0, 0], VCB: [1200, 87.5, 900, 87.55, 300, 78795000] };
const T = ["ACB", "HPG", "VHM", "VCB", "ACB", "HPG", "VHM", "VCB", "ACB", "VCB", "ACB", "HPG", "VHM", "VCB"];
const TAX = [2212, 1234, 0, 234, 2343, 0, 0, 682, 5478, 300, 28497, 0, 3243, 300];
const PNL = [31239, 12203213, -12349, 13231, 394003, 200000, -192203, 200000, 100000, 200000, 500000, 200000, -12200230, 300000];
const PCT = [12, 145, -4.53, 34, 57, 38, -37, 348, 23, 24, 123, 34, -37, 45];
const TIMES = { ACB: "9:33", HPG: "9:12", VHM: "9:02", VCB: "8:30" };
const ROWS = T.map((t, i) => ({ id: i, t, d: BY[t], tax: TAX[i], pnl: PNL[i], pct: PCT[i] }));
const HEAD = ["Ticker", "Volume", "Price", "Matched Vol", "Avg. Price", "Fee", "Tax", "Net Value", "P&L", "P&L", "Order Time"];
const Y = ["500M", "400M", "300M", "200M", "100M", "0", "-100M", "-200M", "-300M"];
const X = ["1/9", "5/9", "10/9", "15/9", "20/9", "25/9", "30/9", "5/10", "10/10", "15/10", "20/10", "25/10", "30/10"];

export default function PnlHistory() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(new Set());
  const rows = ROWS.filter((r) => r.t.includes(q.trim().toUpperCase()));
  const series = useMemo(() => [{ name: "P&L", color: "#19c19d", fill: true, data: walk(41, 60) }], []);
  const hasBox = (t) => t === "ACB" || t === "VCB";
  const toggle = (id) => { const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); setSel(s); };
  const exportCsv = () => {
    const lines = [HEAD.join(","), ...rows.map((r) => [r.t, r.d[0], r.d[1], r.d[2], r.d[3], r.d[4], r.tax, r.d[5], r.pnl, r.pct + "%", TIMES[r.t] + " 22/01/2023"].join(","))];
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" })), download: "profit-loss-history.csv" });
    a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <PageShell className="assets">
      <AssetTabs active="pnl" />
      <div className="panel">
        <div className="filters2">
          <input className="field-s" placeholder="Search ticker" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="sel">Start date <select><option>10/02/2025</option></select></label>
          <label className="sel">End date <select><option>10/03/2025</option></select></label>
          <button className="btn-soft" onClick={() => setQ("")}>Delete all filter</button>
          <button className="btn-soft right" onClick={exportCsv}>Export excel</button>
        </div>
        <Chart series={series} y={Y} x={X} className="chart2--tall" />
        <div className="otable-wrap pnl">
          <table className="otable body-2">
            <thead><tr><th><input type="checkbox" aria-label="Select all" checked={rows.filter((r) => hasBox(r.t)).every((r) => sel.has(r.id))} onChange={(e) => setSel(e.target.checked ? new Set(rows.filter((r) => hasBox(r.t)).map((r) => r.id)) : new Set())} /></th>{HEAD.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}>
                <td>{hasBox(r.t) && <input type="checkbox" checked={sel.has(r.id)} onChange={() => toggle(r.id)} />}</td>
                <td>{r.t}</td><td>{n(r.d[0])}</td><td>{r.d[1].toFixed(2)}</td><td>{n(r.d[2])}</td><td>{r.d[3].toFixed(2)}</td><td>{n(r.d[4])}</td><td>{n(r.tax)}</td><td>{n(r.d[5])}</td>
                <td className={r.pnl >= 0 ? "c-up" : "c-down"}>{n(r.pnl)}</td><td className={r.pct >= 0 ? "c-up" : "c-down"}>{r.pct}%</td><td>{TIMES[r.t]} 22/01/2023</td>
              </tr>))}</tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}