use std::process::Command;
use tauri::{Manager};
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

            // 2) Registra os atalhos
            app_handle.plugin(
                tauri_plugin_global_shortcut::Builder::new()
                    .with_shortcuts(["Ctrl+s", "Alt+Space"])?
                    .with_handler(move |app_handle, shortcut, event| {
                        if event.state == ShortcutState::Pressed
                            && (shortcut.matches(Modifiers::CONTROL, Code::KeyS)
                                || shortcut.matches(Modifiers::ALT, Code::Space))
                        {
                            // 3) Reabre e foca a janela escondida
                            if let Some(win) = app_handle.get_webview_window("main") {
                                let _ = win.show();
                                let _ = win.set_focus();
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
