import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import type { Locale } from "~/i18n-config";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function Navigation({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const t = await getTranslations("header");

  const headersList = await headers();
  const pathname = headersList.get("x-current-path")!;

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(path);
  };

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              MAXOUXAX
            </Link>
          </div>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                data-active={isActive("/")}
              >
                <Link href="/">{t("home")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                data-active={isActive("/projects")}
              >
                <Link href="/projects">{t("projects")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
