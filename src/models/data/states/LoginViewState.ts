import { LoginInfoResponse } from "../interfaces/LoginInfoResponse"

export interface LoginViewState {
    email: string
    isLoading: boolean
    isError: boolean
    errorMessage: string
    userLoginInfo: LoginInfoResponse[]
    selectedOrganization: LoginInfoResponse | null

    setEmail: (email: string) => void
    verifyEmail: () => Promise<void>
    selectOrganization: (organization: LoginInfoResponse) => void

    clearState: () => void
}