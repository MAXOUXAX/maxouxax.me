import en from "~/i18n/locales/en.json" assert { type: "json" };

type MetaShape = {
  home?: {
    title?: string;
    description?: string;
  };
};

const meta: MetaShape = en;
const defaultHome = meta.home ?? {};

export const SITE_NAME = "MAXOUXAX";
export const SITE_URL = "https://maxouxax.me";

export const DEFAULT_TITLE =
  defaultHome.title ?? `${SITE_NAME} – Software Engineer`;
export const DEFAULT_DESCRIPTION =
  defaultHome.description ??
  "Personal website of MAXOUXAX, showcasing my projects.";
