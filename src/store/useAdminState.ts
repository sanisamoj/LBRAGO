import { MinimalUserInfoResponse } from "@/models/data/interfaces/MinimalUserInfoResponse"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"
import { create } from "zustand"
import { useLanguageState } from "./useLanguageState"
import { toast } from "sonner"
import { AdminState } from "@/models/data/states/AdminState"

export const useAdminState = create<AdminState>((set) => ({
    users: [],
    initAdminState: async () => {
        try {
            const envRepository = EnvironmentRepository.getInstance()
            const users: MinimalUserInfoResponse[] = await envRepository.getAllUsers()
            set({ users })
        } catch (error) {
            const { translations } = useLanguageState.getState()
            toast.warning(translations.errorToGetAllUser)
        }
    },

    clearState: () => {
        set({ users: [] })
    }
}))