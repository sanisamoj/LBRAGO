import { MemberPermissionType } from "../enums/MemberPermissionType"

export interface AddMemberRequest {
    vaultId: string
    userId: string
    esvk_pubK_user: string
    permission: MemberPermissionType
}