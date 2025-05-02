import { PasswordVerifierLoginResponse } from "./PasswordVerifierLoginResponse"

export interface LoginInfoResponse {
    orgId: string
    organizationName: string
    organizationImageUrl: string
    passwordVerifier: PasswordVerifierLoginResponse
}