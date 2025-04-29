import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface UserWithOrganizationResponse {
    orgId: string
    organizationName: string
    organizationImageUrl: string
    passwordVerifier: PasswordVerifierLoginResponse
}

export interface PasswordVerifierLoginResponse {
    salt: string // base64 encoded byte[]
    parameters: PasswordVerifierParameters
}