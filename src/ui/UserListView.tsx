import { User, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useLanguageState } from "@/store/useLanguageState"
import { useAdminState } from "@/store/useAdminState"
import { useState } from "react"
import { useGlobalState } from "@/store/useGlobalState"

export function UserListView() {
    const { translations } = useLanguageState()
    const { navigateTo } = useNavigationState()
    const { user: loggedUser } = useGlobalState()
    const { users } = useAdminState()

    const [usersVirtual, setUsersVirtual] = useState(users)

    const search = (value: string) => {
        setUsersVirtual(users.filter((user) => user.email.toLowerCase().includes(value.toLowerCase())))
    }

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="relative flex-grow w-full sm:w-auto">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        type="search"
                        value={undefined}
                        onChange={(e) => search(e.target.value)}
                        className="h-8 pl-8 text-xs"
                        placeholder={translations.userSearch}
                        onClick={undefined}
                    />
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.ADD_USER)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {translations.addNewUser}
                </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                {usersVirtual.length > 0 ? (
                    usersVirtual.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-150">
                            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={undefined} alt={user.username} />
                                    <AvatarFallback className="text-xs">
                                        {user.username.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={user.username}>{user.username}</p>
                                    <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                            {user.id !== loggedUser?.id && (
                                <div className="flex-shrink-0 ml-2">
                                    <Button
                                        type="button" variant="ghost" size="sm"
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={undefined}
                                        title={`${translations.remove} ${user.username}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                        {usersVirtual.length > 0 ? translations.notFoundUsers : translations.noRegisteredUsers}
                    </div>
                )}
            </div>
        </div>
    );
}