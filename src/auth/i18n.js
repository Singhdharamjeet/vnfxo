// Minimal translations for the navbar/toolbar. 
export const LANGS = [
  { code: "en", label: "English", flag: "gb" },
  { code: "vi", label: "Tiếng việt", flag: "vn" },
  { code: "ja", label: "日本語", flag: "jp" },
  { code: "ko", label: "한국어", flag: "kr" },
];

const dict = {
  en: { market: "Market", heatmap: "Heatmap", trading: "Trading", orderBook: "Order book", assets: "Asset management", cash: "Cash transactions", openAccount: "Open Account", login: "Login", account: "Account", search: "Search ticker", order: "Order", logout: "Log out" },
  vi: { market: "Thị trường", heatmap: "Bản đồ nhiệt", trading: "Giao dịch", orderBook: "Sổ lệnh", assets: "Quản lý tài sản", cash: "Giao dịch tiền", openAccount: "Mở tài khoản", login: "Đăng nhập", account: "Tài khoản", search: "Tìm mã", order: "Đặt lệnh", logout: "Đăng xuất" },
  ja: { market: "マーケット", heatmap: "ヒートマップ", trading: "取引", orderBook: "注文板", assets: "資産管理", cash: "入出金", openAccount: "口座開設", login: "ログイン", account: "アカウント", search: "銘柄検索", order: "注文", logout: "ログアウト" },
  ko: { market: "시장", heatmap: "히트맵", trading: "거래", orderBook: "주문장", assets: "자산 관리", cash: "입출금", openAccount: "계좌 개설", login: "로그인", account: "계정", search: "종목 검색", order: "주문", logout: "로그아웃" },
};

export const makeT = (lang) => (key) => (dict[lang] || dict.en)[key] || dict.en[key] || key;
export const loadLang = () => { try { return localStorage.getItem("lang") || "en"; } catch { return "en"; } };
export const saveLang = (l) => { try { localStorage.setItem("lang", l); } catch { /* ignore */ } };