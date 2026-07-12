import { notFound } from "next/navigation";

// Catch-all so unknown paths inside a locale render the localized not-found
// page instead of Next's default 404.
export default function CatchAllPage() {
  notFound();
}
