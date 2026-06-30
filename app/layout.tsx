import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ISD Dashboard',
  description: 'SEC EDGAR XBRL 기반 재무 분석 대시보드'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
