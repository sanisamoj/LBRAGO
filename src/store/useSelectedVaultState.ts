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
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { MinimalUserInfoResponse } from "@/models/data/interfaces/MinimalUserInfoResponse"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"

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

    addMember: async (user: MinimalUserInfoResponse) => {
        // Realizar chamada de API para adicionar membro
        const memberCopy: VaultMemberResponse = {
            ...user,
            vaultId: "", // Provide appropriate value
            userId: "", // Provide appropriate value
            esvk_pubK_user: "", // Provide appropriate value
            permission: MemberPermissionType.WRITE, // Adjust as needed
            addedBy: "", // Provide appropriate value
            addAt: "", // Provide appropriate value
        }
        set((state) => ({ members: [...state.members, memberCopy] }))
        const { translations } = useLanguageState.getState()
        toast.success(translations.memberAddedSuccessfully)
    },

    removeMember: async (memberId: string) => {
        const { translations } = useLanguageState.getState()
        try {
            const vaultsRepository = VaultRepository.getInstance()
            await vaultsRepository.removeMember(memberId)

            set((state) => ({ members: state.members.filter(password => password.id !== memberId) }))
            toast.warning(translations.memberRemovedSuccessfully)
        } catch (error) {
            toast.warning(translations.tryInSomeTime)
        }
    },

    clearState: () => set({ vault: {} as DecryptedVault, members: [], passwords: [] })
}))