export interface OrganizationCreationResponse {
    id: string
    name: string
    email: string
    imageUrl: string
    subscriptionPlan: 'basic' | 'premium' | 'enterprise'
    subscriptionStatus: 'active' | 'inactive' | 'canceled'
    updatedAt: string
    createdAt: string
}