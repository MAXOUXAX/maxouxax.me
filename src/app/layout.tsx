import "~/styles/globals.css";

import { type Metadata } from "next";
import { Unbounded } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "MAXOUXAX",
  description: "Personal website of MAXOUXAX",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${unbounded.variable}`}>
      <body>
        <TRPCReactProvider>
          <NextIntlClientProvider>
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </NextIntlClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
