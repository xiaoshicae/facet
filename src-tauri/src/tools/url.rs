#[tauri::command]
pub fn url_encode(input: String) -> String {
    urlencoding::encode(&input).into_owned()
}

#[tauri::command]
pub fn url_decode(input: String) -> Result<String, String> {
    urlencoding::decode(&input)
        .map(|s| s.into_owned())
        .map_err(|e| format!("URL 解码失败: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip() {
        let enc = url_encode("a b&c=世界".into());
        assert_eq!(enc, "a%20b%26c%3D%E4%B8%96%E7%95%8C");
        assert_eq!(url_decode(enc).unwrap(), "a b&c=世界");
    }
}
