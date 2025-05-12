import { listen } from '@tauri-apps/api/event'
import { Window } from '@tauri-apps/api/window'

export async function setupShortcutListener() {
    await listen<string>("shortcut-event", async (_) => {
        const appWindow = Window.getCurrent()

        const isOpen: boolean = await appWindow.isVisible()
        console.log("isOpen", isOpen)
        if (isOpen) {
            await appWindow.hide()
        } else {
            await appWindow.show()
            await appWindow.setFocus()
        }

    })
}