import { MinOrgWithTokenResponse } from "@/models/data/interfaces/MinOrgWithTokenResponse"
import { LoginRepository } from "@/models/repository/LoginRepository"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { invoke } from "@tauri-apps/api/core"
import { GoCreateUserRequest } from "@/models/data/interfaces/GoCreateUserResponse"
import { CreateUserRequest } from "@/models/data/interfaces/CreateUserRequest"
import { toast } from "sonner"
import { UserCreationState } from "@/models/data/states/UserCreationState"
import { CreateUserParameters } from "@/models/data/interfaces/CreateUserParameters"
import { useLanguageState } from "./useLanguageState"

export const useUserCreationState = create<UserCreationState>((set, get) => ({
    code: "",
    organizationName: "",
    imageUrl: "",
    isCodeError: false,
    isPasswordError: false,
    nickname: "",
    password: "",
    confirmPassword: "",
    isLoading: false,

    setCode: (code: string) => {
        get().clearOrganization()
        set({ isCodeError: false, code: code })
        if (code.length >= 24) {
            get().getMinOrgInfoByCreationCode(code)
        }
    },

    getMinOrgInfoByCreationCode: async (code: string) => {
        const repository: LoginRepository = LoginRepository.getInstance()
        try {
            const response: MinOrgWithTokenResponse = await repository.getTokenForUserCreation(code)
            set({
                organizationName: response.organization,
                imageUrl: response.imageUrl
            })
        } catch (error) {
            set({
                isCodeError: true,
                organizationName: "",
                imageUrl: ""
            })
        }
    },
    setNickname: (nickname: string) => {
        set({ nickname })
    },

    setPassword: (password: string) => {
        set({ password })
    },

    setConfirmPassword: (confirmPassword: string) => {
        set({ confirmPassword })
        if (get().password !== confirmPassword) {
            set({ isPasswordError: true })
        } else {
            set({ isPasswordError: false })
        }
    },

    createUser: async () => {
        const { translations } = useLanguageState.getState()

        if (get().password === "" || get().confirmPassword === "" || get().nickname === "") {
            toast.error(translations.fillAllFields)
            return
        }
        set({ isLoading: true })

        try {
            const parameter: CreateUserParameters = {
                password: get().password,
                parameters: {
                    saltLength: 16,
                    memory: 65536,
                    time: 6,
                    parallelism: 4,
                    keyLength: 32
                }
            }
            const jsonArg: string = JSON.stringify(parameter)
            const output: string = await invoke<string>('generate_user_credentials', { arg: jsonArg });
            let goCreateUserResponse: GoCreateUserRequest = JSON.parse(output)

            const userCreate: CreateUserRequest = {
                code: get().code,
                username: get().nickname,
                passwordVerifier: {
                    salt: goCreateUserResponse.passwordVerifier.salt,
                    verifier: goCreateUserResponse.passwordVerifier.verifier,
                    parameters: goCreateUserResponse.passwordVerifier.parameters
                },
                salt_ek: goCreateUserResponse.salt_ek,
                keys: goCreateUserResponse.keys
            }
            const repository: LoginRepository = LoginRepository.getInstance()
            await repository.createUser(userCreate)

            useNavigationState.getState()
                .navigateReplace(NavigationScreen.LOGIN_EMAIL)

            get().clearState()
            toast.success(translations.userCreatedSuccessfully)
        } catch (error) {
            toast.error(translations.accountDontCreated)
        }
        set({ isLoading: false })
    },

    clearOrganization: () => {
        set({ organizationName: "", imageUrl: "" })
    },

    clearState: () => {
        set({ code: "", organizationName: "", imageUrl: "", password: "", confirmPassword: "", nickname: "", isCodeError: false, isPasswordError: false })
    }
}))