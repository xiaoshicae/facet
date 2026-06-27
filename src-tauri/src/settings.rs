//! 轻量设置持久化:app config 目录下的 settings.json(无数据库依赖)。
//! 复用 qai 的前端契约 save_setting / get_setting_cmd。

use std::fs;
use std::path::PathBuf;

use serde_json::{Map, Value};
use tauri::{AppHandle, Manager};

fn settings_file(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("settings.json"))
}

fn read_all(app: &AppHandle) -> Map<String, Value> {
    let Ok(path) = settings_file(app) else {
        return Map::new();
    };
    let Ok(text) = fs::read_to_string(path) else {
        return Map::new();
    };
    serde_json::from_str::<Map<String, Value>>(&text).unwrap_or_default()
}

#[tauri::command]
pub fn save_setting(app: AppHandle, key: String, value: String) -> Result<(), String> {
    let mut all = read_all(&app);
    all.insert(key, Value::String(value));
    let path = settings_file(&app)?;
    let text = serde_json::to_string_pretty(&all).map_err(|e| e.to_string())?;
    fs::write(path, text).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_setting_cmd(app: AppHandle, key: String) -> Option<String> {
    read_all(&app)
        .get(&key)
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
}
