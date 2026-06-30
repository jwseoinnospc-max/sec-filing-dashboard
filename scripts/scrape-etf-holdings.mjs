/**
 * ETF 구성종목 스크래퍼 (GitHub Actions 주간 실행)
 * Samsung Fund(KODEX) + Mirae Asset(TIGER) 페이지에서 Playwright로 데이터 수집
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../data/etf-holdings.json");

const current = JSON.parse(readFileSync(DATA_PATH, "utf8"));

async function scrapeKodex(page) {
  console.log("Scraping KODEX 미국우주항공...");
  await page.goto("https://www.samsungfund.com/etf/product/view.do?id=2ETFU4", {
    waitUntil: "networkidle", timeout: 30000,
  });

  // Intercept XHR for portfolio data
  const holdings = [];
  try {
    // Wait for portfolio section
    await page.waitForSelector("table", { timeout: 15000 });
    const rows = await page.$$eval("table tbody tr", (trs) =>
      trs.map((tr) => {
        const cells = [...tr.querySelectorAll("td")].map((td) => td.innerText.trim());
        return cells;
      })
    );
    for (const cells of rows) {
      // Look for rows with ticker symbol pattern and weight (%)
      const weightCell = cells.find((c) => c.includes("%") && parseFloat(c) > 0);
      const symbolCell = cells.find((c) => /^[A-Z]{2,5}$/.test(c));
      if (symbolCell && weightCell) {
        holdings.push({ symbol: symbolCell, name: "", weight: weightCell });
      }
    }
  } catch (e) {
    console.warn("KODEX scrape failed:", e.message);
  }
  return holdings;
}

async function scrapeTiger(page) {
  console.log("Scraping TIGER 미국우주테크...");
  await page.goto(
    "https://investments.miraeasset.com/tigeretf/ko/product/search/detail/index.do?ksdFund=KR70183J0002",
    { waitUntil: "networkidle", timeout: 30000 }
  );

  const holdings = [];
  try {
    await page.waitForSelector("table", { timeout: 15000 });
    const rows = await page.$$eval("table tbody tr", (trs) =>
      trs.map((tr) => [...tr.querySelectorAll("td")].map((td) => td.innerText.trim()))
    );
    for (const cells of rows) {
      const weightCell = cells.find((c) => c.includes("%") && parseFloat(c) > 0);
      const symbolCell = cells.find((c) => /^[A-Z]{2,5}$/.test(c));
      if (symbolCell && weightCell) {
        holdings.push({ symbol: symbolCell, name: "", weight: weightCell });
      }
    }
  } catch (e) {
    console.warn("TIGER scrape failed:", e.message);
  }
  return holdings;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  let changed = false;

  const kodexHoldings = await scrapeKodex(page);
  if (kodexHoldings.length >= 5) {
    current.etfs["KODEX 미국우주항공"].holdings = kodexHoldings;
    changed = true;
    console.log(`KODEX: ${kodexHoldings.length} holdings scraped`);
  } else {
    console.log(`KODEX: insufficient data (${kodexHoldings.length}), keeping existing`);
  }

  const tigerHoldings = await scrapeTiger(page);
  if (tigerHoldings.length >= 5) {
    current.etfs["TIGER 미국우주테크"].holdings = tigerHoldings;
    changed = true;
    console.log(`TIGER: ${tigerHoldings.length} holdings scraped`);
  } else {
    console.log(`TIGER: insufficient data (${tigerHoldings.length}), keeping existing`);
  }

  await browser.close();

  if (changed) {
    current.dataAsOf = new Date().toISOString().split("T")[0];
    writeFileSync(DATA_PATH, JSON.stringify(current, null, 2), "utf8");
    console.log(`Updated dataAsOf: ${current.dataAsOf}`);
  } else {
    console.log("No data updated — existing holdings retained");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
