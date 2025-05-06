"use client"

import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import UserVaultSelector from "./UserVaultSelector"
import { useSelectedVaultState } from "@/store/useSelectedVaultState"
import { useLanguageState } from "@/store/useLanguageState"
import { VaultMemberResponse } from "@/models/data/interfaces/VaultMemberResponse"

export function VaultUserListView() {
    const { translations } = useLanguageState()
    const { vault, members } = useSelectedVaultState()
    console.log('members', members)

    const [mainSearchTerm, setMainSearchTerm] = useState("")

    const filteredVaultUsers = useMemo(() => {
        if (!mainSearchTerm) return members
        return members.filter(user =>
            user.username.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(mainSearchTerm.toLowerCase())
        )
    }, [members, mainSearchTerm])

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="space-y-1 w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                    <Label htmlFor="user-selector-input" className="text-xs font-medium text-muted-foreground">
                        {translations.addUserToVault}
                    </Label>
                    <UserVaultSelector
                        availableUsers={members}
                        onAddUser={() => { }}
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
                                    <p className="text-sm font-medium truncate" title={member.username}>{member.username}</p>
                                    <p className="text-xs text-muted-foreground truncate" title={member.email}>{member.email}</p>
                                </div>
                            </div>
                            {member.userId !== vault.vaultCreatedBy && (
                                <Button
                                    type="button" variant="ghost" size="sm"
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                    onClick={() => { console.log("user removed", member) }}
                                    title={`${translations.removeUser} ${member.username}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-6 px-3 text-center bg- text-sm text-muted-foreground">
                        {mainSearchTerm && members.length > 0 ? translations.noUsersFound : translations.noUsersInVault}
                    </div>
                )}
            </div>
        </div>
    );
}