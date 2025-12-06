"use client";
import { easeIn, motion } from "motion/react";
import { useRef } from "react";

type TextStaggeredFadeProps = {
  text: string;
  className?: string;
};

export const StaggeredFade: React.FC<TextStaggeredFadeProps> = ({
  text,
  className = "",
}) => {
  const letters = text.split("");

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
    <motion.h2
      key={text}
      ref={ref}
      initial="hidden"
      animate="show"
      variants={variants}
      className={className}
    >
      {letters.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={variants} custom={i}>
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};
