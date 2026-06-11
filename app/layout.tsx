import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "イベント音響の教科書",
    template: "%s | イベント音響の教科書"
  },
  description: "講演会・地域イベント・屋外イベントで困らないためのPA基礎と実践教材"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
