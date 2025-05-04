import { PasswordMetadata } from "./PasswordMetadata"

export interface EncryptPasswordMetadataDTO {
    encryptedPasswordMetadata: PasswordMetadata
    privUserK: string
    esvkPubKUser: string
}