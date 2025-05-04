"use client"

import { useState } from "react"
import { User, X } from "lucide-react" // Icons needed for this screen
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils" // Assuming you have a utility for class names

// --- Dados de Exemplo (em uma aplicação real, viriam de um estado global, API, etc.) ---

// Definindo o tipo de usuário (sem a permissão, pois não é editável nesta tela)
interface AdminUserType {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
}

// Usando os mesmos dados do exemplo anterior
const initialUsersData: AdminUserType[] = [
    {
        id: "1",
        email: "joao.silva@acmecorp.com",
        name: "João Silva",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "2",
        email: "maria.santos@acmecorp.com",
        name: "Maria Santos",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "3",
        email: "pedro.oliveira@acmecorp.com",
        name: "Pedro Oliveira",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "4",
        email: "ana.pereira@acmecorp.com",
        name: "Ana Pereira",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "5",
        email: "carlos.ferreira@acmecorp.com",
        name: "Carlos Ferreira",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "6",
        email: "lucia.costa@acmecorp.com",
        name: "Lúcia Costa",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "7",
        email: "roberto.almeida@acmecorp.com",
        name: "Roberto Almeida",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    {
        id: "8",
        email: "patricia.lima@acmecorp.com",
        name: "Patrícia Lima",
        imageUrl: "/placeholder.svg?height=40&width=40",
    },
    // Adicione mais usuários conforme necessário
];

// --- Componente da Tela de Administração ---

export default function AdminUserManagementScreen() {
    // Estado para gerenciar a lista de usuários exibida
    // Em um app real, isso seria inicializado com dados buscados de uma API
    const [users, setUsers] = useState<AdminUserType[]>(initialUsersData);
    // Estado para o termo de busca
    const [searchTerm, setSearchTerm] = useState("");

    // Função para remover um usuário (atualiza o estado local)
    // Em um app real, também chamaria uma API para deletar o usuário no backend
    const handleRemoveUser = (idToRemove: string) => {
        setUsers(currentUsers => currentUsers.filter(user => user.id !== idToRemove));
        console.log(`Simulando remoção do usuário com ID: ${idToRemove}`);
        // Exemplo: await api.deleteUser(idToRemove);
    };

    // Filtra os usuários baseado no termo de busca (nome ou email)
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-4">
            <h1 className="text-xl font-semibold mb-4">Gerenciamento de Usuários</h1>

            {/* Input de Busca */}
            <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 pl-9 pr-4 text-sm w-full sm:w-64" // Ajuste de tamanho e padding
                    placeholder="Buscar por nome ou email..."
                />
            </div>

            {/* Lista de Usuários */}
            <div className="rounded-lg border border-border overflow-hidden">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
                            {/* Informações do Usuário */}
                            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    {/* Usar imagem ou fallback */}
                                    <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                                    <AvatarFallback className="text-xs">
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2) // Pega no máximo 2 iniciais
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={user.name}>{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            {/* Botão de Remover */}
                            <div className="flex-shrink-0 ml-2">
                                <Button
                                    type="button"
                                    variant="ghost" // Ou "destructive" para mais ênfase
                                    size="sm"
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemoveUser(user.id)}
                                    title={`Remover ${user.name}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    // Mensagem quando não há usuários (ou nenhum corresponde à busca)
                    <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                        {users.length === 0 ? "Nenhum usuário cadastrado." : "Nenhum usuário encontrado com este termo de busca."}
                    </div>
                )}
            </div>

            {/* Opcional: Adicionar paginação ou outras ações de admin aqui */}

        </div>
    );
}