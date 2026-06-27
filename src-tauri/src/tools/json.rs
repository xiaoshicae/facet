use serde_json::Value;

/// mode: "pretty" 美化 | "minify" 压缩 | "validate" 仅校验
#[tauri::command]
pub fn json_format(input: String, mode: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    let value: Value =
        serde_json::from_str(input.trim()).map_err(|e| format!("无效的 JSON: {e}"))?;
    match mode.as_str() {
        "minify" => serde_json::to_string(&value).map_err(|e| e.to_string()),
        "validate" => Ok("✓ JSON 合法".to_string()),
        _ => serde_json::to_string_pretty(&value).map_err(|e| e.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pretty_and_minify() {
        let pretty = json_format("{\"a\":1}".into(), "pretty".into()).unwrap();
        assert!(pretty.contains("\n"));
        let mini = json_format("{ \"a\" : 1 }".into(), "minify".into()).unwrap();
        assert_eq!(mini, "{\"a\":1}");
    }

    #[test]
    fn invalid() {
        assert!(json_format("{bad}".into(), "pretty".into()).is_err());
    }

    #[test]
    fn empty_ok() {
        assert_eq!(json_format("  ".into(), "pretty".into()).unwrap(), "");
    }
}
