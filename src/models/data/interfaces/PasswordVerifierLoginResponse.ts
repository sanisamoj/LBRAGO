import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface PasswordVerifierLoginResponse {
    salt: string
    parameters: PasswordVerifierParameters
}
