import { MemberPermissionType } from "../enums/MemberPermissionType"
import { DecryptedVaultMetadata } from "./DecryptedVaultMetadata"

export interface DecryptedVault {
    id: string
    orgId: string
    decryptedVaultMetadata: DecryptedVaultMetadata
    personalVault: boolean
    permission: MemberPermissionType
    vaultCreatedBy: string
    vaultUpdatedAt: string
    vaultCreatedAt: string
    addedBy: string
    addAt: string
}