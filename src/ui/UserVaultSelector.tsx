import { useState } from "react"
import { Check, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { UserVaultSelectorProps } from "@/models/data/interfaces/UserVaultSelectorProps"
import { VaultMemberResponse } from "@/models/data/interfaces/VaultMemberResponse"
import { useLanguageState } from "@/store/useLanguageState"

export default function UserVaultSelector({ availableUsers, onAddUser }: UserVaultSelectorProps) {
    const { translations } = useLanguageState()
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const filteredUsers: VaultMemberResponse[] = availableUsers.filter(
        (user) => !availableUsers.some((selectedUser) => selectedUser.email === user.email),
    )

    const handleAddUser = (user: (typeof availableUsers)[0]) => {
        onAddUser(user)
        setOpen(false)
        setInputValue("")
    }

    const handleAddCustomUser = () => {
        if (!inputValue || !inputValue.includes("@")) return

        setOpen(false)
        setInputValue("")
    }

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="search"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="h-8 pl-8 text-xs"
                                placeholder={translations.addUserByEmailPlaceholder}
                                onClick={() => setOpen(true)}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleAddCustomUser}
                            disabled={!inputValue || !inputValue.includes("@")}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full min-w-[200px] max-w-xs sm:max-w-sm md:max-w-md" align="start">

                    <Command>
                        <CommandInput
                            placeholder={translations.userSearch}
                            value={inputValue}
                            onValueChange={setInputValue}
                            className="h-9"
                        />
                        <CommandList className="max-h-40 overflow-auto scrollbar-invisible">
                            <CommandEmpty>
                                {inputValue && inputValue.includes("@") ? (
                                    <div className="py-3 px-2">
                                        <p className="text-xs text-muted-foreground mb-1">{translations.userNotFound}</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-7 text-xs"
                                            onClick={handleAddCustomUser}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            {translations.add} {inputValue}
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="py-6 text-center text-sm">{translations.userNotFound}.</p>
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredUsers.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.email}
                                        onSelect={() => handleAddUser(user)}
                                        className="py-1.5"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={"/placeholder.svg"} />
                                                <AvatarFallback className="text-[10px]">
                                                    {user.username
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{user.username}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Check className={`h-4 w-4 opacity-0`} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
