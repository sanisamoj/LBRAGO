import { Config } from "@/Config";

export const getIconUrl = (domain: string) => `${Config.API_URL}/media/${domain}`