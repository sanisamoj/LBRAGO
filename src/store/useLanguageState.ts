import ptTranslations from "../locales/pt/common.json"
import { create } from "zustand"
import { LanguageState } from "@/models/data/states/LanguageState"

export const useLanguageState = create<LanguageState>(() => ({
    language: "pt",
    translations: ptTranslations
}))