import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { Header } from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";

const SITE_URL = "https://maxouxax.me";
const SITE_NAME = "MAXOUXAX";

const t = await getTranslations("meta.home");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t("title"),
    template: `%s | ${SITE_NAME}`,
  },
  description: t("description"),
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
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: t("title"),
    description: t("description"),
    siteName: SITE_NAME,
    locale: "en",
    alternateLocale: ["fr"],
  },
  twitter: {
    card: "summary",
    site: "@MAXOUXAX",
    creator: "@MAXOUXAX",
    title: t("title"),
    description: t("description"),
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e0f2fe" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: [
      "https://github.com/MAXOUXAX",
      "https://x.com/MAXOUXAX",
      "https://youtube.com/MAXOUXAX",
    ],
    jobTitle: "Software Engineer",
  };

  return (
    <html
      lang={locale}
      className={`${geist.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <TRPCReactProvider>
            <NextIntlClientProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster />
            </NextIntlClientProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
