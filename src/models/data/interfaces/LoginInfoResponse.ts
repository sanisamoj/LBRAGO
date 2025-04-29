import { PasswordVerifierLoginResponse } from "./UserWithOrganizationResponse"

export interface LoginInfoResponse {
    orgId: string
    organizationName: string
    organizationImageUrl: string
    passwordVerifier: PasswordVerifierLoginResponse
}