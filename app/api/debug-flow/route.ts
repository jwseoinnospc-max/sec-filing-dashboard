import { NextResponse } from "next/server";

function decodeEucKr(buf: Buffer): string {
  try {
    return new TextDecoder("euc-kr").decode(buf);
  } catch {
    return buf.toString("latin1");
  }
}

async function tryFetch(url: string, opts?: RequestInit) {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        "Referer": "https://m.stock.naver.com/",
        "Accept": "application/json, text/plain, */*",
        ...(opts?.headers as Record<string, string>),
      },
      cache: "no-store",
      ...opts,
    });
    const text = await r.text();
    return { status: r.status, len: text.length, snippet: text.slice(0, 600) };
  } catch (e) {
    return { status: -1, len: 0, snippet: String(e) };
  }
}

// KRX JSON endpoint (direct, no OTP)
async function fetchKrxJson(mktId: "STK" | "KSQ") {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const trdDd = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;

  const body = new URLSearchParams({
    bld: "dbms/MDC/STAT/standard/MDCSTAT02301",
    mktId,
    invstTpCd: "0000",
    strtDd: trdDd,
    endDd: trdDd,
    share: "1",
    money: "1",
  });

  try {
    const res = await fetch("http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": "http://data.krx.co.kr/",
        "Origin": "http://data.krx.co.kr",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: body.toString(),
      cache: "no-store",
    });
    const text = await res.text();
    return { status: res.status, len: text.length, snippet: text.slice(0, 800) };
  } catch (e) {
    return { status: -1, len: 0, snippet: String(e) };
  }
}

// KRX OTP flow
async function fetchKrxOtp(mktId: "STK" | "KSQ") {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const trdDd = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;

  try {
    const otpBody = new URLSearchParams({
      bld: "dbms/MDC/STAT/standard/MDCSTAT02301",
      mktId,
      invstTpCd: "0000",
      strtDd: trdDd,
      endDd: trdDd,
      share: "1",
      money: "1",
      csvxls_isNo: "false",
    });
    const otpRes = await fetch("http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": "http://data.krx.co.kr/contents/MDC/MDI/mdiBoardDetail/MDCPBBRD0039.cmd",
        "Origin": "http://data.krx.co.kr",
      },
      body: otpBody.toString(),
      cache: "no-store",
    });
    const otp = await otpRes.text();
    if (!otp || otp.length > 200) return { error: "OTP bad", len: otp.length, otp: otp.slice(0, 100) };

    const dlRes = await fetch("http://data.krx.co.kr/comm/fileDn/DownloadBdd/download.cmd", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": "http://data.krx.co.kr/",
      },
      body: new URLSearchParams({ code: otp }).toString(),
      cache: "no-store",
    });
    const buf = Buffer.from(await dlRes.arrayBuffer());
    const text = decodeEucKr(buf);
    return { otp, dlStatus: dlRes.status, len: text.length, snippet: text.slice(0, 600) };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function GET() {
  const [
    krxKospiJson,
    krxKosdaqJson,
    krxKospiOtp,
    // Naver mobile API candidates
    naverInvestorKospi,
    naverInvestorKosdaq,
    naverStockApi,
    naverMobileSise,
    naverApiInvestor,
  ] = await Promise.all([
    fetchKrxJson("STK"),
    fetchKrxJson("KSQ"),
    fetchKrxOtp("STK"),
    tryFetch("https://m.stock.naver.com/api/json/sise/siseInvestorFlow.nhn?sosok=0"),
    tryFetch("https://m.stock.naver.com/api/json/sise/siseInvestorFlow.nhn?sosok=1"),
    tryFetch("https://api.stock.naver.com/sise/investorflow?market=KOSPI"),
    tryFetch("https://m.stock.naver.com/front-api/v1/sise/investor?market=KOSPI"),
    tryFetch("https://api.stock.naver.com/index/KOSPI/investorflow"),
  ]);

  return NextResponse.json(
    {
      krx: { kospi_json: krxKospiJson, kosdaq_json: krxKosdaqJson, kospi_otp: krxKospiOtp },
      naver: { kospi: naverInvestorKospi, kosdaq: naverInvestorKosdaq, stock_api: naverStockApi, mobile_sise: naverMobileSise, api_investor: naverApiInvestor },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
