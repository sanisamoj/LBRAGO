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
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"

export interface PasswordCreationState {
    vaultId: string
    esvkPubKUser: string
    name: string
    description: string
    imageUrl: string | undefined
    file: File | undefined
    username: string
    password: string
    notes: string
    url: string

    isLoading: boolean

    initPasswordCreation: (vaultId: string, esvkPubKUser: string) => void
    setName: (name: string) => void
    setDescription: (description: string) => void
    setImageUrl: (imageUrl: string | undefined) => void
    setFile: (file: File | undefined) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
    setNotes: (notes: string) => void
    setUrl: (url: string) => void

    createPassword: () => Promise<void>
    clearState: () => void
}

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

    initPasswordCreation: (vaultId: string, esvkPubKUser: string) => set({ vaultId, esvkPubKUser }),
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
            await vaultsRepository.createPassword(request)
            toast.success(translations.passwordCreatedSuccessfully)

            useNavigationState.getState().navigateReplace(NavigationScreen.PASSWORDS)
        } catch (error) {
            console.log(error)
            toast.error(translations.internalErrorTryAgain)
        }

        set({ isLoading: false })
    },

    clearState: () => set({ name: "", description: "", imageUrl: undefined, username: "", password: "", notes: "", url: "" })
}))