"use client";

import { motion, stagger, type Variants } from "motion/react";
import {
  GithubLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Unbounded } from "next/font/google";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { StaggeredFade } from "~/components/staggered-fade";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "900"],
});

export function UnderConstruction() {
  const t = useTranslations("home");

  const background: Variants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 3,
        ease: "easeOut",
      },
    },
  };

  const socialsContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: stagger(0.12, { startDelay: 1 }),
      },
    },
  };

  const socialItem: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-background text-foreground selection:bg-foreground/10 selection:text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden font-sans">
      <motion.div
        variants={background}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />

        <div className="bg-primary/20 absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center justify-center space-y-10 px-4 sm:px-6">
        <div className="flex items-center justify-center px-2 text-center">
          <StaggeredFade
            as="h1"
            className={`${unbounded.className} text-balance wrap-break-word text-center text-[clamp(2.4rem,8vw,3.4rem)] font-black leading-tight tracking-tight sm:text-[clamp(2.8rem,6vw,4.2rem)] md:text-[clamp(3rem,5vw,4.8rem)] lg:text-6xl max-w-[min(92vw,38rem)]`}
            text={t("title")}
          />
        </div>

        <motion.div
          variants={socialsContainer}
          initial="hidden"
          animate="show"
          className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {[
            {
              icon: YoutubeLogoIcon,
              href: "https://youtube.com/MAXOUXAX",
              label: t("socials.youtube"),
            },
            {
              icon: GithubLogoIcon,
              href: "https://github.com/MAXOUXAX",
              label: t("socials.github"),
            },
            {
              icon: XLogoIcon,
              href: "https://x.com/MAXOUXAX",
              label: t("socials.x"),
            },
          ].map(({ icon: Icon, href, label }) => (
            <TooltipProvider key={href}>
              <motion.div variants={socialItem}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      className="border-border/50 bg-foreground/5 text-foreground hover:bg-foreground hover:text-background h-12 w-12 rounded-full border hover:scale-110 active:scale-95"
                    >
                      <a href={href} target="_blank" rel="noreferrer">
                        <Icon className="size-5" />
                        <span className="sr-only">{label}</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              </motion.div>
            </TooltipProvider>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

