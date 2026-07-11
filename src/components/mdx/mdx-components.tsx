import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

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
};
