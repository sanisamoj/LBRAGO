"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import IconSelectorScreen from "./IconSelectScreen"
import UserSelector, { UserType } from "./UserSelector"
import { useLanguageState } from "@/store/useLanguageState"
import { useCreateVaultState } from "@/store/useCreateVaultState"

export default function CreateVaultScreen() {
  const { translations } = useLanguageState()
  const {
    name, description, imageUrl, isLoading, personalVault, setName, setDescription,
    setImageUrl, createVault, setPersonalVault
  } = useCreateVaultState()

  const [users, setUsers] = useState<UserType[]>([
    {
      id: "1",
      email: "joao.silva@acmecorp.com",
      name: "João Silva",
      imageUrl: "/placeholder.svg?height=40&width=40",
      permission: "write"
    },
  ])

  const handleAddUser = (user: any) => {
    setUsers([...users, user])
  }

  const handleRemoveUser = (email: string) => {
    setUsers(users.filter((user) => user.email !== email))
  }

  return (
    <div className="flex flex-col h-full p-4">

      <form onSubmit={(e) => { e.preventDefault(); createVault() }} className="space-y-3">
        <IconSelectorScreen imageUrl={imageUrl} setFile={() => { }} setImageUrl={setImageUrl} />

        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-medium">
            {translations.addNewVault}
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-xs"
            placeholder={translations.nameCreateVaultPlaceholder}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-xs font-medium">
            {translations.description}
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[60px] text-xs"
            placeholder={translations.decriptionCreateVaultPlaceholder}
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Input
            type="checkbox"
            id="isPersonal"
            checked={personalVault}
            onChange={(e) => setPersonalVault(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <Label
            htmlFor="isPersonal"
            className="text-xs font-medium cursor-pointer select-none"
          >
            {translations.isPersonalVaultLabel}
          </Label>
        </div>

        {!personalVault && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">{translations.users}</Label>
            <UserSelector selectedUsers={users} onAddUser={handleAddUser} onRemoveUser={handleRemoveUser} onUpdateUserPermission={() => { }} />
          </div>
        )}

        <Button type="submit" className="w-full h-8 text-xs mt-4 mb-4" disabled={isLoading}>
          {isLoading ? translations.encryptingVault : translations.createVault}
        </Button>
      </form>
    </div>
  )
}
