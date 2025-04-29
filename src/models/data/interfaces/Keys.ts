import { EncryptedKey } from "./EncryptedKey"

export interface Keys {
    publicKey: string
    encryptedPrivateKey: EncryptedKey
    encryptedSecretKey: EncryptedKey
}