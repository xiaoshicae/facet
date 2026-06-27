# Facet 构建计划

> 📌 这是项目的**原始构建路线图**(初始落地用)。项目当前状态(含后续新增的 11 个工具与 AI 功能)以 [`README.md`](./README.md) 为准。



> 跨平台桌面开发者工具箱。视觉与工程模式继承参考项目 **qai**(`xiaoshicae/qai`,Tauri 2 + React 19),核心目标:**界面优雅、性能强(变换跑在 Rust 侧)、可无限扩展(加工具不改核心代码)**。

本文件是落地路线图。配套规格见对话中的《Facet — 构建规格》。

---

## 0. 环境与前置结论

| 项 | 状态 |
|---|---|
| 工具链 | Node 22 / npm 10 / cargo & rustc 1.94 ✅ |
| Tauri Linux 系统库(webkit2gtk-4.1 / gtk-3 / libsoup-3) | 已安装 ✅(本环境可 `cargo check`/构建) |
| 参考项目 qai | 公开仓库,已克隆参考文件到 `/home/user/qai-ref` ✅ |
| GitHub 写权限 | 仅限 `xiaoshicae/facet` |
| 开发分支 | `claude/complete-plan-6yye5q` |

**与规格的两处务实偏差(已确认):**

1. **依赖版本**:不盲目追最新,直接采用 qai 已验证的版本基线(React 19.1 / Tailwind 4.1 / @tauri-apps/api 2.10 等),新增 `cmdk`。`lucide-react` 保持 `0.511`(规格第 8 节自己也标注 v1 跨大版本有图标重命名风险)。"升级到各自最新" 列为后续独立任务,避免一开始就让构建不稳。
2. **设置持久化**:不引入 `rusqlite`。`save_setting` / `get_setting_cmd` 用 app config 目录下的 `settings.json`(纯 `std::fs` + `serde_json`)实现,满足主题持久化即可,零额外依赖。

---

## 1. 架构(支点)

```
每个工具 = 自包含模块:meta.ts(元数据) + Rust command(变换) + React 组件(UI)
                              │
            Vite import.meta.glob 自动扫描 tools/*/meta.ts
                              ▼
                    中央 Registry(tools / toolMap / toolsByCategory)
                  ┌───────────┼───────────┐
              侧边栏        命令面板         路由(ToolHost)
                              │
              组件 → invoke(rust_cmd) → Rust 变换 → 返回
```

**加一个新工具 = 新增 `tools/<id>/meta.ts` + 组件 + `src-tauri/src/tools/<id>.rs` + 在 `generate_handler!` 加一行。** 侧边栏 / 命令面板 / 路由全部自动更新,核心代码零改动。

---

## 2. 目录结构(目标)

```
facet/
├── PLAN.md
├── package.json / vite.config.ts / tsconfig.json / eslint.config.js / index.html
├── src-tauri/
│   ├── Cargo.toml / build.rs / tauri.conf.json
│   ├── capabilities/default.json
│   ├── icons/                      # 由 `tauri icon` 生成
│   └── src/
│       ├── main.rs / lib.rs        # Builder + generate_handler! 注册全部 command
│       ├── settings.rs             # save_setting / get_setting_cmd(JSON 文件)
│       └── tools/
│           ├── mod.rs
│           └── {base64,json,xml,regex,url,hash,timestamp}.rs
└── src/
    ├── main.tsx / App.tsx / index.css(移植 qai,删 method/variable 色)
    ├── lib/{utils.ts, monaco-setup.ts, monaco-themes.ts}
    ├── registry/{types.ts, index.ts}        ★ 契约 + 自动注册
    ├── stores/{theme-store.ts, tool-store.ts}
    ├── hooks/{use-global-shortcuts.ts, use-resizable.ts}
    ├── components/
    │   ├── ui/{button,card,tabs,input,select,code-editor}.tsx   # 移植 qai
    │   ├── layout/{app-layout,sidebar,title-bar}.tsx
    │   ├── command-palette.tsx               ★ 新增(cmdk)
    │   └── tool-workbench.tsx                 ★ signature 玻璃态双栏
    ├── views/{home,tool-host,settings}.tsx
    └── tools/<id>/{meta.ts, <id>.tsx}
```

★ = 新写的核心文件;`ui/*`、`index.css`、`theme-store`、monaco 封装等移植自 qai。

---

## 3. 工具清单(首批 7 个,覆盖全部分类与变换形态)

| id | 名称 | 分类 | Rust command | crate |
|---|---|---|---|---|
| `base64` | Base64 编解码 | 编码 | `base64_encode` / `base64_decode` | base64 |
| `url-encode` | URL 编解码 | 编码 | `url_encode` / `url_decode` | urlencoding |
| `json-format` | JSON 格式化 | JSON | `json_format`(美化/压缩/校验) | serde_json |
| `xml-format` | XML 格式化 | XML | `xml_format` | quick-xml |
| `regex-test` | 正则验证 | 正则 | `regex_test`(匹配/分组/全局) | regex |
| `hash` | 哈希计算 | 哈希 | `hash_text`(md5/sha1/sha256/sha512) | md-5 / sha1 / sha2 / hex |
| `timestamp` | 时间戳转换 | 时间 | `timestamp_convert` | chrono |

全部变换逻辑下沉 Rust;前端只做 `invoke` + 玻璃态 UI。每个 Rust 模块附 `#[cfg(test)]` 单元测试(纯函数,便于在无 GUI 环境验证)。

---

## 4. 实施阶段与验收

### 阶段 A — 计划(本文件)✅
产出 PLAN.md 并提交。

### 阶段 B — 骨架与配置
- `package.json`(qai 基线 + cmdk)、`vite.config.ts`、`tsconfig.json`、`eslint.config.js`、`index.html`(`<title>Facet</title>`,`<html class="dark">`)。
- `src-tauri/`:`Cargo.toml`(name=facet, lib=facet_lib)、`build.rs`、`tauri.conf.json`(productName=Facet, identifier=com.facet.app)、`capabilities/default.json`。
- **验收**:`npm install` 成功;目录结构成型。

### 阶段 C — 设计系统与 ui 组件(移植 qai)
- 复制 `index.css`,**删除 `--color-method-*` 与 `--color-variable*`** 及其深色覆盖与相关高亮规则,其余保留(OKLCH 配色、glass-card、btn-gradient、glow-ring、divider-glow、滚动条、select 箭头)。
- 移植 `lib/utils.ts`(`cn` + `isShortcutTarget`,monaco host 属性改 `data-facet-monaco-host`)、`monaco-setup.ts` / `monaco-themes.ts`(主题改名 `facet-dark`/`facet-light`)、`theme-store.ts`。
- 移植 `ui/`:`button`、`card`、`tabs`、`input`、`select`、`code-editor`。
- **验收**:`npm run build`(`tsc -b && vite build`)通过;空壳能渲染。

### 阶段 D — 可扩展核心
- `registry/types.ts`(`ToolMeta` 契约)、`registry/index.ts`(`import.meta.glob` 自动注册 + `toolMap` + `toolsByCategory`)。
- `tool-store.ts`(命令面板开关 + 收藏)、`use-resizable.ts`(从 qai app-layout 提取)、`use-global-shortcuts.ts`(Cmd/Ctrl+K 唤起命令面板,`isShortcutTarget` 排除输入框/Monaco)。
- `tool-workbench.tsx`(玻璃态双栏 + 状态条 + 复制)、`command-palette.tsx`(cmdk)、`title-bar.tsx`、`app-layout.tsx`、`sidebar.tsx`(按 `toolsByCategory` 分组,当前项 `glow-ring`)。
- `views/`:`home`(工具网格)、`tool-host`(按 `:id` 从 `toolMap` 取 + `<Suspense>` 懒加载)、`settings`(主题切换)。
- `App.tsx` 路由 `/`、`/tool/:id`、`/settings`。
- **验收**:`vite build` 通过;路由/侧边栏/命令面板读 registry。

### 阶段 E — Rust 后端 + 工具模块
- `settings.rs`、`tools/mod.rs` 及 7 个工具 `.rs`,`lib.rs` 的 `generate_handler!` 注册全部。
- 前端 7 个 `tools/<id>/{meta.ts,<id>.tsx}`,先打通 Base64 全链,再按同一模式批量补齐。
- **验收**:`cargo test`(纯变换函数)通过;`cargo check` 通过;`vite build` 通过。

### 阶段 F — 图标、验证、提交
- 生成 Facet 图标集(`tauri icon`)。
- 全量验证:`npm install` / `npm run build` / `cargo check`(+ 条件允许时 `cargo build`)/ `cargo test`。
- 提交并推送到 `claude/complete-plan-6yye5q`。

---

## 5. 关键契约(冻结)

```ts
// registry/types.ts
export interface ToolMeta {
  id: string
  name: string
  category: string          // '编码' | 'JSON' | 'XML' | '正则' | '哈希' | '时间'
  icon: LucideIcon
  keywords: string[]
  component: ComponentType
  detectClipboard?: (text: string) => boolean
}
```

`ToolWorkbench` props:`title, toolbar?, input, output, error?, meta?, onInputChange, language?`。
Rust command 签名约定:输入 `input: String`(+ 可选 `mode`/`algo` 等),返回 `Result<String, String>`,错误即 toast/状态条红字。

---

## 6. 风险与对策

| 风险 | 对策 |
|---|---|
| lucide-react v1 图标重命名 | 锁 `0.511`(qai 同款),升级单列后续任务 |
| Monaco worker 在 Tauri CSP 下被拦 | 沿用 qai 的 `worker-src 'self' blob:` CSP 与 `monaco-setup` worker 注册 |
| 无图标导致 bundle 失败 | 阶段 F 用 `tauri icon` 生成完整图标集 |
| 本环境跑不了 GUI | 以 `cargo check`/`cargo test`/`vite build` 作为可验证底线;GUI 冒烟在有桌面的机器上做 |
| qai 像素级差异 | 直接移植 qai 源文件,差异仅来自删 method/variable 色(本项目用不到) |

---

## 7. 扩展指南(交付后加新工具)

1. `src-tauri/src/tools/<id>.rs`:写 `#[tauri::command] pub fn <cmd>(input: String) -> Result<String,String>` + 测试。
2. `src-tauri/src/lib.rs`:`generate_handler!` 增一行;`tools/mod.rs` 增 `pub mod <id>;`。
3. `src/tools/<id>/meta.ts`:导出 `ToolMeta`(`component: lazy(() => import('./<id>'))`)。
4. `src/tools/<id>/<id>.tsx`:用 `ToolWorkbench` + `invoke`。

完成。无需触碰 registry / 侧边栏 / 命令面板 / 路由。
