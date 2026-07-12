import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { routing } from "~/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  /*
   * Weird Next.js bug that logs "An unexpected response was received from the server." when an action is triggered from a client component.
   * Found here: https://github.com/vercel/next.js/discussions/77469#discussioncomment-14610419
   */
  if (request.headers.has("next-action") || request.headers.has("x-action")) {
    // The workaround has to specifically not include the headers in the response, otherwise it will trigger the bug again.
    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip api routes, Next internals and any path with a file extension
  // (static assets under /public must never be locale-redirected).
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
