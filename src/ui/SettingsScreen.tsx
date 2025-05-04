import { Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaultIcon } from "@/vault-icon"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { usePreferencesState } from "@/store/usePreferencesState"
import { useGlobalState } from "@/store/useGlobalState"
import { useVaultsState } from "@/store/useVaultsState"
import { useState } from "react"
import { useLanguageState } from "@/store/useLanguageState"


export default function SettingsScreen() {
    const { translations } = useLanguageState()
    const { vaults } = useVaultsState()
    const { store, signout } = useGlobalState()
    const { navigateTo } = useNavigationState()
    const {
        isDarkTheme, minimizeOnCopy, clearClipboardTimeout, setDarkTheme,
        setMinimizeOnCopy, setClearClipboardTimeout
    } = usePreferencesState()

    const [settingsTab, setSettingsTab] = useState(translations.general)

    return (
        <>
            <div className="p-2 flex-1 overflow-y-auto">
                <Tabs value={settingsTab} onValueChange={setSettingsTab} className="flex flex-col w-full h-full">
                    <TabsList className="grid grid-cols-3 h-8 w-full">
                        <TabsTrigger value={translations.general} className="text-xs py-1">{translations.general}</TabsTrigger>
                        <TabsTrigger value={translations.environment} className="text-xs py-1">{translations.environment}</TabsTrigger>
                        <TabsTrigger value={translations.security} className="text-xs py-1">{translations.security}</TabsTrigger>
                    </TabsList>

                    <TabsContent value={translations.general} className="mt-2 space-y-4 flex-1 overflow-y-auto pb-2 pr-2 pl-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">{translations.darkTheme}</h3>
                                <p className="text-xs text-muted-foreground">{translations.useThemeInSystem}</p>
                            </div>
                            <Switch checked={isDarkTheme} onCheckedChange={setDarkTheme} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium">{translations.minimizeOnCopy}</h3>
                                <p className="text-xs text-muted-foreground">{translations.minimizeOnCopyDescription}</p>
                            </div>
                            <Switch checked={minimizeOnCopy} onCheckedChange={setMinimizeOnCopy} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="clipboard-clear" className="text-sm font-medium">{translations.clearClipboardInSeconds}</Label>
                            <p className="text-xs text-muted-foreground pb-1">0 = {translations.notClearAuto}</p>
                            <Input id="clipboard-clear" type="number" min="0" max="300" value={clearClipboardTimeout}
                                onChange={(e) => setClearClipboardTimeout(Math.max(0, Number.parseInt(e.target.value) || 0))}
                                className="h-7 text-xs" />
                        </div>
                    </TabsContent>

                    <TabsContent value={translations.environment} className="space-y-4 flex-1 overflow-y-auto pb-2 pr-2 pl-2">
                        {store?.user.role === "admin" && (
                            <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.ALL_USERS)}>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                {translations.inviteUser}
                            </Button>
                        )}

                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">{translations.manageVaults}</h3></div>
                            <div className="max-h-[150px] overflow-y-auto scrollbar-invisible">
                                {vaults.map((vault) => (
                                    <div key={vault.id} className="flex items-center py-2 px-3 border-b border-border last:border-b-0 gap-3 cursor-pointer">
                                        <VaultIcon icon={vault.decryptedVaultMetadata.imageUrl} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold truncate">{vault.decryptedVaultMetadata.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">{vault.permission}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
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
                                {translations.addNewVault}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value={translations.security} className="mt-2 space-y-4 flex-1 overflow-y-auto pb-2">
                        <div className="rounded-lg border border-border overflow-hidden">
                            <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">{translations.accountSecurity}</h3></div>
                            <div className="p-3 space-y-2">
                                <Button variant="outline" size="sm" className="w-full h-7 text-xs">{translations.changeMasterPassword}</Button>
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
                                    {translations.endSession}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}