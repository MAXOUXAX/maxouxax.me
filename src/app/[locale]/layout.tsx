import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ViewTransitions } from "next-view-transitions";
import { setRequestLocale } from "next-intl/server";

import { routing } from "~/i18n/routing";

import { Header } from "~/components/header";
import LocaleSwitcher from "~/components/locale-switcher";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/theme-provider";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "~/config/site";
import { cn } from "~/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e0f2fe" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
      "MAXOUXAX",
      "developer",
      "portfolio",
      "web",
      "cloudflare",
      "next.js",
      "react",
      "tRPC",
      "frontend",
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      siteName: SITE_NAME,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
    },
    twitter: {
      card: "summary",
      site: "@MAXOUXAX",
      creator: "@MAXOUXAX",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    icons: {
      // [favicon-script icons start]
      icon: [
        { url: "/favicon.ico", rel: "icon" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
      // [favicon-script icons end]
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
    },
  };
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering.
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: ["https://github.com/MAXOUXAX", "https://x.com/MAXOUXAX"],
    jobTitle: "Software Engineer",
  };

  return (
    <ViewTransitions>
      <html
        lang={locale}
        className={cn(geist.variable, "font-sans", inter.variable)}
        suppressHydrationWarning
      >
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ThemeProvider>
            <NextIntlClientProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <LocaleSwitcher />
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
