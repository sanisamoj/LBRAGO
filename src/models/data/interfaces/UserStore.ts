import { UserResponse } from "./UserResponse"

export interface UserStore {
    user: UserResponse
    token: string
}