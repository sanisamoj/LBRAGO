export class Config {
    public static API_URL = "http://localhost:7888" //"http://217.196.60.110:7888"
    public static FAVICON_URL = `${Config.API_URL}/favicon.ico`

    static token: string

    public static setToken(token: string): void {
        this.token = token
    }

    public static clearToken(): void {
        this.token = ""
    }
}