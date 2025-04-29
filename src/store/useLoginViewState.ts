import { LoginViewState } from "@/models/data/states/LoginViewState"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { LoginInfoResponse } from "@/models/data/interfaces/LoginInfoResponse"
import { LoginRepository } from "@/models/repository/LoginRepository"

export const useLoginViewState = create<LoginViewState>((set, get) => ({
    email: "",
    isLoading: false,
    isError: false,
    errorMessage: "",
    userLoginInfo: [],
    selectedOrganization: null,

    setEmail: (email: string) => set({ email: email, isError: false, errorMessage: "" }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    verifyEmail: async () => {
        const { navigateReplace } = useNavigationState.getState()
        set({ isLoading: true })

        try {
            const repository: LoginRepository = LoginRepository.getInstance()
            const loginInfoResponseList: LoginInfoResponse[] = await repository.getLoginInfo(get().email)
            set({ userLoginInfo: loginInfoResponseList })
            navigateReplace(NavigationScreen.LOGIN_ORGANIZATION)
            set({ isLoading: false, isError: false, errorMessage: "", email: "" })
        } catch (error) {
            set({
                isLoading: false,
                isError: true,
                errorMessage: "Nenhum usuário foi encontrado com este Email."
            })
        }
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
                selectedOrganization: null
            }
        )
    }
}))