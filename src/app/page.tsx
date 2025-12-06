import { getTranslations } from "next-intl/server";

export default async function Home({}: {}) {
  const t = await getTranslations("home");

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: "#020617",
        backgroundImage: `
          linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
          radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
        `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%",
      }}
    >
      <h1 className="font-display text-3xl text-white">{t("title")}</h1>
    </div>  
  );
}
