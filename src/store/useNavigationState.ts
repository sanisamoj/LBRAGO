import { NavigationScreen } from '@/models/data/enums/NavigationScreen'
import { create } from 'zustand'
import { useLanguageState } from './useLanguageState'
import { screenTitleTranslationKeys } from '@/utils/screenTitleTranslationKeys'
import { CommonLanguage } from '@/models/data/interfaces/CommonLanguage'

interface NavigationState {
    history: NavigationScreen[]

    showSearchToggle: boolean // Mostra ícone de busca ou input?

    navigateTo: (screen: NavigationScreen) => void
    navigateBack: () => void
    navigateReplace: (screen: NavigationScreen) => void
    resetNavigation: (initialScreen: NavigationScreen) => void

    getCurrentScreen: () => NavigationScreen
    getCurrentScreenTitle: () => string

    canGoBack: () => boolean
}

export const useNavigationState = create<NavigationState>((set, get) => ({
    history: [NavigationScreen.APRESENTATION],

    showSearchToggle: false,

    navigateTo: (screen: NavigationScreen) => {
        const currentHistory: NavigationScreen[] = get().history
        if (currentHistory[currentHistory.length - 1] !== screen) {
            set({ history: [...currentHistory, screen] })
        }
    },

    navigateBack: () => {
        const currentHistory = get().history
        if (currentHistory.length > 1) {
            set({ history: currentHistory.slice(0, -1) }) // Remove o último item
        }
    },

    navigateReplace: (screen: NavigationScreen) => {
        set((state) => ({
            history: [...state.history.slice(0, -1), screen] // Remove o último e adiciona o novo
        }))
    },

    resetNavigation: (initialScreen: NavigationScreen) => {
        set({ history: [initialScreen] })
    },

    getCurrentScreen: () => {
        const currentHistory = get().history
        return currentHistory[currentHistory.length - 1]
    },

    getCurrentScreenTitle: () => {
        const currentScreen = get().getCurrentScreen()
        const { translations } = useLanguageState.getState()
        const titleKey: keyof CommonLanguage = screenTitleTranslationKeys[currentScreen]

        if (titleKey && translations[titleKey]) {
            return translations[titleKey];
        }

        return currentScreen.replace(/_/g, ' ').toLowerCase()
    },

    canGoBack: () => {
        return get().history.length > 1
    },

}))