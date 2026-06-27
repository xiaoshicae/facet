mod settings;
mod tools;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            settings::save_setting,
            settings::get_setting_cmd,
            tools::base64::base64_encode,
            tools::base64::base64_decode,
            tools::url::url_encode,
            tools::url::url_decode,
            tools::json::json_format,
            tools::xml::xml_format,
            tools::regex::regex_test,
            tools::hash::hash_text,
            tools::timestamp::timestamp_convert,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
