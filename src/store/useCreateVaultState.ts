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
import { CreateVaultState } from "@/models/data/interfaces/CreateVaultState"

export const useCreateVaultState = create<CreateVaultState>((set, get) => ({
    name: "",
    description: "",
    imageUrl: Config.FAVICON_URL,
    personalVault: false,

    isLoading: false,

    setName: (name: string) => set({ name }),
    setDescription: (description: string) => set({ description }),
    setImageUrl: (imageUrl: string | undefined) => set({ imageUrl }),
    setPersonalVault: (personalVault: boolean) => set({ personalVault }),

    createVault: async () => {
        set({ isLoading: true })

        const { publicKey } = useGlobalState.getState()
        const { translations } = useLanguageState.getState()

        const dto: EncryptVaultMetadataDTO = {
            userPubkey: publicKey,
            metadata: {
                imageUrl: get().imageUrl ?? "",
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
            const response = await vaultsRepository.createVault(request)

            toast.success(translations.vaultCreatedSuccessfully)
        } catch (error) {
            toast.error(translations.errorGeneratingVault)
        }

        set({ isLoading: false })
    }
}))