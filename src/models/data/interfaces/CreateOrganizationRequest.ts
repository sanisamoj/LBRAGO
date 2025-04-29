import { CreateUserRequest } from "./CreateUserRequest"

export interface CreateOrganizationRequest {
    name: string
    email: string
    imageUrl?: string
    subscriptionPlan: string
    user: CreateUserRequest
}