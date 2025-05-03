"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import IconSelectorScreen from "./IconSelectScreen"
import { useNavigationState } from "@/store/useNavigationState"
import UserSelector from "./UserSelector"

interface CreateVaultScreenProps {
  onSave: (vaultData: {
    name: string
    description: string
    icon: string
    iconBg: string
    users: { email: string; name: string; avatar?: string }[]
  }) => void
}

export default function CreateVaultScreen({
  onSave,
}: CreateVaultScreenProps) {
  const { navigateTo } = useNavigationState()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("blocks")
  const [selectedBg, setSelectedBg] = useState("bg-blue-100")
  const [isLoading, setIsLoading] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [users, setUsers] = useState<{ id: string; email: string; name: string; avatar?: string }[]>([
    { id: "default", email: "usuario@acmecorp.com", name: "João Silva", avatar: "/placeholder.svg?height=32&width=32" },
  ])

  const handleAddUser = (user: { id: string; email: string; name: string; avatar?: string }) => {
    setUsers([...users, user])
  }

  const handleRemoveUser = (email: string) => {
    setUsers(users.filter((user) => user.email !== email))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      onSave({
        name,
        description,
        icon: selectedIcon,
        iconBg: selectedBg,
        users,
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full p-4">

      <form onSubmit={handleSubmit} className="space-y-3">
        <IconSelectorScreen imageUrl={undefined} setFile={() => { }} setImageUrl={() => { }} />

        {/* Name and Description */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-medium">
            Nome do Cofre
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-xs"
            placeholder="Ex: Marketing, Desenvolvimento, etc."
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-xs font-medium">
            Descrição
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[60px] text-xs"
            placeholder="Descreva o propósito deste cofre"
          />
        </div>

        {/* Users Section */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Usuários</Label>
          <UserSelector selectedUsers={users} onAddUser={handleAddUser} onRemoveUser={handleRemoveUser} />
        </div>

        <Button type="submit" className="w-full h-8 text-xs mt-4 mb-4" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Criar Cofre"}
        </Button>
      </form>
    </div>
  )
}
