import { EVaultWithMemberInfo } from "@/models/data/interfaces/EVaultWithMemberInfo"
import { VaultRepository } from "@/models/repository/VaultRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { DecryptVaultMetadataDTO } from "@/models/data/interfaces/DecryptVaultMetadataDTO"
import { useGlobalState } from "./useGlobalState"
import { invoke } from "@tauri-apps/api/core"
import { DecryptedVaultMetadata } from "@/models/data/interfaces/DecryptedVaultMetadata"
import { VaultsState } from "@/models/data/interfaces/VaultsState"

export const useVaultsState = create<VaultsState>((set) => ({
    e_vaults: [],
    vaults: [],

    initVaultState: async () => {
        const { privateKey } = useGlobalState.getState()
        try {
            const vaultsRespository = VaultRepository.getInstance()
            const e_vaults: EVaultWithMemberInfo[] = await vaultsRespository.getMyVaults()
            set({ e_vaults })

            let decryptedVaults: DecryptedVault[] = []
            
            for (const e_vault of e_vaults) {
                const decryptVaultDTO: DecryptVaultMetadataDTO = {
                    encryptedVaultMetadata: {
                        ciphertext: e_vault.encryptedVaultMetadata.ciphertext,
                        nonce: e_vault.encryptedVaultMetadata.nonce
                    },
                    privUserK: privateKey,
                    esvkPubKUser: e_vault.esvkPubKUser
                }

                const jsonArg: string = JSON.stringify(decryptVaultDTO)
                const output: string = await invoke<string>('decrypt_vault_metadata', { arg: jsonArg })
                const decryptedVaultMetadataList: DecryptedVaultMetadata = JSON.parse(output)

                const decryptedVault: DecryptedVault = {
                    id: e_vault.id,
                    orgId: e_vault.orgId,
                    decryptedVaultMetadata: decryptedVaultMetadataList,
                    personalVault: e_vault.personalVault,
                    permission: e_vault.permission,
                    vaultCreatedBy: e_vault.vaultCreatedBy,
                    vaultUpdatedAt: e_vault.vaultUpdatedAt,
                    vaultCreatedAt: e_vault.vaultCreatedAt
                }

                decryptedVaults.push(decryptedVault)
            }
            set({ vaults: decryptedVaults })
        } catch (error) {
            const { translations } = useLanguageState.getState()
            toast.warning(translations.dontHaveAVaultCreateOne)
        }
    }
}))