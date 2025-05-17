import { Config } from "@/Config"
import axios, { AxiosInstance } from "axios"
import { ApplicationVersion } from "../data/interfaces/Version"

export class GlobalRepository {
    private static instance: GlobalRepository | null = null

    private api: AxiosInstance = axios.create({
        baseURL: Config.API_URL,
        timeout: 2500,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    private constructor() { }

    public static getInstance(): GlobalRepository {
        if (!GlobalRepository.instance) {
            GlobalRepository.instance = new GlobalRepository()
        }
        return GlobalRepository.instance
    }

    public async getLatestVersion(): Promise<ApplicationVersion> {
        const response = await this.api.get("/versions/latest")
        return response.data
    }
}