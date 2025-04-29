import { usePreferencesState } from "@/store/usePreferencesState"
import { useEffect } from "react"

export default function ThemeWatcher() {
    const { isDarkTheme } = usePreferencesState()

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkTheme)
    }, [isDarkTheme])

    return null
}