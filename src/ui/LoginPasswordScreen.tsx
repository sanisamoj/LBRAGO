"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useLoginViewState } from "@/store/useLoginViewState"

export default function LoginPasswordScreen() {
  const { resetNavigation } = useNavigationState()
  const { selectedOrganization } = useLoginViewState()

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      resetNavigation(NavigationScreen.VAULTS)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center p-6">

        {/* Bloco de apresentação da empresa */}
        <div className="flex items-center gap-3 mb-6">
          {selectedOrganization?.organizationImageUrl ? (
            <img
              src={selectedOrganization?.organizationImageUrl}
              alt={selectedOrganization?.organizationName}
              className="h-10 w-10 rounded-md object-cover shadow"
            />
          ) : (
            <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h2 className="text-base font-bold">{selectedOrganization?.organizationName}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium">
              Senha Mestra
            </Label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 pl-8 pr-8 text-xs"
                placeholder="Sua senha mestra"
                required
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-[10px] font-medium cursor-pointer">
                Lembrar-me
              </Label>
            </div>
            <Button variant="link" className="h-auto p-0 text-[10px]">
              Esqueceu a senha?
            </Button>
          </div>

          <Button type="submit" className="w-full h-8 text-xs" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>

  )
}
