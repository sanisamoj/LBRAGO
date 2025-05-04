import { ChevronRight, Plus } from "lucide-react"
import { VaultIcon } from "@/vault-icon"
import { Button } from "@/components/ui/button"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useVaultsState } from "@/store/useVaultsState"
import { useLanguageState } from "@/store/useLanguageState"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"

export default function VaultsScreen() {
    const { translations } = useLanguageState()
    const { navigateTo } = useNavigationState()
    const { vaults, selectVault } = useVaultsState()

    return (
        <>
            <div className="px-2 pb-2">
                <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.CREATE_VAULTS)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {translations.addNewVault}
                </Button>

                <div className="rounded-lg border border-border mt-2 overflow-y-hidden">
                    {vaults.map((vault: DecryptedVault) => (
                        <div
                            key={vault.id}
                            className="flex items-center py-2 px-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => selectVault(vault)}
                        >
                            <div className={`h-9 w-9 rounded-md flex items-center justify-center mr-3`}>
                                <VaultIcon
                                    icon={vault.decryptedVaultMetadata.imageUrl}
                                    className="h-5 w-5"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold">{vault.decryptedVaultMetadata.name}</h3>
                                <p className="text-xs text-muted-foreground">{vault.decryptedVaultMetadata.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{vault.permission}</div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}