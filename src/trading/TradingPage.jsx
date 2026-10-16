import { useMemo, useState } from "react";
import PageShell from "../auth/PageShell";
import OrderTable, { makeOrders } from "./OrderTable";
import { rows as stocks } from "../market/mockData";
import "./trading.css";

const f = (v) => v.toFixed(2);
const n = (v) => v.toLocaleString("en-US");
const TF = ["1m", "15m", "1 hour", "4 hour", "1 day", "1 month", "1 year", "All time"];
const STATS = [["Market Capitalization", "146,241.16 B"], ["Outstanding Shares", "5.81 B"], ["Free Float", "3.15 B"], ["EPS", "-238"], ["P/E", "-76,64"], ["Revenue (4 Quarters)", "116,014.21 B"], ["Profit (4 Quarters)", "-1,953.42 B"], ["Total Assets", "176,243.32 B"], ["ROE (4 Quarters)", "0.64%"], ["Beta (120 Weeks)", "1.10"]];

/* Mock candles. Replace with a chart library (lightweight-charts / TradingView) fed by your API. */
function Chart() {
  const bars = useMemo(() => {
    let s = 5, p = 21.8;
    const r = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
    return Array.from({ length: 70 }, () => {
      const o = p, c = o + (r() - 0.5) * 0.14;
      p = c + (21.8 - c) * 0.05;
      return { o, c, hi: Math.max(o, c) + r() * 0.06, lo: Math.min(o, c) - r() * 0.06, v: r() };
    });
  }, []);
  const y = (v) => ((22.1 - v) / 0.5) * 300, W = 800 / 70;
  return (
    <>
      <svg className="chart" viewBox="0 0 800 300" preserveAspectRatio="none">
        {bars.map((b, i) => {
          const col = b.c >= b.o ? "var(--green)" : "var(--red)", x = i * W + W / 2;
          return <g key={i} stroke={col} fill={col}><line x1={x} x2={x} y1={y(b.hi)} y2={y(b.lo)} vectorEffect="non-scaling-stroke" /><rect x={x - 3} width="6" y={y(Math.max(b.o, b.c))} height={Math.max(1, Math.abs(y(b.o) - y(b.c)))} /></g>;
        })}
      </svg>
      <svg className="vol" viewBox="0 0 800 80" preserveAspectRatio="none">
        {bars.map((b, i) => <rect key={i} x={i * W + 1} width="6" y={80 - b.v * 70} height={b.v * 70} fill={b.c >= b.o ? "var(--green)" : "var(--red)"} opacity=".6" />)}
      </svg>
    </>
  );
}

const Depth = () => (
  <svg className="depth" viewBox="0 0 200 120" preserveAspectRatio="none">
    {[100, 62, 25, 14, 8].map((h, i) => <rect key={"b" + i} x={i * 20} y={120 - h} width="19" height={h} fill="var(--green)" opacity=".75" />)}
    {[6, 10, 18, 40, 70].map((h, i) => <rect key={"a" + i} x={100 + i * 20} y={120 - h} width="19" height={h} fill="var(--red)" opacity=".75" />)}
  </svg>
);

export default function TradingPage() {
  const [tf, setTf] = useState("1m");
  const [tab, setTab] = useState("overview"); // Trading/01 = overview, Trading/02 = depth
  const [side, setSide] = useState("buy");
  const [type, setType] = useState("LO"); // Trading/02 uses MP
  const [qty, setQty] = useState(1283);
  const [price, setPrice] = useState(21.9);
  const [adv, setAdv] = useState(true);
  const [sel, setSel] = useState(new Set());
  const orders = useMemo(() => makeOrders(4), []);
  const total = qty * price * 1000;
  const top = stocks[0];

  return (
    <PageShell className="trading">
      <aside className="watch">
        <input className="field-s" placeholder="Search ticker" />
        <div className="chips"><button className="chip is-on">S&P 500</button><button className="chip">NASDAQ</button><button className="chip">HNX</button></div>
        <div className="watch__list">
          <div className="watch__row head"><span>Ticker</span><span>Price</span><span>+/-</span><span>Vol</span></div>
          {stocks.map((s, i) => (
            <div key={s.ticker + i} className={"watch__row" + (i === 0 ? " is-on" : "")}>
              <span>{s.ticker}</span><span className={s.match.chg >= 0 ? "c-up" : "c-down"}>{f(s.match.price)}</span>
              <span className={s.match.chg >= 0 ? "c-up" : "c-down"}>{f(s.match.chg)}</span><span>{n(s.total)}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="center">
        <header className="quote">
          <div className="quote__name"><h2>AAPL</h2><span className="tag">NASDAQ</span><span className="tag">TECHNOLOGY</span><p>Apple Inc</p></div>
          <div className="quote__px"><b className="c-up">21.85</b><small className="c-up">+0.10 +0.46%</small></div>
          <div><small>Highest</small><b>22.05</b></div><div><small>Lowest</small><b>20.00</b></div><div><small>Total vol</small><b>2,338,700</b></div>
        </header>
        <div className="chartbox">
          <div className="tfbar">{TF.map((t) => <button key={t} className={"tf" + (tf === t ? " is-on" : "")} onClick={() => setTf(t)}>{t}</button>)}</div>
          <Chart />
        </div>
        <section className="orders">
          <nav className="subtabs"><button className="is-on">Equities order book</button><button>Derivatives order book</button></nav>
          <div className="otable-wrap"><OrderTable rows={orders} selected={sel} setSelected={setSel} /></div>
          <button className="btn-soft" disabled={!sel.size}>Cancel selected orders</button>
        </section>
      </main>

      <aside className="side">
        <div className="seg">{[["overview", "Overview"], ["book", "Order book"], ["depth", "Depth"]].map(([k, l]) => <button key={k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
        {tab === "overview" && <dl className="stats">{STATS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className={v.startsWith("-") && k.startsWith("Profit") ? "c-down" : ""}>{v}</dd></div>)}</dl>}
        {tab === "book" && <dl className="stats">{[...top.ask].reverse().map(([p, v]) => <div key={"a" + p}><dt className="c-down">{f(p)}</dt><dd>{n(v)}</dd></div>)}{top.bid.map(([p, v]) => <div key={"b" + p}><dt className="c-up">{f(p)}</dt><dd>{n(v)}</dd></div>)}</dl>}
        {tab === "depth" && <Depth />}

        <form className="ticket" onSubmit={(e) => e.preventDefault()}>
          <div className="seg seg--trade"><button type="button" className={side === "buy" ? "is-buy" : ""} onClick={() => setSide("buy")}>Buy</button><button type="button" className={side === "sell" ? "is-sell" : ""} onClick={() => setSide("sell")}>Sell</button></div>
          <p className="bp">Buying Power: 28,100,000 $ ~ <span className="c-up">1,283</span></p>
          <label className="box">Quantity<input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} /></label>
          <label className="box">Price<input value={type === "MP" ? "Market Price (MP)" : price} disabled={type !== "LO"} onChange={(e) => setPrice(+e.target.value || 0)} /></label>
          <div className="types">{["LO", "MP", "ATO", "ATC"].map((t) => <button type="button" key={t} className={type === t ? "is-on" : ""} onClick={() => setType(t)}>{t}</button>)}</div>
          <div className="adv"><span>Advanced Order</span><button type="button" className={"switch" + (adv ? " is-on" : "")} role="switch" aria-checked={adv} onClick={() => setAdv(!adv)} /><select><option>Stop Limit</option></select></div>
          {adv && <>
            <label className="box">Market price<input placeholder="Enter market price" /></label>
            <label className="box">Start date<input defaultValue="02/10/2022" /></label>
            <div className="two"><label className="box">End date<input defaultValue="05/10/2022" /></label><label className="box">End time<input defaultValue="23:59" /></label></div>
          </>}
          <p className="total"><span>Total</span><b>{n(total)} $</b></p>
          <button className={"submit " + side}>{side === "buy" ? "Buy" : "Sell"}</button>
        </form>
      </aside>
    </PageShell>
  );
}