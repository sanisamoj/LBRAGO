use enigo::{Enigo, InputResult, Mouse, Settings};
use std::process::Command;
use tauri::Manager;
use tauri::PhysicalPosition;
use tauri::Position;
use tauri::WebviewWindow;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[tauri::command]
async fn generate_user_credentials(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--cn")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn generate_user_credentials_with_param(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--pv")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn regenerate_user_private_key(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--pk")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn decrypt_vault_metadata(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--dvm")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn encrypt_vault_metadata(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--evm")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn encrypt_password_metadata(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--epm")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn decrypt_password_metadata(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--dpm")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn regenerate_svk_to_member(arg: String) -> Result<String, String> {
    let output = Command::new("lembrago")
        .arg("--rsvk")
        .arg(arg)
        .output()
        .map_err(|e| format!("Failed to execute script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

     #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let _ = app.get_webview_window("main")
                       .expect("no main window")
                       .set_focus();
        }));
    }

    builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();

            app_handle.plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_shortcuts(["Alt+Space"])?
                    .with_handler(move |app_handle, shortcut, event| {
                        if event.state == ShortcutState::Pressed {
                            if let Some(win) = app_handle.get_webview_window("main") {
                                match win.is_visible() {
                                    Ok(true) => {
                                        let _ = win.hide();
                                    }
                                    Ok(false) => {
                                        let _ = get_mouse_position_and_reposition_window(&win);
                                        let _ = win.show();
                                        let _ = win.set_focus();
                                    }
                                    Err(e) => eprintln!("Erro ao verificar visibilidade: {}", e),
                                }
                            }
                        }
                    })
                    .build(),
            )?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            generate_user_credentials,
            generate_user_credentials_with_param,
            regenerate_user_private_key,
            decrypt_vault_metadata,
            encrypt_vault_metadata,
            encrypt_password_metadata,
            decrypt_password_metadata,
            regenerate_svk_to_member,
            update_shortcuts,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_mouse_position_and_reposition_window(win: &WebviewWindow) -> Result<(), String> {
    let settings = Settings::default();
    let enigo =
        Enigo::new(&settings).map_err(|e| format!("Falha ao inicializar Enigo: {:?}", e))?;

    let location_result: InputResult<(i32, i32)> = enigo.location();
    let (mouse_x, mouse_y) =
        location_result.map_err(|e| format!("Falha ao obter localização do mouse: {:?}", e))?;

    let new_pos = PhysicalPosition::new(mouse_x + 10, mouse_y + 10);

    win.set_position(Position::Physical(new_pos))
        .map_err(|e| format!("Falha ao definir a posição da janela: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn update_shortcuts(app: tauri::AppHandle, shortcuts: Vec<String>) -> Result<(), String> {
    let plugin = app.global_shortcut();

    // Remove todos os atalhos anteriores
    plugin
        .unregister_all()
        .map_err(|e| format!("Falha ao remover atalhos antigos: {}", e))?;

    // Registra todos os novos atalhos
    for shortcut_str in shortcuts {
        let shortcut = shortcut_str
            .parse::<Shortcut>()
            .map_err(|e| format!("Atalho inválido '{}': {:?}", shortcut_str, e))?;

        plugin
            .register(shortcut)
            .map_err(|e| format!("Erro ao registrar atalho '{}': {}", shortcut_str, e))?;
    }

    Ok(())
}
