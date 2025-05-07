import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { EVaultWithMemberInfo } from "../data/interfaces/EVaultWithMemberInfo"
import { CreateVaultRequest } from "../data/interfaces/CreateVaultRequest"
import { EVaultResponse } from "../data/interfaces/EVaultResponse"
import { EPasswordResponse } from "../data/interfaces/EPasswordResponse"
import { CreatePasswordRequest } from "../data/interfaces/CreatePasswordRequest"
import { VaultMemberResponse } from "../data/interfaces/VaultMemberResponse"
import { UpdateMemberRequest } from "../data/interfaces/UpdateMemberRequest"

export class VaultRepository {
    private static instance: VaultRepository | null = null
    private static token: string

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 2500,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    private constructor() { }

    public static getInstance(): VaultRepository {
        if (this.instance === null) {
            this.instance = new VaultRepository()
        }
        return this.instance
    }

    public static setToken(token: string): void {
        this.token = token
    }

    public async getMyVaults(): Promise<EVaultWithMemberInfo[]> {
        const response = await this.api.get("/users/vaults", {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })

        return response.data
    }

    public async createVault(request: CreateVaultRequest): Promise<EVaultResponse> {
        const response = await this.api.post("/vaults", request, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })

        return response.data
    }

    public async deleteVault(vaultId: string): Promise<void> {
        await this.api.delete(`/vaults/${vaultId}`, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })
    }

    public async getPasswords(vaultId: string): Promise<EPasswordResponse[]> {
        const response = await this.api.get(`/vaults/passwords?vaultId=${vaultId}`, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })
        return response.data
    }

    public async createPassword(request: CreatePasswordRequest): Promise<EPasswordResponse> {
        const response = await this.api.post("/vaults/passwords", request, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })

        return response.data
    }

    public async getMembers(vaultId: string): Promise<VaultMemberResponse[]> {
        const response = await this.api.get(`/vaults/members?vaultId=${vaultId}`, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })
        return response.data
    }

    public async removeMember(userId: string): Promise<void> {
        await this.api.delete(`/vaults/members?id=${userId}`, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })
    }

    public async updateMember(request: UpdateMemberRequest): Promise<void> {
        await this.api.put(`/vaults/members`, request, {
            headers: {
                Authorization: `Bearer ${VaultRepository.token}`
            }
        })
    }
}