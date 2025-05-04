import { EncryptedKey } from "./EncryptedKey"

export interface DecryptPasswordMetadataDTO {
    encryptedPasswordMetadata: EncryptedKey
    privUserK: string;
    esvkPubKUser: string;
}