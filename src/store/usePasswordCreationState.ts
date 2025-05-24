import { Config } from "@/Config"
import { PasswordRequest } from "@/models/data/interfaces/PasswordRequest"
import { EncryptedKey } from "@/models/data/interfaces/EncryptedKey"
import { PasswordMetadata } from "@/models/data/interfaces/PasswordMetadata"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { useNavigationState } from "./useNavigationState"
import { useGlobalState } from "./useGlobalState"
import { EPasswordResponse } from "@/models/data/interfaces/EPasswordResponse"
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { decryptPassword } from "@/utils/ED_passwords"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { PasswordCreationState } from "@/models/data/states/PasswordCreationState"
import { useSelectedVaultState } from "./useSelectedVaultState"
import { encryptPassword } from "@/utils/encryptPassword"
import { SavedMediaResponse } from "@/models/data/interfaces/SavedMediaResponse"
import { UploadMedia } from "@/utils/uploadMedia"
import { useMediaState } from "./useMediaState"

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
        const { translations } = useLanguageState.getState()

        let imageUrl: string = get().imageUrl ?? ""
        if(get().file) {
            try {
                const savedMedia: SavedMediaResponse = await UploadMedia(get().file!)
                imageUrl = savedMedia.url
            } catch (error) {
                toast.warning(translations.verifyImageFormat)
                set({ isLoading: false })
                return
            }
        }

        const passMetadata: PasswordMetadata = {
            name: get().name,
            imageUrl: imageUrl,
            username: get().username,
            description: get().description,
            url: get().url,
            password: get().password,
            notes: get().notes
        }

        const { privateKey } = useGlobalState.getState()

        try {
            const encryptedKey: EncryptedKey = await encryptPassword(passMetadata, get().esvkPubKUser, privateKey)

            const request: PasswordRequest = {
                vaultId: get().vaultId,
                encryptedItemData: encryptedKey
            }

            const vaultsRepository = VaultRepository.getInstance()
            const e_password: EPasswordResponse = await vaultsRepository.createPassword(request)
            const decryptedPassword: DecryptedPassword = await decryptPassword(e_password, get().esvkPubKUser, privateKey, MemberPermissionType.ADMIN)
            useSelectedVaultState.getState().addPassword(decryptedPassword)

            toast.success(translations.passwordCreatedSuccessfully)
            useNavigationState.getState().navigateBack()

            await useMediaState.getState().initState()

            get().clearState()
        } catch (error) {
            toast.error(translations.internalErrorTryAgain)
        } finally {
            set({ isLoading: false })
        }
    },

    clearState: () => set({ name: "", description: "", username: "", password: "", notes: "", url: "", file: undefined, imageUrl: Config.FAVICON_URL })
}))

