"use client";

// Shared module state: the slug of the last project page the visitor was on.
// The projects index names that row's title/cover so the view transition can
// morph back to it — including when the project page was the entry point.
let lastVisitedSlug: string | null = null;

export function setLastVisitedSlug(slug: string) {
  lastVisitedSlug = slug;
}

export function getLastVisitedSlug() {
  return lastVisitedSlug;
}

export function RememberProjectVisit({ slug }: { slug: string }) {
  // Set during render (not in an effect) so the value is already recorded if
  // the visitor navigates away before effects run; idempotent by nature.
  lastVisitedSlug = slug;
  return null;
}
