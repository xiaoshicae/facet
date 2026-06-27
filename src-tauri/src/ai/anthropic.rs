//! Anthropic Messages API 适配(/v1/messages,SSE 流式)。
//! Rust 无官方 SDK,按 REST 线格式手写;默认模型由前端传入(claude-opus-4-8)。

use futures_util::StreamExt;
use serde_json::{json, Value};
use tauri::{AppHandle, Emitter};

use super::AiRequest;

fn endpoint(base_url: &str) -> String {
    format!("{}/v1/messages", base_url.trim_end_matches('/'))
}

fn friendly_error(status: u16, body: &str) -> String {
    match status {
        401 => "API Key 无效或缺失".to_string(),
        403 => "无权限(检查 Key 或额度)".to_string(),
        404 => "接口或模型 ID 不存在".to_string(),
        429 => "请求过于频繁,请稍后再试".to_string(),
        500..=599 => "服务暂时不可用,请稍后再试".to_string(),
        _ => format!("请求失败({status}): {body}"),
    }
}

fn build_body(req: &AiRequest, stream: bool, max_tokens: u32) -> Value {
    let mut body = json!({
        "model": req.model,
        "max_tokens": max_tokens,
        "messages": [{ "role": "user", "content": req.prompt }],
        "stream": stream,
    });
    if let Some(sys) = &req.system {
        if !sys.is_empty() {
            body["system"] = json!(sys);
        }
    }
    body
}

async fn send(req: &AiRequest, body: &Value) -> Result<reqwest::Response, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|e| e.to_string())?;
    client
        .post(endpoint(&req.base_url))
        .header("x-api-key", &req.api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(body)
        .send()
        .await
        .map_err(|e| format!("连接失败,请检查网络/代理: {e}"))
}

/// 轻量校验:发一个 max_tokens=16 的非流式请求,只看是否鉴权成功。
pub async fn test(req: AiRequest) -> Result<String, String> {
    let resp = send(&req, &build_body(&req, false, 16)).await?;
    let status = resp.status();
    if !status.is_success() {
        let text = resp.text().await.unwrap_or_default();
        return Err(friendly_error(status.as_u16(), &text));
    }
    Ok(format!("连接成功 · {}", req.model))
}

/// 流式:解析 SSE,把 content_block_delta 的文本增量按事件发给前端。
pub async fn stream(app: AppHandle, req: AiRequest) -> Result<(), String> {
    let id = req.request_id.clone();
    let fail = |app: &AppHandle, msg: String| -> Result<(), String> {
        let _ = app.emit(&format!("ai-error-{id}"), msg.clone());
        Err(msg)
    };

    let resp = match send(&req, &build_body(&req, true, 4096)).await {
        Ok(r) => r,
        Err(e) => return fail(&app, e),
    };
    let status = resp.status();
    if !status.is_success() {
        let text = resp.text().await.unwrap_or_default();
        return fail(&app, friendly_error(status.as_u16(), &text));
    }

    let mut stream = resp.bytes_stream();
    let mut buf = String::new();
    while let Some(chunk) = stream.next().await {
        let bytes = match chunk {
            Ok(b) => b,
            Err(e) => return fail(&app, format!("流中断: {e}")),
        };
        buf.push_str(&String::from_utf8_lossy(&bytes));

        // SSE 以空行分隔事件块
        while let Some(pos) = buf.find("\n\n") {
            let raw: String = buf[..pos].to_string();
            buf.drain(..pos + 2);
            for line in raw.lines() {
                let Some(data) = line.trim().strip_prefix("data:") else {
                    continue;
                };
                let data = data.trim();
                if data.is_empty() || data == "[DONE]" {
                    continue;
                }
                let Ok(v) = serde_json::from_str::<Value>(data) else {
                    continue;
                };
                match v.get("type").and_then(|x| x.as_str()).unwrap_or("") {
                    "content_block_delta" => {
                        if let Some(text) = v
                            .get("delta")
                            .and_then(|d| d.get("text"))
                            .and_then(|x| x.as_str())
                        {
                            let _ = app.emit(&format!("ai-chunk-{id}"), text.to_string());
                        }
                    }
                    "error" => {
                        let msg = v
                            .get("error")
                            .and_then(|e| e.get("message"))
                            .and_then(|x| x.as_str())
                            .unwrap_or("未知错误")
                            .to_string();
                        return fail(&app, msg);
                    }
                    _ => {}
                }
            }
        }
    }

    let _ = app.emit(&format!("ai-done-{id}"), ());
    Ok(())
}
