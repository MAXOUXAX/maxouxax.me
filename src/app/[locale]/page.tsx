import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SITE_URL } from "~/config/site";
import { localizedAlternates } from "~/i18n/metadata";

import { UnderConstruction } from "./under-construction";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: localizedAlternates(locale, ""),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UnderConstruction />;
}
