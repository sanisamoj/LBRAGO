import { Vault } from "@/types"

export interface VaultsState {
    vaults: Vault[]
    setVaults: (vaults: Vault[]) => void
}