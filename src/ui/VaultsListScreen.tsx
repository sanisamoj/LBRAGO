import { ChevronRight, Plus, Search } from "lucide-react"
import { VaultIcon } from "@/vault-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useVaultsState } from "@/store/useVaultsState"
import { useLanguageState } from "@/store/useLanguageState"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"
import { useState, useMemo } from "react"

export default function VaultsListScreen() {
    const { translations } = useLanguageState()
    const { navigateTo } = useNavigationState()
    const { vaults, selectVault } = useVaultsState()

    const [searchQuery, setSearchQuery] = useState('')

    const filteredVaults = useMemo(() => {
        if (!searchQuery.trim()) {
            return vaults
        }
        const lowerCaseQuery = searchQuery.toLowerCase()
        return vaults.filter(vault =>
            vault.decryptedVaultMetadata.name.toLowerCase().includes(lowerCaseQuery) ||
            (vault.decryptedVaultMetadata.description && vault.decryptedVaultMetadata.description.toLowerCase().includes(lowerCaseQuery))
        )
    }, [vaults, searchQuery])

    return (
        <>
            <div className="px-2 pb-2 flex flex-col ">
            
                <div className="relative mb-2 mt-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search-vaults-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs w-full"
                        placeholder={translations.searchVaultsPlaceholder}
                    />
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs"
                    onClick={() => navigateTo(NavigationScreen.CREATE_VAULTS)}
                >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {translations.addNewVault}
                </Button>

                <div className="rounded-lg border border-border mt-2 overflow-y-auto flex-grow"> 
                    {filteredVaults.length > 0 ? (
                        filteredVaults.map((vault: DecryptedVault) => (
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
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold truncate">{vault.decryptedVaultMetadata.name}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{vault.decryptedVaultMetadata.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">{vault.permission}</div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-4 text-sm">
                            {searchQuery ? translations.noVaultsFound : translations.noVaultsAvailable}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}