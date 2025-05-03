import { EVaultWithMemberInfo } from "@/models/data/interfaces/EVaultWithMemberInfo"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"

export interface VaultsState {
    initVaultState: () => Promise<void>

    e_vaults: EVaultWithMemberInfo[]
}

export const useVaultsState = create<VaultsState>((set) => ({
    e_vaults: [],

    initVaultState: async () => {
        try {
            const vaultsRespository = VaultRepository.getInstance()
            const e_vaults: EVaultWithMemberInfo[] = await vaultsRespository.getMyVaults()
            console.log(e_vaults)
            set({ e_vaults })
        } catch (_) {
            const { translations } = useLanguageState.getState()
            toast.error(translations.errorToFindVaults)
            return
        }
    }
}))