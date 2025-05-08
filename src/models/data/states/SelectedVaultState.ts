import { MemberPermissionType } from "../enums/MemberPermissionType"
import { DecryptedPassword } from "../interfaces/DecryptedPassword"
import { DecryptedVault } from "../interfaces/DecryptedVault"
import { MinimalUserInfoResponse } from "../interfaces/MinimalUserInfoResponse"
import { VaultMemberResponse } from "../interfaces/VaultMemberResponse"

export interface SelectedVaultState {
    vault: DecryptedVault
    members: VaultMemberResponse[]
    passwords: DecryptedPassword[]

    initState: (vault: DecryptedVault, passwords: DecryptedPassword[]) => Promise<void>
    selectPassword: (vault: DecryptedVault) => void
    addPassword: (password: DecryptedPassword) => void
    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => void

    addMember: (user: MinimalUserInfoResponse) => Promise<void>
    removeMember: (memberId: string) => Promise<void>
    updateMemberVaultPermission: (userId: string, newRole: MemberPermissionType) => Promise<void>

    clearState: () => void
}