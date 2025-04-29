"use client"

import { useState } from "react"
import { Check, Plus, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

interface UserSelectorProps {
    selectedUsers: { id: string; email: string; name: string; avatar?: string }[]
    onAddUser: (user: { id: string; email: string; name: string; avatar?: string }) => void
    onRemoveUser: (email: string) => void
}

export default function UserSelector({ selectedUsers, onAddUser, onRemoveUser }: UserSelectorProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    // Filter out already selected users
    const filteredUsers = availableUsers.filter(
        (user) => !selectedUsers.some((selectedUser) => selectedUser.email === user.email),
    )

    const handleAddUser = (user: (typeof availableUsers)[0]) => {
        onAddUser(user)
        setOpen(false)
        setInputValue("")
    }

    const handleAddCustomUser = () => {
        if (!inputValue || !inputValue.includes("@")) return

        // Create a new user with the email
        const newUser = {
            id: `custom-${Date.now()}`,
            email: inputValue,
            name: inputValue.split("@")[0],
            avatar: undefined,
        }

        onAddUser(newUser)
        setOpen(false)
        setInputValue("")
    }

    return (
        <div className="space-y-2">
            <div className="rounded-lg border border-border overflow-hidden">
                {selectedUsers.length > 0 ? (
                    selectedUsers.map((user) => (
                        <div key={user.email} className="flex items-center justify-between py-1.5 px-2 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatar || "/placeholder.svg?height=24&width=24"} />
                                    <AvatarFallback className="text-[10px]">
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs font-medium">{user.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onRemoveUser(user.email)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="py-2 px-3 text-center text-xs text-muted-foreground">
                        Nenhum usuário adicionado. Adicione usuários abaixo.
                    </div>
                )}
            </div>

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
                                placeholder="Adicionar usuário por email"
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
                            placeholder="Buscar usuários..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            className="h-9"
                        />
                        <CommandList className="max-h-40 overflow-auto">
                            <CommandEmpty>
                                {inputValue && inputValue.includes("@") ? (
                                    <div className="py-3 px-2">
                                        <p className="text-xs text-muted-foreground mb-1">Usuário não encontrado</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-7 text-xs"
                                            onClick={handleAddCustomUser}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Adicionar {inputValue}
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="py-6 text-center text-sm">Nenhum usuário encontrado.</p>
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
                                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
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
