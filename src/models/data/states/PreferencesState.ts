export interface PreferencesState {
    isDarkTheme: boolean
    minimizeOnCopy: boolean
    clearClipboardTimeout: number

    setDarkTheme: (isDarkTheme: boolean) => Promise<void>
    setMinimizeOnCopy: (minimizeOnCopy: boolean) => Promise<void>
    setClearClipboardTimeout: (clearClipboardTimeout: number) => Promise<void>

    updatePreferencesStore: () => Promise<void>
}
