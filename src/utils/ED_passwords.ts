import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { DecryptedPasswordMetadataDTO } from "@/models/data/interfaces/DecryptedPasswordMetadataDTO"
import { DecryptPasswordMetadataDTO } from "@/models/data/interfaces/DecryptPasswordMetadataDTO"
import { EPasswordResponse } from "@/models/data/interfaces/EPasswordResponse"
import { invoke } from "@tauri-apps/api/core"

export const decryptPasswords = async (e_passwords: EPasswordResponse[], esvkPubKUser: string, privateKey: string, permission: MemberPermissionType): Promise<DecryptedPassword[]> => {
    const decryptedPasswords: DecryptedPassword[] = []

    for (const e_password of e_passwords) {
        const decryptPasswordDTO: DecryptPasswordMetadataDTO = {
            encryptedPasswordMetadata: e_password.encryptedItemData,
            privUserK: privateKey,
            esvkPubKUser: esvkPubKUser
        }
        
        const jsonArg: string = JSON.stringify(decryptPasswordDTO)
        const output: string = await invoke<string>('decrypt_password_metadata', { arg: jsonArg })
        const decryptedPasswordMetadata: DecryptedPasswordMetadataDTO = JSON.parse(output)

        const decryptedPassword: DecryptedPassword = {
            id: e_password.id,
            name: decryptedPasswordMetadata.name,
            imageUrl: decryptedPasswordMetadata.imageUrl,
            username: decryptedPasswordMetadata.username,
            description: decryptedPasswordMetadata.description,
            url: decryptedPasswordMetadata.url,
            esvkPubKUser: esvkPubKUser,
            password: decryptedPasswordMetadata.password,
            notes: decryptedPasswordMetadata.notes,
            permission: permission,
            addedAt: e_password.createdAt,
            updatedAt: e_password.updatedAt
        }
        
        decryptedPasswords.push(decryptedPassword)
    }

    return decryptedPasswords
}