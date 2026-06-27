/// from_base: "2" | "8" | "10" | "16"，把输入数解析后输出四种进制。
#[tauri::command]
pub fn number_base(input: String, from_base: String) -> Result<String, String> {
    let s = input.trim().trim_start_matches("0x").trim_start_matches("0b");
    if s.is_empty() {
        return Ok(String::new());
    }
    let radix: u32 = from_base.parse().map_err(|_| "无效的来源进制".to_string())?;
    let n = i128::from_str_radix(s, radix)
        .map_err(|e| format!("按 {radix} 进制解析失败: {e}"))?;
    // 负数用「符号 + 绝对值」展示，避免 128 位补码串
    let sign = if n < 0 { "-" } else { "" };
    let mag = n.unsigned_abs();
    Ok(format!(
        "BIN (2)   {sign}{mag:b}\nOCT (8)   {sign}{mag:o}\nDEC (10)  {n}\nHEX (16)  {sign}{mag:x}",
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dec_input() {
        let out = number_base("255".into(), "10".into()).unwrap();
        assert!(out.contains("BIN (2)   11111111"));
        assert!(out.contains("HEX (16)  ff"));
    }

    #[test]
    fn hex_input() {
        let out = number_base("ff".into(), "16".into()).unwrap();
        assert!(out.contains("DEC (10)  255"));
    }

    #[test]
    fn negative() {
        let out = number_base("-10".into(), "10".into()).unwrap();
        assert!(out.contains("DEC (10)  -10"));
        assert!(out.contains("BIN (2)   -1010"));
        assert!(out.contains("HEX (16)  -a"));
    }

    #[test]
    fn invalid() {
        assert!(number_base("xyz".into(), "10".into()).is_err());
    }
}
