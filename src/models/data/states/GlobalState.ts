import { InitGlobalStateData } from "../interfaces/InitGlobalStateData"
import { UserResponse } from "../interfaces/UserResponse"
import { UserStore } from "../interfaces/UserStore"

export interface GlobalState {
    user: UserResponse | null
    store: UserStore | null
    privateKey: string
    publicKey: string

    loadStore (): Promise<void>
    saveStore (userStore: UserStore): Promise<void>
    clearStore (): Promise<void>
    saveUserSession(userResponse: UserStore): Promise<void>

    regenerateUserPrivK: (userResponse: UserResponse, password: string) => Promise<void>

    signout: () => Promise<void>

    initialAppConfiguration: () => Promise<void>
    initGlobalState: (config: InitGlobalStateData) => Promise<void>
    clearAllStates: () => void
}



