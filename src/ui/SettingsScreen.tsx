import { Plus, Trash2 } from "lucide-react"
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
import { UserPermissionType } from "@/models/data/enums/UserPermissionType"
import clsx from "clsx"
import { CommonDialog } from "./common/Dialog"
import { DecryptedVault } from "@/models/data/interfaces/DecryptedVault"

export default function SettingsScreen() {
    const { translations } = useLanguageState()
    const { user, signout } = useGlobalState()
    const { navigateTo } = useNavigationState()
    const { vaults, deleteVault, buttonIsLoading, removeVaultDialogIsOpen, setRemoveVaultDialogIsOpen } = useVaultsState()
    const {
        isDarkTheme, minimizeOnCopy, clearClipboardTimeout, setDarkTheme,
        setMinimizeOnCopy, setClearClipboardTimeout, customOpenAppShortcut,
        updateShortcut
    } = usePreferencesState()

    const [settingsTab, setSettingsTab] = useState(translations.general)
    const [virtualVault, setVirtualVault] = useState<DecryptedVault | null>(null)

    const handleRemoveVault = (vault: DecryptedVault) => () => {
        setVirtualVault(vault)
        setRemoveVaultDialogIsOpen(true)
    }

    return (
        <>
            <div className="p-2 flex-1 overflow-y-auto">
                <Tabs value={settingsTab} onValueChange={setSettingsTab} className="flex flex-col w-full h-full">
                    <TabsList className={clsx(
                        'grid h-8 w-full',
                        user?.role === UserPermissionType.ADMIN ? 'grid-cols-3' : 'grid-cols-2'
                    )}>
                        <TabsTrigger value={translations.general} className="text-xs py-1">{translations.general}</TabsTrigger>
                        {user?.role === UserPermissionType.ADMIN && <TabsTrigger value={translations.environment} className="text-xs py-1">{translations.environment}</TabsTrigger>}
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

                        <div className="space-y-1 pt-2"> {/* Adicionado pt-2 para um leve espaçamento superior dos demais blocos */}
                            <Label htmlFor="app-shortcut" className="text-sm font-medium">
                                {translations.appShortcutLabel}
                            </Label>
                            <p className="text-xs text-muted-foreground pb-1">
                                {translations.appShortcutDescription}
                            </p>
                            <Input
                                id="app-shortcut"
                                type="text"
                                placeholder={translations.appShortcutPlaceholder}
                                value={customOpenAppShortcut}
                                readOnly
                                onKeyDown={(e) => {
                                    e.preventDefault()
                                    const modifiers = []
                                    if (e.ctrlKey) modifiers.push('Ctrl')
                                    if (e.altKey) modifiers.push('Alt')
                                    if (e.shiftKey) modifiers.push('Shift')
                                    // metaKey é Command no Mac, tecla Windows no Windows/Linux
                                    // Usar 'Meta' ou 'CmdOrCtrl' pode ser uma boa prática para consistência no display
                                    if (e.metaKey) modifiers.push(navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Cmd' : 'Ctrl')


                                    let key = e.key.toUpperCase()
                                    // Verifica se é uma tecla alfanumérica, de função (F1-F12), ou outras teclas comuns para atalhos
                                    const isLetter = key.length === 1 && key >= 'A' && key <= 'Z'
                                    const isDigit = key.length === 1 && key >= '0' && key <= '9'
                                    const isFunctionKey = key.startsWith('F') && key.length > 1 && key.length <= 3 && !isNaN(Number(key.substring(1)))
                                    const otherValidKeys = ['SPACE', 'TAB', 'ENTER', 'ESCAPE', 'BACKSPACE', 'DELETE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN', 'ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', '+', '-', '=', '[', ']', '\\', ';', '\'', ',', '.', '/'];

                                    if (isLetter || isDigit || isFunctionKey || otherValidKeys.includes(key)) {
                                        if (modifiers.length > 0) {
                                            const shortcutString = [...modifiers, key].join('+')
                                            updateShortcut(shortcutString)
                                        } else {
                                            if (isFunctionKey || otherValidKeys) {
                                                const shortcutString = key
                                                updateShortcut(shortcutString)
                                            }
                                        }
                                    } else { }
                                }}
                                className="h-7 text-xs"
                            />
                            <p className="text-xs text-muted-foreground pt-1">
                                {translations.appShortcutInfo}
                            </p>
                        </div>
                    </TabsContent>

                    {user?.role && (
                        <TabsContent value={translations.environment} className="space-y-4 flex-1 overflow-y-auto pb-2 pr-2 pl-2">
                            {user?.role === "admin" && (
                                <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.ALL_USERS)}>
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    {translations.inviteUser}
                                </Button>
                            )}

                            <div className="rounded-lg border border-border overflow-hidden">
                                <div className="p-2 bg-muted/50 border-b border-border"><h3 className="text-sm font-medium">{translations.manageVaults}</h3></div>
                                <div className="max-h-[150px] overflow-y-auto scrollbar-invisible">
                                    {vaults.map((vault: DecryptedVault) => (
                                        <div key={vault.id} className="flex items-center py-2 px-3 border-b border-border last:border-b-0 gap-3 cursor-pointer">
                                            <VaultIcon icon={vault.decryptedVaultMetadata.imageUrl} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold truncate">{vault.decryptedVaultMetadata.name}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{vault.permission}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveVault(vault)}
                                                    className="h-6 w-6 p-0 text-destructive"
                                                    title={translations.removeVault}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
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
                    )}

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

                <CommonDialog
                    isOpen={removeVaultDialogIsOpen}
                    onOpenChange={setRemoveVaultDialogIsOpen}
                    title={translations.areYouSureInRemoveVault}
                    description={translations.areYouSureInRemoveVaultDialogDescription}
                    cancelButtonText={translations.cancel}
                    confirmButtonText={translations.remove}
                    confirmButtonAction={async () => { deleteVault(virtualVault!.id) }}
                    isLoading={buttonIsLoading}
                />
            </div>
        </>
    )
}