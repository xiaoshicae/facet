use serde_json::Value;
use serde_json_path::JsonPath;

/// 用 JSONPath 在 JSON 中查询，返回命中节点数组。
#[tauri::command]
pub fn json_path(input: String, path: String) -> Result<String, String> {
    if input.trim().is_empty() || path.trim().is_empty() {
        return Ok(String::new());
    }
    let value: Value =
        serde_json::from_str(input.trim()).map_err(|e| format!("无效的 JSON: {e}"))?;
    let jp = JsonPath::parse(path.trim()).map_err(|e| format!("无效的 JSONPath: {e}"))?;
    let nodes: Vec<&Value> = jp.query(&value).all();
    if nodes.is_empty() {
        return Ok("[]  // 无命中".to_string());
    }
    serde_json::to_string_pretty(&nodes).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    const DOC: &str = r#"{"store":{"books":[{"title":"A","price":10},{"title":"B","price":20}]}}"#;

    #[test]
    fn query_titles() {
        let out = json_path(DOC.into(), "$.store.books[*].title".into()).unwrap();
        assert!(out.contains("\"A\""));
        assert!(out.contains("\"B\""));
    }

    #[test]
    fn no_hit() {
        let out = json_path(DOC.into(), "$.store.missing".into()).unwrap();
        assert!(out.contains("无命中"));
    }

    #[test]
    fn invalid_path() {
        assert!(json_path(DOC.into(), "$[".into()).is_err());
    }
}
