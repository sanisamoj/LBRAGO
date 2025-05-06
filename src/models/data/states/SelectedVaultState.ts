import { DecryptedPassword } from "../interfaces/DecryptedPassword"
import { DecryptedVault } from "../interfaces/DecryptedVault"
import { VaultMemberResponse } from "../interfaces/VaultMemberResponse"

export interface SelectedVaultState {
    vault: DecryptedVault
    members: VaultMemberResponse[]
    passwords: DecryptedPassword[]

    initState: (vault: DecryptedVault, passwords: DecryptedPassword[]) => Promise<void>
    selectPassword: (vault: DecryptedVault) => void
    addPassword: (password: DecryptedPassword) => void
    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => void
}