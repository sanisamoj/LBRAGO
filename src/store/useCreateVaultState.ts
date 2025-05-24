import { EncryptVaultMetadataDTO } from "@/models/data/interfaces/EncryptVaultMetadataDTO"
import { create } from "zustand"
import { useGlobalState } from "./useGlobalState"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core"
import { EncryptedVaultMetadataDTO } from "@/models/data/interfaces/EncryptedVaultMetadataDTO"
import { CreateVaultRequest } from "@/models/data/interfaces/CreateVaultRequest"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { Config } from "@/Config"
import { CreateVaultState } from "@/models/data/states/CreateVaultState"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { EVaultResponse } from "@/models/data/interfaces/EVaultResponse"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { decryptVaultWithMemberResponse } from "@/utils/ED_vaults"
import { useVaultsState } from "./useVaultsState"
import { AxiosError } from "axios"
import { SavedMediaResponse } from "@/models/data/interfaces/SavedMediaResponse"
import { UploadMedia } from "@/utils/uploadMedia"
import { useMediaState } from "./useMediaState"

export const useCreateVaultState = create<CreateVaultState>((set, get) => ({
    name: "",
    description: "",
    imageUrl: Config.FAVICON_URL,
    personalVault: false,
    file: undefined,

    isLoading: false,

    setName: (name: string) => set({ name }),
    setDescription: (description: string) => set({ description }),
    setImageUrl: (imageUrl: string | undefined) => set({ imageUrl }),
    setPersonalVault: (personalVault: boolean) => set({ personalVault }),
    setFile: (file: File | undefined) => set({ file }),

    createVault: async () => {
        set({ isLoading: true })

        const { publicKey, privateKey } = useGlobalState.getState()
        const { translations } = useLanguageState.getState()
        const { resetNavigation } = useNavigationState.getState()

        let imageUrl: string = get().imageUrl ?? ""
        if(get().file) {
            try {
                const savedMedia: SavedMediaResponse = await UploadMedia(get().file!)
                imageUrl = savedMedia.url
            } catch (error) {
                toast.warning(translations.verifyImageFormat)
                return
            }
        }

        const dto: EncryptVaultMetadataDTO = {
            userPubkey: publicKey,
            metadata: {
                imageUrl: imageUrl,
                name: get().name,
                description: get().description
            }
        }
        const jsonArg: string = JSON.stringify(dto)

        try {
            const result: string = await invoke<string>("encrypt_vault_metadata", { arg: jsonArg })
            const e_vaultmetada: EncryptedVaultMetadataDTO = JSON.parse(result)
            const request: CreateVaultRequest = {
                e_vaultmetadata: e_vaultmetada.e_vaultmetadata,
                esvk_pubK_user: e_vaultmetada.esvk_pubK_user,
                personalVault: get().personalVault
            }

            const vaultsRepository = VaultRepository.getInstance()
            const response: EVaultResponse = await vaultsRepository.createVault(request)

            const decryptedVault: DecryptedVault = await decryptVaultWithMemberResponse(response, privateKey)
            useVaultsState.getState().addVault(decryptedVault)

            toast.success(translations.vaultCreatedSuccessfully)
            resetNavigation(NavigationScreen.VAULTS)

            useMediaState.getState().initState()
        } catch (error: AxiosError | any) {
            if (error instanceof AxiosError) {
                if (error.status === 403) {
                    toast.warning(translations.youAlreadyHavePersonalVault)
                    return
                }
            }

            toast.error(translations.errorGeneratingVault)
        } finally {
            set({ isLoading: false })
        }
    },

    clearState: () => set({ name: "", description: "", imageUrl: Config.FAVICON_URL, personalVault: false })
}))