import { DecryptedVault } from "./DecryptedVault"
import { EVaultWithMemberInfo } from "./EVaultWithMemberInfo"

export interface VaultsState {
    initVaultState: () => Promise<void>
    addVault: (vault: DecryptedVault) => void
    selectVault: (vault: DecryptedVault) => void

    e_vaults: EVaultWithMemberInfo[]
    vaults: DecryptedVault[]
    selectedVault: DecryptedVault | null
}