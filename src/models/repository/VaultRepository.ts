import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { EVaultWithMemberInfo } from "../data/interfaces/EVaultWithMemberInfo"
import { CreateVaultRequest } from "../data/interfaces/CreateVaultRequest"
import { EVaultResponse } from "../data/interfaces/EVaultResponse"

export class VaultRepository {
    private static instance: VaultRepository | null = null
    private static token: string

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 4000,
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
}