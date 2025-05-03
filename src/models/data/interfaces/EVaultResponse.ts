import { EncryptedKey } from "./EncryptedKey"
import { VaultMemberResponse } from "./VaultMemberResponse"

export interface EVaultResponse {
    id: string
    orgId: string
    encryptedVaultMetadata: EncryptedKey
    myMembership: VaultMemberResponse
    personalVault: boolean
    createdBy: string
    updatedAt: string
    createdAt: string
}