export class Config {
    public static API_URL = "https://lembrago.sanisamojrepository.com/api"
    public static FAVICON_URL = `${Config.API_URL}/favicon.ico`
    public static VERSION = "0.10.3"

    static token: string

    public static setToken(token: string): void {
        this.token = token
    }

    public static clearToken(): void {
        this.token = ""
    }
}