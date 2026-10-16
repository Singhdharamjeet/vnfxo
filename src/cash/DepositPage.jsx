import { useState } from "react";
import PageShell from "../auth/PageShell";
import { MockQr } from "../auth/AuthModal";
import "../trading/trading.css";
import "../assets/assets.css";
import "./cash.css";

// id, amount, time, date, status  (mock data: replace with your API)
const HISTORY = [
  ["NT-182312843", "12,928,100,000", "12:00", "22/01/2023", "Success"], ["NT-182313442", "4,697,706,000", "19:20", "24/01/2023", "Fail"],
  ["NT-182323412", "12,928,100,000", "7:13", "28/01/2023", "Processing"], ["NT-182312843", "1,203,000,000", "12:12", "01/02/2023", "Success"],
  ["NT-182313442", "1,230,000,000", "13:21", "13/02/2023", "Success"], ["NT-182323412", "70,203,000", "12:00", "22/01/2023", "Success"],
  ["NT-182312843", "100,000,000", "19:20", "24/01/2023", "Fail"], ["NT-182313442", "5,212,000,000", "7:13", "28/01/2023", "Success"],
  ["NT-182323412", "12,928,100,000", "12:12", "01/02/2023", "Fail"], ["NT-182312843", "70,203,000", "13:21", "13/02/2023", "Processing"],
  ["NT-182313442", "100,000,000", "12:00", "22/01/2023", "Success"], ["NT-182323412", "5,212,000,000", "19:20", "24/01/2023", "Success"],
  ["NT-182323412", "12,928,100,000", "7:13", "28/01/2023", "Success"],
];
const cls = { Success: "c-up", Fail: "c-down", Processing: "c-ref" };
const fmt = (s) => { const d = s.replace(/\D/g, ""); return d ? Number(d).toLocaleString("en-US") : ""; };

export const CashTabs = ({ active }) => (
  <nav className="subtabs">
    <a className={active === "deposit" ? "is-on" : ""} href="/cash/deposit">Deposit</a>
    <a className={active === "withdraw" ? "is-on" : ""} href="/cash/withdraw">Withdraw</a>
  </nav>
);

const Account = () => <label className="sel">Account <select><option>Account - 125364</option></select></label>;

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [qr, setQr] = useState(0); // 0 = no QR yet; otherwise a seed
  const [rows, setRows] = useState(HISTORY);

  const create = () => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setQr(now.getTime() % 100000);
    setRows([[`NT-${String(now.getTime()).slice(-9)}`, amount, time, now.toLocaleDateString("en-GB"), "Processing"], ...rows]);
  };

  return (
    <PageShell className="assets cash">
      <CashTabs active="deposit" />
      <div className="panel">
        <div className="wrap">
          <h1>Deposit</h1>
          <Account />
          <div className="two">
            <section className="card steps">
              <p className="step"><span className="num">1</span>STEP 1: Enter the amount you want to deposit</p>
              <div className="amount">
                <label className="box">Enter the amount deposit
                  <input inputMode="numeric" placeholder="Amount" value={amount} onChange={(e) => setAmount(fmt(e.target.value))} />
                </label>
                <button className="create" disabled={!amount} onClick={create}>Create QR payment</button>
              </div>
              <p className="step"><span className="num">2</span>STEP 2: Scan QR code to deposit money</p>
              <div className={"qrbox" + (qr ? " live" : "")}>{qr ? <MockQr seed={qr} /> : null}</div>
              <p className="qrhint">Scan QR code to deposit</p>
              <p className="step"><span className="num">3</span>STEP 3: Check your <a className="link" href="/assets">Asset management</a> or <a className="link" href="#history">Transaction history</a></p>
            </section>

            <section className="card" id="history">
              <h3>DEPOSIT HISTORY</h3>
              <div className="selrow two-sel"><Account /><label className="sel">Time <select><option>22/01/2023 - 22/03/2023</option></select></label></div>
              <div className="otable-wrap hist-scroll">
                <table className="otable body-2">
                  <thead><tr><th>Transaction ID</th><th>Deposit ($)</th><th>Time</th><th>Status</th></tr></thead>
                  <tbody>{rows.map(([id, amt, time, date, st], i) => (
                    <tr key={i}><td>{id}</td><td>{amt}</td><td>{time}&nbsp; {date}</td><td className={cls[st]}>{st}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  );
}