import { useState } from "react";
import PageShell from "../auth/PageShell";
import OrderTable, { makeOrders } from "./OrderTable";
import "./trading.css";

export default function OrderBookPage() {
  const [rows, setRows] = useState(() => makeOrders(16));
  const [sel, setSel] = useState(new Set());
  const [q, setQ] = useState("");
  const [side, setSide] = useState("All");
  const [status, setStatus] = useState("All");
  const shown = rows.filter((r) => r.d[0].includes(q.trim().toUpperCase()) && (side === "All" || r.d[1] === side) && (status === "All" || r.d[8] === status));
  const cancel = () => { setRows(rows.filter((r) => !sel.has(r.id))); setSel(new Set()); };
  return (
    <PageShell className="ob">
      <nav className="subtabs"><button className="is-on">Equities order book</button><button>Derivatives order book</button></nav>
      <div className="filters">
        <input className="field-s" placeholder="Search ticker" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="field-s">Buy/Sell <select value={side} onChange={(e) => setSide(e.target.value)}><option>All</option><option>Buy</option><option>Sell</option></select></label>
        <label className="field-s">Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Pending</option><option>Matched</option><option>Cancelled</option><option>Chờ khớp</option></select></label>
        <button className="btn-soft" onClick={cancel} disabled={!sel.size}>Cancel selected orders</button>
      </div>
      <div className="otable-wrap"><OrderTable rows={shown} selected={sel} setSelected={setSel} /></div>
    </PageShell>
  );
}