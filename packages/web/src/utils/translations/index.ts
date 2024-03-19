import { ruTranslations } from "./ru";
import { enTranslations } from "./en";
import { LangType } from "../../store/lang/reducer";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next/index";
import { RootState } from "../../store";
export type Strings = typeof ruTranslations;
export const translations: { [p in LangType]: Partial<Strings> } = {
  ru: ruTranslations,
  en: enTranslations,
};
export const useTranslations = () => {
  const lang: LangType = useSelector((state: RootState) => state.lang);
  const strings = translations[lang];
  return strings as typeof ruTranslations;
};
