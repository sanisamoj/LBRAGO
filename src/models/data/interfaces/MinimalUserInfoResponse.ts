export interface MinimalUserInfoResponse {
    id: string
    orgId: string
    email: string
    username: string
    publicKey: string
    role: 'admin' | 'member'
    status: 'active' | 'inactive' | 'pending'
    createdAt: string
    updatedAt: string
}