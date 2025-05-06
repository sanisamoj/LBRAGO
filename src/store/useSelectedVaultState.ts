import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { create } from "zustand"
import { usePasswordsCreationViewState } from "./usePasswordCreationState"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { VaultMemberResponse } from "@/models/data/interfaces/VaultMemberResponse"
import { useGlobalState } from "./useGlobalState"
import { UserPermissionType } from "@/models/data/enums/UserPermissionType"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { SelectedVaultState } from "@/models/data/states/SelectedVaultState"

export const useSelectedVaultState = create<SelectedVaultState>((set) => ({
    vault: {} as DecryptedVault,
    members: [],
    passwords: [],

    initState: async (vault: DecryptedVault, passwords: DecryptedPassword[]) => {
        set({ vault, passwords })

        const { user } = useGlobalState.getState()
        if (user?.role === UserPermissionType.ADMIN) {
            const vaultsRepository = VaultRepository.getInstance()
            const members: VaultMemberResponse[] = await vaultsRepository.getMembers(vault.id)
            set({ members })
        }
    },

    selectPassword: (vault: DecryptedVault) => {
        set({ vault })
    },

    addPassword: (password: DecryptedPassword) => {
        set((state) => ({ passwords: [...state.passwords, password] }))
    },

    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => {
        usePasswordsCreationViewState.getState().initPasswordCreation(vaultId, esvkPubKUser)
        useNavigationState.getState().navigateTo(NavigationScreen.CREATE_PASSWORDS)
    },
}))