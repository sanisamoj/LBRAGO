import { UserResponse } from "../interfaces/UserResponse"
import { UserStore } from "../interfaces/UserStore"
import { UserWithTokenResponse } from "../interfaces/UserWithTokenResponse"

export interface GlobalState {
    store: UserStore | null
    privateKey: string
    publicKey: string

    loadStore (): Promise<void>
    saveStore (userStore: UserStore): Promise<void>
    clearStore (): Promise<void>
    saveUserResponse(userResponse: UserWithTokenResponse): Promise<void>

    regenerateUserPrivK: (userResponse: UserResponse, password: string) => Promise<void>

    signout: () => Promise<void>
}

