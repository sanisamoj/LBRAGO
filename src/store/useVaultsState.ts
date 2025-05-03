import { EVaultWithMemberInfo } from "@/models/data/interfaces/EVaultWithMemberInfo"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { useGlobalState } from "./useGlobalState"
import { VaultsState } from "@/models/data/interfaces/VaultsState"
import { decryptVaults } from "@/utils/ED_vaults"

export const useVaultsState = create<VaultsState>((set, get) => ({
    e_vaults: [],
    vaults: [],

    initVaultState: async () => {
        const { privateKey } = useGlobalState.getState()
        try {
            const vaultsRespository = VaultRepository.getInstance()
            const e_vaults: EVaultWithMemberInfo[] = await vaultsRespository.getMyVaults()
            set({ e_vaults })

            let decryptedVaults: DecryptedVault[] = await decryptVaults(e_vaults, privateKey)
            set({ vaults: decryptedVaults })
        } catch (error) {
            const { translations } = useLanguageState.getState()
            toast.warning(translations.dontHaveAVaultCreateOne)
        }
    },

    addVault: (vault: DecryptedVault) => set({ vaults: [...get().vaults, vault] })
}))

