//! 密钥安全存储:优先操作系统 keyring(macOS Keychain / Windows 凭据管理器 /
//! Linux Secret Service),不可用时(如无头环境)回落到 settings.json。
//! 前端只存 provider 的非敏感配置;apiKey 通过这里按 id 存取。

use tauri::AppHandle;

use crate::settings;

const SERVICE: &str = "com.facet.app";

fn entry(id: &str) -> Result<keyring::Entry, keyring::Error> {
    keyring::Entry::new(SERVICE, id)
}

fn fallback_key(id: &str) -> String {
    format!("aikey:{id}")
}

#[tauri::command]
pub fn secret_set(app: AppHandle, id: String, value: String) -> Result<(), String> {
    match entry(&id).and_then(|e| e.set_password(&value)) {
        Ok(()) => {
            // keyring 成功 → 清掉文件里可能残留的明文
            settings::file_remove(&app, &fallback_key(&id));
            Ok(())
        }
        Err(_) => settings::file_set(&app, &fallback_key(&id), &value),
    }
}

#[tauri::command]
pub fn secret_get(app: AppHandle, id: String) -> Option<String> {
    if let Ok(e) = entry(&id) {
        if let Ok(pw) = e.get_password() {
            return Some(pw);
        }
    }
    settings::file_get(&app, &fallback_key(&id))
}

#[tauri::command]
pub fn secret_delete(app: AppHandle, id: String) -> Result<(), String> {
    if let Ok(e) = entry(&id) {
        let _ = e.delete_credential();
    }
    settings::file_remove(&app, &fallback_key(&id));
    Ok(())
}
