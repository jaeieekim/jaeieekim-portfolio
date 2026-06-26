import type { Metadata } from "next";
import "./globals.css";
import HamburgerMenu from "@/components/HamburgerMenu";

export const metadata: Metadata = {
  title: "JaeieeKim Portfolio",
  description: "A monolithic structure comprised of granular instability.",
  openGraph: {
    title: "JaeieeKim Portfolio",
    description: "A monolithic structure comprised of granular instability.",
    url: "https://jaeieekim-portfolio.vercel.app",
    siteName: "JaeieeKim Portfolio",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <HamburgerMenu />
        {children}
      </body>
    </html>
  );
}
