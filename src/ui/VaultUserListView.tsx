import { X, Search, Shield, Edit, Eye, MoreHorizontal, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import AddUserInVaultSelector from "./AddUserInVaultSelector"
import { useSelectedVaultState } from "@/store/useSelectedVaultState"
import { useLanguageState } from "@/store/useLanguageState"
import { VaultMemberResponse } from "@/models/data/interfaces/VaultMemberResponse"
import { MinimalUserInfoResponse } from "@/models/data/interfaces/MinimalUserInfoResponse"
import { useAdminState } from "@/store/useAdminState"
import { useGlobalState } from "@/store/useGlobalState"
import { MemberPermissionType } from "@/models/data/enums/MemberPermissionType"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function VaultUserListView() {
    const { translations } = useLanguageState()
    const { user } = useGlobalState()
    const { users } = useAdminState()
    const { vault, members, addMember, removeMember, updateMemberVaultPermission } = useSelectedVaultState()

    const filteredUsers: MinimalUserInfoResponse[] = useMemo(() => {
        return users.filter(
            (minUser: MinimalUserInfoResponse) =>
                minUser.id !== user!.id && !members.find(member => member.userId === minUser.id)
        )
    }, [members])
    
    const [mainSearchTerm, setMainSearchTerm] = useState("")

    const filteredVaultUsers: VaultMemberResponse[] = useMemo(() => {
        if (!mainSearchTerm) return members
        return members.filter(user =>
            user.username.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(mainSearchTerm.toLowerCase())
        )
    }, [members, mainSearchTerm])

    const vaultRoles: string[] = ["admin", "write", "read"]
    const roleIcons = {
        admin: <Shield className="mr-2 h-4 w-4" />,
        write: <Edit className="mr-2 h-4 w-4" />,
        read: <Eye className="mr-2 h-4 w-4" />,
    }

    const getRoleTranslation = (role: MemberPermissionType) => {
        switch (role) {
            case "admin": return "Administrador"
            case "write": return "Editor"
            case "read": return "Leitor"
            default: return role
        }
    }

    const handleRoleChange = (memberId: string, permission: MemberPermissionType) => {
        const member: VaultMemberResponse | undefined = members.find((m: VaultMemberResponse) => m.id === memberId)
        if (member) {
            updateMemberVaultPermission(member.userId, permission)
        }
    }

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="space-y-1 w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                    <Label htmlFor="user-selector-input" className="text-xs font-medium text-muted-foreground">
                        {translations.addUserToVault}
                    </Label>
                    <AddUserInVaultSelector availableUsers={filteredUsers} onAddUser={addMember} />
                </div>
                <div className="relative flex-grow w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        type="search"
                        value={mainSearchTerm}
                        onChange={(e) => setMainSearchTerm(e.target.value)}
                        className="h-8 pl-8 text-xs"
                        placeholder={translations.userSearch}
                        id="vault-user-search"
                    />
                </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                {filteredVaultUsers.length > 0 ? (
                    filteredVaultUsers.map((member: VaultMemberResponse) => (
                        <div key={member.id} className="flex items-center justify-between py-2.5 px-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
                            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={undefined} alt={member.username} />
                                    <AvatarFallback className="text-xs">
                                        {member.username.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate" title={member.username}>
                                            {member.username}
                                        </p>

                                        <Badge variant="outline" className="text-primary border-primary/40 whitespace-nowrap">
                                            {member.permission}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-muted-foreground truncate" title={member.email}>
                                        {member.email}
                                        {member.permission && (
                                            <span className="font-medium"> - {getRoleTranslation(member.permission)}</span>
                                        )}
                                    </p>
                                </div>

                            </div>

                            {member.userId !== vault.vaultCreatedBy ? (
                                <div className="flex items-center flex-shrink-0 ml-2 space-x-1">
                                    {user?.id === member.userId && (
                                        <div title="Você" className="text-muted-foreground">
                                            <UserCheck className="h-4 w-4 opacity-60" />
                                        </div>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-7 w-7 p-0 text-muted-foreground hover:text-primary">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{"Alterar Função"}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {vaultRoles.map((roleValue) => (
                                                <DropdownMenuItem
                                                    key={roleValue}
                                                    onClick={() => handleRoleChange(member.id, roleValue as MemberPermissionType)}
                                                    disabled={member.permission === roleValue}
                                                    className="cursor-pointer"
                                                >
                                                    {roleIcons[roleValue as MemberPermissionType]}
                                                    <span>{getRoleTranslation(roleValue as MemberPermissionType)}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                        onClick={() => removeMember(member.id)}
                                        title={`${translations.removeUser || "Remover"} ${member.username}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center flex-shrink-0 ml-2 h-7 w-7 justify-center" title="Criador do Cofre">
                                    <Shield className="h-4 w-4 text-muted-foreground opacity-50" />
                                </div>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="py-6 px-3 text-center text-sm text-muted-foreground">
                        {mainSearchTerm && members.length > 0 ? (translations.noUsersFound || "Nenhum usuário encontrado.") : ("Nenhum usuário no cofre.")}
                    </div>
                )}
            </div>
        </div>
    )
}