import type { Metadata } from "next";
import { Roboto, Noto_Sans_KR } from "next/font/google";
import "./globals.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

const notoIsansKr = Noto_Sans_KR({
  subsets: ["latin"], // Noto Sans KR은 한글이 기본 포함이라 latin만 써도 됩니다
  weight: ["400", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "TRAK",
  description: "TRAK- - Personal Travel Archive",
  icons: {
    icon: "/favicon.svg",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${roboto.variable} ${notoIsansKr.variable}`}>
      {/* 한글은 Noto Sans를 기본으로, 영문/숫자는 Roboto를 우선 적용 */}
      <body className="font-roboto antialiased"> 
        {children}
      </body>
    </html>
  );
}