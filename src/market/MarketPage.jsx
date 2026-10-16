import { useMemo, useState } from "react";
import Navbar from "../auth/Navbar";
import { makeT, loadLang, saveLang } from "../auth/i18n";
import { rows, indices, TABS } from "./mockData";
import "../auth/tokens.css";
import "./market.css";

const fmt = (n, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const int = (n) => (n == null ? "" : n.toLocaleString("en-US"));

/** One place for the price colour rules: ceiling, floor, reference, up, down. */
export function priceClass(p, { ref, ceil, floor }) {
  if (p === ceil) return "c-ceil";
  if (p === floor) return "c-floor";
  if (p === ref) return "c-ref";
  return p > ref ? "c-up" : "c-down";
}

function Sparkline({ dir, seed }) {
  const pts = useMemo(() => {
    let s = seed, y = 30;
    return Array.from({ length: 60 }, (_, x) => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      y = Math.max(6, Math.min(54, y + ((s / 4294967296) - (dir === "up" ? 0.42 : 0.58)) * 9));
      return `${(x / 59) * 100},${y.toFixed(1)}`;
    }).join(" ");
  }, [dir, seed]);
  const color = dir === "up" ? "var(--green)" : "var(--red)";
  return (
    <svg className="spark" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,60 ${pts} 100,60`} fill={color} opacity="0.25" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function IndexCard({ d, i }) {
  const cls = d.dir === "up" ? "c-up" : "c-down";
  return (
    <article className="icard">
      <div className="icard__main">
        <h3 className="title-2">{d.name} <span className="icard__sub">{d.sub}</span></h3>
        <p className={`icard__val ${cls}`}>{fmt(d.value)} <small>({d.chg > 0 ? "+" : ""}{fmt(d.chg)} {d.pct > 0 ? "+" : ""}{fmt(d.pct)}%)</small></p>
        <p className="icard__breadth body-3">
          <span className="c-up">↑{d.up}({d.upC})</span><span className="c-ref">{d.flat}</span><span className="c-down">↓{d.down}({d.downC})</span>
        </p>
        <p className="body-3 icard__meta">{d.qty}<br />{d.val}</p>
      </div>
      <Sparkline dir={d.dir} seed={i * 97 + 13} />
    </article>
  );
}

const GROUPS = [
  ["Bid", 6], ["Matched", 4], ["Asked", 6], [null, 3], ["Foreign", 3],
];
const SUB = ["Price 3", "Vol 3", "Price 2", "Vol 2", "Price 1", "Vol 1", "Price", "Vol", "+/-", "+/- (%)",
  "Price 3", "Vol 3", "Price 2", "Vol 2", "Price 1", "Vol 1", "Total vol", "High", "Low", "F.buy", "F.sell", "Room"];

function Row({ r }) {
  const k = r;
  const pc = (p) => priceClass(p, k);
  const tickerCls = pc(r.match.price);
  const up = r.match.chg >= 0;
  return (
    <tr>
      <td className={`t-ticker ${tickerCls}`}>{r.ticker}</td>
      <td className="c-ceil">{fmt(r.ceil)}</td>
      <td className="c-floor">{fmt(r.floor)}</td>
      <td className="c-ref">{fmt(r.ref)}</td>
      {r.bid.map(([p, v], i) => [<td key={`bp${i}`} className={pc(p)}>{fmt(p)}</td>, <td key={`bv${i}`} className={pc(p)}>{int(v)}</td>])}
      <td className={pc(r.match.price)}>{fmt(r.match.price)}</td>
      <td className={pc(r.match.price)}>{int(r.match.vol)}</td>
      <td className={up ? "c-up" : "c-down"}>{fmt(Math.abs(r.match.chg))}</td>
      <td className={up ? "c-up" : "c-down"}>{fmt(Math.abs(r.match.pct))}%</td>
      {r.ask.map(([p, v], i) => [<td key={`ap${i}`} className={pc(p)}>{fmt(p)}</td>, <td key={`av${i}`} className={pc(p)}>{int(v)}</td>])}
      <td>{int(r.total)}</td>
      <td className={pc(r.high)}>{fmt(r.high)}</td>
      <td className={pc(r.low)}>{fmt(r.low)}</td>
      <td>{int(r.foreign.buy)}</td>
      <td>{int(r.foreign.sell)}</td>
      <td>{int(r.foreign.room)}</td>
    </tr>
  );
}

export default function MarketPage({ loggedIn = false, onLogin, onOpenAccount }) {
  const [lang, setLang] = useState(loadLang);
  const t = makeT(lang);
  const changeLang = (l) => { setLang(l); saveLang(l); };
  const [tab, setTab] = useState("S&P 500");
  const [q, setQ] = useState("");
  const list = rows.filter((r) => r.ticker.includes(q.trim().toUpperCase()));
  return (
    <div className="market">
      <Navbar loggedIn={loggedIn} lang={lang} onLangChange={changeLang} onLogin={onLogin} onOpenAccount={onOpenAccount} />
      <section className="indices">{indices.map((d, i) => <IndexCard key={d.id} d={d} i={i} />)}</section>

      <div className="toolbar">
        <input className="search body-2" placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={"tab title-3" + (tab === t ? " is-on" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <button className="order-btn btn-lg">{t("order")}</button>
      </div>

      <div className="grid-wrap">
        <table className="grid body-3">
          <thead>
            <tr>
              <th rowSpan="2">Ticker</th><th rowSpan="2">Ceil</th><th rowSpan="2">Floor</th><th rowSpan="2">Ref</th>
              {GROUPS.map(([g, n], i) => (g ? <th key={i} colSpan={n} className="grp">{g}</th> : <th key={i} colSpan={n} />))}
            </tr>
            <tr>{SUB.map((s, i) => <th key={i}>{s}</th>)}</tr>
          </thead>
          <tbody>{list.map((r) => <Row key={r.ticker} r={r} />)}</tbody>
        </table>
      </div>
    </div>
  );
}