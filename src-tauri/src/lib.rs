mod ai;
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
            tools::json_yaml::json_yaml,
            tools::json_to_ts::json_to_ts,
            tools::jsonpath::json_path,
            tools::json_escape::json_escape,
            tools::json_sort::json_sort,
            tools::uuid::uuid_generate,
            tools::jwt::jwt_decode,
            tools::case_convert::case_convert,
            tools::color::color_convert,
            tools::number_base::number_base,
            ai::ai_run,
            ai::ai_test,
            ai::ai_route,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
