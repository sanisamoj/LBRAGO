import { defaultWindowIcon } from "@tauri-apps/api/app"
import { Image } from "@tauri-apps/api/image"
import { Menu, MenuItem } from "@tauri-apps/api/menu"
import { Window } from '@tauri-apps/api/window'
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray"

export async function InitIconTray() {
    const showMenuItem = await MenuItem.new({
        text: 'Mostrar Aplicativo',
        action: async () => {
            const appWindow = Window.getCurrent()
            await appWindow.show()
            await appWindow.setFocus()
        },
    })

    const quitMenuItem = await MenuItem.new({
        text: 'Sair',
        action: async () => {
            console.log("fui executado")
            const appWindow = Window.getCurrent()
            await appWindow.destroy()
        },
    })

    const trayMenu = await Menu.new({
        items: [showMenuItem, quitMenuItem],
    })

    const options: TrayIconOptions = {
        tooltip: "LemBraGO",
        icon: await defaultWindowIcon() as Image,
        showMenuOnLeftClick: true,
        menu: trayMenu
    }

    await TrayIcon.new(options)
}
