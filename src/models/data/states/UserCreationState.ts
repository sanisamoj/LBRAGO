export interface UserCreationState {
    code: string
    organizationName: string
    imageUrl: string
    isCodeError: boolean
    isPasswordError: boolean
    isLoading: boolean

    nickname: string
    setNickname: (nickname: string) => void

    password: string
    confirmPassword: string
    setPassword: (password: string) => void
    setConfirmPassword: (confirmPassword: string) => void

    setCode: (code: string) => void
    getMinOrgInfoByCreationCode: (code: string) => Promise<void>

    createUser: () => Promise<void>

    clearOrganization: () => void
    clearState: () => void
}