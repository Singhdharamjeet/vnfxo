import { useState } from "react";
import PageShell from "../auth/PageShell";
import { Donut, Chart, walk } from "./charts";
import "../trading/trading.css";
import "./assets.css";

const n = (v) => v.toLocaleString("en-US");
const ALLOC = [["HPG", 33, 2534700000, "#ff8a4c"], ["VCG", 18, 1239384000, "#ffd43b"], ["VND", 16, 1039405000, "#f2564d"], ["VCB", 12, 720203000, "#3ddc55"], ["TPB", 11, 680394000, "#4aa8ff"], ["ACB", 7, 480304000, "#4a7bff"], ["SSI", 5, 320003000, "#d946ef"], ["MWG", 3, 120293000, "#8b5cf6"]]
  .map(([name, pct, amount, color]) => ({ name, pct, value: pct, amount, color }));
const OVERVIEW = [["Total asset (1) = (2)+(3)+(4)+(5)+(6)+(7)", 12928100000, "100.00"], ["Cash (2)", 4697706000, "36.23"], ["Equities portfolio (3)", 5212000000, "55.23"], ["Derivative portfolio (4)", 1203000000, "9.34"], ["Bonds (5)", 1230000000, "9.56"], ["ETF (6)", 70203000, "1.34"], ["Saving cash (7)", 100000000, "1.50"], ["Debt (8)", 0, "0"], ["Net assets (9) = (1)-(8)", 12928100000, "100.00"]];
const BOXES = [["Maximum buying power", "4,697,706,000 $"], ["Cash balance", "12,340,000 $"], ["Withdrawable", "2,544,706,000 $"], ["Total debt", "0 $"]];
const DETAILS = [["Total equities portfolio", "5,212,000,000", ""], ["Pending buy orders", "20,383,000", "c-up"], ["T0", "12,234,000", "c-up"], ["T1", "8,234,000", "c-up"], ["Pending sell orders", "4,697,706,000", "c-down"], ["T0", "12,234,000", "c-down"], ["T1", "8,234,000", "c-down"], ["Proceeds from sales advanced", "21,394,000", ""], ["Subscription rights", "0", ""], ["Dividends pending", "0", ""]];
const PCT_Y = ["200%", "150%", "100%", "50%", "0%", "-50%", "-100%", "-150%", "-200%"];
const PNL_Y = ["500M", "400M", "300M", "200M", "100M", "0", "-100M", "-200M", "-300M"];
const DAYS = ["1/9", "5/9", "10/9", "15/9", "20/9", "25/9", "30/9"];
const PORTFOLIOS = ["Equities portfolio", "Derivative portfolio", "Bonds", "ETF"];

export const AssetTabs = ({ active }) => (
  <nav className="subtabs"><a className={active === "portfolio" ? "is-on" : ""} href="/assets">Portfolio performance</a><a className={active === "pnl" ? "is-on" : ""} href="/assets/pnl">Profit/Loss history</a></nav>
);
const Pills = ({ items, value, onChange }) => <div className="pills">{items.map((t) => <button key={t} className={value === t ? "is-on" : ""} onClick={() => onChange(t)}>{t}</button>)}</div>;
const Filters = () => <div className="selrow"><label className="sel">Ticker <select><option>All</option></select></label><label className="sel">Time <select><option>9/2023</option></select></label></div>;
const Card = ({ title, children, className = "" }) => <section className={"card " + className}><h3>{title}</h3>{children}</section>;

export default function Portfolio() {
  const [alloc, setAlloc] = useState(PORTFOLIOS[0]);
  const [det, setDet] = useState(PORTFOLIOS[0]);
  const perf = [{ name: "Your Asset", color: "#f8c41a", swatch: "your-asset", fill: true, data: walk(3) }, { name: "S&P 500", color: "#19c19d", swatch: "sp500", data: walk(11) }, { name: "NASDAQ", color: "#f2564d", swatch: "nasdaq", data: walk(29) }];
  return (
    <PageShell className="assets">
      <AssetTabs active="portfolio" />
      <div className="panel">
        <div className="sum">
          <div className="card"><small>NET ASSETS</small><b>12,928,100,000 VND</b><p>Increase <span className="c-up">3,67%</span> vs yesterday</p></div>
          <div className="card"><small>STOCKS</small><b>8,230,394,000 VND</b><p>Increase <span className="c-up">4,12%</span> vs yesterday</p></div>
          <div className="card"><small>CASH</small><b>4,697,706,000 VND</b><p>Decrease <span className="c-down">28,033,550 VND</span> vs yesterday</p></div>
          <div className="card hist"><small>PROFIT/LOSS HISTORY</small><a href="/assets/pnl" className="link">Detal profit/loss history</a>
            <div className="hist__row">{[["1 Day", "+1,706,000 $", "c-up"], ["1 Month", "-12,340,000 $", "c-down"], ["1 Year", "+2,544,706,000 $", "c-up"], ["All time", "+23,434,706,000 $", "c-up"]].map(([k, v, c]) => <div key={k}><small>{k}</small><b className={c}>{v}</b></div>)}</div></div>
        </div>
        <div className="grid3">
          <Card title="ASSET ALLOCATION" className="row2">
            <Pills items={PORTFOLIOS} value={alloc} onChange={setAlloc} />
            <Donut slices={ALLOC} center="8,230,394,000 $" />
            <ul className="legend">{ALLOC.map((a) => <li key={a.name}><i className={"legend__swatch--" + a.name.toLowerCase()} /><b>{a.name}</b> ({a.pct}%): {n(a.amount)} $</li>)}</ul>
            <a className="link center" href="#">Chi tiết danh mục cơ sở</a>
          </Card>
          <Card title="ASSET OVERVIEW">
            <table className="ov"><thead><tr><th>Asset</th><th>Amount ($)</th><th>%</th></tr></thead>
              <tbody>{OVERVIEW.map(([k, v, p]) => <tr key={k}><td>{k}</td><td>{n(v)}</td><td>{p}</td></tr>)}</tbody></table>
          </Card>
          <Card title="INVESTMENT PERFORMANCE">
            <Filters /><Chart series={perf} y={PCT_Y} x={DAYS} />
            <ul className="key">{perf.map((s) => <li key={s.name}><i className={"key__swatch--" + s.swatch} />{s.name}</li>)}</ul>
          </Card>
          <Card title="ASSET DETAILS">
            <Pills items={PORTFOLIOS} value={det} onChange={setDet} />
            <div className="det">
              <div className="boxes">{BOXES.map(([k, v]) => <div key={k}><small>{k}</small><b>{v}</b></div>)}</div>
              <dl className="rows">{DETAILS.map(([k, v, c], i) => <div key={k + i}><dt>{k}</dt><dd className={c}>{v}</dd></div>)}</dl>
            </div>
          </Card>
          <Card title="PROFIT/LOSS HISTORY">
            <Filters /><Chart series={[{ name: "Your Asset", color: "#19c19d", fill: true, data: walk(41, 60) }]} y={PNL_Y} x={DAYS} />
            <ul className="key"><li><i className="key__swatch--pnl" />Your Asset</li></ul>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}