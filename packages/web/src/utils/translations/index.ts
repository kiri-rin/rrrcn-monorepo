import { RootState } from "../../store/root-reducer";
import { ruTranslations } from "./ru";
import { enTranslations } from "./en";
import { LangType } from "../../store/lang/actions";
import { useSelector } from "react-redux";
export type Strings = typeof ruTranslations;
export const translations: { [p in LangType]: Partial<Strings> } = {
  ru: ruTranslations,
  en: enTranslations,
};
export const useTranslations = () => {
  const lang = useSelector((state: RootState) => state.lang);
  const strings = translations[lang];
  return strings as typeof ruTranslations;
};
