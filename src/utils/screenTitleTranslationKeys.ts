import { NavigationScreen } from '@/models/data/enums/NavigationScreen'
import { CommonLanguage } from '@/models/data/interfaces/CommonLanguage'

export const screenTitleTranslationKeys: Record<NavigationScreen, keyof CommonLanguage> = {
    [NavigationScreen.REGISTER_EMAIL]: "screenTitleRegisterEmail",
    [NavigationScreen.LOGIN_EMAIL]: "screenTitleLoginEmail",
    [NavigationScreen.LOGIN_ORGANIZATION]: "screenTitleLoginOrganization",
    [NavigationScreen.LOGIN_PASSWORD]: "screenTitleLoginPassword",
    [NavigationScreen.VAULTS]: "screenTitleVaults",
    [NavigationScreen.CREATE_VAULTS]: "screenTitleCreateVaults",
    [NavigationScreen.PASSWORDS]: "screenTitlePasswords",
    [NavigationScreen.CREATE_PASSWORDS]: "screenTitleCreatePasswords",
    [NavigationScreen.ENVIRONMENTS]: "screenTitleEnvironments",
    [NavigationScreen.CREATE_ENVIRONMENT]: "screenTitleCreateEnvironment",
    [NavigationScreen.ENVIRONMENT_DETAILS]: "screenTitleEnvironmentDetails",
    [NavigationScreen.SETTINGS]: "screenTitleSettings",
}