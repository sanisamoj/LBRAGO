import { MemberPermissionType } from "../enums/MemberPermissionType"
import { DecryptedPassword } from "../interfaces/DecryptedPassword"
import { DecryptedVault } from "../interfaces/DecryptedVault"
import { MinimalUserInfoResponse } from "../interfaces/MinimalUserInfoResponse"
import { VaultMemberResponse } from "../interfaces/VaultMemberResponse"

export interface SelectedVaultState {
    vault: DecryptedVault
    members: VaultMemberResponse[]
    passwords: DecryptedPassword[]

    isLoading: boolean
    removePasswordDialogIsOpen: boolean 
    setRemovePasswordDialogIsOpen: (isOpen: boolean) => void

    initState: (vault: DecryptedVault, passwords: DecryptedPassword[]) => Promise<void>
    selectPassword: (vault: DecryptedVault) => void
    addPassword: (password: DecryptedPassword) => void
    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => void
    removePassword: (passwordId: string) => Promise<void>
    updatePassword: (password: DecryptedPassword) => Promise<void>

    addMember: (user: MinimalUserInfoResponse) => Promise<void>
    removeMember: (memberId: string) => Promise<void>
    updateMemberVaultPermission: (userId: string, permission: MemberPermissionType) => Promise<void>

    copyToClipboard: (text: string | undefined | null) => Promise<void>
    clearClipboardTimeout: () => Promise<void>

    clearState: () => void
}