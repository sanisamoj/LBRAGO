import { VaultMemberResponse } from "./VaultMemberResponse"

export interface UserVaultSelectorProps {
    availableUsers: VaultMemberResponse[]
    onAddUser: (user: VaultMemberResponse) => void
}