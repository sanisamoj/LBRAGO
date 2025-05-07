import { MemberPermissionType } from "../enums/MemberPermissionType"

export interface UpdateMemberRequest {
    memberId: string
    esvk_pubK_user: string
    permission: MemberPermissionType
}