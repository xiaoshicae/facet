use regex::Regex;
use std::fmt::Write as _;

/// 在 input 文本中用 pattern 进行匹配,返回可读的匹配报告。
#[tauri::command]
pub fn regex_test(input: String, pattern: String) -> Result<String, String> {
    if pattern.is_empty() {
        return Ok(String::new());
    }
    let re = Regex::new(&pattern).map_err(|e| format!("无效的正则表达式: {e}"))?;

    let matches: Vec<_> = re.captures_iter(&input).collect();
    if matches.is_empty() {
        return Ok("无匹配".to_string());
    }

    let mut out = String::new();
    let _ = writeln!(out, "共 {} 处匹配\n", matches.len());
    for (i, caps) in matches.iter().enumerate() {
        let whole = caps.get(0).unwrap();
        let _ = writeln!(
            out,
            "#{}  [{}-{}]  {:?}",
            i + 1,
            whole.start(),
            whole.end(),
            whole.as_str()
        );
        for (gi, group) in caps.iter().enumerate().skip(1) {
            if let Some(g) = group {
                let _ = writeln!(out, "    group[{}] = {:?}", gi, g.as_str());
            }
        }
    }
    Ok(out.trim_end().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_groups() {
        let out = regex_test("a1 b2".into(), r"(\w)(\d)".into()).unwrap();
        assert!(out.contains("共 2 处匹配"));
        assert!(out.contains("group[1]"));
    }

    #[test]
    fn no_match() {
        assert_eq!(regex_test("abc".into(), r"\d+".into()).unwrap(), "无匹配");
    }

    #[test]
    fn invalid_pattern() {
        assert!(regex_test("x".into(), "(".into()).is_err());
    }
}
