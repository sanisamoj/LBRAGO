export interface PasswordCreationState {
    vaultId: string
    esvkPubKUser: string
    name: string
    description: string
    imageUrl: string | undefined
    file: File | undefined
    username: string
    password: string
    notes: string
    url: string

    isLoading: boolean

    initPasswordCreation: (vaultId: string, esvkPubKUser: string) => void
    setName: (name: string) => void
    setDescription: (description: string) => void
    setImageUrl: (imageUrl: string | undefined) => void
    setFile: (file: File | undefined) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
    setNotes: (notes: string) => void
    setUrl: (url: string) => void

    createPassword: () => Promise<void>
    clearState: () => void
}