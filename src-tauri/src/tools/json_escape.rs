/// mode: "escape" 文本→JSON 字符串字面量（去掉外层引号）| "unescape" 反向
#[tauri::command]
pub fn json_escape(input: String, mode: String) -> Result<String, String> {
    if input.is_empty() {
        return Ok(String::new());
    }
    match mode.as_str() {
        "unescape" => {
            let wrapped = format!("\"{input}\"");
            let s: String =
                serde_json::from_str(&wrapped).map_err(|e| format!("无效的转义字符串: {e}"))?;
            Ok(s)
        }
        _ => {
            let encoded = serde_json::to_string(&input).map_err(|e| e.to_string())?;
            // 去掉 serde 加上的外层引号
            Ok(encoded[1..encoded.len() - 1].to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escape_roundtrip() {
        let esc = json_escape("a\"b\n\tc".into(), "escape".into()).unwrap();
        assert_eq!(esc, "a\\\"b\\n\\tc");
        let unesc = json_escape(esc, "unescape".into()).unwrap();
        assert_eq!(unesc, "a\"b\n\tc");
    }

    #[test]
    fn unescape_invalid() {
        assert!(json_escape("a\\xb".into(), "unescape".into()).is_err());
    }
}
