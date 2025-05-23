import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { MinimalUserInfoResponse } from "../data/interfaces/MinimalUserInfoResponse"
import { InviteUserRequest } from "../data/interfaces/InviteUserRequest"
import { SavedMediaResponse } from "../data/interfaces/SavedMediaResponse"

export class EnvironmentRepository {
    private static instance: EnvironmentRepository | null = null

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 2500,
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

    public async getAllUsers(): Promise<MinimalUserInfoResponse[]> {
        const response = await this.api.get("/org/users", {
            headers: {
                Authorization: `Bearer ${Config.token}`
            }
        })
        return response.data
    }

    public async inviteUser(request: InviteUserRequest): Promise<{ invitedCode: string }> {
        const response = await this.api.post<{ invitedCode: string }>("/invites", request, {
            headers: {
                Authorization: `Bearer ${Config.token}`
            }
        })
        return response.data
    }

    public async uploadMedia(file: File): Promise<SavedMediaResponse> {
        const formData = new FormData()
        formData.append("media", file)

        const response = await this.api.post<SavedMediaResponse>("/media", formData, {
            headers: {
                Authorization: `Bearer ${Config.token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    }

    public async getAllMedias(): Promise<SavedMediaResponse[]> {
        const response = await this.api.get<SavedMediaResponse[]>("/vaults/media", {
            headers: {
                Authorization: `Bearer ${Config.token}`
            }
        })
        return response.data
    }

    public async signout(): Promise<void> {
        try {
            await this.api.delete("/signout", {
                headers: {
                    Authorization: `Bearer ${Config.token}`
                }
            })
        } catch (_) { }
        Config.clearToken()
    }

}