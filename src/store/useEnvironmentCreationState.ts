import { CreateOrganizationRequest } from "@/models/data/interfaces/CreateOrganizationRequest"
import { GoCreateUserRequest } from "@/models/data/interfaces/GoCreateUserResponse"
import { LoginRepository } from "@/models/repository/LoginRepository"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { AxiosError } from "axios"
import { useLanguageState } from "./useLanguageState"
import { Config } from "@/Config"
import { CreateUserParameters } from "@/models/data/interfaces/CreateUserParameters"
import { EnvironmentCreationState } from "@/models/data/states/EnvironmentCreationState"

export const useEnvironmentCreationState = create<EnvironmentCreationState>((set, get) => ({
    environmentName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isPasswordError: false,
    isLoading: false,

    file: undefined,
    imageUrl: Config.FAVICON_URL,

    setFile: (file: File | undefined) => set({ file }),
    setImageUrl: (imageUrl: string | undefined) => set({ imageUrl }),

    setEnvironmentName: (environmentName: string) => set({ environmentName }),
    setUsername: (username: string) => set({ username }),
    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),
    setConfirmPassword: (confirmPassword: string) => {
        set({ confirmPassword })
        if (get().password !== confirmPassword) {
            set({ isPasswordError: true })
        } else {
            set({ isPasswordError: false })
        }
    },

    createEnvironment: async () => {
        const { translations } = useLanguageState.getState()
        const fields = [
            get().password,
            get().confirmPassword,
            get().username,
            get().email,
            get().environmentName
        ]

        if (fields.some(field => field.trim() === "")) {
            toast.error(translations.fillAllFieldsError)
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
            const output: string = await invoke<string>('generate_user_credentials', { arg: jsonArg })
            let goCreateUserResponse: GoCreateUserRequest = JSON.parse(output)

            const organizationCreate: CreateOrganizationRequest = {
                name: get().username,
                email: get().email,
                imageUrl: get().imageUrl,
                subscriptionPlan: "basic",
                user: {
                    username: get().username,
                    passwordVerifier: {
                        salt: goCreateUserResponse.passwordVerifier.salt,
                        verifier: goCreateUserResponse.passwordVerifier.verifier,
                        parameters: goCreateUserResponse.passwordVerifier.parameters
                    },
                    salt_ek: goCreateUserResponse.salt_ek,
                    keys: goCreateUserResponse.keys
                }
            }

            const repository: LoginRepository = LoginRepository.getInstance()
            await repository.createOrganization(organizationCreate)

            useNavigationState.getState()
                .navigateReplace(NavigationScreen.LOGIN_EMAIL)

            get().clearState()
            toast.success(translations.environmentCreatedSuccess)
        } catch (error: AxiosError | any) {
            console.log(error)
            // if (error?.response.status === 409) {
            //     toast.error(translations.environmentExistsEmailError)
            //     set({ isLoading: false })
            //     return
            // }
            toast.error(translations.somethingWentWrongError)
        }
        set({ isLoading: false })
    },

    clearState: () => {
        set({
            environmentName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            isPasswordError: false,
            isLoading: false,
            file: undefined
        })
    }
}))