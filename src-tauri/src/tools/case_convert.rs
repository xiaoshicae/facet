/// 把任意命名拆成单词（按分隔符、camelCase 边界、以及 acronym→Word 边界）。
fn words(input: &str) -> Vec<String> {
    let chars: Vec<char> = input.chars().collect();
    let mut result = Vec::new();
    let mut cur = String::new();
    for i in 0..chars.len() {
        let c = chars[i];
        if !c.is_alphanumeric() {
            if !cur.is_empty() {
                result.push(std::mem::take(&mut cur));
            }
            continue;
        }
        if c.is_uppercase() && !cur.is_empty() {
            let prev = chars[i - 1];
            let prev_lower = prev.is_lowercase() || prev.is_ascii_digit();
            let next_lower = i + 1 < chars.len() && chars[i + 1].is_lowercase();
            // 小写/数字后接大写（camel 边界），或 大写串后接「大写+小写」（acronym 收尾）
            if prev_lower || (prev.is_uppercase() && next_lower) {
                result.push(std::mem::take(&mut cur));
            }
        }
        cur.push(c);
    }
    if !cur.is_empty() {
        result.push(cur);
    }
    result.iter().map(|w| w.to_lowercase()).collect()
}

fn capitalize(w: &str) -> String {
    let mut chars = w.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

/// 输出常见命名风格。
#[tauri::command]
pub fn case_convert(input: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    let w = words(&input);
    if w.is_empty() {
        return Err("没有可识别的单词".to_string());
    }
    let camel = {
        let mut s = w[0].clone();
        for word in &w[1..] {
            s.push_str(&capitalize(word));
        }
        s
    };
    let pascal: String = w.iter().map(|x| capitalize(x)).collect();
    let snake = w.join("_");
    let kebab = w.join("-");
    let constant = snake.to_uppercase();
    let title = w.iter().map(|x| capitalize(x)).collect::<Vec<_>>().join(" ");

    Ok(format!(
        "camelCase     {camel}\nPascalCase    {pascal}\nsnake_case    {snake}\nkebab-case    {kebab}\nCONSTANT_CASE {constant}\nTitle Case    {title}"
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn from_snake() {
        let out = case_convert("hello_world_x".into()).unwrap();
        assert!(out.contains("camelCase     helloWorldX"));
        assert!(out.contains("PascalCase    HelloWorldX"));
        assert!(out.contains("kebab-case    hello-world-x"));
        assert!(out.contains("CONSTANT_CASE HELLO_WORLD_X"));
    }

    #[test]
    fn from_camel() {
        let out = case_convert("getHTTPResponse".into()).unwrap();
        assert!(out.contains("snake_case    get_http_response"));
        assert!(out.contains("PascalCase    GetHttpResponse"));
    }
}
