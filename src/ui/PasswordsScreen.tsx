
import { useRef, useEffect, useState } from "react"
import { Circle, Copy, Edit2, Eye, EyeOff, Info, LinkIcon, RectangleEllipsis, Save, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Password, Vault } from "@/types"
import { VaultIcon } from "@/vault-icon"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"

interface PasswordsScreenProps {
    selectedVault: Vault
    passwords: Password[]
    selectedPassword: Password | null
    editingPassword: string | null
    editedPasswordData: Partial<Password>
    showPassword: boolean // Estado para mostrar/ocultar senha
    onPasswordClick: (password: Password) => void
    onStartEditing: (password: Password) => void
    onCancelEditing: () => void
    onSavePassword: (passwordId: string) => void
    onEditChange: (field: keyof Password, value: string) => void
    onShowPasswordToggle: (show: boolean) => void // Callback para alterar showPassword
    copyToClipboard: (text: string) => void
    formatDate: (dateString: string) => string
}


export default function PasswordsScreen({
    selectedVault, passwords, selectedPassword, editingPassword,
    editedPasswordData, showPassword, onPasswordClick,
    onStartEditing, onCancelEditing, onSavePassword, onEditChange,
    onShowPasswordToggle, copyToClipboard, formatDate
}: PasswordsScreenProps) {
    const { navigateTo } = useNavigationState()
    const [searchQuery, setSearchQuery] = useState("")

    const containerRef = useRef<HTMLDivElement>(null)
    const passwordListRef = useRef<HTMLDivElement>(null)

    const filteredPasswords = passwords.filter(
        (password) =>
            searchQuery === "" ||
            password.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (password.url && password.url.toLowerCase().includes(searchQuery.toLowerCase())),
    )

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
                    const scrollAmount = detailsRect.top - containerRect.top - 16
                    containerRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" })
                }
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [selectedPassword, editingPassword])

    return (
        <div className="flex flex-col w-full h-full  overflow-y-auto scrollbar-invisible" ref={containerRef}>
            <div className="px-2 pb-2 w-full h-full">
                <div
                    className="rounded-lg border border-border overflow-hidden mt-2 divide-y divide-border relative"
                    ref={passwordListRef}
                >
                    {filteredPasswords.length > 0 ? (
                        filteredPasswords.map((password) => (
                            <div key={password.id} className="relative">
                                {/* --- Item da Senha (Resumido) --- */}
                                <div
                                    className={cn(
                                        "flex items-center py-2 px-3 cursor-pointer hover:bg-accent transition-colors",
                                        selectedPassword?.id === password.id && !editingPassword && "bg-accent",
                                        editingPassword === password.id && "bg-blue-100 dark:bg-blue-900/30"
                                    )}
                                    onClick={() => !editingPassword && onPasswordClick(password)}
                                    id={`password-item-${password.id}`}
                                >
                                    <div className={`h-9 w-9 ${password.iconBg} rounded-md flex items-center justify-center mr-3`}>
                                        {/* Corrigido VaultIcon props */}
                                        <VaultIcon
                                            icon={password.icon}
                                            className="h-5 w-5"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold truncate">{password.name}</h3>
                                        <p className="text-xs text-muted-foreground truncate">{password.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-1">
                                        <div className="text-muted-foreground">
                                            {password.accessIndicator === 'dot' ? <Circle className="h-2 w-2 fill-current" /> : <span className="text-xs">{password.accessIndicator}</span>}
                                        </div>
                                        {/* Corrigido Info props */}
                                        <Info
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-colors",
                                                (selectedPassword?.id === password.id || editingPassword === password.id) && "text-foreground" // Destaca se selecionado ou editando
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* --- Detalhes da Senha (Expandido/Editando) --- */}
                                {(selectedPassword?.id === password.id || editingPassword === password.id) && (
                                    <div
                                        id={`password-details-${password.id}`}
                                        className={cn(
                                            "p-3 border-t border-border space-y-3",
                                            editingPassword === password.id
                                                ? "bg-blue-50 dark:bg-blue-900/10"
                                                : "bg-accent",
                                            "animate-in fade-in duration-200"
                                        )}
                                    >
                                        {/* Botões Editar/Salvar */}
                                        {selectedVault.accessLevel === "Admin" && (
                                            <div className="flex justify-end mb-1 -mt-1">
                                                {editingPassword === password.id ? (
                                                    <div className="flex gap-1">
                                                        <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={onCancelEditing}>Cancelar</Button>
                                                        <Button variant="default" size="sm" className="h-6 text-xs px-2" onClick={() => onSavePassword(password.id)}>
                                                            <Save className="h-3 w-3 mr-1" /> Salvar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => onStartEditing(password)}>
                                                        <Edit2 className="h-3 w-3 mr-1" /> Editar
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* --- Campo Username --- */}
                                        {password.username && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`username-${password.id}`} className="text-xs font-medium">Usuário</Label>
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        id={`username-${password.id}`}
                                                        value={editingPassword === password.id ? editedPasswordData.username ?? '' : password.username}
                                                        readOnly={editingPassword !== password.id}
                                                        onChange={(e) => onEditChange("username", e.target.value)}
                                                        className="flex-1 h-7 text-xs"
                                                    />
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(password.username || "")} title="Copiar usuário">
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* --- === CAMPO SENHA (COMPLETADO) === --- */}
                                        {password.password && (
                                            <div className="space-y-1">
                                                <Label htmlFor={`password-field-${password.id}`} className="text-xs font-medium"> {/* ID do input alterado para evitar conflito com div pai */}
                                                    Senha
                                                </Label>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex-1 relative">
                                                        <Input
                                                            id={`password-field-${password.id}`}
                                                            type={showPassword ? "text" : "password"}
                                                            value={editingPassword === password.id ? editedPasswordData.password ?? '' : password.password}
                                                            readOnly={editingPassword !== password.id}
                                                            onChange={(e) => onEditChange("password", e.target.value)}
                                                            className="h-7 text-xs pr-7" // Padding right para o botão de olho
                                                        />
                                                        <Button
                                                            variant="ghost" size="icon"
                                                            className="absolute right-0 top-0 h-7 w-7"
                                                            onClick={() => onShowPasswordToggle(!showPassword)} // Chama callback para alterar estado no pai
                                                            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                                        >
                                                            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                        </Button>
                                                    </div>
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(password.password || "")} title="Copiar senha">
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* --- === CAMPO URL (COMPLETADO) === --- */}
                                        {(password.url || editingPassword === password.id) && ( // Mostrar se existe ou se está editando
                                            <div className="space-y-1">
                                                <Label htmlFor={`url-${password.id}`} className="text-xs font-medium">URL</Label>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                            <LinkIcon className="h-3 w-3" />
                                                        </span>
                                                        <Input
                                                            id={`url-${password.id}`}
                                                            value={editingPassword === password.id ? editedPasswordData.url ?? '' : password.url ?? ''}
                                                            readOnly={editingPassword !== password.id}
                                                            onChange={(e) => onEditChange("url", e.target.value)}
                                                            placeholder={editingPassword === password.id ? "https://..." : ""} // Placeholder só na edição
                                                            className="h-7 text-xs pl-6" // Padding left para o ícone
                                                        />
                                                    </div>
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(password.url || "")} title="Copiar URL" disabled={!password.url}>
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* --- === CAMPO NOTAS (COMPLETADO) === --- */}
                                        {(password.notes || editingPassword === password.id) && ( // Mostrar se existe ou se está editando
                                            <div className="space-y-1">
                                                <Label htmlFor={`notes-${password.id}`} className="text-xs font-medium">Notas</Label>
                                                <Textarea
                                                    id={`notes-${password.id}`}
                                                    value={editingPassword === password.id ? editedPasswordData.notes ?? '' : password.notes ?? ''}
                                                    readOnly={editingPassword !== password.id}
                                                    onChange={(e) => onEditChange("notes", e.target.value)}
                                                    placeholder={editingPassword === password.id ? "Digite suas notas..." : ""} // Placeholder só na edição
                                                    className="min-h-[60px] text-xs resize-none" // resize-none pode ser útil
                                                />
                                            </div>
                                        )}

                                        {/* Datas */}
                                        <div className="space-y-1 pt-1">
                                            {/* ... datas ... */}
                                            <div className="flex items-center text-xs text-muted-foreground"><span className="font-medium mr-1">Adicionado:</span><span>{formatDate(password.addedAt)}</span></div>
                                            <div className="flex items-center text-xs text-muted-foreground"><span className="font-medium mr-1">Atualizado:</span><span>{formatDate(password.updatedAt)}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center">
                            {searchQuery ? <p>...</p> : <> <p>...</p> <Button>...</Button> </>}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex w-full mt-1 p-1 justify-end gap-2 border-t">
                <Button variant="outline" size="sm" className="h-8 text-xs" title="Adicionar senha" onClick={() => navigateTo(NavigationScreen.CREATE_PASSWORDS)}>
                    <RectangleEllipsis className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" title="Adicionar membro" onClick={() => navigateTo(NavigationScreen.CREATE_PASSWORDS)}>
                    <UserRoundPlus className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}