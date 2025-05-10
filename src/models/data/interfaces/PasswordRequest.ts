import { EncryptedKey } from "./EncryptedKey"

export interface PasswordRequest {
    vaultId: string
    encryptedItemData: EncryptedKey
}