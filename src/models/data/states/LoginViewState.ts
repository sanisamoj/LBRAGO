import { LoginInfoResponse } from "../interfaces/LoginInfoResponse"

export interface LoginViewState {
    email: string
    isLoading: boolean
    isError: boolean
    errorMessage: string
    userLoginInfo: LoginInfoResponse[]
    selectedOrganization: LoginInfoResponse | null
    password: string

    verificationCodeInput: string
    setVerificationCodeInput: (code: string) => void
    verifyCode: () => Promise<void>
    resendCode: () => Promise<void>
    resetToEmailInput: () => void

    setEmail: (email: string) => void
    verifyEmail: () => Promise<void>
    selectOrganization: (organization: LoginInfoResponse) => void
    setPassword: (password: string) => void
    environnmentAuth: () => Promise<void>

    clearState: () => void
}