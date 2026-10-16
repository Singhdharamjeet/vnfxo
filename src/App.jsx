import { useState } from "react";
import MarketPage from "./market/MarketPage";
import AuthModal from "./auth/AuthModal";
import TradingPage from "./trading/TradingPage";
import OrderBookPage from "./trading/OrderBookPage";
import Portfolio from "./assets/Portfolio";
import PnlHistory from "./assets/PnlHistory";
import DepositPage, { CashTabs } from "./cash/DepositPage";
import PageShell from "./auth/PageShell";

// Tiny path switch so the navbar links work. Swap for react-router-dom as the app grows.
export default function App() {
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("in") === "1");
  const path = window.location.pathname;
  if (path.startsWith("/trading")) return <TradingPage />;
  if (path.startsWith("/order-book")) return <OrderBookPage />;
  if (path.startsWith("/cash/withdraw")) return <PageShell className="assets"><CashTabs active="withdraw" /><p className="withdraw-placeholder">Withdraw screen: not built yet.</p></PageShell>;
  if (path.startsWith("/cash")) return <DepositPage />;
  if (path.startsWith("/assets/pnl")) return <PnlHistory />;
  if (path.startsWith("/assets")) return <Portfolio />;
  return (
    <>
      <MarketPage loggedIn={loggedIn} onLogin={() => setAuth("login")} onOpenAccount={() => setAuth("signup")} />
      {auth && <AuthModal initialView={auth} onClose={() => setAuth(null)}
        onLogin={() => { sessionStorage.setItem("in", "1"); setLoggedIn(true); setAuth(null); }} />}
    </>
  );
}