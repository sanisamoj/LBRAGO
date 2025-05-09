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
import { RegenerateSVKToMemberDTO } from "@/models/data/interfaces/RegenerateSVKToMemberDTO"
import { invoke } from "@tauri-apps/api/core"
import { AddMemberRequest } from "@/models/data/interfaces/AddMemberRequest"
import { UpdateMemberRequest } from "@/models/data/interfaces/UpdateMemberRequest"

export const useSelectedVaultState = create<SelectedVaultState>((set, get) => ({
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
        const { translations } = useLanguageState.getState()
        const { privateKey } = useGlobalState.getState()

        const dto: RegenerateSVKToMemberDTO = {
            esvkPubKUser: get().vault.esvkPubKUser,
            privateKey: privateKey,
            targetUserPubK: user.publicKey
        }
        const jsonArg: string = JSON.stringify(dto)

        try {
            const result: string = await invoke<string>('regenerate_svk_to_member', { arg: jsonArg })

            const addMemberRequest: AddMemberRequest = {
                vaultId: get().vault.id,
                userId: user.id,
                esvk_pubK_user: result,
                permission: MemberPermissionType.WRITE
            }

            const vaultRepository = VaultRepository.getInstance()
            const response: VaultMemberResponse = await vaultRepository.addMember(addMemberRequest)

            const memberCopy: VaultMemberResponse = {
                id: response.id,
                vaultId: response.vaultId,
                userId: response.userId,
                username: user.username,
                email: user.email,
                esvk_pubK_user: response.esvk_pubK_user,
                permission: response.permission,
                addedBy: response.addedBy,
                addAt: response.addAt,
            }
            set((state) => ({ members: [...state.members, memberCopy] }))

            toast.success(translations.memberAddedSuccessfully)
        } catch (error) {
            toast.warning(translations.someError)
        }
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

    updateMemberVaultPermission: async (userId: string, permission: MemberPermissionType) => { 
        const member: VaultMemberResponse | undefined = get().members.find((member: VaultMemberResponse) => member.userId === userId)
        if(!member) return

        const { translations } = useLanguageState.getState()
        const updateMemberRequest: UpdateMemberRequest = {
            memberId: member.id,
            esvk_pubK_user: member.esvk_pubK_user,
            permission: permission
        }

        try {
            const vaultRepository = VaultRepository.getInstance()
            await vaultRepository.updateMember(updateMemberRequest)

            const memberCopy: VaultMemberResponse = {
                id: member.id,
                vaultId: member.vaultId,
                userId: member.userId,
                username: member.username,
                email: member.email,
                esvk_pubK_user: member.esvk_pubK_user,
                permission: permission,
                addedBy: member.addedBy,
                addAt: member.addAt,
            }
            set((state) => ({ members: state.members.map((m: VaultMemberResponse) => m.id === member.id ? memberCopy : m) }))
        } catch (error) {
            toast.warning(translations.someError)
        }
    },

    clearState: () => set({ vault: {} as DecryptedVault, members: [], passwords: [] })
}))