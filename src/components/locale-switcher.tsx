import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function LocaleSwitcher() {
  const t = useTranslations("locale-switcher");
  const locale = useLocale();

  return (
    <Select defaultValue={locale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t("en")}</SelectItem>
        <SelectItem value="fr">{t("fr")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
