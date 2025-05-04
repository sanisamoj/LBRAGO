import { InviteUserRequest } from "@/models/data/interfaces/InviteUserRequest"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"
import { toast } from "sonner"
import { create } from "zustand"

export interface InviteUserState {
    email: string
    role: "admin" | "member"
    isLoading: boolean
    code?: string

    setEmail: (email: string) => void
    setRole: (role: "admin" | "member") => void
    generateCode: () => Promise<void>

    clearState: () => void
}

export const useInviteUserState = create<InviteUserState>((set, get) => ({
    email: "",
    role: "member",
    isLoading: false,
    code: undefined,

    setEmail: (email: string) => {
        set({ email: email, code: undefined })
    },
    setRole: (role: "admin" | "member") => set({ role: role }),

    generateCode: async () => {
        set({ isLoading: true })

        const request: InviteUserRequest = {
            email: get().email,
            role: get().role
        }

        try {
            const envRepository = EnvironmentRepository.getInstance()
            const invitedCode: { invitedCode: string } = await envRepository.inviteUser(request)
            return set({ code: invitedCode.invitedCode, isLoading: false })

        } catch (error) {
            toast.error("Houve algum erro ao convidar o usuário!")
        }

        set({ isLoading: false })
    },

    clearState: () => set({ email: "", role: "member", code: undefined })
}))