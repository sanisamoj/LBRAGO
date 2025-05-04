import { EncryptedKey } from "./EncryptedKey"

export interface EPasswordResponse {
    id: string
    vaultId: string
    encryptedItemData: EncryptedKey
    createdAt: string
    updatedAt: string
}