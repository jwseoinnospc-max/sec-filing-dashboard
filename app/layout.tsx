import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEC Filing Dashboard',
  description: 'SEC EDGAR XBRL 기반 재무 분석 대시보드'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
