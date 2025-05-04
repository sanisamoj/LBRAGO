use std::process::Command;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            generate_user_credentials,
            generate_user_credentials_with_param,
            regenerate_user_private_key,
            decrypt_vault_metadata,
            encrypt_vault_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
