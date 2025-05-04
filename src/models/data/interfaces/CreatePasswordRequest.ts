import { EncryptedKey } from "./EncryptedKey"

export interface CreatePasswordRequest {
    vaultId: string
    encryptedItemData: EncryptedKey
}