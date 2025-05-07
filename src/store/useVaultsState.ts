import { EVaultWithMemberInfo } from "@/models/data/interfaces/EVaultWithMemberInfo"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { useGlobalState } from "./useGlobalState"
import { VaultsState } from "@/models/data/interfaces/VaultsState"
import { decryptVaults } from "@/utils/ED_vaults"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { EPasswordResponse } from "@/models/data/interfaces/EPasswordResponse"
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { decryptPasswords } from "@/utils/ED_passwords"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useSelectedVaultState } from "./useSelectedVaultState"

export const useVaultsState = create<VaultsState>((set, get) => ({
  e_vaults: [],
  vaults: [],
  selectedVault: null,
  e_passwords: new Map<string, EPasswordResponse[]>(),
  passwords: new Map<string, DecryptedPassword[]>(),

  buttonIsLoading: false,

  initVaultState: async () => {
    const { privateKey } = useGlobalState.getState()
    try {
      const vaultsRespository = VaultRepository.getInstance()
      const e_vaults: EVaultWithMemberInfo[] = await vaultsRespository.getMyVaults()
      set({ e_vaults })

      let decryptedVaults: DecryptedVault[] = await decryptVaults(e_vaults, privateKey)
      set({ vaults: decryptedVaults })

      get().getAllPasswords(e_vaults)

    } catch (error: AxiosError | any) {
      const { translations } = useLanguageState.getState()
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED" || error.code === "ECONNABORTED") {
          throw new Error(translations.networkError)
        }
      }
    }
  },

  addVault: (vault: DecryptedVault) => set({ vaults: [...get().vaults, vault] }),

  deleteVault: async (vaultId: string) => {
    set({ buttonIsLoading: true })
    const { translations } = useLanguageState.getState()
    try {
      set({ vaults: get().vaults.filter(vault => vault.id !== vaultId) })
      const vaultsRespository = VaultRepository.getInstance()
      await vaultsRespository.deleteVault(vaultId)
      useNavigationState.getState().resetNavigation(NavigationScreen.VAULTS)
      toast.success(translations.vaultRemovedSuccessfully)
    } catch (error) {

      toast.warning(translations.tryInSomeTime)
    }

    set({ buttonIsLoading: false })
  },

  getAllPasswords: async (e_vaults: EVaultWithMemberInfo[]) => {
    const vaultsRespository = VaultRepository.getInstance()

    e_vaults.forEach(async (e_vault: EVaultWithMemberInfo) => {
      const e_passwords: EPasswordResponse[] = await vaultsRespository.getPasswords(e_vault.id)
      const passwords: DecryptedPassword[] = await decryptPasswords(e_passwords, e_vault.esvkPubKUser, useGlobalState.getState().privateKey, e_vault.permission)
      get().passwords.set(e_vault.id, passwords)
    })
  },

  selectVault: async (vault: DecryptedVault) => {
    set({ selectedVault: vault })
    const passwords: DecryptedPassword[] = get().passwords.get(vault.id) ?? []
    useSelectedVaultState.getState().initState(vault, passwords)
    useNavigationState.getState().navigateTo(NavigationScreen.PASSWORDS)
  },

  clearState: () => set({
    e_vaults: [],
    vaults: [],
    selectedVault: null,
    buttonIsLoading: false,
    e_passwords: new Map<string, EPasswordResponse[]>(),
    passwords: new Map<string, DecryptedPassword[]>()
  })
}))