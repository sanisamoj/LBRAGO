import { DecryptedPassword } from "@/models/data/interfaces/DecryptedPassword"
import { create } from "zustand"
import { usePasswordsCreationViewState } from "./usePasswordCreationState"
import { useNavigationState } from "./useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"

export interface PasswordsViewState {
    passwords: DecryptedPassword[]
    setPasswords: (passwords: DecryptedPassword[]) => void
    addPassword: (password: DecryptedPassword) => void
    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => void
}

export const usePasswordsViewState = create<PasswordsViewState>((set) => ({
    passwords: [],

    setPasswords: (passwords: DecryptedPassword[]) => {
        set({ passwords })
    },

    addPassword: (password: DecryptedPassword) => {
        set((state) => ({ passwords: [...state.passwords, password] }))
    },

    handleCreatePassword: (vaultId: string, esvkPubKUser: string) => {
        usePasswordsCreationViewState.getState().initPasswordCreation(vaultId, esvkPubKUser)
        useNavigationState.getState().navigateTo(NavigationScreen.CREATE_PASSWORDS)
    },
}))