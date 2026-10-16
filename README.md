# VNFXO – Stock Exchange Website (front end)

A React front end for a stock trading site, built from the Figma file **"Stock Exchange Website UI kit (Community) (Copy)"**. It covers the market board, login/signup, trading, order book, asset management and deposit screens. All data is mock data; there is no backend yet.

## Tech stack

- React (Vite template)
- Plain CSS with design tokens (no UI library)
- No other runtime dependencies. Flag images load from `flagcdn.com`, so they need an internet connection.

## Getting started

Requirements: Node.js LTS (check with `node -v` and `npm -v`).

```bash
npm install
npm run dev -- --open     # starts the dev server and opens the browser
```

Other commands:

```bash
npm run build             # production build in /dist
npm run preview           # serve the production build locally
npm run lint              # ESLint
```

Add the Roboto font inside `<head>` in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

## Routes

Routing is a simple path switch in `src/App.jsx` (no router library yet).

| Path | Screen | Figma frame |
|---|---|---|
| `/` | Market board (logged out or logged in) with the login/signup modal | Login&Signup 01, 02, 03, 05; Market/01; Market/change language |
| `/trading` | Trading page (chart, watchlist, order ticket, orders) | Trading/01, Trading/02 |
| `/order-book` | Equities order book | Order book/0, Order book/01 |
| `/assets` | Portfolio performance | Asset management/0, /01 |
| `/assets/pnl` | Profit/Loss history | Asset management/02 |
| `/cash/deposit` (or `/cash`) | Deposit | Cash transactions/0, Deposit/01 |
| `/cash/withdraw` | Placeholder ("not built yet") | not designed here |

The navbar menus (Order book, Asset management, Cash transactions) open on hover. The active page is highlighted from the URL.

## Project structure

```
src/
  index.css            body reset
  App.jsx              path switch, login state, auth modal
  auth/
    tokens.css         design tokens: colors, fonts, type scale (from the Figma Style guide)
    i18n.js            translations (en, vi, ja, ko) and language storage
    Navbar.jsx/.css    top bar, menus, language dropdown, account menu with logout
    PageShell.jsx      navbar + page frame for logged-in pages
    AuthModal.jsx/.css login and signup modal, QR panel with countdown
  market/
    MarketPage.jsx/.css  index cards, toolbar, price table
    mockData.js          mock rows and indices
  trading/
    TradingPage.jsx      watchlist, mock candlestick chart, order ticket
    OrderBookPage.jsx    filters and order table
    OrderTable.jsx       order table shared by Trading and Order book
    trading.css          also holds styles shared by the Assets and Cash pages
  assets/
    Portfolio.jsx        donut chart, tables, charts
    PnlHistory.jsx       filters, chart, table, CSV export
    charts.jsx           small SVG chart helpers (donut, line/area)
    assets.css
  cash/
    DepositPage.jsx      3-step deposit flow and history
    cash.css
```

Import order matters for styles: `tokens.css` defines the colors and fonts that every other stylesheet uses.

## How it works

- **Design tokens.** Colors, fonts and type styles live in `src/auth/tokens.css` as CSS variables, with exact values from the Figma Style guide (neutrals, yellow `#F8C41A`, Roboto). Change a value there and it updates everywhere.
- **Demo login.** Any email and password logs in. The flag is kept in `sessionStorage` under the key `in`. **Log out** (account menu in the navbar) clears it and returns to `/`.
- **Language.** The language dropdown stores the choice in `localStorage` under `lang`. Only the navbar and the toolbar's search and Order button are translated; table headers and page content are English.
- **Price colors.** `priceClass()` in `MarketPage.jsx` holds the board's color rules: purple for ceiling, teal for floor, yellow for reference, green above reference, red below.

## Mock data (replace with your API)

| Where | What |
|---|---|
| `src/market/mockData.js` | board rows and index cards |
| `src/trading/OrderTable.jsx` | sample orders (`BASE`) |
| `src/trading/TradingPage.jsx` | stats and generated candles |
| `src/assets/Portfolio.jsx` | all portfolio numbers; chart lines come from `walk()` in `charts.jsx` |
| `src/assets/PnlHistory.jsx` | P&L rows |
| `src/cash/DepositPage.jsx` | `HISTORY` rows |

Recommended: move all calls into one `src/api.js` and replace the mocks page by page.

## What is not real yet

- Login, signup, order placement, cancelling orders and deposits do not call a backend.
- The QR codes are random patterns and cannot be scanned. Use a package such as `qrcode.react` with a token from your server.
- The chart on the Trading page is mock. Use a library such as `lightweight-charts` with your price feed.
- Most numbers, tables and chart shapes are copied from the design.
- "Export excel" downloads a CSV file, not a real `.xlsx`.
- The logo, bell and help icons are text or emoji stand-ins. Export the real ones from Figma as SVG.

## Not built

Withdraw, Heatmap, Derivatives order book, the Market account dropdown beyond "Log out", and Login&Signup/06 (not seen in the design export).

## Known limitations

- **Sizes and spacing are estimates for most screens.** Only the Figma Style guide page has real layers, so colors and type are exact. Most screens in the file are flat images, so layout measurements were read by eye. Compare each page with Figma at 1728 px wide and adjust.
- **Global CSS.** Stylesheets are plain global CSS, so class names can clash between pages (the signup tabs use `.auth-tabs` because the market toolbar already uses `.tabs`). Prefix new classes by page, or move to CSS Modules.
- **Page reloads.** Navbar links are normal links, so every navigation reloads the page.

## Suggested next steps

1. Switch to `react-router-dom` for navigation without full reloads.
2. Add an API layer and replace the mock data.
3. Stream market prices over a WebSocket and flash cells on change.
4. Add form validation to login and signup.
5. Move the translations to `react-i18next` and translate the table headers and page content.
6. Build the remaining screens (Withdraw, Heatmap, Derivatives order book).
7. Add tests for the main flows (login, logout, deposit, order filters).