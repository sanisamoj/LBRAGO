import { ArrowLeft, Minimize2, Moon, Settings, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigationState } from "@/store/useNavigationState"
import { Window } from '@tauri-apps/api/window'
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { usePreferencesState } from "@/store/usePreferencesState"

export default function HeaderNavigation() {
    const { isDarkTheme, setDarkTheme } = usePreferencesState()
    const { canGoBack, navigateBack, getCurrentScreenTitle, getCurrentScreen, navigateTo } = useNavigationState()

    const themeTogglePermission: boolean = [
        NavigationScreen.SETTINGS
    ].includes(getCurrentScreen())

    const settingsButtonPermission: boolean = [
        NavigationScreen.VAULTS, NavigationScreen.PASSWORDS,
        NavigationScreen.CREATE_VAULTS, NavigationScreen.PASSWORDS,
        NavigationScreen.CREATE_PASSWORDS
    ].includes(getCurrentScreen())

    const LeftContent = () => (
        <div className="flex items-center flex-1 min-w-0 mr-2" data-tauri-drag-region="no-drag">
            {canGoBack() && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateBack}
                    className="mr-1 h-7 w-7 p-0"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}
            <h2 className="text-base font-bold truncate">{getCurrentScreenTitle()}</h2>
        </div>
    )

    const RightButtons = () => (
        <div className="flex items-center gap-1 ml-auto" data-tauri-drag-region="no-drag">
            {!themeTogglePermission && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDarkTheme(!isDarkTheme) }}
                    className="h-7 w-7 p-0"
                    title="Alternar tema"
                >
                    {isDarkTheme ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            )}
            {settingsButtonPermission && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo(NavigationScreen.SETTINGS)}
                    className="h-7 w-7 p-0"
                    title="Configurações"
                >
                    <Settings className="h-4 w-4" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    const currentWindow = Window.getCurrent()
                    currentWindow.minimize()
                }}
                className="h-7 w-7 p-0"
                title="Minimizar"
            >
                <Minimize2 className="h-4 w-4" />
            </Button>
        </div>
    )

    return (
        <div
            className="py-2 px-3 border-t border-b border-border flex items-center justify-between gap-2"
            data-tauri-drag-region
        >
            <LeftContent />
            <RightButtons />
        </div>
    )
}

