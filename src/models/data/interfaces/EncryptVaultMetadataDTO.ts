import { DecryptedVaultMetadata } from "./DecryptedVaultMetadata"

export interface EncryptVaultMetadataDTO {
    userPubkey: string
    metadata: DecryptedVaultMetadata
}

