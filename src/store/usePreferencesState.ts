import { PreferencesState } from "@/models/data/states/PreferencesState"
import { create } from "zustand"

export const usePreferencesState = create<PreferencesState>((set) => ({
    isDarkTheme: false,
    setDarkTheme: (isDarkTheme: boolean) => set({ isDarkTheme })
}))