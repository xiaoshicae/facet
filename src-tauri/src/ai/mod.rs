//! AI 副驾后端:多 provider 可扩展。
//! 每个 provider 用 `format` 区分线格式;目前实现 "anthropic" 一种,
//! 加新家 = 新增一个模块 + 在下面 match 里加一行。

mod anthropic;

use serde::{Deserialize, Serialize};
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

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiRouteRequest {
    pub format: String,
    pub base_url: String,
    pub model: String,
    pub api_key: String,
    /// 用户的自然语言需求
    pub query: String,
    /// 前端按 registry 生成的 Anthropic tools 数组
    pub tools: serde_json::Value,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RouteResult {
    /// 选中的工具 id(= tool name)
    pub tool: Option<String>,
    /// 提取出的、要预填进该工具的输入
    pub input: Option<String>,
    /// 模型未选工具时的说明文字
    pub text: Option<String>,
}

/// 工具路由:自然语言 → 选中一个工具 + 提取 input(不执行,前端跳转预填)。
#[tauri::command]
pub async fn ai_route(req: AiRouteRequest) -> Result<RouteResult, String> {
    match req.format.as_str() {
        "anthropic" => anthropic::route(req).await,
        other => Err(format!("暂不支持的 provider 类型: {other}")),
    }
}
