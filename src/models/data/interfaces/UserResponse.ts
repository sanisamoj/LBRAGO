import { Keys } from "./Keys"
import { PasswordVerifierLoginResponse } from "./PasswordVerifierLoginResponse"

export interface UserResponse {
    id: string
    email: string
    orgId: string
    username: string
    passwordVerifier: PasswordVerifierLoginResponse
    salt_ek: string
    keys: Keys
}