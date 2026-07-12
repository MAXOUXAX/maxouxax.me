import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "~/i18n/routing";
import { SITE_URL } from "~/config/site";

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
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}`] as const),
        ),
        "x-default": `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
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
