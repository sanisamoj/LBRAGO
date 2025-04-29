import { ChevronRight, Plus } from "lucide-react"
import { Vault } from "@/types"
import { VaultIcon } from "@/vault-icon"
import { Button } from "@/components/ui/button";
import { useNavigationState } from "@/store/useNavigationState";
import { NavigationScreen } from "@/models/data/enums/NavigationScreen";

interface VaultsScreenProps {
    vaults: Vault[];
    onVaultClick: (vault: Vault) => void;
}

export default function VaultsScreen({
    vaults,
    onVaultClick
}: VaultsScreenProps) {
    const { navigateTo } = useNavigationState()

    return (
        <>
            <div className="px-2 pb-2 pt-1">
                <div className="rounded-lg border border-border overflow-y-hidden">
                    {vaults.map((vault) => (
                        <div
                            key={vault.id}
                            className="flex items-center py-2 px-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => onVaultClick(vault)} // Chama callback do pai
                        >
                            <div className={`h-9 w-9 ${vault.iconBg} rounded-md flex items-center justify-center mr-3`}>
                                <VaultIcon
                                    icon={vault.icon}
                                    // Lógica de cor pode ser simplificada ou movida para data.ts
                                    iconColor={vault.id === "sales" ? "#E97B43" : "#4B7BE5"}
                                    className="h-5 w-5"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold">{vault.name}</h3>
                                <p className="text-xs text-muted-foreground">{vault.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{vault.accessLevel}</div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    ))}
                </div>
                {vaults.length > 0 && (
                    <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.CREATE_VAULTS)}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Adicionar Novo Cofre
                    </Button>
                )}
            </div>
        </>
    )
}