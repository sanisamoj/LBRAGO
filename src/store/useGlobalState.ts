import { LoginRepository } from "@/models/repository/LoginRepository"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { GlobalState, InitGlobalStateData } from "@/models/data/states/GlobalState"
import { load, Store } from '@tauri-apps/plugin-store'
import { UserStore } from "@/models/data/interfaces/UserStore"
import { usePreferencesState } from "./usePreferencesState"
import { PreferencesStore } from "@/models/data/interfaces/PreferenceStore"
import { UserResponse } from "@/models/data/interfaces/UserResponse"
import { RegenerateUserKeysDTO } from "@/models/data/interfaces/RegenerateUserKeysDTO"
import { invoke } from "@tauri-apps/api/core"
import { DecryptedUserKeys } from "@/models/data/interfaces/DecryptedUserKeys"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { useVaultsState } from "./useVaultsState"
import { useLoginViewState } from "./useLoginViewState"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"

export const useGlobalState = create<GlobalState>((set, get) => ({
    store: null,
    privateKey: "",
    publicKey: "",

    loadStore: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const { resetNavigation } = useNavigationState.getState()

        const preferencesStore: PreferencesStore | undefined = await store.get<PreferencesStore>('preferencesStore')
        const userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        if (!userStore && !preferencesStore) { return resetNavigation(NavigationScreen.LOGIN_EMAIL) }

        if (preferencesStore) {
            const { setDarkTheme, setMinimizeOnCopy, setClearClipboardTimeout, setSavePassword } = usePreferencesState.getState()
            setDarkTheme(preferencesStore.isDarkTheme)
            setMinimizeOnCopy(preferencesStore.minimizeOnCopy)
            setClearClipboardTimeout(preferencesStore.clearClipboardTimeout)
            setSavePassword(preferencesStore.savePassword)

            if (preferencesStore.savePassword) {
                useLoginViewState.getState().setRememberPassword(true)
            }
        }

        if (preferencesStore?.savePassword && userStore?.password) {
            await get().regenerateUserPrivK(userStore.user, userStore.password)
            VaultRepository.setToken(userStore.token)
            await useVaultsState.getState().initVaultState()

            set({ store: userStore })
            return resetNavigation(NavigationScreen.VAULTS)
        }

        resetNavigation(NavigationScreen.LOGIN_EMAIL)
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

    saveUserSession: async (userResponse: UserStore) => {
        const store: Store = await load('store.json', { autoSave: false })
        let userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        let preferencesStore: PreferencesStore | undefined = await store.get<PreferencesStore>('preferencesStore')
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout } = usePreferencesState.getState()

        if (!userStore) {
            const store: UserStore = {
                user: userResponse.user,
                token: userResponse.token,
                password: userResponse.password
            }
            userStore = store
        } else {
            userStore.user = userResponse.user
            userStore.token = userResponse.token
            userStore.password = userResponse.password
        }

        if (!preferencesStore) {
            const store: PreferencesStore = {
                isDarkTheme: isDarkTheme,
                minimizeOnCopy: minimizeOnCopy,
                clearClipboardTimeout: clearClipboardTimeout,
                savePassword: true
            }
            preferencesStore = store
        } else {
            preferencesStore.isDarkTheme = isDarkTheme
            preferencesStore.minimizeOnCopy = minimizeOnCopy
            preferencesStore.clearClipboardTimeout = clearClipboardTimeout
            preferencesStore.savePassword = true
        }

        await store.set('userStore', userStore)
        await store.set('preferencesStore', preferencesStore)
        await store.save()

        set({ store: userStore })
    },

    updatePreferences: async () => {
        const store: Store = await load('store.json', { autoSave: false })
        const { isDarkTheme, minimizeOnCopy, clearClipboardTimeout, savePassword } = usePreferencesState.getState()

        const preferencesStore: PreferencesStore = {
            isDarkTheme: isDarkTheme,
            minimizeOnCopy: minimizeOnCopy,
            clearClipboardTimeout: clearClipboardTimeout,
            savePassword: savePassword
        }
        await store.set('preferencesStore', preferencesStore)

        if (!savePassword) {
            let userStore: UserStore | undefined = await store.get<UserStore>('userStore')
            if (userStore) {
                userStore.password = undefined
                await store.set('userStore', userStore)
            }
        }

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
            set({ privateKey: decryptedUserKeys.privateKey, publicKey: userResponse.keys.publicKey })
        } catch (error) {
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
    },

    initGlobalState: async (config: InitGlobalStateData) => {
        await get().regenerateUserPrivK(config.user, config.password)
        await useVaultsState.getState().initVaultState()
        EnvironmentRepository.setToken(config.token)

        if (config.savePassword) {
            const userStore: UserStore = {
                user: config.user,
                token: config.token,
                password: config.password
            }
            await get().saveUserSession(userStore)
        }
    }
}))