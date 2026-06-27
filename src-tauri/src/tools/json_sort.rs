use serde_json::{Map, Value};

fn sort_value(v: Value, desc: bool) -> Value {
    match v {
        Value::Object(map) => {
            let mut entries: Vec<(String, Value)> =
                map.into_iter().map(|(k, val)| (k, sort_value(val, desc))).collect();
            entries.sort_by(|a, b| a.0.cmp(&b.0));
            if desc {
                entries.reverse();
            }
            Value::Object(entries.into_iter().collect::<Map<String, Value>>())
        }
        Value::Array(arr) => Value::Array(arr.into_iter().map(|x| sort_value(x, desc)).collect()),
        other => other,
    }
}

/// 递归按对象键排序并美化。order: "asc" | "desc"
#[tauri::command]
pub fn json_sort(input: String, order: String) -> Result<String, String> {
    if input.trim().is_empty() {
        return Ok(String::new());
    }
    let value: Value =
        serde_json::from_str(input.trim()).map_err(|e| format!("无效的 JSON: {e}"))?;
    let sorted = sort_value(value, order == "desc");
    serde_json::to_string_pretty(&sorted).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sorts_keys_asc() {
        let out = json_sort("{\"b\":1,\"a\":{\"d\":1,\"c\":2}}".into(), "asc".into()).unwrap();
        let a = out.find("\"a\"").unwrap();
        let b = out.find("\"b\"").unwrap();
        let c = out.find("\"c\"").unwrap();
        let d = out.find("\"d\"").unwrap();
        assert!(a < b);
        assert!(c < d);
    }

    #[test]
    fn sorts_keys_desc() {
        let out = json_sort("{\"a\":1,\"b\":2}".into(), "desc".into()).unwrap();
        assert!(out.find("\"b\"").unwrap() < out.find("\"a\"").unwrap());
    }
}
