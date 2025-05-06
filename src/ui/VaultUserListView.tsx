"use client"

import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import UserVaultSelector from "./UserVaultSelector"

// --- Tipos e Mocks (mantidos do seu exemplo) ---
interface VaultUser {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface VaultUserListViewProps {
    vaultId: string;
    initialVaultUsers?: VaultUser[];
    allCompanyUsers: VaultUser[]; // Importante: Veja nota sobre esta prop abaixo
    onAddUserToVault: (vaultId: string, user: VaultUser) => Promise<void> | void;
    onRemoveUserFromVault: (vaultId: string, userId: string) => Promise<void> | void;
}

const mockTranslations = {
    userSearch: "Pesquisar usuários no cofre...",
    addUserToVault: "Adicionar Usuário ao Cofre", // Usado como label para UserSelector
    removeUser: "Remover Usuário",
    noUsersInVault: "Nenhum usuário neste cofre.",
    searchUsersToAdd: "Pesquisar usuários para adicionar...",
    noUsersFound: "Nenhum usuário encontrado.",
    addUserByEmail: "Adicionar usuário por email",
    userNotInList: "Usuário não está na lista",
    add: "Adicionar",
    addNewUserToVault: "Adicionar novo usuário ao cofre"
};

// Exemplo de usuários disponíveis
const availableUsers = [
    {
        id: "1",
        email: "joao.silva@acmecorp.com",
        name: "João Silva",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "2",
        email: "maria.santos@acmecorp.com",
        name: "Maria Santos",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "3",
        email: "pedro.oliveira@acmecorp.com",
        name: "Pedro Oliveira",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "4",
        email: "ana.pereira@acmecorp.com",
        name: "Ana Pereira",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "5",
        email: "carlos.ferreira@acmecorp.com",
        name: "Carlos Ferreira",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "6",
        email: "lucia.costa@acmecorp.com",
        name: "Lúcia Costa",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "7",
        email: "roberto.almeida@acmecorp.com",
        name: "Roberto Almeida",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "8",
        email: "patricia.lima@acmecorp.com",
        name: "Patrícia Lima",
        avatar: "/placeholder.svg?height=40&width=40",
    },
]

const useLanguageState = () => ({ // Mock
    translations: mockTranslations
});
// --- Fim Tipos e Mocks ---


export function VaultUserListView({
    vaultId,
    initialVaultUsers = [],
    allCompanyUsers, // Nota: O UserSelector fornecido usa sua própria lista interna 'availableUsers'.
                     // Esta prop 'allCompanyUsers' NÃO será usada pelo UserSelector a menos que
                     // o UserSelector seja modificado para aceitar uma lista de usuários disponíveis.
    onAddUserToVault,
    onRemoveUserFromVault
}: VaultUserListViewProps) {
    const { translations } = useLanguageState();
    const [vaultUsers, setVaultUsers] = useState<VaultUser[]>(initialVaultUsers);
    const [mainSearchTerm, setMainSearchTerm] = useState("");

    // Callback para quando UserSelector adiciona um usuário.
    // O UserSelector passa o objeto completo do usuário.
    const handleUserAddedBySelector = async (userFromSelector: VaultUser) => {
        // Verifica se o usuário já existe em vaultUsers (UserSelector pode já fazer isso)
        const alreadyInVault = vaultUsers.some(vu => vu.id === userFromSelector.id || vu.email.toLowerCase() === userFromSelector.email.toLowerCase());
        
        if (alreadyInVault) {
            console.warn("VaultUserListView: Tentativa de adicionar usuário duplicado.", userFromSelector);
            return;
        }

        await onAddUserToVault(vaultId, userFromSelector);
        setVaultUsers(prev => [...prev, userFromSelector]);
    };
    
    // Callback para o botão 'X' na lista principal de usuários do cofre.
    // Este remove diretamente pelo ID.
    const handleRemoveUserFromMainList = async (userIdToRemove: string) => {
        await onRemoveUserFromVault(vaultId, userIdToRemove);
        setVaultUsers(prev => prev.filter(user => user.id !== userIdToRemove));
    };

    const filteredVaultUsers = useMemo(() => {
        if (!mainSearchTerm) return vaultUsers;
        return vaultUsers.filter(user =>
            user.name.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(mainSearchTerm.toLowerCase())
        );
    }, [vaultUsers, mainSearchTerm]);

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="space-y-1 w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                    <Label htmlFor="user-selector-input" className="text-xs font-medium text-muted-foreground">
                        {translations.addUserToVault}
                    </Label>
                    <UserVaultSelector
                        availableUsers={vaultUsers}
                        onAddUser={handleUserAddedBySelector}
                    />
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
                    filteredVaultUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2.5 px-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150"> {/* Ajustado py */}
                            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-xs">
                                        {user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={user.name}>{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                            <Button
                                type="button" variant="ghost" size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                onClick={() => handleRemoveUserFromMainList(user.id)}
                                title={`${translations.removeUser} ${user.name}`}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="py-6 px-3 text-center text-sm text-muted-foreground"> {/* Ajustado py */}
                        {mainSearchTerm && vaultUsers.length > 0 ? translations.noUsersFound : translations.noUsersInVault}
                    </div>
                )}
            </div>
        </div>
    );
}