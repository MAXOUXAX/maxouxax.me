import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UnderConstruction } from "~/app/under-construction";

const SITE_URL = "https://maxouxax.me";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.home");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function Home() {
  return <UnderConstruction />;
}
