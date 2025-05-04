import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { MinimalUserInfoResponse } from "../data/interfaces/MinimalUserInfoResponse"
import { InviteUserRequest } from "../data/interfaces/InviteUserRequest"

export class EnvironmentRepository {
    private static instance: EnvironmentRepository | null = null
    private static token: string

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 4000,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    private constructor() { }

    public static getInstance(): EnvironmentRepository {
        if (this.instance === null) {
            this.instance = new EnvironmentRepository()
        }
        return this.instance
    }

    public static setToken(token: string): void {
        this.token = token
    }

    public async getAllUsers(): Promise<MinimalUserInfoResponse[]> {
        const response = await this.api.get("/org/users", {
            headers: {
                Authorization: `Bearer ${EnvironmentRepository.token}`
            }
        })
        return response.data
    }

    public async inviteUser(request: InviteUserRequest): Promise<{ invitedCode: string }> {
        const response = await this.api.post<{ invitedCode: string }>("/invites", request, {
            headers: {
                Authorization: `Bearer ${EnvironmentRepository.token}`
            }
        })
        return response.data
    }

    public async signout(): Promise<void> {
        try {
            await this.api.delete("/signout", {
                headers: {
                    Authorization: `Bearer ${EnvironmentRepository.token}`
                }
            })
        } catch (_) { }
        EnvironmentRepository.token = ""
    }

}