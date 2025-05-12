use enigo::{Enigo, Mouse, Settings, InputResult};
use tauri::WebviewWindow;
use tauri::PhysicalPosition;
use tauri::Position;
use std::process::Command;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, Modifiers, ShortcutState};

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
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();

            let handle_clone_for_handler = app_handle.clone();

            app_handle.plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_shortcuts(["Ctrl+w", "Alt+Space"])?
                    .with_handler(move |_app_handle_ignored, shortcut, event| {
                        if event.state == ShortcutState::Pressed
                            && (shortcut.matches(Modifiers::CONTROL, Code::KeyW)
                                || shortcut.matches(Modifiers::ALT, Code::Space))
                        {
                            if let Some(win) = handle_clone_for_handler.get_webview_window("main") {
                                match win.is_visible() {
                                    Ok(is_visible) => {
                                        if is_visible {
                                            if let Err(e) = win.hide() {
                                                 eprintln!("Erro ao esconder a janela: {}", e);
                                            }
                                        } else {
                                            match get_mouse_position_and_reposition_window(&win) {
                                                Ok(_) => {
                                                    if let Err(e) = win.show() {
                                                         eprintln!("Erro ao mostrar a janela: {}", e);
                                                    }
                                                    if let Err(e) = win.set_focus() {
                                                         eprintln!("Erro ao focar a janela: {}", e);
                                                    }
                                                }
                                                Err(e) => {
                                                    eprintln!("Erro ao reposicionar a janela: {}. Mostrando na posição anterior.", e);
                                                     if let Err(e) = win.show() {
                                                         eprintln!("Erro ao mostrar a janela (fallback): {}", e);
                                                    }
                                                    if let Err(e) = win.set_focus() {
                                                         eprintln!("Erro ao focar a janela (fallback): {}", e);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    Err(e) => {
                                        eprintln!("Erro ao verificar visibilidade da janela: {}", e);
                                    }
                                }
                            } else {
                                eprintln!("Janela 'main' não encontrada.");
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
            regenerate_svk_to_member
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_mouse_position_and_reposition_window(win: &WebviewWindow) -> Result<(), String> {
    let settings = Settings::default();
    let enigo = Enigo::new(&settings)
        .map_err(|e| format!("Falha ao inicializar Enigo: {:?}", e))?;

    let location_result: InputResult<(i32, i32)> = enigo.location();
    let (mouse_x, mouse_y) = location_result
        .map_err(|e| format!("Falha ao obter localização do mouse: {:?}", e))?;

    let new_pos = PhysicalPosition::new(mouse_x + 10, mouse_y + 10);

    win.set_position(Position::Physical(new_pos))
        .map_err(|e| format!("Falha ao definir a posição da janela: {}", e))?;

    Ok(())
}
