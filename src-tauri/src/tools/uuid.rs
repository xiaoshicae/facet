/// 生成 count 个 UUID v4（每行一个）。
#[tauri::command]
pub fn uuid_generate(count: u32) -> String {
    let n = count.clamp(1, 1000);
    (0..n)
        .map(|_| uuid::Uuid::new_v4().to_string())
        .collect::<Vec<_>>()
        .join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generates_count() {
        let out = uuid_generate(5);
        assert_eq!(out.lines().count(), 5);
        for line in out.lines() {
            assert_eq!(line.len(), 36);
            assert_eq!(line.as_bytes()[14], b'4'); // v4 版本位
        }
    }

    #[test]
    fn clamps_zero() {
        assert_eq!(uuid_generate(0).lines().count(), 1);
    }
}
