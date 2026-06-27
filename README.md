# Facet

跨平台(Windows / macOS / Linux)桌面**开发者工具箱**:JSON / XML / 正则 / 编码 / 哈希 / 时间戳 / 颜色 / 进制 等几十种小工具,玻璃态科技风,变换逻辑跑在 Rust 侧,**加工具不改核心代码**。内置可选的 **AI 副驾**(就地解释/修复)与 **AI 路由**(自然语言找工具并预填)。

> 视觉与工程模式继承参考项目 [`xiaoshicae/qai`](https://github.com/xiaoshicae/qai)。完整的初始构建路线见 [`PLAN.md`](./PLAN.md);本文件反映当前状态。

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Tauri 2 + React 19 + TypeScript + Vite |
| 样式 | Tailwind CSS 4(CSS-first `@theme`) |
| 状态 | Zustand |
| UI | shadcn 风格 `cn()`、`lucide-react`、`sonner`、Monaco、`cmdk` |
| 后端 | Rust:`serde_json` / `base64` / `quick-xml` / `regex` / `serde_yaml` / `serde_json_path` / `uuid` / `md-5` / `sha1` / `sha2` / `chrono` |
| AI | Rust `reqwest`(SSE 流式)调 Anthropic Messages API;`keyring` 存密钥 |

## 功能

**工具(18 个,均 Rust 实现,45 个单测)**

- **JSON**:格式化(美化/压缩/校验)、一键格式化、键排序、转义、JSONPath 查询、JSON⟷YAML、JSON→TypeScript
- **编码**:Base64、URL、JWT 解析
- **文本/其它**:XML 格式化、正则验证、哈希(MD5/SHA1/256/512)、时间戳转换、命名风格转换、颜色(HEX/RGB/HSL)、进制转换、UUID 生成

**AI(可选,配置 provider 后出现)**

- **工具内副驾**:工作台 ✨ 按钮,就地对当前输入/输出做 AI 操作(如修复 JSON、解读 JWT claims),流式输出,可一键写回输入。
- **AI 路由**:命令面板(⌘K)里描述需求 → 模型选中工具并提取输入 → 跳转并预填。
- **多 provider 可扩展**:已实现 Anthropic(默认 `claude-opus-4-8`);加新家 = Rust 加一个 `format` 分支 + 配置。

## 架构

```
            Vite import.meta.glob 自动扫描 tools/*/meta.ts
                              ▼
        中央 Registry(tools / toolMap / toolsByCategory)
        ┌──────────┬──────────┬──────────────┐
     侧边栏     命令面板    路由(ToolHost)   AI 工具目录(路由)
                              │
       组件 → invoke(rust_cmd) → Rust 纯函数变换 → 返回
```

**registry 是唯一事实源**:侧边栏、命令面板、路由、AI 路由目录全部从它派生。`useToolRun` 收口「输入→变换→输出/错误」状态机,`ToolWorkbench` 是所有工具复用的玻璃态双栏。Rust 侧每个工具 = 纯函数 + 薄 `#[tauri::command]`。

## 开发 / 构建

```bash
npm install
npm run tauri dev      # 桌面开发(需本机有桌面环境)
npm run build          # 前端 tsc + vite 构建
npm run test           # 前端 vitest
cd src-tauri && cargo test   # Rust 单测
```

> Linux 构建需系统库:`libwebkit2gtk-4.1-dev`、`libgtk-3-dev`、`libsoup-3.0-dev` 等。

## 扩展指南

**加一个工具**(核心零改动):

1. `src-tauri/src/tools/<id>.rs`:`#[tauri::command] pub fn <cmd>(input: String) -> Result<String, String>` + `#[cfg(test)]` 测试
2. `src-tauri/src/tools/mod.rs` 加 `pub mod <id>;`;`src-tauri/src/lib.rs` 的 `generate_handler!` 加一行
3. `src/tools/<id>/meta.ts`:导出 `ToolMeta`(`component: lazy(() => import('./<id>'))`)
4. `src/tools/<id>/<id>.tsx`:`useToolRun()` + `ToolWorkbench` + `invoke`

侧边栏 / 命令面板 / 路由 / AI 路由自动更新。

**给工具加 AI 动作**:在 `meta.ts` 加 `aiActions: [{ id, label, prompt: ({input, output}) => '…', writeBack? }]`。

**加一个 AI provider**:`src-tauri/src/ai/<format>.rs` 实现该线格式,在 `ai/mod.rs` 的 `match` 加一个分支;前端配置里 `format` 选它。

## 安全

- API Key 优先存入**操作系统 keyring**(macOS Keychain / Windows 凭据管理器 / Linux Secret Service);无头等不可用环境**回落到 `settings.json`**。`settings.json` 只存非敏感配置(name/baseUrl/model)。
- 所有工具变换均为**本地纯计算**,不联网、无副作用;只有主动触发 AI 时才把输入发往所配置的服务。

## License

MIT
