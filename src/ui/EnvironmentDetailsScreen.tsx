"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Eye, EyeOff, Mail, Minimize2, Moon, Save, Sun, User, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Environment } from "../types"
import { VaultIcon } from "@/vault-icon"

interface EnvironmentDetailsScreenProps {
    environment: Environment
    onBack: () => void
    onThemeToggle: () => void
    onMinimize: () => void
    mounted: boolean
    resolvedTheme: string | undefined
}

export default function EnvironmentDetailsScreen({
    environment,
    onBack,
    onThemeToggle,
    onMinimize,
    mounted,
    resolvedTheme,
}: EnvironmentDetailsScreenProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({
        userName: environment.userName,
        userEmail: environment.userEmail,
        userPassword: environment.userPassword,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const handleEditChange = (field: string, value: string) => {
        setEditedData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const saveChanges = () => {
        // In a real app, this would save to a database
        setIsEditing(false)
    }

    return (
        <>
            <div className="py-1 px-2 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={onBack} className="mr-1 h-7 w-7 p-0">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-base font-bold">Detalhes do Ambiente</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        {mounted && (
                            <Button variant="ghost" size="sm" onClick={onThemeToggle} className="h-7 w-7 p-0">
                                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={onMinimize} className="h-7 w-7 p-0">
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 ${environment.iconBg} rounded-lg flex items-center justify-center`}>
                            {environment.customImage ? (
                                <img
                                    src={environment.customImage || "/placeholder.svg"}
                                    alt={environment.name}
                                    className="h-5 w-5 object-cover"
                                />
                            ) : (
                                <VaultIcon icon={environment.icon} className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold">{environment.name}</h3>
                            <p className="text-[10px] text-muted-foreground">Ambiente</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        {isEditing ? (
                            <Button variant="default" size="sm" className="h-6 text-[10px]" onClick={saveChanges}>
                                <Save className="h-2.5 w-2.5 mr-1" />
                                Salvar
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => setIsEditing(true)}>
                                <Edit2 className="h-2.5 w-2.5 mr-1" />
                                Editar
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="userEmail" className="text-[10px] font-medium">
                            Email do Usuário
                        </Label>
                        <div className="flex items-center gap-1">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="userEmail"
                                    type="email"
                                    value={isEditing ? editedData.userEmail : environment.userEmail}
                                    onChange={(e) => handleEditChange("userEmail", e.target.value)}
                                    readOnly={!isEditing}
                                    className="h-7 text-xs pl-8"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(environment.userEmail)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="userName" className="text-[10px] font-medium">
                            Nome do Usuário
                        </Label>
                        <div className="flex items-center gap-1">
                            <div className="flex-1 relative">
                                <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="userName"
                                    value={isEditing ? editedData.userName : environment.userName}
                                    onChange={(e) => handleEditChange("userName", e.target.value)}
                                    readOnly={!isEditing}
                                    className="h-7 text-xs pl-8"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(environment.userName)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="userPassword" className="text-[10px] font-medium">
                            Senha
                        </Label>
                        <div className="flex items-center gap-1">
                            <div className="flex-1 relative">
                                <Input
                                    id="userPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={isEditing ? editedData.userPassword : environment.userPassword}
                                    onChange={(e) => handleEditChange("userPassword", e.target.value)}
                                    readOnly={!isEditing}
                                    className="h-7 text-xs"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(environment.userPassword)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2">
                        <div className="flex items-center text-[10px] text-gray-500">
                            <span className="font-medium mr-1">Criado em:</span>
                            <span>{formatDate(environment.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-gray-500">
                            <span className="font-medium mr-1">Atualizado em:</span>
                            <span>{formatDate(environment.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
