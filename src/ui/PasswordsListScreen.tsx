import { useRef, useEffect, useState } from "react"
import { Copy, Crown, Edit2, Eye, EyeOff, Info, LinkIcon, Plus, Save, Trash2, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Password } from "@/types"
import { VaultIcon } from "@/vault-icon"
import { useVaultsState } from "@/store/useVaultsState"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { useLanguageState } from "@/store/useLanguageState"
import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { CommonDialog } from "./common/Dialog"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useSelectedVaultState } from "@/store/useSelectedVaultState"
import { useGlobalState } from "@/store/useGlobalState"

export default function PasswordsListScreen() {
    const { translations } = useLanguageState()
    const { user } = useGlobalState()
    const { navigateTo } = useNavigationState()
    const { selectedVault, deleteVault, buttonIsLoading } = useVaultsState()
    const { passwords, handleCreatePassword } = useSelectedVaultState()

    const [searchQuery, _] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [selectedPassword, setSelectedPassword] = useState<DecryptedPassword | null>(null)
    const [editingPassword, setEditingPassword] = useState<string | null>(null)
    const [editedPasswordData, setEditedPasswordData] = useState<Partial<DecryptedPassword>>({})
    const [isOpen, setIsOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null);
    const passwordListRef = useRef<HTMLDivElement>(null);

    const filteredPasswords = passwords.filter(
        (password) =>
            searchQuery === "" ||
            password.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (password.url && password.url.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const copyToClipboard = (text: string | undefined | null) => {
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => { })
        }
    }

    const formatDate = (dateString: string | Date): string => {
        try {
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString
            if (isNaN(date.getTime())) {
                return "Data inválida"
            }
            return date.toLocaleString("pt-BR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
            });
        } catch (error) {
            console.error("Erro ao formatar data:", error)
            return "Erro na data"
        }
    }

    const editPermission: boolean = selectedVault ? [
        MemberPermissionType.ADMIN,
        MemberPermissionType.WRITE
    ].includes(selectedVault.permission) : false

    const handlePasswordClick = (password: DecryptedPassword) => {
        if (editingPassword === password.id) return; // Do nothing if already editing this one

        if (password.id === selectedPassword?.id) {
            // If clicking the already selected password, deselect it
            setSelectedPassword(null);
            setShowPassword(false); // Hide password when deselecting
        } else {
            // If clicking a new password, select it
            setSelectedPassword(password);
            setEditingPassword(null); // Ensure editing mode is cancelled
            setEditedPasswordData({}); // Clear any previous edit data
            setShowPassword(false); // Ensure password is hidden initially
        }
    }

    const startEditing = (password: DecryptedPassword) => {
        if (!editPermission) return // Prevent editing without permission
        setEditingPassword(password.id)
        setSelectedPassword(password) // Ensure the item being edited is also the selected one
        setEditedPasswordData({
            username: password.username,
            password: password.password,
            url: password.url,
            notes: password.notes,
            // Include other editable fields if necessary
        })
        setShowPassword(false) // Keep password hidden by default when starting edit
    }

    const cancelEditing = () => {
        setEditingPassword(null)
        setEditedPasswordData({})
        // Optional: revert selectedPassword if needed, or keep it selected
        setShowPassword(false) // Ensure password is hidden on cancel
    }

    const savePasswordChanges = (passwordId: string) => {
        if (!editPermission) return // Prevent saving without permission

        console.log("Simulando salvar senha ID:", passwordId, "com dados:", editedPasswordData)
        // **Zustand Integration Point:**
        // Replace console.log with actual Zustand action call:
        // updatePassword(passwordId, editedPasswordData)

        // After successful update (handle async):
        setEditingPassword(null)
        setEditedPasswordData({})
        setShowPassword(false) // Hide password after saving

        // Refresh selected password data if necessary, Zustand might handle this reactively
        const updatedPassword = filteredPasswords.find(p => p.id === passwordId)
        if (updatedPassword) {
            // Update the selected password state locally *if* Zustand doesn't automatically update the component
            // This might involve merging editedPasswordData with the original password data
            // Example (needs refinement based on actual data structure):
            const mergedData = { ...updatedPassword, ...editedPasswordData }
            setSelectedPassword(mergedData)
        }

    }

    const handleEditChange = (field: keyof Password, value: string) => {
        setEditedPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleShowPasswordToggle = (newState: boolean) => {
        setShowPassword(newState)
    }

    // Effect to scroll the details into view when a password is selected
    useEffect(() => {
        if (!selectedPassword || editingPassword) return

        const timer = setTimeout(() => {
            const detailsElement = document.getElementById(`password-details-${selectedPassword.id}`)
            if (detailsElement && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const detailsRect = detailsElement.getBoundingClientRect()

                if (detailsRect.bottom > containerRect.bottom) {
                    const scrollAmount = detailsRect.bottom - containerRect.bottom + 16
                    containerRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" })
                }

                else if (detailsRect.top < containerRect.top) {
                    const itemElement = document.getElementById(`password-item-${selectedPassword.id}`)
                    if (itemElement) {
                        const itemRect = itemElement.getBoundingClientRect()
                        const scrollAmount = itemRect.top - containerRect.top - 8
                        containerRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" })
                    }
                }
            }
        }, 150)

        return () => clearTimeout(timer)
    }, [selectedPassword, editingPassword])

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-invisible" ref={containerRef}>

            <div className="flex-1 px-2 pb-2 w-full">
                <div
                    className="rounded-lg border border-border overflow-hidden mt-2 divide-y divide-border relative"
                    ref={passwordListRef}
                >
                    {filteredPasswords.length > 0 ? (
                        filteredPasswords.map((password) => (
                            <div key={password.id} className="relative">
                                <div
                                    className={cn(
                                        "flex items-center py-2 px-3 cursor-pointer hover:bg-accent transition-colors",
                                        selectedPassword?.id === password.id && !editingPassword && "bg-accent",
                                        editingPassword === password.id && "bg-blue-100 dark:bg-blue-900/30"
                                    )}
                                    onClick={() => handlePasswordClick(password)}
                                    id={`password-item-${password.id}`}
                                >
                                    <div className={`h-9 w-9 bg-primaryrounded-md flex items-center justify-center mr-3 flex-shrink-0`}>
                                        <VaultIcon
                                            icon={password.imageUrl}
                                            className="h-5 w-5"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate">{password.name}</h3>
                                        {password.description && (
                                            <p className="text-xs text-muted-foreground truncate">{password.description}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                        <div className="text-muted-foreground">
                                            {password.permission === MemberPermissionType.ADMIN ? <Crown className="h-3 w-3 fill-current" /> : <span className="text-xs">{password.permission}</span>}
                                        </div>
                                        <Info
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-colors",
                                                (selectedPassword?.id === password.id || editingPassword === password.id) && "text-foreground"
                                            )}
                                        />
                                    </div>
                                </div>

                                {(selectedPassword?.id === password.id || editingPassword === password.id) && (
                                    <div
                                        id={`password-details-${password.id}`}
                                        className={cn(
                                            "p-3 border-t border-border space-y-3",
                                            editingPassword === password.id
                                                ? "bg-blue-50 dark:bg-blue-900/10"
                                                : "bg-accent/50 dark:bg-accent/20",
                                            "animate-in fade-in duration-200"
                                        )}
                                    >
                                        {/* Edit/Save Buttons */}
                                        {editPermission && (
                                            <div className="flex justify-end mb-1 -mt-1">
                                                {editingPassword === password.id ? (
                                                    <div className="flex gap-1">
                                                        <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={cancelEditing}>{translations.cancel || "Cancelar"}</Button>
                                                        <Button variant="default" size="sm" className="h-6 text-xs px-2" onClick={() => savePasswordChanges(password.id)}>
                                                            <Save className="h-3 w-3 mr-1" /> {translations.save || "Salvar"}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => startEditing(password)}>
                                                        <Edit2 className="h-3 w-3 mr-1" /> {translations.edit || "Editar"}
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* Username Field */}
                                        {(password.username || editingPassword === password.id) && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`username-${password.id}`} className="text-xs font-medium">{translations.user || "Usuário"}</Label>
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        id={`username-${password.id}`}
                                                        value={editingPassword === password.id ? editedPasswordData.username ?? '' : password.username ?? ''}
                                                        readOnly={editingPassword !== password.id}
                                                        onChange={(e) => handleEditChange("username", e.target.value)}
                                                        className="flex-1 h-7 text-xs"
                                                        placeholder={editingPassword === password.id ? "Digite o usuário" : ""}
                                                    />
                                                    <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => copyToClipboard(editingPassword === password.id ? editedPasswordData.username : password.username)} title={translations.copyUser || "Copiar usuário"} disabled={!(editingPassword === password.id ? editedPasswordData.username : password.username)}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Password Field */}
                                        {(password.password || editingPassword === password.id) && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`password-field-${password.id}`} className="text-xs font-medium">
                                                    {translations.password || "Senha"}
                                                </Label>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex-1 relative">
                                                        <Input
                                                            id={`password-field-${password.id}`}
                                                            type={showPassword ? "text" : "password"}
                                                            value={editingPassword === password.id ? editedPasswordData.password ?? '' : password.password ?? ''}
                                                            readOnly={editingPassword !== password.id}
                                                            onChange={(e) => handleEditChange("password", e.target.value)}
                                                            className="h-7 text-xs pr-8"
                                                            placeholder={editingPassword === password.id ? "Digite a senha" : ""}
                                                        />
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground" // Centered vertically
                                                            onClick={() => handleShowPasswordToggle(!showPassword)}
                                                            title={showPassword ? (translations.hidePassword || "Ocultar senha") : (translations.showPassword || "Mostrar senha")}
                                                            type="button"
                                                        >
                                                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                        </Button>
                                                    </div>
                                                    <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => copyToClipboard(editingPassword === password.id ? editedPasswordData.password : password.password)} title={translations.copyPassword || "Copiar senha"} disabled={!(editingPassword === password.id ? editedPasswordData.password : password.password)}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* URL Field */}
                                        {(password.url || editingPassword === password.id) && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`url-${password.id}`} className="text-xs font-medium">URL</Label>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                                            <LinkIcon className="h-3 w-3" />
                                                        </span>
                                                        <Input
                                                            id={`url-${password.id}`}
                                                            value={editingPassword === password.id ? editedPasswordData.url ?? '' : password.url ?? ''}
                                                            readOnly={editingPassword !== password.id}
                                                            onChange={(e) => handleEditChange("url", e.target.value)}
                                                            placeholder={editingPassword === password.id ? "https://exemplo.com" : ""}
                                                            className="h-7 text-xs pl-6"
                                                        />
                                                    </div>
                                                    <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => copyToClipboard(editingPassword === password.id ? editedPasswordData.url : password.url)} title={translations.copyUrl || "Copiar URL"} disabled={!(editingPassword === password.id ? editedPasswordData.url : password.url)}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes Field */}
                                        {(password.notes || editingPassword === password.id) && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`notes-${password.id}`} className="text-xs font-medium">{translations.notes || "Notas"}</Label>
                                                <Textarea
                                                    id={`notes-${password.id}`}
                                                    value={editingPassword === password.id ? editedPasswordData.notes ?? '' : password.notes ?? ''}
                                                    readOnly={editingPassword !== password.id}
                                                    onChange={(e) => handleEditChange("notes", e.target.value)}
                                                    placeholder={editingPassword === password.id ? "Digite suas notas..." : ""}
                                                    className="min-h-[60px] text-xs resize-none scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-1 h-6 text-xs px-2"
                                                    onClick={() => copyToClipboard(editingPassword === password.id ? editedPasswordData.notes : password.notes)}
                                                    disabled={!(editingPassword === password.id ? editedPasswordData.notes : password.notes)}>{translations.copyNotes}</Button>
                                            </div>
                                        )}

                                        {/* Date Information */}
                                        <div className="space-y-1 pt-2 border-t border-border/50 mt-3">
                                            {password.addedAt && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span className="font-medium mr-1">{translations.added}:</span>
                                                    <span>{formatDate(password.addedAt)}</span>
                                                </div>
                                            )}
                                            {password.updatedAt && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span className="font-medium mr-1">{translations.updated}:</span>
                                                    <span>{formatDate(password.updatedAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-xs text-muted-foreground flex flex-col w-full h-full gap-2 justify-center">
                            {searchQuery
                                ? `${translations.noPasswordsFoundFor} "${searchQuery}".`
                                : (translations.noPasswordsInVault)
                            }
                            {!searchQuery && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    onClick={() => { handleCreatePassword(selectedVault!.id, selectedVault!.esvkPubKUser) }}
                                >
                                    {translations.addPassword}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 flex w-full p-2 justify-end gap-2 border-t z-10 bg-white dark:bg-zinc-900">
                {selectedVault?.vaultCreatedBy === user?.id && (
                    <Button variant="outline" size="sm" className="h-8 text-xs px-2" title={translations.removeVault} onClick={() => { setIsOpen(true) }}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}

                {selectedVault?.permission === MemberPermissionType.ADMIN && (
                    <>
                        <Button variant="outline" size="sm" className="h-8 text-xs px-2" title={translations.managerMembers} onClick={() => { navigateTo(NavigationScreen.MANAGE_VAULT_MEMBERS) }}>
                            <UsersRound className="h-4 w-4" />
                        </Button>

                        <Button variant="outline" size="sm" className="h-8 text-xs px-2" title={translations.addPassword} onClick={() => { handleCreatePassword(selectedVault!.id, selectedVault!.esvkPubKUser) }}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            <CommonDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title="Tem certeza que seja remover este cofre?"
                description="Todas as informações relacionadas a este cofre serão perdidas permanentemente inclusive os acessos dos outros membros."
                cancelButtonText="Cancelar"
                confirmButtonText="Remover"
                confirmButtonAction={async () => { deleteVault(selectedVault!.id) }}
                isLoading={buttonIsLoading}
            />
        </div>
    )
}