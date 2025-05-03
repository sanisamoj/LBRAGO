import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface PVGenerateDTO {
    salt: string
    parameters: PasswordVerifierParameters
    password: string
}