import { EncryptedKey } from "./EncryptedKey"

export interface MyVault {
    e_vaultmetadata: EncryptedKey
    esvk_pubK_user: string
}
