import { InitGlobalStateData } from "../interfaces/InitGlobalStateData"
import { UserResponse } from "../interfaces/UserResponse"
import { UserStore } from "../interfaces/UserStore"
import { Version } from "../interfaces/Version"
import { AppUpdateDownloadState } from "./AppUpdateDownloadState"

export interface GlobalState {
    user: UserResponse | null
    store: UserStore | null
    privateKey: string
    publicKey: string
    availableUpdate: boolean
    latestVersion: Version
    appUpdateDownloadState: AppUpdateDownloadState

    loadStore (): Promise<void>
    saveStore (userStore: UserStore): Promise<void>
    clearStore (): Promise<void>
    saveUserSession(userResponse: UserStore): Promise<void>
    setAvailableUpdate(availableUpdate: boolean): void

    regenerateUserPrivK: (userResponse: UserResponse, password: string) => Promise<void>

    signout: () => Promise<void>

    initialAppConfiguration: () => Promise<void>
    initGlobalState: (config: InitGlobalStateData) => Promise<void>

    checkUpdates: () => Promise<void>
    verifyUpdatesInternal: () => Promise<void>
    updateAppVersion: () => Promise<void>

    clearAllStates: () => void
}



