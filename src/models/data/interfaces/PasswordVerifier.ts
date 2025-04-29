import { PasswordVerifierParameters } from "./PasswordVerifierParameters"

export interface PasswordVerifier {
    salt: string
    verifier: string
    parameters: PasswordVerifierParameters
}