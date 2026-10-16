import { useState } from "react";
import Navbar from "./Navbar";
import { loadLang, saveLang } from "./i18n";
import "./tokens.css";

/** Logged-in page frame: navbar + content. Shared by Trading, Order book, etc. */
export default function PageShell({ children, className = "" }) {
  const [lang, setLang] = useState(loadLang);
  return (
    <div className={"shell " + className}>
      <Navbar loggedIn lang={lang} onLangChange={(l) => { setLang(l); saveLang(l); }} />
      {children}
    </div>
  );
}