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
import { decryptPassword, decryptPasswords } from "@/utils/ED_passwords"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useSelectedVaultState } from "./useSelectedVaultState"
import { EncryptedKey } from "@/models/data/interfaces/EncryptedKey"
import { encryptPassword } from "@/utils/encryptPassword"
import { UpdatePasswordRequest } from "@/models/data/interfaces/UpdatePasswordRequest"
import { UploadPassword } from "@/models/data/interfaces/UploadPassword"

export const useVaultsState = create<VaultsState>((set, get) => ({
  e_vaults: [],
  vaults: [],
  selectedVault: null,
  e_passwords: new Map<string, EPasswordResponse[]>(),
  passwords: new Map<string, DecryptedPassword[]>(),

  removeVaultDialogIsOpen: false,
  setRemoveVaultDialogIsOpen: (isOpen: boolean) => set({ removeVaultDialogIsOpen: isOpen }),

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
      const vaultsRespository = VaultRepository.getInstance()
      await vaultsRespository.deleteVault(vaultId)
      toast.success(translations.vaultRemovedSuccessfully)

      get().e_passwords.delete(vaultId)
      get().passwords.delete(vaultId)

      set({ 
        vaults: get().vaults.filter(vault => vault.id !== vaultId),
        removeVaultDialogIsOpen: false,
        selectedVault: null
      })

      useSelectedVaultState.getState().clearState()
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
    await useSelectedVaultState.getState().initState(vault)
    useNavigationState.getState().navigateTo(NavigationScreen.PASSWORDS)
  },

  addPassword: (vaultId: string, password: DecryptedPassword) => {
    const current: DecryptedPassword[] = get().passwords.get(vaultId) ?? []
    const updatedPasswords = new Map(get().passwords)
    updatedPasswords.set(vaultId, [...current, password])
    set({ passwords: updatedPasswords })
  },

  removePassword: (passwordId: string) => {
    const currentPasswords: Map<string, DecryptedPassword[]> = get().passwords
    const newPasswords: Map<string, DecryptedPassword[]> = new Map()
    currentPasswords.forEach((passwords, vaultId) => {
      newPasswords.set(vaultId, passwords.filter(password => password.id !== passwordId))
    })

    set({ passwords: newPasswords })
  },

  updatePassword: async (update: UploadPassword) => {
    const { privateKey } = useGlobalState.getState()
    const { translations } = useLanguageState.getState()

    try {
        const encryptedKey: EncryptedKey = await encryptPassword(update.passwordMetadata, update.esvkPubKUser, privateKey)

        const request: UpdatePasswordRequest = {
            passwordId: update.id,
            encryptedItemData: encryptedKey
        }

        const vaultsRepository = VaultRepository.getInstance()
        const ePasswordResponse: EPasswordResponse = await vaultsRepository.updatePassword(request)

        const vault: DecryptedVault = get().vaults.find(v => v.id === update.vaultId)!
        const decryptedPassword: DecryptedPassword = await decryptPassword(ePasswordResponse, update.esvkPubKUser, privateKey, vault.permission)

        const currentPasswords: DecryptedPassword[] = get().passwords.get(update.vaultId) ?? []
        const updatedPasswords = new Map(get().passwords)
        updatedPasswords.set(update.vaultId, [...currentPasswords, decryptedPassword])
        set({ passwords: updatedPasswords })
    } catch (error) {
        toast.error(translations.internalErrorTryAgain)
    }
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