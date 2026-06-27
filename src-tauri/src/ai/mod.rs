//! AI 副驾后端:多 provider 可扩展。
//! 每个 provider 用 `format` 区分线格式;目前实现 "anthropic" 一种,
//! 加新家 = 新增一个模块 + 在下面 match 里加一行。

mod anthropic;

use serde::Deserialize;
use tauri::AppHandle;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiRequest {
    /// 前端生成的请求 id,用于路由流式事件(ai-chunk-{id} 等)
    pub request_id: String,
    /// provider 线格式,如 "anthropic"
    pub format: String,
    pub base_url: String,
    pub model: String,
    pub api_key: String,
    #[serde(default)]
    pub system: Option<String>,
    pub prompt: String,
}

/// 流式对话:按 request_id 发出 `ai-chunk-{id}`(增量文本)、
/// `ai-done-{id}`(完成)、`ai-error-{id}`(错误)事件。
#[tauri::command]
pub async fn ai_run(app: AppHandle, req: AiRequest) -> Result<(), String> {
    match req.format.as_str() {
        "anthropic" => anthropic::stream(app, req).await,
        other => Err(format!("暂不支持的 provider 类型: {other}")),
    }
}

/// 校验 provider 配置(轻量非流式请求)。
#[tauri::command]
pub async fn ai_test(req: AiRequest) -> Result<String, String> {
    match req.format.as_str() {
        "anthropic" => anthropic::test(req).await,
        other => Err(format!("暂不支持的 provider 类型: {other}")),
    }
}
