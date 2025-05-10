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
import { PasswordMetadata } from "@/models/data/interfaces/PasswordMetadata"
import { EncryptedKey } from "@/models/data/interfaces/EncryptedKey"
import { encryptPassword } from "@/utils/encryptPassword"
import { decryptPassword } from "@/utils/ED_passwords"
import { EPasswordResponse } from "@/models/data/interfaces/EPasswordResponse"
import { UpdatePasswordRequest } from "@/models/data/interfaces/UpdatePasswordRequest"
import { usePreferencesState } from "./usePreferencesState"
import { Window } from "@tauri-apps/api/window"

export const useSelectedVaultState = create<SelectedVaultState>((set, get) => ({
    vault: {} as DecryptedVault,
    members: [],
    passwords: [],

    removePasswordDialogIsOpen: false,
    isLoading: false,

    setRemovePasswordDialogIsOpen: (isOpen: boolean) => {
        set({ removePasswordDialogIsOpen: isOpen })
    },

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

    removePassword: async (passwordId: string) => {
        set({ isLoading: false })
        const { translations } = useLanguageState.getState()

        try {
            const vautRepository = VaultRepository.getInstance()
            await vautRepository.deletePassword(passwordId)

            const newPasswords: DecryptedPassword[] = get().passwords.filter(password => password.id !== passwordId)
            set({ passwords: newPasswords, removePasswordDialogIsOpen: false })

            toast.success(translations.passwordRemoveSuccessfully)
        } catch (error) {
            console.log("error", error)
            toast.error(translations.errorInRemovePassword)
        }

        set({ isLoading: false })
    },

    updatePassword: async (password: DecryptedPassword) => {
        set({ isLoading: true })

        const passwordMetadata: PasswordMetadata = {
            name: password.name,
            imageUrl: password.imageUrl ?? "",
            username: password.username,
            description: password.description,
            url: password.url,
            password: password.password,
            notes: password.notes
        }

        const { privateKey } = useGlobalState.getState()
        const { translations } = useLanguageState.getState()
        const esvkPubKUser: string = get().vault.esvkPubKUser

        try {
            const encryptedKey: EncryptedKey = await encryptPassword(passwordMetadata, esvkPubKUser, privateKey)

            const request: UpdatePasswordRequest = {
                passwordId: password.id,
                encryptedItemData: encryptedKey
            }

            const vaultsRepository = VaultRepository.getInstance()
            const ePasswordResponse: EPasswordResponse = await vaultsRepository.updatePassword(request)

            const decryptedPassword: DecryptedPassword = await decryptPassword(ePasswordResponse, esvkPubKUser, privateKey, get().vault.permission)

            const newPasswords: DecryptedPassword[] = get().passwords.map(p => p.id === password.id ? decryptedPassword : p)
            set({ passwords: newPasswords })
        } catch (error) {
            console.log("error", error)
            toast.error(translations.internalErrorTryAgain)
        }

        set({ isLoading: false })
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
        if (!member) return

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

    copyToClipboard: (text: string | undefined | null) => {
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    const { minimizeOnCopy } = usePreferencesState.getState()
                    if (minimizeOnCopy) {
                        const currentWindow = Window.getCurrent()
                        currentWindow.hide()
                    }
                })
        }
    },

    clearState: () => set({ vault: {} as DecryptedVault, members: [], passwords: [] })
}))