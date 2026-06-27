use base64::{engine::general_purpose::STANDARD, Engine};

#[tauri::command]
pub fn base64_encode(input: String) -> String {
    STANDARD.encode(input)
}

#[tauri::command]
pub fn base64_decode(input: String) -> Result<String, String> {
    let bytes = STANDARD
        .decode(input.trim())
        .map_err(|e| format!("Base64 解码失败: {e}"))?;
    String::from_utf8(bytes).map_err(|e| format!("不是有效的 UTF-8 文本: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip() {
        let enc = base64_encode("hello 世界".into());
        assert_eq!(enc, "aGVsbG8g5LiW55WM");
        assert_eq!(base64_decode(enc).unwrap(), "hello 世界");
    }

    #[test]
    fn decode_invalid() {
        assert!(base64_decode("not*base64".into()).is_err());
    }
}
