use serde_json::Value;

/// direction: "j2y" JSON→YAML | "y2j" YAML→JSON
#[tauri::command]
pub fn json_yaml(input: String, direction: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    match direction.as_str() {
        "y2j" => {
            let value: Value =
                serde_yaml::from_str(&input).map_err(|e| format!("无效的 YAML: {e}"))?;
            serde_json::to_string_pretty(&value).map_err(|e| e.to_string())
        }
        _ => {
            let value: Value =
                serde_json::from_str(input.trim()).map_err(|e| format!("无效的 JSON: {e}"))?;
            serde_yaml::to_string(&value).map_err(|e| e.to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn json_to_yaml() {
        let out = json_yaml("{\"a\":1,\"b\":[2,3]}".into(), "j2y".into()).unwrap();
        assert!(out.contains("a: 1"));
        assert!(out.contains("- 2"));
    }

    #[test]
    fn yaml_to_json() {
        let out = json_yaml("a: 1\nb: 2\n".into(), "y2j".into()).unwrap();
        assert!(out.contains("\"a\": 1"));
    }

    #[test]
    fn invalid_json() {
        assert!(json_yaml("{bad}".into(), "j2y".into()).is_err());
    }
}
