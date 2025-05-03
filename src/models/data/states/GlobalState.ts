import { UserStore } from "../interfaces/UserStore"
import { UserWithTokenResponse } from "../interfaces/UserWithTokenResponse"

export interface GlobalState {
    store: UserStore | null

    loadStore (): Promise<void>
    saveStore (userStore: UserStore): Promise<void>
    clearStore (): Promise<void>
    saveUserResponse(userResponse: UserWithTokenResponse): Promise<void>

    signout: () => Promise<void>
}

