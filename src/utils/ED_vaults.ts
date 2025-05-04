import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { DecryptedVaultMetadata } from "@/models/data/interfaces/DecryptedVaultMetadata"
import { DecryptVaultMetadataDTO } from "@/models/data/interfaces/DecryptVaultMetadataDTO"
import { EVaultResponse } from "@/models/data/interfaces/EVaultResponse"
import { EVaultWithMemberInfo } from "@/models/data/interfaces/EVaultWithMemberInfo"
import { invoke } from "@tauri-apps/api/core"

export const decryptVaults = async (e_vaults: EVaultWithMemberInfo[], privateKey: string): Promise<DecryptedVault[]> => {
    let decryptedVaults: DecryptedVault[] = []

    for (const e_vault of e_vaults) {
        const decryptVaultDTO: DecryptVaultMetadataDTO = {
            encryptedVaultMetadata: {
                ciphertext: e_vault.encryptedVaultMetadata.ciphertext,
                nonce: e_vault.encryptedVaultMetadata.nonce
            },
            privUserK: privateKey,
            esvkPubKUser: e_vault.esvkPubKUser
        }

        const jsonArg: string = JSON.stringify(decryptVaultDTO)
        const output: string = await invoke<string>('decrypt_vault_metadata', { arg: jsonArg })
        const decryptedVaultMetadataList: DecryptedVaultMetadata = JSON.parse(output)

        const decryptedVault: DecryptedVault = {
            id: e_vault.id,
            orgId: e_vault.orgId,
            decryptedVaultMetadata: decryptedVaultMetadataList,
            personalVault: e_vault.personalVault,
            esvkPubKUser: e_vault.esvkPubKUser,
            permission: e_vault.permission,
            vaultCreatedBy: e_vault.vaultCreatedBy,
            vaultUpdatedAt: e_vault.vaultUpdatedAt,
            vaultCreatedAt: e_vault.vaultCreatedAt,
            addedBy: e_vault.addedBy,
            addAt: e_vault.addAt
        }

        decryptedVaults.push(decryptedVault)
    }

    return decryptedVaults
}

export const decryptVault = async (e_vault: EVaultWithMemberInfo, privateKey: string): Promise<DecryptedVault> => {
    const decryptVaultDTO: DecryptVaultMetadataDTO = {
        encryptedVaultMetadata: {
            ciphertext: e_vault.encryptedVaultMetadata.ciphertext,
            nonce: e_vault.encryptedVaultMetadata.nonce
        },
        privUserK: privateKey,
        esvkPubKUser: e_vault.esvkPubKUser
    }

    const jsonArg: string = JSON.stringify(decryptVaultDTO)
    const output: string = await invoke<string>('decrypt_vault_metadata', { arg: jsonArg })
    const decryptedVaultMetadataList: DecryptedVaultMetadata = JSON.parse(output)

    const decryptedVault: DecryptedVault = {
        id: e_vault.id,
        orgId: e_vault.orgId,
        decryptedVaultMetadata: decryptedVaultMetadataList,
        esvkPubKUser: e_vault.esvkPubKUser,
        personalVault: e_vault.personalVault,
        permission: e_vault.permission,
        vaultCreatedBy: e_vault.vaultCreatedBy,
        vaultUpdatedAt: e_vault.vaultUpdatedAt,
        vaultCreatedAt: e_vault.vaultCreatedAt,
        addedBy: e_vault.addedBy,
        addAt: e_vault.addAt
    }

    return decryptedVault
}

export const decryptVaultWithMemberResponse = async (e_vault: EVaultResponse, privateKey: string): Promise<DecryptedVault> => {
    const decryptVaultDTO: DecryptVaultMetadataDTO = {
        encryptedVaultMetadata: {
            ciphertext: e_vault.encryptedVaultMetadata.ciphertext,
            nonce: e_vault.encryptedVaultMetadata.nonce
        },
        privUserK: privateKey,
        esvkPubKUser: e_vault.myMembership.esvk_pubK_user
    }

    const jsonArg: string = JSON.stringify(decryptVaultDTO)
    const output: string = await invoke<string>('decrypt_vault_metadata', { arg: jsonArg })
    const decryptedVaultMetadataList: DecryptedVaultMetadata = JSON.parse(output)

    const decryptedVault: DecryptedVault = {
        id: e_vault.id,
        orgId: e_vault.orgId,
        decryptedVaultMetadata: decryptedVaultMetadataList,
        esvkPubKUser: e_vault.myMembership.esvk_pubK_user,
        personalVault: e_vault.personalVault,
        permission: e_vault.myMembership.permission,
        vaultCreatedBy: e_vault.createdBy,
        vaultUpdatedAt: e_vault.updatedAt,
        vaultCreatedAt: e_vault.createdAt,
        addedBy: e_vault.myMembership.addedBy,
        addAt: e_vault.myMembership.addAt
    }

    return decryptedVault
}
