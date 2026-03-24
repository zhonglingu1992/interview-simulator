import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.MOONSHOT_API_KEY ?? "";

  // Test a real call to Kimi API
  let kimiStatus = "not tested";
  let kimiError = "";
  try {
    const res = await fetch("https://api.moonshot.cn/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    kimiStatus = res.ok ? "OK" : `${res.status} ${res.statusText}`;
    if (!res.ok) kimiError = await res.text();
  } catch (e) {
    kimiStatus = "fetch failed";
    kimiError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    keyFound: !!key,
    keyLength: key.length,
    keyPrefix: key.slice(0, 5),
    keySuffix: key.slice(-4),
    kimiStatus,
    kimiError,
  });
}
