import { DecryptedPassword } from "./DecryptedPassword"
import { DecryptedVault } from "./DecryptedVault"
import { EPasswordResponse } from "./EPasswordResponse"
import { EVaultWithMemberInfo } from "./EVaultWithMemberInfo"

export interface VaultsState {
    initVaultState: () => Promise<void>
    addVault: (vault: DecryptedVault) => void
    selectVault: (vault: DecryptedVault) => Promise<void>

    getAllPasswords: (e_vaults: EVaultWithMemberInfo[]) => Promise<void>

    e_vaults: EVaultWithMemberInfo[]
    vaults: DecryptedVault[]
    selectedVault: DecryptedVault | null

    e_passwords: Map<string, EPasswordResponse[]>
    passwords: Map<string, DecryptedPassword[]>
}