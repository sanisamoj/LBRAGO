import { UserResponse } from "./UserResponse"

export interface UserWithTokenResponse {
    user: UserResponse
    token: string
}

