import { useRef, useEffect, useState } from "react"
import { Circle, Copy, Edit2, Eye, EyeOff, Info, LinkIcon, RectangleEllipsis, Save, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Password } from "@/types"
import { VaultIcon } from "@/vault-icon"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useVaultsState } from "@/store/useVaultsState"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { useLanguageState } from "@/store/useLanguageState"
import { passwords } from "@/data"

export default function PasswordsScreen() {
    const { translations } = useLanguageState()
    const { navigateTo } = useNavigationState()
    const { selectedVault } = useVaultsState()

    const [searchQuery, setSearchQuery] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)
    const [editingPassword, setEditingPassword] = useState<string | null>(null)
    const [editedPasswordData, setEditedPasswordData] = useState<Partial<Password>>({})

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
                .then(() => {})
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

    const handlePasswordClick = (password: Password) => {
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
    };

    const startEditing = (password: Password) => {
        if (!editPermission) return; // Prevent editing without permission
        setEditingPassword(password.id);
        setSelectedPassword(password); // Ensure the item being edited is also the selected one
        setEditedPasswordData({
            username: password.username,
            password: password.password,
            url: password.url,
            notes: password.notes,
            // Include other editable fields if necessary
        });
        setShowPassword(false); // Keep password hidden by default when starting edit
    };

    const cancelEditing = () => {
        setEditingPassword(null);
        setEditedPasswordData({});
        // Optional: revert selectedPassword if needed, or keep it selected
        setShowPassword(false); // Ensure password is hidden on cancel
    };

    const savePasswordChanges = (passwordId: string) => {
        if (!editPermission) return; // Prevent saving without permission

        console.log("Simulando salvar senha ID:", passwordId, "com dados:", editedPasswordData);
        // **Zustand Integration Point:**
        // Replace console.log with actual Zustand action call:
        // updatePassword(passwordId, editedPasswordData);

        // After successful update (handle async):
        setEditingPassword(null);
        setEditedPasswordData({});
        setShowPassword(false); // Hide password after saving

        // Refresh selected password data if necessary, Zustand might handle this reactively
        const updatedPassword = filteredPasswords.find(p => p.id === passwordId);
        if (updatedPassword) {
            // Update the selected password state locally *if* Zustand doesn't automatically update the component
            // This might involve merging editedPasswordData with the original password data
            // Example (needs refinement based on actual data structure):
            const mergedData = { ...updatedPassword, ...editedPasswordData };
            setSelectedPassword(mergedData);
        }

    };

    const handleEditChange = (field: keyof Password, value: string) => {
        setEditedPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleShowPasswordToggle = (newState: boolean) => {
        setShowPassword(newState);
    };

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
                                    <div className={`h-9 w-9 ${password.iconBg || 'bg-muted'} rounded-md flex items-center justify-center mr-3 flex-shrink-0`}>
                                        <VaultIcon
                                            icon={password.icon}
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
                                            {password.accessIndicator === 'dot' ? <Circle className="h-2 w-2 fill-current" /> : <span className="text-xs">{password.accessIndicator}</span>}
                                        </div>
                                        <Info
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-colors",
                                                (selectedPassword?.id === password.id || editingPassword === password.id) && "text-foreground"
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Password Details (Accordion Content) */}
                                {(selectedPassword?.id === password.id || editingPassword === password.id) && (
                                    <div
                                        id={`password-details-${password.id}`}
                                        className={cn(
                                            "p-3 border-t border-border space-y-3",
                                            editingPassword === password.id
                                                ? "bg-blue-50 dark:bg-blue-900/10" // Edit mode background
                                                : "bg-accent/50 dark:bg-accent/20", // View mode background (slightly different from hover/select)
                                            "animate-in fade-in duration-200" // Shadcn animation utility
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
                                                            className="h-7 text-xs pr-8" // Ensure padding for the button
                                                            placeholder={editingPassword === password.id ? "Digite a senha" : ""}
                                                        />
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground" // Centered vertically
                                                            onClick={() => handleShowPasswordToggle(!showPassword)}
                                                            title={showPassword ? (translations.hidePassword || "Ocultar senha") : (translations.showPassword || "Mostrar senha")}
                                                            type="button" // Prevent form submission if wrapped in a form later
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
                                                            className="h-7 text-xs pl-6" // Padding left for the icon
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
                                                {/* Optional Copy Button for Notes */}
                                                {/* <Button variant="outline" size="sm" className="mt-1 h-6 text-xs px-2" onClick={() => copyToClipboard(editingPassword === password.id ? editedPasswordData.notes : password.notes)} disabled={!(editingPassword === password.id ? editedPasswordData.notes : password.notes)}>Copiar Notas</Button> */}
                                            </div>
                                        )}

                                        {/* Date Information */}
                                        <div className="space-y-1 pt-2 border-t border-border/50 mt-3">
                                            {password.addedAt && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span className="font-medium mr-1">{translations.added || "Adicionado"}:</span>
                                                    <span>{formatDate(password.addedAt)}</span>
                                                </div>
                                            )}
                                            {password.updatedAt && (
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span className="font-medium mr-1">{translations.updated || "Atualizado"}:</span>
                                                    <span>{formatDate(password.updatedAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        // Message when no passwords match search or vault is empty
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            {searchQuery
                                ? `${translations.noPasswordsFoundFor || "Nenhuma senha encontrada para"} "${searchQuery}".`
                                : (translations.noPasswordsInVault || "Nenhuma senha neste cofre.")
                            }
                            {/* Optionally add a button to create the first password if empty and no search */}
                            {!searchQuery && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => navigateTo(NavigationScreen.CREATE_PASSWORDS)}
                                >
                                    {translations.addPassword || "Adicionar Senha"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Area: Sticky at the bottom inside the scroll container */}
            {/* `mt-auto` is removed as `flex-1` on content pushes it down. Added background for visibility */}
            <div className="sticky bottom-0 flex w-full p-2 justify-end gap-2 border-t bg-background z-10">
                <Button variant="outline" size="sm" className="h-8 text-xs px-2" title={translations.addPassword || "Adicionar senha"} onClick={() => navigateTo(NavigationScreen.CREATE_PASSWORDS)}>
                    <RectangleEllipsis className="h-4 w-4" />
                </Button>
                {/* Assuming adding members might be related to vault settings, adjust navigation target if needed */}
                <Button variant="outline" size="sm" className="h-8 text-xs px-2" title={translations.addMember || "Adicionar membro"} onClick={() => { }}>
                    <UserRoundPlus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}