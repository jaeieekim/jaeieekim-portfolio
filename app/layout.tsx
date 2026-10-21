import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JaeieeKim Portfolio",
  description: "Product Designer Portfolio",
  openGraph: {
    title: "JaeieeKim Portfolio",
    description: "Product Designer Portfolio",
    url: "https://jaeieekim-portfolio.vercel.app",
    siteName: "JaeieeKim Portfolio",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "https://jaeieekim-portfolio.vercel.app/og-image.png" }],
  },
};

// 화면을 아이폰 홈 바·안드로이드 제스처 막대 아래까지 채움 → 그 높이(여백)를 CSS에서 읽어 쓸 수 있게 함
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        {children}
      </body>
    </html>
  );
}
