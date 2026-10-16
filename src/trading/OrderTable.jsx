const n = (v) => v.toLocaleString("en-US");
const f = (v) => v.toFixed(2);
// ticker, side, volume, price, matched vol, avg price, pending vol, matched value, status, time
const BASE = [
  ["ACB", "Buy", 1000, 21.75, 800, 21.7, 200, 17360000, "Pending", "9:33 22/01/2023"],
  ["HPG", "Sell", 400, 24.65, 400, 24.7, 0, 9860000, "Matched", "9:12 22/01/2023"],
  ["VHM", "Buy", 300, 45.5, 0, 0, 0, 0, "Cancelled", "9:02 22/01/2023"],
  ["VCB", "Sell", 1200, 87.5, 900, 87.55, 300, 78795000, "Chờ khớp", "8:30 22/01/2023"],
];
export const makeOrders = (count) => Array.from({ length: count }, (_, i) => ({ id: i, d: BASE[i % 4] }));
const isOpen = (s) => s === "Pending" || s === "Chờ khớp";
const stCls = { Pending: "c-ref", "Chờ khớp": "c-ref", Matched: "c-up", Cancelled: "c-down" };
const HEAD = ["Ticker", "Buy/Sell", "Volume", "Price", "Matched Vol", "Avg. Price", "Pending Vol", "Matched Value", "Status", "Order Time", "Action"];

export default function OrderTable({ rows, selected, setSelected }) {
  const open = rows.filter((r) => isOpen(r.d[8]));
  const all = open.length > 0 && open.every((r) => selected.has(r.id));
  const toggle = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };
  return (
    <table className="otable body-3">
      <thead><tr>
        <th><input type="checkbox" aria-label="Select all" checked={all} onChange={() => setSelected(all ? new Set() : new Set(open.map((r) => r.id)))} /></th>
        {HEAD.map((h) => <th key={h}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(({ id, d: [t, side, vol, p, mv, avg, pv, val, st, time] }) => (
          <tr key={id}>
            <td>{isOpen(st) && <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} />}</td>
            <td>{t}</td>
            <td className={side === "Buy" ? "c-up" : "c-down"}>{side}</td>
            <td>{n(vol)}</td><td>{f(p)}</td><td>{n(mv)}</td><td>{f(avg)}</td><td>{n(pv)}</td><td>{n(val)}</td>
            <td className={stCls[st]}>{st}</td><td>{time}</td>
            <td className="act">{isOpen(st) && <><button aria-label="Edit">✎</button><button className="c-down" aria-label="Cancel">✕</button></>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}