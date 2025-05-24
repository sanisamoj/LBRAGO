import { PasswordMetadata } from "./PasswordMetadata"

export interface UploadPassword {
  id: string
  vaultId: string
  esvkPubKUser: string, 
  passwordMetadata: PasswordMetadata
}