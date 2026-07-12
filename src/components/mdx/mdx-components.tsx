import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactElement } from "react";
import { Children, isValidElement } from "react";

function MdxImage(props: ImageProps) {
  const { alt, title, ...rest } = props;

  return (
    <figure className="my-6">
      <Image
        {...rest}
        alt={alt}
        sizes="(max-width: 768px) 100vw, 672px"
        className="border-border/60 h-auto w-full rounded-2xl border"
      />
      {title ? (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Markdown images sit inside a `<p>` (e.g. `![alt](src)` on its own line),
 * but `MdxImage` renders a `<figure>`, and `<figure>` (like other block-level
 * elements) is invalid inside `<p>`. That mismatch causes React to bail into
 * a full client-side re-render, surfacing as a hydration error.
 *
 * When a paragraph contains only a single image element (optionally
 * surrounded by whitespace text nodes), render the figure directly instead
 * of wrapping it in a `<p>`.
 */
function MdxParagraph(props: HTMLAttributes<HTMLParagraphElement>) {
  const { children, ...rest } = props;

  const childArray = Children.toArray(children);
  const nonWhitespaceChildren = childArray.filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  );

  if (
    nonWhitespaceChildren.length === 1 &&
    isValidElement(nonWhitespaceChildren[0]) &&
    (nonWhitespaceChildren[0] as ReactElement).type === MdxImage
  ) {
    return nonWhitespaceChildren[0] as ReactElement;
  }

  return <p {...rest}>{children}</p>;
}

function MdxLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href = "", ...rest } = props;
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a {...rest} href={href} target="_blank" rel="noreferrer noopener" />
    );
  }

  return <Link {...rest} href={href} />;
}

export const mdxComponents = {
  img: MdxImage,
  a: MdxLink,
  p: MdxParagraph,
};
