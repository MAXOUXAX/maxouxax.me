"use client";
import { easeIn, motion } from "motion/react";
import { useRef, type JSX } from "react";

type AllowedTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

type TextStaggeredFadeProps = {
  text: string;
  className?: string;
  as?: AllowedTag;
};

const motionTags: Record<AllowedTag, JSX.ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

export const StaggeredFade = ({
  text,
  className = "",
  as = "p",
}: TextStaggeredFadeProps) => {
  const letters = text.split("");
  const Tag = motionTags[as];

  const getDelay = (i: number | undefined) => {
    if (letters.length <= 1 || i === undefined) return 0;
    const progress = i / (letters.length - 1);
    return easeIn(progress);
  };

  const variants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: getDelay(i) },
      filter: "blur(0px)",
    }),
  };

  const ref = useRef(null);

  return (
    <Tag
      key={text}
      ref={ref}
      initial="hidden"
      animate="show"
      variants={variants}
      className={className}
    >
      {letters.map((letter, i) => (
        <motion.span key={`${letter}-${i}`} variants={variants} custom={i}>
          {letter}
        </motion.span>
      ))}
    </Tag>
  );
};
