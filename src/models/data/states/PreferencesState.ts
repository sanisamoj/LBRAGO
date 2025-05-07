export interface PreferencesState {
    isDarkTheme: boolean
    minimizeOnCopy: boolean
    clearClipboardTimeout: number
    savePassword: boolean

    setDarkTheme: (isDarkTheme: boolean) => Promise<void>
    setMinimizeOnCopy: (minimizeOnCopy: boolean) => Promise<void>
    setClearClipboardTimeout: (clearClipboardTimeout: number) => Promise<void>
    setSavePassword: (savePassword: boolean) => Promise<void>

    updatePreferencesStore: () => Promise<void>

    initPreferencesState: () => Promise<void>
    clearState: () => void
}
