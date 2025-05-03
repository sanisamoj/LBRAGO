import { EncryptedKey } from "./EncryptedKey"

export interface CreateVaultRequest {
    e_vaultmetadata: EncryptedKey
    esvk_pubK_user: string,
    personalVault?: boolean
}