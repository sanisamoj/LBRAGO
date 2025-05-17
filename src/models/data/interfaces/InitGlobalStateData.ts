import { UserResponse } from "./UserResponse"

export interface InitGlobalStateData {
    user: UserResponse,
    password: string
    token: string
    savePassword: boolean
}