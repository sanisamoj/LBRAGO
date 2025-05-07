import { MinimalUserInfoResponse } from "../interfaces/MinimalUserInfoResponse"

export interface AdminState {
    users: MinimalUserInfoResponse[]
    initAdminState: () => Promise<void>
    clearState: () => void
}
