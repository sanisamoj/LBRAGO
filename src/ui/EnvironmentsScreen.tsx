"use client"

import { useState } from "react"
import { Plus, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Environment } from "../types"
import { VaultIcon } from "@/vault-icon"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"

export default function EnvironmentsScreen() {
    const { navigateTo } = useNavigationState()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)

    const sampleEnvironments: Environment[] = [
        {
            id: "prod",
            name: "Produção",
            icon: "server",
            iconBg: "bg-red-100",
            userEmail: "admin@acmecorp.com",
            userName: "Administrador",
            userPassword: "securePass123!",
            createdAt: "2023-05-15T10:30:00Z",
            updatedAt: "2023-11-22T14:45:00Z",
        },
        {
            id: "staging",
            name: "Homologação",
            icon: "database",
            iconBg: "bg-yellow-100",
            userEmail: "test@acmecorp.com",
            userName: "Testador",
            userPassword: "testPass456!",
            createdAt: "2023-04-10T09:15:00Z",
            updatedAt: "2023-10-05T11:20:00Z",
        },
        {
            id: "dev",
            name: "Desenvolvimento",
            icon: "code",
            iconBg: "bg-blue-100",
            userEmail: "dev@acmecorp.com",
            userName: "Desenvolvedor",
            userPassword: "devPass789!",
            createdAt: "2023-06-20T13:40:00Z",
            updatedAt: "2023-12-01T16:30:00Z",
            customImage: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "qa",
            name: "Testes",
            icon: "activity",
            iconBg: "bg-green-100",
            userEmail: "qa@acmecorp.com",
            userName: "QA",
            userPassword: "qaPass321!",
            createdAt: "2023-03-12T08:20:00Z",
            updatedAt: "2023-09-18T15:10:00Z",
        },
    ]

    const filteredEnvironments = sampleEnvironments.filter(
        (env) =>
            searchQuery === "" ||
            env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            env.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            env.userName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <>
            <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Buscar ambientes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-7 text-xs pr-7"
                        autoFocus
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-7 w-7 p-0"
                        onClick={() => {
                            setSearchQuery("")
                            setShowSearch(false)
                        }}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-2 pb-2 pt-1">
                    <div className="rounded-lg border border-border overflow-hidden">
                        {filteredEnvironments.length > 0 ? (
                            filteredEnvironments.map((environment) => (
                                <div
                                    key={environment.id}
                                    className="flex items-center py-1.5 px-2 border-b border-border cursor-pointer hover:bg-accent transition-colors"
                                    onClick={() => {}}
                                >
                                    <div className={`h-7 w-7 ${environment.iconBg} rounded-md flex items-center justify-center mr-2`}>
                                        {environment.customImage ? (
                                            <img
                                                src={environment.customImage || "/placeholder.svg"}
                                                alt={environment.name}
                                                className="h-5 w-5 object-cover"
                                            />
                                        ) : (
                                            <VaultIcon icon={environment.icon} className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold">{environment.name}</h3>
                                        <p className="text-[10px] text-muted-foreground">{environment.userEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                {searchQuery ? (
                                    <p className="text-xs text-muted-foreground">Nenhum ambiente encontrado para "{searchQuery}"</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground">Nenhum ambiente encontrado</p>
                                )}
                            </div>
                        )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => navigateTo(NavigationScreen.CREATE_ENVIRONMENT)}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Criar Novo Ambiente
                    </Button>
                </div>
            </div>
        </>
    )
}
