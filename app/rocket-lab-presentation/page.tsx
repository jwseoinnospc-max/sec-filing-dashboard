import Link from "next/link";
import NavMenu from "@/components/NavMenu";

// Each entry's `url` points directly at the PDF on Rocket Lab's investor relations site
// (https://investors.rocketlabcorp.com/financial-information/quarterly-results).
// `url: null` means the direct PDF link hasn't been collected yet (the IR site blocks
// automated fetching, so these need to be copied by hand from a browser).
const QUARTERS: { label: string; url: string | null }[] = [
  { label: "2026 1Q", url: "https://investors.rocketlabcorp.com/static-files/c0bd4327-c3ff-4843-8eae-8b0d8a4d4b82" },
  { label: "2025 4Q", url: "https://investors.rocketlabcorp.com/static-files/be9441ad-c07f-49c2-ad50-531fd77180ee" },
  { label: "2025 3Q", url: null },
  { label: "2025 2Q", url: null },
  { label: "2025 1Q", url: null },
  { label: "2024 4Q", url: null },
  { label: "2024 3Q", url: null },
  { label: "2024 2Q", url: null },
  { label: "2024 1Q", url: null },
  { label: "2023 4Q", url: null },
  { label: "2023 3Q", url: null },
  { label: "2023 2Q", url: null },
  { label: "2023 1Q", url: null },
  { label: "2022 4Q", url: null },
  { label: "2022 3Q", url: null },
  { label: "2022 2Q", url: null },
  { label: "2022 1Q", url: null }
];

export default function RocketLabPresentationPage() {
  return (
    <main className="page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Rocket Lab Presentation</h1>
          <p>분기별 Investor Presentation을 한 화면에서 확인합니다.</p>
        </div>
      </section>

      <section className="presentation-grid">
        {QUARTERS.map((q) => (
          <div key={q.label} className="presentation-card">
            <div className="presentation-label">{q.label}</div>
            {q.url ? (
              <a href={q.url} target="_blank" rel="noopener noreferrer" className="presentation-btn">
                PDF 보기
              </a>
            ) : (
              <a
                href="https://investors.rocketlabcorp.com/financial-information/quarterly-results"
                target="_blank"
                rel="noopener noreferrer"
                className="presentation-btn presentation-btn-muted"
              >
                준비 중
              </a>
            )}
          </div>
        ))}
      </section>

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
