import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Deliberately duplicated from src/lib/i18n/config.ts rather than imported.
// Proxy is meant to run detached from the render code, so it does not lean on
// shared modules. Two strings are a cheaper price than that coupling.
const LOCALES = ["en", "es"];
const DEFAULT = "en";

// Accept-Language, ranked by q, first supported language wins. Hand-rolled
// because two locales do not justify a dependency.
function preferred(header: string | null): string {
  if (!header) return DEFAULT;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === "*") break;
    const base = tag.split("-")[0];
    if (LOCALES.includes(base)) return base;
  }
  return DEFAULT;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred(request.headers.get("accept-language"))}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals and any path with a file extension,
  // which covers favicon.ico and everything served straight out of public/.
  matcher: ["/((?!_next|.*\.).*)"],
};
