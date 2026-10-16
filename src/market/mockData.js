// Deterministic mock data. Replace `rows` / `indices` with your WebSocket / API feed.
const TICKERS = "ACB BCM BID BVH CTG FPT GAS GVR HDB HPG MBB MSN MWG PLX POW SAB SHB SSB SSI STB TCB TPB VCB VHM VIB VJC".split(" ");
const REFS = [22.7, 68.3, 42, 42.6, 29.5, 97, 90.7, 20.7, 17.6, 26.2, 22.7, 68.3, 42, 42.6, 29.5, 97, 90.7, 20.7, 17.6, 26.2, 22.7, 68.3, 42, 42.6, 29.5, 97];
const TICK = 0.05;
const snap = (n) => Math.round(n / TICK) * TICK;
const lcg = (s) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;

export const rows = TICKERS.map((ticker, i) => {
  const rnd = lcg(i + 7);
  const ref = REFS[i];
  const ceil = snap(ref * 1.068), floor = snap(ref * 0.932);
  const price = Math.min(ceil, Math.max(floor, snap(ref + (Math.floor(rnd() * 13) - 6) * TICK)));
  const vol = () => (Math.floor(rnd() * 900) + 1) * 100;
  const side = (dir) => [1, 2, 3].map((k) => [snap(price + dir * k * TICK), vol()]);
  const bid = side(-1).reverse(); // shown as Price 3 .. Price 1
  const ask = side(1);
  const buy = rnd() > 0.6 ? Math.floor(rnd() * 200) * 100 : null;
  return {
    ticker, ref, ceil, floor, bid, ask,
    match: { price, vol: vol(), chg: price - ref, pct: ((price - ref) / ref) * 100 },
    total: vol() * 9, high: Math.min(ceil, price + 0.2), low: Math.max(floor, price - 0.2),
    foreign: { buy, sell: Math.floor(rnd() * 900) * 100, room: Math.floor(rnd() * 1e9) },
  };
});

export const indices = [
  { id: "SPX", name: "S&P 500", sub: "Standard & Poor's 500", value: 1137.36, chg: 12.08, pct: 0.93, up: 287, upC: 12, flat: 49, down: 82, downC: 4, qty: "439,929,193 Ticker", val: "15,144.71 B", dir: "up" },
  { id: "NDX", name: "NASDAQ", sub: "Nasdaq-100", value: 1150.37, chg: 10.59, pct: 0.93, up: 20, upC: 0, flat: 1, down: 9, downC: 0, qty: "179,929,193 Ticker", val: "5,144.71 Tỷ", dir: "down" },
  { id: "DJI", name: "DJIA", sub: "Dow Jones", value: 233.55, chg: 3.19, pct: 1.33, up: 123, upC: 9, flat: 54, down: 52, downC: 4, qty: "79,347,193 Ticker", val: "1,541.71 B", dir: "up" },
  { id: "RUI", name: "Russell 1000", sub: "", value: 490.21, chg: 9.08, pct: 2.03, up: 24, upC: 0, flat: 2, down: 4, downC: 1, qty: "63,929,193 Ticker", val: "1,234.71 B", dir: "down" },
  { id: "MXW", name: "MSCI World Index", sub: "", value: 86.89, chg: -0.31, pct: -0.26, up: 169, upC: 11, flat: 76, down: 102, downC: 6, qty: "43,929,193 Ticker", val: "614.71 B", dir: "up" },
];

export const TABS = ["Favorite", "S&P 500", "NASDAQ", "Dow Jones", "Russell 1000", "MSCI World Index", "Bond", "Derivative", "Covered Warrant", "ETF"];