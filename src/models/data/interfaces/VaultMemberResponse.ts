import { MemberPermissionType } from "../enums/MemberPermissionType"

export interface VaultMemberResponse {
    id: string
    vaultId: string
    userId: string
    email: string
    esvk_pubK_user: string
    permission: MemberPermissionType
    addedBy: string
    addAt: string
}