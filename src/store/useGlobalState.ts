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
import { UserResponse } from "@/models/data/interfaces/UserResponse"
import { RegenerateUserKeysDTO } from "@/models/data/interfaces/RegenerateUserKeysDTO"
import { invoke } from "@tauri-apps/api/core"
import { DecryptedUserKeys } from "@/models/data/interfaces/DecryptedUserKeys"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"

export const useGlobalState = create<GlobalState>((set) => ({
    store: null,
    pk: "",

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
        const { resetNavigation } = useNavigationState.getState()

        if (!userStore) {
            resetNavigation(NavigationScreen.LOGIN_EMAIL)
            return
        }

        // Executar função para retornar cofres, caso não dê certo
        // Token está inválido, caso dê certo preencher o store 

        set({ store: userStore })
        resetNavigation(NavigationScreen.VAULTS)
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

    regenerateUserPrivK: async (userResponse: UserResponse, password: string) => {
        const regUserKeysDTO: RegenerateUserKeysDTO = {
            pVGenerateDTO: {
                salt: userResponse.salt_ek,
                parameters: userResponse.passwordVerifier.parameters,
                password: password
            },
            keys: userResponse.keys
        }
        const jsonArg: string = JSON.stringify(regUserKeysDTO)

        try {
            const result: string = await invoke<string>('regenerate_user_private_key', { arg: jsonArg })
            const decryptedUserKeys: DecryptedUserKeys = JSON.parse(result)
            set({ pk: decryptedUserKeys.privateKey })
        } catch (_) {
            const { translations } = useLanguageState.getState()
            toast.error(translations.errorToRegenerateUserPrivkey)
        }

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