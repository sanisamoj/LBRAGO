import { DecryptedVault } from "./DecryptedVault"
import { EVaultWithMemberInfo } from "./EVaultWithMemberInfo"

export interface VaultsState {
    initVaultState: () => Promise<void>

    e_vaults: EVaultWithMemberInfo[]
    vaults: DecryptedVault[]
}