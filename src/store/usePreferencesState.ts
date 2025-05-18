import { PreferencesStore } from "@/models/data/interfaces/PreferenceStore"
import { PreferencesState } from "@/models/data/states/PreferencesState"
import { load, Store } from "@tauri-apps/plugin-store"
import { create } from "zustand"
import { useLoginViewState } from "./useLoginViewState"
import { invoke } from "@tauri-apps/api/core"
import { enable, disable } from '@tauri-apps/plugin-autostart';

export const usePreferencesState = create<PreferencesState>((set, get) => ({
    isDarkTheme: false,
    minimizeOnCopy: false,
    clearClipboardTimeout: 0,
    savePassword: false,
    customOpenAppShortcut: "Alt+Space",
    autoStartup: false,

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

    updateShortcut: async (shortcut: string) => {
        set({ customOpenAppShortcut: shortcut })
        await invoke("update_shortcuts", {
            shortcuts: [shortcut]
        })
        await get().updatePreferencesStore()
    },

    setAutoStartup: async (autoStartup: boolean) => {
        set({ autoStartup })

        if(autoStartup) {
            await enable()
        } else {
            await disable()
        }

        await get().updatePreferencesStore()
    },

    updatePreferencesStore: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout, savePassword, customOpenAppShortcut } = usePreferencesState.getState()

        const preferencesStore: PreferencesStore = {
            isDarkTheme: isDarkTheme,
            minimizeOnCopy: minimizeOnCopy,
            clearClipboardTimeout: clearClipboardTimeout,
            savePassword: savePassword,
            customOpenAppShortcut: customOpenAppShortcut,
            autoStartup: get().autoStartup
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
            get().updateShortcut(preferencesStore.customOpenAppShortcut)
            get().setAutoStartup(preferencesStore.autoStartup)
            return useLoginViewState.getState().setRememberPassword(preferencesStore.savePassword)
        }

        const newStore: PreferencesStore = {
            isDarkTheme: get().isDarkTheme,
            minimizeOnCopy: get().minimizeOnCopy,
            clearClipboardTimeout: get().clearClipboardTimeout,
            savePassword: get().savePassword,
            customOpenAppShortcut: get().customOpenAppShortcut,
            autoStartup: get().autoStartup
        }

        await store.set('preferencesStore', newStore)
        await store.save()
    },

    clearState: () => set({ minimizeOnCopy: false, clearClipboardTimeout: 0, savePassword: false, customOpenAppShortcut: "Alt+Space" })
}))