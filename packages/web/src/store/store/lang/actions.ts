import { createAction } from "typesafe-actions";
export type LangType = "ru" | "en";
export const setLangAction = createAction("LANG_SET")<LangType>();
