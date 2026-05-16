export const SITE = {
  name: "キャリアラウンジ",
  title: "キャリアラウンジ — 転職市場全般 UGC プラットフォーム",
  description:
    "転職エージェント・転職体験談・年収口コミを、実体験ベースで投稿・比較・共有する UGC コミュニティ。年代・業界・職種を横断して使える転職判断材料。",
  url: "https://careerlounge.jp",
  domain: "careerlounge.jp",
  siteCode: "careerlounge",
  author: "AI Maker Lab",
  ownerName: "岡田 廉士",
  email: "contact@careerlounge.jp",
  launchedYear: 2026,
} as const;

export const NAV = [
  { label: "トップ", href: "/" },
  { label: "エージェント", href: "/agents/" },
  { label: "比較", href: "/compare/" },
  { label: "口コミ", href: "/reviews/" },
  { label: "投稿する", href: "/submit/" },
] as const;
