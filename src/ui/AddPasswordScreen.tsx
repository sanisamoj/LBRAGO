"use client"

import { useState } from "react"
import { Eye, EyeOff, Globe, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import IconSelectorScreen from "./IconSelectScreen"
import { usePasswordsCreationViewState } from "@/store/usePasswordCreationState"

export default function AddPasswordScreen() {
    const {
        name, description, imageUrl, username, password, notes, url, setFile,
        setName, setDescription, setImageUrl, setUsername, setPassword, setNotes, setUrl,
        createPassword, isLoading
    } = usePasswordsCreationViewState()

    const [showPassword, setShowPassword] = useState(false)

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
        let result = ""
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setPassword(result)
        setShowPassword(true)
    }

    return (
        <div className="flex flex-col h-full p-4">
            <form onSubmit={(e) => { e.preventDefault(); createPassword() }} className="space-y-3">
                <IconSelectorScreen setFile={setFile} setImageUrl={setImageUrl} imageUrl={imageUrl} />

                {/* Name and Description */}
                <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-medium">
                        Nome
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Ex: AWS Console, GitHub, etc."
                        required
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="description" className="text-xs font-medium">
                        Descrição
                    </Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Ex: Conta principal, Repositório da empresa, etc."
                    />
                </div>

                {/* URL */}
                <div className="space-y-1">
                    <Label htmlFor="url" className="text-xs font-medium">
                        URL
                    </Label>
                    <div className="relative">
                        <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="h-8 pl-8 text-xs"
                            placeholder="Ex: aws.amazon.com"
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                    <Label htmlFor="username" className="text-xs font-medium">
                        Usuário
                    </Label>
                    <div className="relative">
                        <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-8 pl-8 text-xs"
                            placeholder="Ex: admin@acmecorp.com"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-medium">
                            Senha
                        </Label>
                        <Button type="button" variant="link" className="h-auto p-0 text-[10px]" onClick={generatePassword}>
                            Gerar senha
                        </Button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-8 pl-8 pr-8 text-xs"
                            placeholder="Digite ou gere uma senha"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                    <Label htmlFor="notes" className="text-xs font-medium">
                        Notas
                    </Label>
                    <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[60px] text-xs"
                        placeholder="Informações adicionais sobre esta senha"
                    />
                </div>

                <Button type="submit" className="w-full h-8 text-xs mt-4 mb-4" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Senha"}
                </Button>
            </form>
        </div>
    )
}
