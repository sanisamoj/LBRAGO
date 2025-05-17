import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { GlobalState } from "@/models/data/states/GlobalState"
import { load, Store } from '@tauri-apps/plugin-store'
import { UserStore } from "@/models/data/interfaces/UserStore"
import { usePreferencesState } from "./usePreferencesState"
import { UserResponse } from "@/models/data/interfaces/UserResponse"
import { RegenerateUserKeysDTO } from "@/models/data/interfaces/RegenerateUserKeysDTO"
import { invoke } from "@tauri-apps/api/core"
import { DecryptedUserKeys } from "@/models/data/interfaces/DecryptedUserKeys"
import { useVaultsState } from "./useVaultsState"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"
import { useAdminState } from "./useAdminState"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { useUserCreationState } from "./useUserCreationState"
import { useSelectedVaultState } from "./useSelectedVaultState"
import { usePasswordsCreationViewState } from "./usePasswordCreationState"
import { useEnvironmentCreationState } from "./useEnvironmentCreationState"
import { useCreateVaultState } from "./useCreateVaultState"
import { Config } from "@/Config"
import { InitIconTray } from "@/utils/IconTray"
import { InitGlobalStateData } from "@/models/data/interfaces/InitGlobalStateData"
import { jwtDecode } from 'jwt-decode'
import { GlobalRepository } from "@/models/repository/GlobalRepository"
import { Version } from "@/models/data/interfaces/Version"
import { checkVersion, VersionCheckResult } from "@/utils/checkVersion"

import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export const useGlobalState = create<GlobalState>((set, get) => ({
    user: null,
    store: null,
    privateKey: "",
    publicKey: "",
    availableUpdate: false,

    initialAppConfiguration: async () => {
        // Inicia as informações iniciais do app como os estados
        get().loadStore()

        // Gera a barra de ícone
        InitIconTray()
    },

    loadStore: async () => {
        await usePreferencesState.getState().initPreferencesState()

        const store: Store = await load('store.json', { autoSave: false })
        const userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        const { resetNavigation } = useNavigationState.getState()

        if (!userStore) { return resetNavigation(NavigationScreen.LOGIN_EMAIL) }
        if (userStore) {
            const decodedToken = jwtDecode<any>(userStore.token)
            const currentTimeInSeconds = Math.floor(Date.now() / 1000)

            if (decodedToken.exp < currentTimeInSeconds) {
                return resetNavigation(NavigationScreen.LOGIN_EMAIL)
            }

            try {
                const init: InitGlobalStateData = {
                    user: userStore.user,
                    password: userStore.password,
                    token: userStore.token,
                    savePassword: true
                }

                await get().initGlobalState(init)
                return resetNavigation(NavigationScreen.VAULTS)

            } catch (error: Error | any) {
                const { translations } = useLanguageState.getState()
                if (error instanceof Error && error.message === translations.networkError) {
                    toast.warning(translations.networkError)
                }
                return useNavigationState.getState().resetNavigation(NavigationScreen.LOGIN_EMAIL)
            }
        }
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

        if (!userStore) {
            const store: UserStore = {
                user: userResponse.user,
                token: userResponse.token,
                password: userResponse.password,
                savePassword: userResponse.savePassword
            }
            userStore = store
        } else {
            userStore.user = userResponse.user
            userStore.token = userResponse.token
            userStore.password = userResponse.password
            userStore.savePassword = userResponse.savePassword
        }

        await store.set('userStore', userStore)
        await store.save()

        set({ store: userStore })
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

        const result: string = await invoke<string>('regenerate_user_private_key', { arg: jsonArg })
        const decryptedUserKeys: DecryptedUserKeys = JSON.parse(result)
        set({ privateKey: decryptedUserKeys.privateKey, publicKey: userResponse.keys.publicKey })
    },

    signout: async () => {
        const repository: EnvironmentRepository = EnvironmentRepository.getInstance()
        await repository.signout()

        const store: Store = await load('store.json', { autoSave: false })
        const userStore: UserStore | undefined = await store.get<UserStore>('userStore')
        if (userStore) {
            await store.delete('userStore')
            await store.save()
        }

        get().clearAllStates()
        useNavigationState.getState()
            .resetNavigation(NavigationScreen.LOGIN_EMAIL)
    },

    initGlobalState: async (config: InitGlobalStateData) => {
        set({ user: config.user })
        await get().regenerateUserPrivK(config.user, config.password)

        Config.setToken(config.token)
        await useVaultsState.getState().initVaultState()

        if (config.user.role === "admin") {
            useAdminState.getState().initAdminState()
        }

        if (config.savePassword) {
            const userStore: UserStore = {
                user: config.user,
                token: config.token,
                password: config.password,
                savePassword: true
            }
            get().saveUserSession(userStore)
        }

        get().checkUpdates()
    },

    checkUpdates: async () => {
        const check = async () => {
            const repository: GlobalRepository = GlobalRepository.getInstance()
            const latestVersion: Version = await repository.getLatestVersion()
            
            const checkedVersion = checkVersion(Config.VERSION, latestVersion.version)
            if(checkedVersion === VersionCheckResult.FEATURE_UPDATE || checkedVersion === VersionCheckResult.PATCH_UPDATE) {
                set({ availableUpdate: true })
            }
        }
        
        await check()

        setInterval( async () => {
            await check()
        }, 1000 * 60 * 60 * 12) // 12 hours
    },

    updateAppVersion: async () => {
        await verifyUpdates()
    },

    clearAllStates: () => {
        set({ user: null, store: null, privateKey: "", publicKey: "" })
        useVaultsState.getState().clearState()
        useUserCreationState.getState().clearState()
        useSelectedVaultState.getState().clearState()
        usePreferencesState.getState().clearState()
        usePasswordsCreationViewState.getState().clearState()
        useEnvironmentCreationState.getState().clearState()
        useCreateVaultState.getState().clearState()
    }
}))

const verifyUpdates = async () => {
    try {
        const update = await check();
    if (update) {
        console.log(
            `found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        let downloaded = 0;
        let contentLength: number | undefined = 0;
        // alternatively we could also call update.download() and update.install() separately
        await update.downloadAndInstall((event) => {
            switch (event.event) {
            case 'Started':
                contentLength = event.data.contentLength;
                console.log(`started downloading ${event.data.contentLength} bytes`);
                break;
            case 'Progress':
                downloaded += event.data.chunkLength;
                console.log(`downloaded ${downloaded} from ${contentLength}`);
                break;
            case 'Finished':
                console.log('download finished');
                break;
            }
        });

        console.log('update installed');
        await relaunch();
    }
    } catch (error) {
        console.error(error);   
    }
}