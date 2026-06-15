/**
 * Next.js ルートレイアウト (RootLayout)。
 *
 * このファイルは何か:
 *   アプリ全体の HTML シェル。フォント読み込み・globals.css・metadata を定義する
 *   最上位 layout.tsx。
 *
 * どう使われるか:
 *   - 全ページ (/ および /qualification/**) の共通 `<html>` / `<body>` を提供する。
 *   - 被保険者資格エリア専用のサイドバー等は qualification/layout.tsx 側で追加する。
 *
 * 設計メモ:
 *   - Geist フォントを CSS 変数経由で Tailwind に渡す。
 *   - metadata はブラウザタブタイトル・SEO 用 (PoC では最小限)。
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "介護保険資格管理システム",
  description: "介護保険システム標準仕様書 第6.0版 被保険者資格 PoC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
