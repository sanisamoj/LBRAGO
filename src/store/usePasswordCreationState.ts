import { Config } from "@/Config"
import { CreatePasswordRequest } from "@/models/data/interfaces/CreatePasswordRequest"
import { EncryptedKey } from "@/models/data/interfaces/EncryptedKey"
import { PasswordMetadata } from "@/models/data/interfaces/PasswordMetadata"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { invoke } from "@tauri-apps/api/core"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { EncryptPasswordMetadataDTO } from "@/models/data/interfaces/EncryptPasswordMetadataDTO"
import { useGlobalState } from "./useGlobalState"
import { EPasswordResponse } from "@/models/data/interfaces/EPasswordResponse"
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { decryptPassword } from "@/utils/ED_passwords"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { usePasswordsViewState } from "./usePasswordsViewState"
import { PasswordCreationState } from "@/models/data/states/PasswordCreationState"

export const usePasswordsCreationViewState = create<PasswordCreationState>((set, get) => ({
    vaultId: "",
    esvkPubKUser: "",
    name: "",
    description: "",
    imageUrl: Config.FAVICON_URL,
    file: undefined,
    username: "",
    password: "",
    notes: "",
    url: "",

    isLoading: false,

    initPasswordCreation: (vaultId: string, esvkPubKUser: string) => {
        set({ vaultId: vaultId, esvkPubKUser: esvkPubKUser })
    },
    setName: (name: string) => set({ name }),
    setDescription: (description: string) => set({ description }),
    setImageUrl: (imageUrl: string | undefined) => set({ imageUrl }),
    setFile: (file: File | undefined) => set({ file }),
    setUsername: (username: string) => set({ username }),
    setPassword: (password: string) => set({ password }),
    setNotes: (notes: string) => set({ notes }),
    setUrl: (url: string) => set({ url }),

    createPassword: async () => {
        set({ isLoading: true })
        const passMetadata: PasswordMetadata = {
            name: get().name,
            imageUrl: get().imageUrl ?? "",
            username: get().username,
            description: get().description,
            url: get().url,
            password: get().password,
            notes: get().notes
        }

        const { privateKey } = useGlobalState.getState()
        const e_passwordMetadataDTO: EncryptPasswordMetadataDTO = {
            encryptedPasswordMetadata: passMetadata,
            esvkPubKUser: get().esvkPubKUser,
            privUserK: privateKey
        }

        const jsonArg: string = JSON.stringify(e_passwordMetadataDTO)
        const { translations } = useLanguageState.getState()

        try {
            const output: string = await invoke<string>('encrypt_password_metadata', { arg: jsonArg })
            const encryptedKey: EncryptedKey = JSON.parse(output)

            const request: CreatePasswordRequest = {
                vaultId: get().vaultId,
                encryptedItemData: encryptedKey
            }

            const vaultsRepository = VaultRepository.getInstance()
            const e_password: EPasswordResponse = await vaultsRepository.createPassword(request)
            const decryptedPassword: DecryptedPassword = await decryptPassword(e_password, get().esvkPubKUser, privateKey, MemberPermissionType.ADMIN)
            usePasswordsViewState.getState().addPassword(decryptedPassword)

            toast.success(translations.passwordCreatedSuccessfully)
            useNavigationState.getState().navigateReplace(NavigationScreen.PASSWORDS)
            get().clearState()
        } catch (error) {
            toast.error(translations.internalErrorTryAgain)
        }

        set({ isLoading: false })
    },

    clearState: () => set({ name: "", description: "", imageUrl: undefined, username: "", password: "", notes: "", url: "" })
}))