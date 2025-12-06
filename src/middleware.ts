import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const { pathname } = request.nextUrl;

  /*
   * Weird Next.js bug that logs "An unexpected response was received from the server." when an action is triggered from a client component.
   * Found here: https://github.com/vercel/next.js/discussions/77469#discussioncomment-14610419
   */
  if (headers.has("next-action") || headers.has("x-action")) {
    // The workaround has to specifically not include the headers in the response, otherwise it will trigger the bug again.
    return NextResponse.next();
  }

  const pathnameWithoutFirstSlash = pathname.slice(1);

  headers.set("x-current-path", pathnameWithoutFirstSlash ?? "/");

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
