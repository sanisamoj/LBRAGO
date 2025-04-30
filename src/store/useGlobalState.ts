import { LoginRepository } from "@/models/repository/LoginRepository"
import { create } from "zustand"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { GlobalState } from "@/models/data/states/GlobalState"

export const useGlobalState = create<GlobalState>((_) => ({
    signout: async () => {
        const repository: LoginRepository = LoginRepository.getInstance()
        await repository.signOut()

        useNavigationState.getState()
            .navigateReplace(NavigationScreen.LOGIN_EMAIL)
    }
}))