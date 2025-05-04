export interface InviteUserRequest {
    email: string
    role: "admin" | "member"
}