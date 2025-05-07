import { MinimalUserInfoResponse } from "./MinimalUserInfoResponse"

export interface UserVaultSelectorProps {
    availableUsers: MinimalUserInfoResponse[]
    onAddUser: (user: MinimalUserInfoResponse) => void
}