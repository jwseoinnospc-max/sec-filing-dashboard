import { NextResponse } from "next/server";

function decodeEucKr(buf: Buffer): string {
  try {
    return new TextDecoder("euc-kr").decode(buf);
  } catch {
    return buf.toString("latin1");
  }
}

// KRX investor trading data for KOSPI/KOSDAQ
async function fetchKrxInvestorFlow(mktId: "STK" | "KSQ") {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const trdDd = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;

  // Step 1: Get OTP token
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

  const otpRes = await fetch(
    "http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "http://data.krx.co.kr/contents/MDC/MDI/mdiBoardDetail/MDCPBBRD0039.cmd",
        "Origin": "http://data.krx.co.kr",
      },
      body: otpBody.toString(),
      cache: "no-store",
    }
  );
  const otp = await otpRes.text();
  if (!otp || otp.length > 100) {
    return { error: "OTP failed", otp: otp.slice(0, 200), otpStatus: otpRes.status };
  }

  // Step 2: Download data using OTP
  const dlBody = new URLSearchParams({ code: otp });
  const dlRes = await fetch(
    "http://data.krx.co.kr/comm/fileDn/DownloadBdd/download.cmd",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": "http://data.krx.co.kr/",
      },
      body: dlBody.toString(),
      cache: "no-store",
    }
  );
  const buf = Buffer.from(await dlRes.arrayBuffer());
  const text = decodeEucKr(buf);
  return { otp: otp.slice(0, 50), dlStatus: dlRes.status, len: text.length, snippet: text.slice(0, 600) };
}

// Also try KRX JSON endpoint directly
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

  const res = await fetch(
    "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "http://data.krx.co.kr/",
        "Origin": "http://data.krx.co.kr",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: body.toString(),
      cache: "no-store",
    }
  );
  const text = await res.text();
  return { status: res.status, len: text.length, snippet: text.slice(0, 800) };
}

export async function GET() {
  const [kospiOtp, kosdaqOtp, kospiJson, kosdaqJson] = await Promise.all([
    fetchKrxInvestorFlow("STK").catch((e) => ({ error: String(e) })),
    fetchKrxInvestorFlow("KSQ").catch((e) => ({ error: String(e) })),
    fetchKrxJson("STK").catch((e) => ({ error: String(e) })),
    fetchKrxJson("KSQ").catch((e) => ({ error: String(e) })),
  ]);

  return NextResponse.json(
    { kospi_otp: kospiOtp, kosdaq_otp: kosdaqOtp, kospi_json: kospiJson, kosdaq_json: kosdaqJson },
    { headers: { "Cache-Control": "no-store" } }
  );
}
