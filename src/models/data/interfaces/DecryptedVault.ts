import { DecryptedVaultMetadata } from "./DecryptedVaultMetadata"

export interface DecryptedVault {
    id: string
    orgId: string
    decryptedVaultMetadata: DecryptedVaultMetadata
    personalVault: boolean
    permission: string
    vaultCreatedBy: string
    vaultUpdatedAt: string
    vaultCreatedAt: string
    addedBy: string
    addAt: string
}