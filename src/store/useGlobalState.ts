import { LoginRepository } from "@/models/repository/LoginRepository"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { GlobalState } from "@/models/data/states/GlobalState"
import { load, Store } from '@tauri-apps/plugin-store'
import { UserStore } from "@/models/data/interfaces/UserStore"
import { UserWithTokenResponse } from "@/models/data/interfaces/UserWithTokenResponse"
import { usePreferencesState } from "./usePreferencesState"
import { PreferencesStore } from "@/models/data/interfaces/PreferenceStore"

export const useGlobalState = create<GlobalState>((set, get) => ({
    store: null,

    loadStore: async () => {
        const store: Store = await load('store.json', { autoSave: false })

        const preferencesStore: PreferencesStore | undefined = await store.get<PreferencesStore>('preferencesStore')
        if (preferencesStore) {
            const { setDarkTheme, setMinimizeOnCopy, setClearClipboardTimeout } = usePreferencesState.getState()
            setDarkTheme(preferencesStore.isDarkTheme)
            setMinimizeOnCopy(preferencesStore.minimizeOnCopy)
            setClearClipboardTimeout(preferencesStore.clearClipboardTimeout)
        }

        const userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        const { navigateTo } = useNavigationState.getState()

        if (!userStore) {    
            navigateTo(NavigationScreen.LOGIN_EMAIL)
            return
        }

        // Executar função para retornar cofres, caso não dê certo
        // Token está inválido, caso dê certo preencher o store 

        set({ store: userStore })
        navigateTo(NavigationScreen.VAULTS)
    },

    saveStore: async (userStore: UserStore) => {
        const store: Store = await load('store.json', { autoSave: false })
        await store.set('userStore', userStore)
        await store.save()
        set({ store: userStore })
    },

    clearStore: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        await store.clear()
        await store.save()
        set({ store: null })
    },

    saveUserResponse: async (userResponse: UserWithTokenResponse) => {
        const store: Store = await load('store.json', { autoSave: false })
        let userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        let preferencesStore: PreferencesStore | undefined = await store.get<PreferencesStore>('preferencesStore')
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout } = usePreferencesState.getState()

        if (!userStore) {
            const userStore: UserStore = {
                user: userResponse.user,
                token: userResponse.token,
            }
            await store.set('userStore', userStore)
            await store.save()
            set({ store: userStore })
            return
        }

        if (!preferencesStore) {
            const preferencesStore: PreferencesStore = {
                isDarkTheme: isDarkTheme,
                minimizeOnCopy: minimizeOnCopy,
                clearClipboardTimeout: clearClipboardTimeout
            }
            await store.set('preferencesStore', preferencesStore)
            await store.save()
            return
        }

        userStore.user = userResponse.user
        userStore.token = userResponse.token

        await store.set('userStore', userStore)
        await store.save()
        set({ store: userStore })
    },

    updatePreferences: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout } = usePreferencesState.getState()

        const preferencesStore: PreferencesStore = {
            isDarkTheme: isDarkTheme,
            minimizeOnCopy: minimizeOnCopy,
            clearClipboardTimeout: clearClipboardTimeout
        }
        await store.set('preferencesStore', preferencesStore)
        await store.save()
        return
    },

    signout: async () => {
        const repository: LoginRepository = LoginRepository.getInstance()
        await repository.signOut()

        const store: Store = await load('store.json', { autoSave: false })
        await store.delete('userStore')
        await store.save()

        useNavigationState.getState()
            .resetNavigation(NavigationScreen.LOGIN_EMAIL)
    }
}))