import Link from "next/link";
import NavMenu from "@/components/NavMenu";

// Each entry's `url` points directly at the PDF on Rocket Lab's investor relations site
// (https://investors.rocketlabcorp.com/financial-information/quarterly-results).
// `url: null` means the direct PDF link hasn't been collected yet (the IR site blocks
// automated fetching, so these need to be copied by hand from a browser).
const QUARTERS: { label: string; url: string | null }[] = [
  { label: "2026 1Q", url: "https://investors.rocketlabcorp.com/static-files/c0bd4327-c3ff-4843-8eae-8b0d8a4d4b82" },
  { label: "2025 4Q", url: "https://investors.rocketlabcorp.com/static-files/be9441ad-c07f-49c2-ad50-531fd77180ee" },
  { label: "2025 3Q", url: "https://investors.rocketlabcorp.com/static-files/f2e2847c-5660-4b81-8bf7-709f61289898" },
  { label: "2025 2Q", url: "https://investors.rocketlabcorp.com/static-files/815a4786-20f5-4f20-be8a-2bbfc8d75449" },
  { label: "2025 1Q", url: "https://investors.rocketlabcorp.com/static-files/bbf2962a-dc50-4fe1-90e9-75caa0b8e68d" },
  { label: "2024 4Q", url: "https://investors.rocketlabcorp.com/static-files/16817498-fc1c-4f35-903e-7bdd7d421d8e" },
  { label: "2024 3Q", url: "https://investors.rocketlabcorp.com/static-files/fd3767d3-f83b-4255-ae34-dedfdbe7fe89" },
  { label: "2024 2Q", url: "https://investors.rocketlabcorp.com/static-files/2f602d69-9670-4cb2-ac2a-a22813a1f165" },
  { label: "2024 1Q", url: "https://investors.rocketlabcorp.com/static-files/12d3a9c0-e0f7-4a9c-ae23-af38bdc585ed" },
  { label: "2023 4Q", url: "https://investors.rocketlabcorp.com/static-files/f4062822-f8f6-47f4-99c2-58296c742465" },
  { label: "2023 3Q", url: "https://investors.rocketlabcorp.com/static-files/61eda582-cbe9-4346-8600-89def8aba7e9" },
  { label: "2023 2Q", url: "https://investors.rocketlabcorp.com/static-files/4f67d91f-0b79-4e45-b0db-91848d471b23" },
  { label: "2023 1Q", url: "https://investors.rocketlabcorp.com/static-files/cf036ce1-29cd-46aa-a855-3278d6abacdf" },
  { label: "2022 4Q", url: "https://investors.rocketlabcorp.com/static-files/3c318a3d-234c-4747-8605-e4d6531dfabb" },
  { label: "2022 3Q", url: "https://investors.rocketlabcorp.com/static-files/5c3f46da-e560-4dc2-9960-0b4567e8d3b9" },
  { label: "2022 2Q", url: "https://investors.rocketlabcorp.com/static-files/74d6dbd0-0069-4993-af7c-c2bdbac08685" },
  { label: "2022 1Q", url: "https://investors.rocketlabcorp.com/static-files/36bda1d4-c842-457e-8c82-20b142a68ba0" }
];

const LATEST_LABEL = QUARTERS[0].label;

function groupByYear(quarters: typeof QUARTERS) {
  const years: { year: string; quarters: typeof QUARTERS }[] = [];
  for (const q of quarters) {
    const year = q.label.slice(0, 4);
    let group = years.find((g) => g.year === year);
    if (!group) {
      group = { year, quarters: [] };
      years.push(group);
    }
    group.quarters.push(q);
  }
  return years;
}

export default function RocketLabPresentationPage() {
  const years = groupByYear(QUARTERS);

  return (
    <main className="page">
      <section className="header">
        <div>
          <NavMenu />
          <h1>Rocket Lab Presentation</h1>
          <p>분기별 Investor Presentation을 한 화면에서 확인합니다.</p>
        </div>
      </section>

      {years.map(({ year, quarters }) => (
        <div key={year} className="presentation-year-row">
          <div className="presentation-year-label">{year}</div>
          <div className="presentation-grid">
            {quarters.map((q) => (
              <div key={q.label} className="presentation-card">
                <div className="presentation-label">
                  {q.label}
                  {q.label === LATEST_LABEL && <span className="presentation-new-badge">New</span>}
                </div>
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
          </div>
        </div>
      ))}

      <div className="footer">
        <Link href="/">← 대시보드로 돌아가기</Link>
      </div>
    </main>
  );
}
