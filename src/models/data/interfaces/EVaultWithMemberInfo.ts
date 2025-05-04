import { MemberPermissionType } from "../enums/MemberPermissionType"
import { EncryptedKey } from "./EncryptedKey"

export interface EVaultWithMemberInfo {
    id: string
    orgId: string
    encryptedVaultMetadata: EncryptedKey
    personalVault: boolean
    vaultCreatedBy: string
    vaultUpdatedAt: string
    vaultCreatedAt: string
    userId: string
    permission: MemberPermissionType
    esvkPubKUser: string
    addedBy: string
    addAt: string
}
