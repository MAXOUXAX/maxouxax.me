import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  let pathnameWithoutLocale = pathname.split("/").at(2);
  if (!pathnameWithoutLocale) pathnameWithoutLocale = "/";
  else pathnameWithoutLocale = "/" + pathnameWithoutLocale;

  headers.set("x-current-path", pathnameWithoutLocale);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
