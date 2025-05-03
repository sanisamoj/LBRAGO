import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface CreateUserParameters {
    password: string
    parameters: PasswordVerifierParameters
}