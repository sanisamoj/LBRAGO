import { listen } from '@tauri-apps/api/event'
import { Window } from '@tauri-apps/api/window'

export async function setupShortcutListener() {
    await listen<string>("shortcut-event", async (_) => {
        const appWindow = Window.getCurrent()
        await appWindow.show()
        await appWindow.setFocus()
    })
}