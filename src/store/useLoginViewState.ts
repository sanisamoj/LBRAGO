import { LoginViewState } from "@/models/data/states/LoginViewState"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { LoginInfoResponse } from "@/models/data/interfaces/LoginInfoResponse"
import { LoginRepository } from "@/models/repository/LoginRepository"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { AxiosError } from "axios"

export const useLoginViewState = create<LoginViewState>((set, get) => ({
    email: "",
    isLoading: false,
    isError: false,
    errorMessage: "",
    userLoginInfo: [],
    selectedOrganization: null,

    verificationCodeInput: "",

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
            toast.error(translations.sentCodeSuccess)
        } catch (error : AxiosError | any) {
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
        const { translations } = useLanguageState.getState()
        if (code.length >= 6) {
            try {
                get().verifyCode()
            } catch (error) {
                set({ isError: true, errorMessage: translations.invalidCode })
            }
        }
    },
    verifyCode: async () => {
        const repository: LoginRepository = LoginRepository.getInstance()
        const loginInfoResponseList: LoginInfoResponse[] = await repository.getLoginInfo(get().email, get().verificationCodeInput)
        set({ userLoginInfo: loginInfoResponseList })

        const { navigateReplace } = useNavigationState.getState()
        navigateReplace(NavigationScreen.LOGIN_ORGANIZATION)

        set({ isError: false, errorMessage: "", email: "", verificationCodeInput: "" })
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