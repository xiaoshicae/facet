use serde_json::Value;

fn is_ident(key: &str) -> bool {
    !key.is_empty()
        && key
            .chars()
            .enumerate()
            .all(|(i, c)| c == '_' || c == '$' || c.is_ascii_alphabetic() || (i > 0 && c.is_ascii_digit()))
}

fn ts_type(v: &Value, indent: usize) -> String {
    match v {
        Value::Null => "null".to_string(),
        Value::Bool(_) => "boolean".to_string(),
        Value::Number(_) => "number".to_string(),
        Value::String(_) => "string".to_string(),
        Value::Array(arr) => match arr.first() {
            Some(first) => format!("{}[]", ts_type(first, indent)),
            None => "unknown[]".to_string(),
        },
        Value::Object(map) => {
            if map.is_empty() {
                return "Record<string, unknown>".to_string();
            }
            let pad = "  ".repeat(indent + 1);
            let close = "  ".repeat(indent);
            let mut body = String::from("{\n");
            for (k, val) in map {
                let key = if is_ident(k) {
                    k.clone()
                } else {
                    format!("'{}'", k.replace('\'', "\\'"))
                };
                body.push_str(&format!("{pad}{key}: {};\n", ts_type(val, indent + 1)));
            }
            body.push_str(&format!("{close}}}"));
            body
        }
    }
}

/// JSON → TypeScript 类型（根名 Root）
#[tauri::command]
pub fn json_to_ts(input: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    let value: Value =
        serde_json::from_str(input.trim()).map_err(|e| format!("无效的 JSON: {e}"))?;
    let body = ts_type(&value, 0);
    if matches!(value, Value::Object(_)) {
        Ok(format!("export interface Root {body}"))
    } else {
        Ok(format!("export type Root = {body};"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn object_to_interface() {
        let out = json_to_ts("{\"name\":\"a\",\"age\":1,\"tags\":[\"x\"]}".into()).unwrap();
        assert!(out.contains("export interface Root"));
        assert!(out.contains("name: string;"));
        assert!(out.contains("age: number;"));
        assert!(out.contains("tags: string[];"));
    }

    #[test]
    fn array_root() {
        let out = json_to_ts("[1,2]".into()).unwrap();
        assert!(out.contains("export type Root = number[];"));
    }

    #[test]
    fn quotes_invalid_ident() {
        let out = json_to_ts("{\"a-b\":1}".into()).unwrap();
        assert!(out.contains("'a-b': number;"));
    }
}
