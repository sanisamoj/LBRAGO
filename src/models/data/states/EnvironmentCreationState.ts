export interface EnvironmentCreationState {
    environmentName: string
    username: string
    email: string
    password: string
    confirmPassword: string
    isPasswordError: boolean
    isLoading: boolean

    file: File | undefined
    imageUrl: string | undefined

    setEnvironmentName: (environmentName: string) => void
    setUsername: (username: string) => void
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    setConfirmPassword: (confirmPassword: string) => void

    setFile: (file: File | undefined) => void
    setImageUrl: (imageUrl: string | undefined) => void

    createEnvironment: () => Promise<void>

    clearState: () => void
}