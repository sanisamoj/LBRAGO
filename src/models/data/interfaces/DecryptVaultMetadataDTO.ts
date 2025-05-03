import { EncryptedKey } from "./EncryptedKey";

export interface DecryptVaultMetadataDTO {
    encryptedVaultMetadata: EncryptedKey
    privUserK: string
    esvkPubKUser: string
}