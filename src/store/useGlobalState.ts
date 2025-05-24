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
import { check, Update } from '@tauri-apps/plugin-updater'

export const useGlobalState = create<GlobalState>((set, get) => ({
    user: null,
    store: null,
    privateKey: "",
    publicKey: "",
    availableUpdate: false,
    latestVersion: {} as Version,
    appUpdateDownloadState: { 
        isActive: false,
        progress: 0,
        status: 'idle',
        message: '',
        error: undefined,
    },
    medias: [],

    initialAppConfiguration: async () => {
        // Inicia as informações iniciais do app como os estados
        get().loadStore()

        // Verifica se tem atualização disponível
        get().checkUpdates()

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
            const currentTimeInSeconds: number = Math.floor(Date.now() / 1000)

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

    setAvailableUpdate: async (availableUpdate: boolean) => {
        set({ availableUpdate })
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
    },

    checkUpdates: async () => {
        const check = async () => {
            const repository: GlobalRepository = GlobalRepository.getInstance()
            const latestVersion: Version = await repository.getLatestVersion()
            
            const checkedVersion: VersionCheckResult = checkVersion(Config.VERSION, latestVersion.version)
            if(checkedVersion === VersionCheckResult.FEATURE_UPDATE || checkedVersion === VersionCheckResult.PATCH_UPDATE) {
                set({ availableUpdate: true, latestVersion: latestVersion })
            }
        }
        
        await check()

        setInterval( async () => {
            await check()
        }, 1000 * 60 * 60 * 6) // 6 hours
    },

    verifyUpdatesInternal: async () => {
        set(state => ({
        appUpdateDownloadState: {
            ...state.appUpdateDownloadState,
            isActive: true,
            status: 'checking',
            progress: 0,
            message: 'Verificando atualizações...',
            error: undefined,
        }
        }))

        try {
        const update: Update | null = await check()
        if (update) {
            set(state => ({
            appUpdateDownloadState: {
                ...state.appUpdateDownloadState,
                status: 'downloading',
                message: `Baixando ${update.version} (0%)...`,
                progress: 0,
            }
            }))

            let downloadedBytes = 0
            let totalBytes: number | undefined = undefined

            await update.downloadAndInstall((progressEvent) => {
            switch (progressEvent.event) {
                case 'Started':
                totalBytes = progressEvent.data.contentLength
                set(state => ({
                    appUpdateDownloadState: {
                    ...state.appUpdateDownloadState,
                    status: 'downloading',
                    progress: 0,
                    message: `Iniciando download de ${update.version}...`,
                    }
                }))
                break
                case 'Progress':
                downloadedBytes += progressEvent.data.chunkLength
                const percentage: number = totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : get().appUpdateDownloadState.progress
                
                set({ appUpdateDownloadState: { 
                    ...get().appUpdateDownloadState,
                    status: 'downloading',
                    progress: totalBytes ? percentage : 0,
                    message: `Iniciando download de ${update.version}...`,
                    }
                })
                break
                case 'Finished':
                set(state => ({
                    appUpdateDownloadState: {
                    ...state.appUpdateDownloadState,
                    status: 'installing',
                    progress: 100,
                    message: `Download de ${update.version} concluído. Instalando...`,
                    }
                }))
                break
            }
            })
            
            set(state => ({
            appUpdateDownloadState: {
                ...state.appUpdateDownloadState,
                status: 'completed_relaunching',
                message: `Atualização ${update.version} instalada. Reiniciando o aplicativo...`,
            }
            }))
            
        } else {
            set(_ => ({
            availableUpdate: false,
            appUpdateDownloadState: {
                isActive: false,
                status: 'idle',
                progress: 0,
                message: 'Seu aplicativo está atualizado.',
                error: undefined,
            }
            }))
            toast.success('Seu aplicativo está atualizado.')
        }
        } catch (error) {
        console.error("Falha na atualização:", error)
        set(_ => ({
            appUpdateDownloadState: {
            isActive: false,
            status: 'error',
            progress: 0,
            message: 'Falha ao verificar ou instalar a atualização.',
            error: String(error),
            }
        }))
        toast.error('Falha ao buscar ou instalar a atualização.')
        }
    },

    updateAppVersion: async () => {
        await get().verifyUpdatesInternal()
    },

   clearAllStates: () => {
        set({
            user: null,
            store: null,
            privateKey: "",
            publicKey: "",
            availableUpdate: false,
            latestVersion: {} as Version,
            appUpdateDownloadState: {
                isActive: false,
                progress: 0,
                status: 'idle',
                message: '',
                error: undefined,
            }
        })
        useVaultsState.getState().clearState()
        useUserCreationState.getState().clearState()
        useSelectedVaultState.getState().clearState()
        usePreferencesState.getState().clearState()
        usePasswordsCreationViewState.getState().clearState()
        useEnvironmentCreationState.getState().clearState()
        useCreateVaultState.getState().clearState()
    }
}))