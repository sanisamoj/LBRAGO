import { LoginViewState } from "@/models/data/states/LoginViewState"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { LoginInfoResponse } from "@/models/data/interfaces/LoginInfoResponse"
import { LoginRepository } from "@/models/repository/LoginRepository"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { PasswordVerifierLoginResponse } from "@/models/data/interfaces/PasswordVerifierLoginResponse"
import { GeneratePasswordVerifierInfo } from "@/models/data/interfaces/GeneratePasswordVerifierInfo"
import { invoke } from "@tauri-apps/api/core"
import { MinimalPasswordVerifier } from "@/models/data/interfaces/MinimalPasswordVerifier"
import { EnvironmentLoginRequest } from "@/models/data/interfaces/EnvironmentLoginRequest"
import { UserWithTokenResponse } from "@/models/data/interfaces/UserWithTokenResponse"
import { useGlobalState } from "./useGlobalState"
import { InitGlobalStateData } from "@/models/data/states/GlobalState"

export const useLoginViewState = create<LoginViewState>((set, get) => ({
    email: "",
    isLoading: false,
    isError: false,
    errorMessage: "",
    userLoginInfo: [],
    selectedOrganization: null,
    rememberPassword: false,

    verificationCodeInput: "",

    password: "",

    setEmail: (email: string) => set({ email: email, isError: false, errorMessage: "" }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    verifyEmail: async () => {
        const { navigateReplace } = useNavigationState.getState()
        const { translations } = useLanguageState.getState()
        set({ isLoading: true })

        try {
            const repository: LoginRepository = LoginRepository.getInstance()
            await repository.codeProcessLogin(get().email)
            navigateReplace(NavigationScreen.VERIFY_CODE)

            set({ isLoading: false, isError: false, errorMessage: "" })
            toast.success(translations.sentCodeSuccess)
        } catch (error: AxiosError | any) {
            if (error.response.status === 429) {

                set({
                    isLoading: false,
                    isError: true,
                    errorMessage: translations.sendAuthEmailAttempsExceeded
                })
                toast.error(translations.sendAuthEmailAttempsExceeded)
                return
            }

            set({
                isLoading: false,
                isError: true,
                errorMessage: translations.userNotFoundWithThisEmail
            })
        }
    },

    setVerificationCodeInput: (code: string) => {
        set({ verificationCodeInput: code })
        if (code.length >= 6) {
            get().verifyCode()
        } else {
            set({ isError: false, errorMessage: "" })
        }
    },
    verifyCode: async () => {
        try {
            const repository: LoginRepository = LoginRepository.getInstance()
            const loginInfoResponseList: LoginInfoResponse[] = await repository.getLoginInfo(get().email, get().verificationCodeInput)
            set({ userLoginInfo: loginInfoResponseList })

            const { navigateReplace } = useNavigationState.getState()
            navigateReplace(NavigationScreen.LOGIN_ORGANIZATION)
            set({ isError: false, errorMessage: "", verificationCodeInput: "" })
        } catch (error) {
            const { translations } = useLanguageState.getState()
            set({ isError: true, errorMessage: translations.invalidCode })
        }
    },
    resendCode: async () => {
        const { translations } = useLanguageState.getState()
        try {
            const repository: LoginRepository = LoginRepository.getInstance()
            await repository.codeProcessLogin(get().email)
            toast.success(translations.sentCodeSuccess)
        } catch (error) {
            toast.error(translations.sendAuthEmailAttempsExceeded)
        }
    },
    resetToEmailInput: () => {
        get().clearState()
        const { navigateReplace } = useNavigationState.getState()
        navigateReplace(NavigationScreen.LOGIN_EMAIL)
    },

    selectOrganization: (info: LoginInfoResponse) => {
        set({ selectedOrganization: info })
        const { navigateTo } = useNavigationState.getState()
        navigateTo(NavigationScreen.LOGIN_PASSWORD)
    },

    setPassword: (password: string) => set({ password }),

    setRememberPassword: (rememberPassword: boolean) => set({ rememberPassword }),

    environnmentAuth: async () => {
        set({ isLoading: true })
        const passwordVerifier: PasswordVerifierLoginResponse | undefined = get().selectedOrganization?.passwordVerifier
        if (!passwordVerifier) {
            set({ isLoading: false })
            return
        }

        const generatePVInfo: GeneratePasswordVerifierInfo = {
            salt: passwordVerifier.salt,
            parameters: passwordVerifier.parameters,
            password: get().password
        }

        try {
            const jsonStr: string = JSON.stringify(generatePVInfo)
            const result: string = await invoke<string>('generate_user_credentials_with_param', { arg: jsonStr })
            const minPasswordVerifier: MinimalPasswordVerifier = JSON.parse(result)

            const loginRepository = LoginRepository.getInstance()
            const loginRequest: EnvironmentLoginRequest = {
                orgId: get().selectedOrganization!.orgId,
                email: get().email,
                verifier: minPasswordVerifier.hash
            }
            console.log(loginRequest)
            const userWithTokenResponse: UserWithTokenResponse = await loginRepository.login(loginRequest)

            const init: InitGlobalStateData = {
                user: userWithTokenResponse.user,
                password: get().password,
                token: userWithTokenResponse.token,
                savePassword: get().rememberPassword
            }

            await useGlobalState.getState().initGlobalState(init)
        } catch (_) {
            const { translations } = useLanguageState.getState()
            toast.error(translations.acessDenied)
            set({ isLoading: false })
            return
        }

        const { resetNavigation } = useNavigationState.getState()
        resetNavigation(NavigationScreen.VAULTS)
        set({ isLoading: false })
    },

    getOrganizationInfoByCreationCode: async (code: string) => {
        const repository: LoginRepository = LoginRepository.getInstance()
        return await repository.getTokenForUserCreation(code)
    },

    clearState: () => {
        set(
            {
                email: "",
                isError: false,
                isLoading: false,
                errorMessage: "",
                userLoginInfo: [],
                selectedOrganization: null,
                verificationCodeInput: ""
            }
        )
    }
}))