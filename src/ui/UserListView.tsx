import { User, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigationState } from "@/store/useNavigationState";
import { NavigationScreen } from "@/models/data/enums/NavigationScreen";
import { useLanguageState } from "@/store/useLanguageState";

export function UserListView() {
    const { translations } = useLanguageState()
    const { navigateTo } = useNavigationState()

    const users: any[] = [
        { id: "1", email: "joao.silva@acmecorp.com", name: "João Silva", imageUrl: "/placeholder.svg?height=40&width=40" },
        { id: "2", email: "maria.santos@acmecorp.com", name: "Maria Santos", imageUrl: "/placeholder.svg?height=40&width=40" },
        { id: "3", email: "pedro.oliveira@acmecorp.com", name: "Pedro Oliveira", imageUrl: "/placeholder.svg?height=40&width=40" },
    ]

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="relative flex-grow w-full sm:w-auto">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        type="search"
                        value={undefined}
                        onChange={undefined}
                        className="h-8 pl-8 text-xs"
                        placeholder="Add user by email"
                        onClick={undefined}
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.ADD_USER)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {translations.addNewUser}
                </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
                            {/* Coluna de Informações do Usuário */}
                            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
                                    <AvatarFallback className="text-xs">
                                        {user.name.split(" ").map((n: any) => n[0]).slice(0, 2).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={user.name}>{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                            {/* Coluna de Ação (Remover) */}
                            <div className="flex-shrink-0 ml-2">
                                <Button
                                    type="button" variant="ghost" size="sm"
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={undefined} // Chama a função do pai
                                    title={`Remover ${user.name}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                        {users.length > 0 ? "Nenhum usuário encontrado com este termo." : "Nenhum usuário cadastrado."}
                    </div>
                )}
            </div>
        </div>
    );
}