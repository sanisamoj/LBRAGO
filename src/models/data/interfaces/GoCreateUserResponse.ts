import { Keys } from "./Keys"
import { PasswordVerifier } from "./PasswordVerifier"

export interface GoCreateUserRequest {
  passwordVerifier: PasswordVerifier
  salt_ek: string
  keys: Keys
  // myVault: MyVault
}