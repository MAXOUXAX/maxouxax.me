import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./locale-switcher";
import ThemeSwitcher from "./theme-switcher";

export async function Header() {
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
    <header className="absolute top-0 z-50 w-full p-2 rounded-full backdrop-blur-lg bg-white/5">
      <div className="container mx-auto px-4">
        {/* <NavigationMenu className="max-w-full justify-between py-4"> */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold">
              MAXOUXAX
            </Link>
          </div>
          <div>
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>
          {/* <NavigationMenuList>
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
        </NavigationMenu> */}
      </div>
    </header>
  );
}
