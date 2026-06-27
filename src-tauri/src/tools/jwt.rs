use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use serde_json::Value;

fn decode_segment(seg: &str) -> Result<String, String> {
    let bytes = URL_SAFE_NO_PAD
        .decode(seg)
        .map_err(|e| format!("Base64URL 解码失败: {e}"))?;
    let value: Value =
        serde_json::from_slice(&bytes).map_err(|e| format!("段不是合法 JSON: {e}"))?;
    serde_json::to_string_pretty(&value).map_err(|e| e.to_string())
}

/// 解析 JWT（不验签），输出 header 与 payload。
#[tauri::command]
pub fn jwt_decode(input: String) -> Result<String, String> {
    let token = input.trim();
    if token.is_empty() {
        return Ok(String::new());
    }
    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() < 2 {
        return Err("不是有效的 JWT（缺少 . 分隔的段）".to_string());
    }
    let header = decode_segment(parts[0])?;
    let payload = decode_segment(parts[1])?;
    Ok(format!(
        "// Header\n{header}\n\n// Payload\n{payload}\n\n// 注意：本工具不校验签名"
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    // {"alg":"HS256","typ":"JWT"} . {"sub":"123","name":"x"} . sig
    const TOKEN: &str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoieCJ9.abc";

    #[test]
    fn decodes() {
        let out = jwt_decode(TOKEN.into()).unwrap();
        assert!(out.contains("\"alg\": \"HS256\""));
        assert!(out.contains("\"sub\": \"123\""));
    }

    #[test]
    fn rejects_garbage() {
        assert!(jwt_decode("notajwt".into()).is_err());
    }
}
