import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { getLocale } from "next-intl/server";
import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: "MAXOUXAX",
  description: "Personal website of MAXOUXAX",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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

  return (
    <html lang={locale} className={`${geist.variable}`} suppressHydrationWarning>
      <body>
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
