import { useEffect, useRef, useState } from "react";
import "./tokens.css";
import "./navbar.css";
import { LANGS, makeT } from "./i18n";

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Flag images load from flagcdn for now; replace with SVGs exported from Figma.
const Flag = ({ code }) => <img className="flag" src={`https://flagcdn.com/w40/${code}.png`} alt="" />;

const LINKS = [
  { key: "market", href: "/market" },
  { key: "heatmap", href: "/heatmap" },
  { key: "trading", href: "/trading" },
  { key: "orderBook", href: "/order-book", menu: true, sub: [["Equities order book", "/order-book"], ["Derivatives order book", "/order-book"]] },
  { key: "assets", href: "/assets", menu: true, sub: [["Portfolio performance", "/assets"], ["Profit/Loss history", "/assets/pnl"]] },
  { key: "cash", href: "/cash", menu: true, sub: [["Deposit", "/cash/deposit"], ["Withdraw", "/cash/withdraw"]] },
];

const path = window.location.pathname;
const isActive = (h) => (h === "/market" ? path === "/" || path.startsWith("/market") : path.startsWith(h));

export default function Navbar({ loggedIn = false, account = "125364", lang = "en", onLangChange, onLogin, onLogout, onOpenAccount }) {
  const t = makeT(lang);
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const [acctOpen, setAcctOpen] = useState(false);
  const acctWrap = useRef(null);
  const logout = () => {
    if (onLogout) return onLogout();
    try { sessionStorage.removeItem("in"); } catch { /* ignore */ }
    window.location.assign("/");
  };
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    if (!open) return;
    const away = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  useEffect(() => {
    if (!acctOpen) return;
    const away = (e) => !acctWrap.current?.contains(e.target) && setAcctOpen(false);
    const esc = (e) => e.key === "Escape" && setAcctOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [acctOpen]);

  return (
    <header className="nav">
      {/* Replace with the logo exported from Figma (SVG) */}
      <a className="nav__logo" href="/"><svg width="121" height="20" viewBox="0 0 121 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M118.702 9.70584C118.702 11.788 118.578 13.4343 118.353 14.6206C118.153 15.6859 117.529 16.2912 116.481 16.4848C115.033 16.7269 112.712 16.848 109.517 16.848C107.27 16.848 105.273 16.7996 103.576 16.6785C102.552 16.6301 101.828 16.5333 101.379 16.4122C100.955 16.2912 100.605 16.1217 100.381 15.8796C100.081 15.5648 99.8814 14.9354 99.7566 13.9669C99.6318 12.9985 99.5569 11.449 99.5569 9.31847C99.5569 7.18793 99.6817 5.66265 99.9063 4.59738C100.031 3.94369 100.256 3.48369 100.555 3.19316C100.88 2.92684 101.379 2.73316 102.078 2.63631C103.376 2.41842 105.423 2.29736 108.169 2.29736C110.939 2.32157 112.787 2.32157 113.735 2.37C114.684 2.39421 115.557 2.46684 116.306 2.58789C117.529 2.75737 118.228 3.36263 118.403 4.35527C118.603 5.37212 118.702 7.16371 118.702 9.70584Z" fill="url(#paint0_linear_1004_18550)"/>
<path d="M0 0.046875H3.21821L12.5205 16.4975H13.1077L22.1986 0.046875H25.4403L14.9165 19.0753H10.7587L0 0.046875Z" fill="white"/>
<path d="M26.4504 0.046875H30.9371L47.404 16.4741H47.6624V0.046875H50.5753V19.0753H46.0181L29.5982 2.67148H29.3633V19.0753H26.4504V0.046875Z" fill="white"/>
<path d="M53.394 19.0753V0.046875H71.4583L68.9448 2.50744H56.3069V8.15504H70.7771L68.8743 10.6156H56.3304V19.0284H53.4175L53.394 19.0753Z" fill="white"/>
<path d="M72.2101 0.046875H76.274L84.3312 7.85039L92.5294 0.046875H96.7108L86.9152 9.1627L97.2276 19.0518H93.1872L84.2607 10.4516L75.4753 19.0518H71.2939L81.8177 9.1627L72.2101 0.046875Z" fill="white"/>
<path d="M109.584 0C112.825 0 115.104 0.0937359 116.443 0.304642C117.782 0.515548 118.792 0.93736 119.426 1.57008C119.826 1.94502 120.131 2.4137 120.319 2.95268C120.507 3.49166 120.671 4.21812 120.789 5.15548C120.93 6.35061 121 7.85039 121 9.6548C121 11.9513 120.883 13.7089 120.671 14.904C120.46 16.0992 120.084 16.9896 119.52 17.5521C118.933 18.1848 117.993 18.6066 116.701 18.8175C115.409 19.0284 113.319 19.1456 110.429 19.1456C109.02 19.1456 107.446 19.1456 105.731 19.0753C104.016 19.005 102.865 18.9815 102.325 18.9347C101.362 18.8409 100.587 18.6769 100.023 18.466C99.4593 18.2551 98.9425 17.9036 98.4962 17.4349C97.9089 16.8256 97.533 15.982 97.3451 14.904C97.1572 13.8261 97.0632 12.0216 97.0632 9.49077C97.0632 6.49122 97.2747 4.35872 97.674 3.11672C98.1908 1.57008 99.3653 0.679586 101.245 0.374944C102.889 0.11717 105.661 0 109.584 0ZM108.127 2.53087C105.52 2.53087 103.617 2.62461 102.396 2.83551C101.738 2.95268 101.268 3.14015 100.963 3.39793C100.657 3.6557 100.469 4.10095 100.352 4.73367C100.141 5.7882 100.047 7.31141 100.047 9.30329C100.047 11.2952 100.094 12.8653 100.211 13.8026C100.328 14.74 100.516 15.3493 100.798 15.6539C101.01 15.8882 101.315 16.0757 101.738 16.1695C102.161 16.2632 102.842 16.3569 103.805 16.4272C105.402 16.5444 107.282 16.5913 109.396 16.5913C112.403 16.5913 114.587 16.4741 115.95 16.2163C116.936 16.0523 117.524 15.4664 117.711 14.4353C117.923 13.2636 118.017 11.6936 118.017 9.67824C118.017 7.21767 117.923 5.48355 117.735 4.49933C117.571 3.53853 116.913 2.97612 115.762 2.78865C115.057 2.67147 114.235 2.60117 113.342 2.57774C112.45 2.55431 110.711 2.53087 108.104 2.50744L108.127 2.53087Z" fill="white"/>
<path d="M114.873 9.66765C110.418 10.3032 109.841 10.8846 109.035 15.3156C108.399 10.8608 107.818 10.2838 103.387 9.47775C107.842 8.84221 108.419 8.26075 109.225 3.82981C109.86 8.28459 110.442 8.86156 114.873 9.66765Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_1004_18550" x1="109.357" y1="16.9903" x2="109.357" y2="1.66064" gradientUnits="userSpaceOnUse">
<stop stop-color="#F9C11B"/>
<stop offset="1" stop-color="#F9971B"/>
</linearGradient>
</defs>
</svg>
</a>

      <nav className="nav__links">
        {LINKS.map(({ key, href, menu, sub }) => (
          <div key={key} className="nav__dd">
            <a href={href} className={"nav__item title-2" + (isActive(href) ? " is-active" : "")}>{t(key)}{menu && <Chevron />}</a>
            {sub && <ul className="langmenu nav__sub">{sub.map(([label, to]) => <li key={label}><a className="langmenu__item title-2" href={to}>{label}</a></li>)}</ul>}
          </div>
        ))}
      </nav>

      <div className="nav__right">
        <button className="nav__icon" aria-label="Notifications"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 14.5194C17.5 14.9261 17.1703 15.2558 16.7636 15.2558H3.23643C2.82971 15.2558 2.5 14.9261 2.5 14.5194C2.5 14.1127 2.82971 13.7829 3.23643 13.7829H3.25V8.65074C3.25 4.9774 6.2725 2 10 2C13.7275 2 16.75 4.9774 16.75 8.65074V13.7829H16.7636C17.1703 13.7829 17.5 14.1127 17.5 14.5194ZM4.75 13.7829H15.25V8.65074C15.25 5.79116 12.8995 3.47287 10 3.47287C7.1005 3.47287 4.75 5.79116 4.75 8.65074V13.7829ZM8.31337 16.7965C8.10934 16.384 8.4981 15.9922 8.95833 15.9922H11.0417C11.5019 15.9922 11.8907 16.384 11.6866 16.7965C11.5963 16.9793 11.4749 17.1477 11.3258 17.2941C10.9742 17.6394 10.4973 17.8333 10 17.8333C9.50272 17.8333 9.02581 17.6394 8.67417 17.2941C8.52511 17.1477 8.40374 16.9793 8.31337 16.7965Z" fill="#A8B0B8"/>
</svg>
</button>
        <button className="nav__icon" aria-label="Help"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.21351 6.29262C6.59596 6.51386 7.08534 6.38317 7.30658 6.00072C8.07218 4.89245 9.5521 6.36814 8.33872 7.08946C8.12063 7.21911 7.83541 7.43492 7.61847 7.69929C7.41306 7.94962 7.2244 8.29387 7.20222 8.71696C7.19939 8.7443 7.19794 8.77205 7.19794 8.80014C7.19794 9.24197 7.55612 9.60014 7.99794 9.60014C8.60776 9.60014 8.72383 9.27618 8.84097 8.94926C8.91632 8.73895 8.9921 8.52743 9.20004 8.40014C9.86134 7.99532 10.4 7.27832 10.4 6.40014C10.4 5.07465 9.32553 4.00013 8.00004 4.00013C7.11069 4.00013 6.33537 4.48428 5.92161 5.19956C5.70037 5.582 5.83106 6.07139 6.21351 6.29262Z" fill="#A8B0B8"/>
<path d="M7.19794 11.2001C7.19794 10.7583 7.55612 10.4001 7.99794 10.4001C8.43977 10.4001 8.79795 10.7583 8.79795 11.2001C8.79795 11.642 8.43977 12.0001 7.99794 12.0001C7.55612 12.0001 7.19794 11.642 7.19794 11.2001Z" fill="#A8B0B8"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 8.00001C16 12.4183 12.4183 16 8.00001 16C3.58173 16 0 12.4183 0 8.00001C0 3.58173 3.58173 0 8.00001 0C12.4183 0 16 3.58173 16 8.00001ZM14.4 8.00001C14.4 11.5346 11.5346 14.4 8.00001 14.4C4.46538 14.4 1.6 11.5346 1.6 8.00001C1.6 4.46538 4.46538 1.6 8.00001 1.6C11.5346 1.6 14.4 4.46538 14.4 8.00001Z" fill="#A8B0B8"/>
</svg>
</button>

        <div className="nav__langwrap" ref={wrap}>
          <button className="nav__lang body-2" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Flag code={current.flag} /> {current.label}
          </button>
          {open && (
            <ul className="langmenu" role="menu">
              {LANGS.map((l) => (
                <li key={l.code}>
                  <button role="menuitem" className={"langmenu__item title-2" + (l.code === lang ? " is-on" : "")}
                    onClick={() => { onLangChange?.(l.code); setOpen(false); }}>
                    <Flag code={l.flag} /> {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {loggedIn ? (
          <div className="nav__langwrap" ref={acctWrap}>
            <button className="nav__item title-2" aria-haspopup="menu" aria-expanded={acctOpen} onClick={() => setAcctOpen(!acctOpen)}>{t("account")} - {account}<Chevron /></button>
            {acctOpen && (
              <ul className="langmenu" role="menu">
                <li><button role="menuitem" className="langmenu__item title-2" onClick={logout}>{t("logout")}</button></li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <button className="nav__cta btn-lg" onClick={onOpenAccount}>{t("openAccount")}</button>
            <button className="nav__login btn-lg" onClick={onLogin}>{t("login")}</button>
          </>
        )}
      </div>
    </header>
  );
}