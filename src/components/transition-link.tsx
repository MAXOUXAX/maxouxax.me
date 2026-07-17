"use client";

import { Link as ViewTransitionLink } from "next-view-transitions";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof ViewTransitionLink>, "href"> & {
  href: string;
};

/**
 * Internal link that both carries the locale prefix (like next-intl's Link)
 * and wraps the navigation in a view transition (like next-view-transitions'
 * Link). Use for all internal navigation that should animate.
 */
export function TransitionLink({ href, ...props }: Props) {
  const locale = useLocale();
  const localizedHref = `/${locale}${href === "/" ? "" : href}`;

  return <ViewTransitionLink {...props} href={localizedHref} />;
}
