export type NavItemStatus = "VISIBLE" | "HIDDEN";

export interface NavItem {
  href: string;
  labelKey: "home" | "projects";
  status: NavItemStatus;
}

export const navItems: readonly NavItem[] = [
  { href: "/", labelKey: "home", status: "VISIBLE" },
  { href: "/projects", labelKey: "projects", status: "HIDDEN" },
] as const;
