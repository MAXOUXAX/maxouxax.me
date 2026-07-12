"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

// Shared module state: the slug of the last project page the visitor was on,
// and the exact list scroll position at the moment they left it. The
// projects index uses the slug to name that row's title/cover so the view
// transition can morph back to it, and restores the exact scrollY instead of
// re-measuring the row — measuring via getBoundingClientRect raced with the
// list's own layout settling (images/fonts) and could land a frame short of
// the real position for rows far down the page.
//
// This is client-only, per-browser-tab state and must never influence what
// the server renders: a "use client" boundary still executes during SSR, so
// reading/writing these variables in a component's render body would mutate
// (or read) the server process's long-lived module across unrelated
// requests — one visitor's in-flight navigation leaking into another's
// response on the same isolate. useSyncExternalStore's getServerSnapshot
// guarantees the server (and the first client render, for hydration parity)
// always sees `null`, then swaps in the real value right after hydration
// without a visible flash (React flushes that swap before paint).
let lastVisitedSlug: string | null = null;
let lastVisitedScrollY: number | null = null;

export function setLastVisitedProject(slug: string, scrollY: number) {
  lastVisitedSlug = slug;
  lastVisitedScrollY = scrollY;
}

function subscribe() {
  // Nothing to subscribe to: by the time a consumer (the list) reads this
  // store, whoever was going to write to it (a row's click handler, or the
  // project page's RememberProjectVisit effect) has already done so on an
  // earlier, now-unmounted page.
  return noop;
}

function noop() {
  /* no subscription to tear down */
}

function getSlugSnapshot() {
  return lastVisitedSlug;
}

function getScrollYSnapshot() {
  return lastVisitedScrollY;
}

function getServerSnapshot() {
  return null;
}

export function useLastVisitedSlug() {
  return useSyncExternalStore(subscribe, getSlugSnapshot, getServerSnapshot);
}

export function useLastVisitedScrollY() {
  return useSyncExternalStore(subscribe, getScrollYSnapshot, getServerSnapshot);
}

export function RememberProjectVisit({ slug }: { slug: string }) {
  // Client-only effect, never during render — see the module comment above.
  // A row's onClick handler already records the precise pair (slug,
  // scrollY) right before this same navigation — only clear scrollY when
  // this slug didn't come from that handler (direct link, refresh, or a
  // stale value from a previous project), since there's then no scroll
  // position to restore and the list must fall back to scrollIntoView.
  useLayoutEffect(() => {
    if (lastVisitedSlug !== slug) {
      lastVisitedScrollY = null;
    }
    lastVisitedSlug = slug;
  }, [slug]);
  return null;
}
