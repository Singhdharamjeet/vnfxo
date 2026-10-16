import { useEffect, useMemo, useState } from "react";
import "./tokens.css";
import "./auth.css";

function Field({ label, type = "text", name, secret = false, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="field__input"
        name={name}
        type={secret && !show ? "password" : type}
        {...rest}
      />
      {secret && (
        <button
          type="button"
          className="field__eye"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow(!show)}
        >
          {show ? "🙈" : "👁"}
        </button>
      )}
    </label>
  );
}

/* Mock QR pattern. In production replace with a real code, e.g. <QRCodeSVG value={token} /> from `qrcode.react`. */
export function MockQr({ seed }) {
  const N = 21;
  const cells = useMemo(() => {
    let s = seed * 7919 + 1;
    const ring = (lx, ly) => lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
    const out = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const tl = x < 8 && y < 8, tr = x >= N - 8 && y < 8, bl = x < 8 && y >= N - 8;
      let on;
      if (tl) on = x < 7 && y < 7 && ring(x, y);
      else if (tr) on = x > N - 8 && y < 7 && ring(x - (N - 7), y);
      else if (bl) on = x < 7 && y > N - 8 && ring(x, y - (N - 7));
      else { s = (s * 1664525 + 1013904223) % 4294967296; on = s / 4294967296 > 0.5; }
      if (on) out.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
    return out;
  }, [seed]);
  return <svg className="qr__code" viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" aria-label="Login QR code">{cells}</svg>;
}

const QR_SECONDS = 180;

function QrPanel() {
  const [left, setLeft] = useState(QR_SECONDS);
  const [seed, setSeed] = useState(1);
  const expired = left <= 0;
  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [expired, seed]);
  const refresh = () => { setSeed((s) => s + 1); setLeft(QR_SECONDS); };
  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <aside className="qr">
      <div className={"qr__box" + (expired ? " is-expired" : "")}>
        <MockQr seed={seed} />
        {/* Hover state in Figma (02): Download button. Expired: Refresh button. */}
        <button type="button" className="qr__download" onClick={expired ? refresh : undefined}>
          {expired ? "Refresh QR code" : "Download QR code"}
        </button>
      </div>
      <h3>{expired ? "This QR code has expired" : <>This QR code is valid until <em>{mmss}</em></>}</h3>
      <p>Scan this code with the VNFXO app to log in instantly.</p>
    </aside>
  );
}

function Login({ onClose, onSwitch, onSubmit }) {
  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(Object.fromEntries(new FormData(e.currentTarget)));
  };
  return (
    <div className="modal modal--login">
      <QrPanel />

      <form className="login" onSubmit={submit}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="title">Log in to your <br /><em>VNFXO</em> account</h2>
        <Field label="Email or phone number" name="id" autoFocus required />
        <Field label="Password" name="password" secret required />
        <div className="row">
          <label className="check"><input type="checkbox" name="remember" /> Remember me</label>
          <a href="/forgot-password" className="link">Forgot password?</a>
        </div>
        <button className="btn btn--primary" type="submit">Log in</button>
        <button className="btn btn--ghost" type="button" onClick={onSwitch}>Open account</button>
        <div className="divider"><span>Or try the experience with</span></div>
        <div className="social">
          {[["G", "Google"], ["", "Apple"], ["f", "Facebook"]].map(([icon, name]) => (
            <button type="button" key={name} className="social__btn">
              <span>{icon}</span>{name}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

function Signup({ onClose, onSwitch, onSubmit }) {
  const [type, setType] = useState("personal");
  const [agreed, setAgreed] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ type, ...Object.fromEntries(new FormData(e.currentTarget)) });
  };
  return (
    <form className="modal modal--signup" onSubmit={submit}>
      <button type="button" className="modal__close" onClick={onClose} aria-label="Close">✕</button>
      <div className="auth-tabs" role="tablist">
        {["personal", "broker"].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={type === t}
            className={"tabs__tab" + (type === t ? " is-active" : "")}
            onClick={() => setType(t)}
          >
            {t.toUpperCase()} ACCOUNT
          </button>
        ))}
      </div>
      <h2 className="title">Create Account</h2>
      <Field label="Email or phone number" name="id" required />
      <Field label="Full name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Password" name="password" secret required />
      <label className="check check--terms">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>
          By creating an account, you agree to VNFXO's{" "}
          <a className="link" href="/terms">Terms of Use</a> and{" "}
          <a className="link" href="/privacy">Privacy Policy</a>
        </span>
      </label>
      <button className="btn btn--primary" type="submit" disabled={!agreed}>Continue</button>
      <button type="button" className="back" onClick={onSwitch}>Back to login</button>
    </form>
  );
}

export default function AuthModal({ initialView = "login", onClose, onLogin, onSignup }) {
  const [view, setView] = useState(initialView);
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      {view === "login" ? (
        <Login onClose={onClose} onSwitch={() => setView("signup")} onSubmit={onLogin} />
      ) : (
        <Signup onClose={onClose} onSwitch={() => setView("login")} onSubmit={onSignup} />
      )}
    </div>
  );
}