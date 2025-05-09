import { PreferencesStore } from "@/models/data/interfaces/PreferenceStore"
import { PreferencesState } from "@/models/data/states/PreferencesState"
import { load, Store } from "@tauri-apps/plugin-store"
import { create } from "zustand"
import { useLoginViewState } from "./useLoginViewState"

export const usePreferencesState = create<PreferencesState>((set, get) => ({
    isDarkTheme: false,
    minimizeOnCopy: false,
    clearClipboardTimeout: 0,
    savePassword: false,

    setDarkTheme: async (isDarkTheme: boolean) => {
        set({ isDarkTheme })
        await get().updatePreferencesStore()
    },
    setMinimizeOnCopy: async (minimizeOnCopy: boolean) => {
        set({ minimizeOnCopy })
        await get().updatePreferencesStore()
    },
    setClearClipboardTimeout: async (clearClipboardTimeout: number) => {
        set({ clearClipboardTimeout })
        get().updatePreferencesStore()
    },

    setSavePassword: async (savePassword: boolean) => {
        set({ savePassword })
        await get().updatePreferencesStore()
    },

    updatePreferencesStore: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout, savePassword } = usePreferencesState.getState()

        const preferencesStore: PreferencesStore = {
            isDarkTheme: isDarkTheme,
            minimizeOnCopy: minimizeOnCopy,
            clearClipboardTimeout: clearClipboardTimeout,
            savePassword: savePassword
        }
        await store.set('preferencesStore', preferencesStore)
        await store.save()
        return
    },

    initPreferencesState: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const preferencesStore: PreferencesStore | undefined = await store.get<PreferencesStore>('preferencesStore')

        if (preferencesStore) {
            get().setDarkTheme(preferencesStore.isDarkTheme)
            get().setMinimizeOnCopy(preferencesStore.minimizeOnCopy)
            get().setClearClipboardTimeout(preferencesStore.clearClipboardTimeout)
            get().setSavePassword(preferencesStore.savePassword)
            return useLoginViewState.getState().setRememberPassword(preferencesStore.savePassword)
        }

        const newStore: PreferencesStore = {
            isDarkTheme: get().isDarkTheme,
            minimizeOnCopy: get().minimizeOnCopy,
            clearClipboardTimeout: get().clearClipboardTimeout,
            savePassword: get().savePassword
        }

        await store.set('preferencesStore', newStore)
        await store.save()
    },

    clearState: () => set({ minimizeOnCopy: false, clearClipboardTimeout: 0, savePassword: false })
}))