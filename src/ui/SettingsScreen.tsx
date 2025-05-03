import { Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaultIcon } from "@/vault-icon"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { Vault } from "@/types"
import { usePreferencesState } from "@/store/usePreferencesState"
import { useGlobalState } from "@/store/useGlobalState"

interface SettingsScreenProps {
    settingsTab: string
    showFavoritesFirst: boolean
    vaults: Vault[]

    onSettingsTabChange: (tab: string) => void
    onShowFavoritesFirstChange: (value: boolean) => void

    // Funções para editar/excluir cofres/orgs (precisariam ser passadas do pai se implementadas)
    // onEditVault?: (vaultId: string) => void;
    // onDeleteVault?: (vaultId: string) => void;
    // onAddVault?: () => void;
    // onEditCompany?: (companyId: string) => void;
    // onAddCompany?: () => void;
}


export default function SettingsScreen({
    settingsTab, showFavoritesFirst, vaults,
    onSettingsTabChange,
    onShowFavoritesFirstChange
}: SettingsScreenProps) {
    const { signout } = useGlobalState()
    const { navigateTo } = useNavigationState()
    const {
        isDarkTheme, minimizeOnCopy, clearClipboardTimeout, setDarkTheme,
        setMinimizeOnCopy, setClearClipboardTimeout
    } = usePreferencesState()


    return (
        <>
            <div className="p-2 flex-1 overflow-y-auto">
                <Tabs value={settingsTab} onValueChange={onSettingsTabChange} className="flex flex-col w-full h-full">
                    <TabsList className="grid grid-cols-3 h-8 w-full">
                        <TabsTrigger value="general" className="text-xs py-1">Geral</TabsTrigger>
                        <TabsTrigger value="vaults" className="text-xs py-1">Cofres</TabsTrigger>
                        <TabsTrigger value="security" className="text-xs py-1">Segurança</TabsTrigger>
                    </TabsList>

                    {/* Abas de Conteúdo */}
                    <TabsContent value="general" className="mt-2 space-y-4 flex-1 overflow-y-auto pb-2 p-2">
                        {/* Configurações Gerais */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">Tema escuro</h3>
                                <p className="text-xs text-muted-foreground">Usar tema do sistema</p>
                            </div>
                            <Switch checked={isDarkTheme} onCheckedChange={setDarkTheme} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">Minimizar ao copiar</h3>
                                <p className="text-xs text-muted-foreground">Minimizar após copiar senha</p>
                            </div>
                            <Switch checked={minimizeOnCopy} onCheckedChange={setMinimizeOnCopy} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="clipboard-clear" className="text-sm font-medium">Limpar área de transferência (segundos)</Label>
                            <p className="text-xs text-muted-foreground pb-1">0 = não limpar automaticamente</p>
                            <Input id="clipboard-clear" type="number" min="0" max="300" value={clearClipboardTimeout}
                                onChange={(e) => setClearClipboardTimeout(Math.max(0, Number.parseInt(e.target.value) || 0))}
                                className="h-7 text-xs" />
                        </div>
                    </TabsContent>

                    <TabsContent value="vaults" className="mt-2 space-y-4 flex-1 overflow-y-auto pb-2">
                        {/* Configurações de Cofres */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">Mostrar favoritos primeiro</h3>
                                <p className="text-xs text-muted-foreground">Exibir cofres favoritos no topo</p>
                            </div>
                            <Switch checked={showFavoritesFirst} onCheckedChange={onShowFavoritesFirstChange} />
                        </div>
                        {/* Gerenciar Cofres */}
                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">Gerenciar Cofres</h3></div>
                            <div className="max-h-[150px] overflow-y-auto">
                                {vaults.map((vault) => (
                                    <div key={vault.id} className="flex items-center py-2 px-3 border-b border-border last:border-b-0">
                                        <VaultIcon icon={""} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold truncate">{vault.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{vault.accessLevel}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Editar cofre"><Edit2 className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" title="Excluir cofre"><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={() => navigateTo(NavigationScreen.CREATE_VAULTS)}
                                variant="ghost"
                                size="sm"
                                className="w-full h-8 text-xs rounded-t-none border-t border-border"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar Cofre
                            </Button>
                        </div>
                        {/* Gerenciar Organizações */}
                        {/* <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">Organizações</h3></div>
                            <div className="max-h-[150px] overflow-y-auto">
                                {companies.map((company) => (
                                    <div key={company.id} className="flex items-center py-2 px-3 border-b border-border last:border-b-0">
                                        <div className="h-7 w-7 bg-primary/10 rounded-md flex items-center justify-center mr-2"><Users className="h-4 w-4 text-primary" /></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold truncate">{company.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">Proprietário</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Editar organização"><Edit2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" size="sm" className="w-full h-8 text-xs rounded-t-none border-t border-border"> <Plus className="h-3 w-3 mr-1" /> Adicionar Organização </Button>
                        </div> */}
                    </TabsContent>

                    <TabsContent value="security" className="mt-2 space-y-4 flex-1 overflow-y-auto pb-2">
                        {/* Configurações de Segurança */}
                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">Segurança da Conta</h3></div>
                            <div className="p-3 space-y-2">
                                <Button variant="outline" size="sm" className="w-full h-7 text-xs">Alterar Senha Mestra</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-xs">Configurar Autenticação em Dois Fatores</Button>
                            </div>
                        </div>
                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-3 space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-7 text-xs text-destructive hover:bg-destructive/10"
                                    onClick={signout}
                                >
                                    Encerrar Sessão e retornar aos ambientes
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}