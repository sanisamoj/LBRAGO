import { EncryptedKey } from "./EncryptedKey"

export interface UpdatePasswordRequest {
    passwordId: string
    encryptedItemData: EncryptedKey
}