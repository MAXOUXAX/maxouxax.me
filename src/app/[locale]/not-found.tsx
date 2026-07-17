"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";

import { Button } from "~/components/ui/button";
import { StaggeredFade } from "~/components/staggered-fade";
import { unbounded } from "~/lib/fonts";

export default function NotFound() {
  const t = useTranslations("not-found");

  // Mouse parallax motion for background orb
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      // Subtle movements to prevent distraction
      mouseX.set(x * 0.12);
      mouseY.set(y * 0.12);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 2.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-background text-foreground selection:bg-foreground/10 selection:text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden font-sans">
      <title>{`${t("heading")} | MAXOUXAX`}</title>

      {/* Grid and interactive Glow Background (Fully in theme with landing page) */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />

        <motion.div
          style={{
            x: glowX,
            y: glowY,
          }}
          className="bg-primary/20 dark:bg-primary/10 absolute top-1/2 left-1/2 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        />
      </motion.div>

      {/* Content layout matching the home page structure */}
      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 px-2 text-center">
          <StaggeredFade
            as="h1"
            className={`${unbounded.className} max-w-[min(92vw,38rem)] text-center text-[clamp(2.4rem,8vw,3.4rem)] leading-tight font-black tracking-tight text-balance wrap-break-word sm:text-[clamp(2.8rem,6vw,4.2rem)] md:text-[clamp(3rem,5vw,4.8rem)] lg:text-6xl`}
            text={t("heading")}
          />

          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
            className="text-muted-foreground max-w-xs text-sm leading-relaxed text-balance sm:text-base"
          >
            {t("description")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
          className="pt-2"
        >
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            size="lg"
            className="border-border/50 bg-foreground/5 text-foreground hover:bg-foreground hover:text-background h-12 rounded-full border px-6 text-xs font-semibold tracking-wide uppercase transition-all hover:scale-105 active:scale-95"
          >
            {t("button")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
