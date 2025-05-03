import { EncryptedKey } from "./EncryptedKey"

export interface EncryptedVaultMetadataDTO {
    e_vaultmetadata: EncryptedKey
    esvk_pubK_user: string
}

