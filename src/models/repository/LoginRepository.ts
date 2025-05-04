import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { LoginInfoResponse } from "../data/interfaces/LoginInfoResponse"
import { MinOrgWithTokenResponse } from "../data/interfaces/MinOrgWithTokenResponse"
import { CreateUserRequest } from "../data/interfaces/CreateUserRequest"
import { CreateOrganizationRequest } from "../data/interfaces/CreateOrganizationRequest"
import { OrganizationCreationResponse } from "../data/interfaces/OrganizationCreationResponse"
import { EnvironmentLoginRequest } from "../data/interfaces/EnvironmentLoginRequest"
import { UserWithTokenResponse } from "../data/interfaces/UserWithTokenResponse"
import { VaultRepository } from "./VaultRepository"

export class LoginRepository {
    private static instance: LoginRepository | null = null
    private static token: string
    private static tokenForUserCreation: string

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    private constructor() { }

    public static getInstance(): LoginRepository {
        if (this.instance === null) {
            this.instance = new LoginRepository()
        }
        return this.instance
    }

    public static setToken(token: string): void {
        this.token = token
    }

    public async getLoginInfo(email: string, code: string): Promise<LoginInfoResponse[]> {
        const response = await this.api.post("/login", {
            email: email,
            code: code
        })
        return response.data
    }

    public async login(request: EnvironmentLoginRequest): Promise<UserWithTokenResponse> {
        const response = await this.api.post("/environment/login", request)
        VaultRepository.setToken(response.data.token)
        return response.data
    }

    public async codeProcessLogin(email: string): Promise<void> {
        await this.api.post("/auth", { email: email }, {
            headers: {
                Authorization: `Bearer ${LoginRepository.token}`
            }
        })
    }

    public async getTokenForUserCreation(code: string): Promise<MinOrgWithTokenResponse> {
        const response = await this.api.get(`/invites/${code}`)
        LoginRepository.tokenForUserCreation = response.data.token
        return response.data
    }

    public async createUser(request: CreateUserRequest): Promise<void> {
        await this.api.post("/users/creation", request,
            {
                headers: {
                    Authorization: `Bearer ${LoginRepository.tokenForUserCreation}`
                }
            }
        )
    }

    public async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationCreationResponse> {
        const response = await this.api.post("/organizations", request,
            {
                headers: {
                    Authorization: `Bearer ${LoginRepository.tokenForUserCreation}`
                }
            }
        )

        return response.data
    }

    public async signOut(): Promise<void> {
        try {
            await this.api.delete("/signout", {
                headers: {
                    Authorization: `Bearer ${LoginRepository.token}`
                }
            })
        } catch (_) { }
        LoginRepository.token = ""
    }
}



