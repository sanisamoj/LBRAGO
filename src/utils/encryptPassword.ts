import { EncryptedKey } from "@/models/data/interfaces/EncryptedKey"
import { EncryptPasswordMetadataDTO } from "@/models/data/interfaces/EncryptPasswordMetadataDTO"
import { PasswordMetadata } from "@/models/data/interfaces/PasswordMetadata"
import { invoke } from "@tauri-apps/api/core"

export async function encryptPassword(passwordMetadata: PasswordMetadata, esvkPubKUser: string, privUserK: string): Promise<EncryptedKey> {
    const e_passwordMetadataDTO: EncryptPasswordMetadataDTO = {
        encryptedPasswordMetadata: passwordMetadata,
        esvkPubKUser: esvkPubKUser,
        privUserK: privUserK
    }

    const jsonArg: string = JSON.stringify(e_passwordMetadataDTO)
    const output: string = await invoke<string>('encrypt_password_metadata', { arg: jsonArg })
    const encryptedKey: EncryptedKey = JSON.parse(output)
    return encryptedKey
}