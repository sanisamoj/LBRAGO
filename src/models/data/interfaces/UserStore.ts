import { UserResponse } from "./UserResponse"

export interface UserStore {
    user: UserResponse
    password?: string
    token: string
}
