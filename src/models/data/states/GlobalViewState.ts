import { NavigationScreen } from "../enums/NavigationScreen"

export interface GlobalViewState {
    currentScreen: NavigationScreen
    navigateTo: (screen: NavigationScreen) => void
}
