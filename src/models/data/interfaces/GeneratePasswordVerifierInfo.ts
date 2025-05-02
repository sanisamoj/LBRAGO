import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface GeneratePasswordVerifierInfo {
    salt: string
    parameters: PasswordVerifierParameters
    password: string
}