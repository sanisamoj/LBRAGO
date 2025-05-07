export interface CreateVaultState {
    name: string
    description: string
    imageUrl: string | undefined
    personalVault: boolean

    isLoading: boolean

    setName: (name: string) => void
    setDescription: (description: string) => void
    setImageUrl: (imageUrl: string | undefined) => void
    setPersonalVault: (personalVault: boolean) => void

    createVault: () => Promise<void>

    clearState: () => void
}