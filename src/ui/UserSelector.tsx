"use client"

import { useState } from "react"
import { Plus, User, X, Lock, Pencil } from "lucide-react" // Added Lock and Pencil for icons
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils" // Assuming you have a utility for class names

// Example data (permission will be added when selected)
const availableUsers = [
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
]

type PermissionLevel = 'read' | 'write';

export interface UserType {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
    permission: PermissionLevel; // Added permission
}

interface UserSelectorProps {
    selectedUsers: UserType[]
    onAddUser: (user: UserType) => void
    onRemoveUser: (email: string) => void
    onUpdateUserPermission: (email: string, newPermission: PermissionLevel) => void // Added permission update handler
    defaultPermission?: PermissionLevel // Optional default permission on add
}

export default function UserSelector({
    selectedUsers,
    onAddUser,
    onRemoveUser,
    onUpdateUserPermission,
    defaultPermission = 'read' // Default to 'read' if not provided
}: UserSelectorProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const filteredAvailableUsers = availableUsers.filter(
        (user) => !selectedUsers.some((selectedUser) => selectedUser.email === user.email),
    )

    const handleSelectUser = (user: Omit<UserType, 'permission'>) => {
        const userWithPermission: UserType = {
            ...user,
            permission: defaultPermission // Add default permission
        }
        onAddUser(userWithPermission)
        setOpen(false)
        setInputValue("")
    }

    const handleAddCustomUser = () => {
        if (!inputValue || !inputValue.includes("@") || selectedUsers.some(u => u.email === inputValue)) return

        const newUser: UserType = {
            id: `custom-${Date.now()}`,
            email: inputValue,
            name: inputValue.split("@")[0],
            imageUrl: undefined,
            permission: defaultPermission // Add default permission
        }

        onAddUser(newUser)
        setOpen(false)
        setInputValue("")
    }

    const handlePermissionToggle = (email: string, currentPermission: PermissionLevel) => {
        const newPermission = currentPermission === 'read' ? 'write' : 'read';
        onUpdateUserPermission(email, newPermission);
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
                                placeholder="Add user by email"
                                onClick={() => setOpen(true)}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleAddCustomUser}
                            disabled={!inputValue || !inputValue.includes("@") || selectedUsers.some(u => u.email === inputValue)}
                            title={selectedUsers.some(u => u.email === inputValue) ? "User already added" : "Add custom user"}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full min-w-[200px] max-w-xs sm:max-w-sm md:max-w-md" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search users..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            className="h-9"
                        />
                        <CommandList className="max-h-40 overflow-auto">
                            <CommandEmpty>
                                {inputValue && inputValue.includes("@") && !selectedUsers.some(u => u.email === inputValue) ? (
                                    <div className="py-3 px-2">
                                        <p className="text-xs text-muted-foreground mb-1">User not found</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-7 text-xs"
                                            onClick={handleAddCustomUser}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add {inputValue}
                                        </Button>
                                    </div>
                                ) : (
                                     inputValue && selectedUsers.some(u => u.email === inputValue) ? (
                                        <p className="py-6 text-center text-sm">User already added.</p>
                                    ) : (
                                        <p className="py-6 text-center text-sm">No users found.</p>
                                    )
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredAvailableUsers.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.email}
                                        onSelect={() => handleSelectUser(user)}
                                        className="py-1.5 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback className="text-[10px]">
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{user.name}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="rounded-lg border border-border overflow-hidden">
                {selectedUsers.length > 0 ? (
                    selectedUsers.map((user) => (
                        <div key={user.email} className="flex items-center justify-between py-1.5 px-2 border-b border-border last:border-b-0">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Avatar className="h-6 w-6 flex-shrink-0">
                                    <AvatarImage src={user.imageUrl || "/placeholder.svg?height=24&width=24"} />
                                    <AvatarFallback className="text-[10px]">
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{user.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "h-6 px-2 py-1 text-[10px]",
                                        user.permission === 'write' ? "border-blue-500 text-blue-600 hover:bg-blue-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    )}
                                    onClick={() => handlePermissionToggle(user.email, user.permission)}
                                    title={`Change permission (current: ${user.permission})`}
                                >
                                    {user.permission === 'read' ? (
                                        <Lock className="h-2.5 w-2.5 mr-1" />
                                    ) : (
                                        <Pencil className="h-2.5 w-2.5 mr-1" />
                                    )}
                                    {user.permission === 'read' ? 'Read' : 'Write'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => onRemoveUser(user.email)}
                                    title={`Remove ${user.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-2 px-3 text-center text-xs text-muted-foreground">
                        No users added.
                    </div>
                )}
            </div>
        </div>
    )
}