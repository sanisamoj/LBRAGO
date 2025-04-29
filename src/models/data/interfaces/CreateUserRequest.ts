import { Keys } from "./Keys"
import { PasswordVerifier } from "./PasswordVerifier"

export interface CreateUserRequest {
  code?: string
  username: string
  passwordVerifier: PasswordVerifier
  salt_ek: string
  keys: Keys
}