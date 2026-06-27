import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { facetDarkTheme, facetLightTheme } from './monaco-themes'

// Worker 注册
self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') return new jsonWorker()
    if (label === 'typescript' || label === 'javascript') return new tsWorker()
    return new editorWorker()
  },
}

// 输出区是只读展示，关闭 TS/JS 诊断，避免红色波浪线。
// monaco 0.55 在类型层弃用了顶层 languages.typescript（运行时仍存在），故安全取用。
type TsDefaults = {
  setDiagnosticsOptions: (o: { noSemanticValidation: boolean; noSyntaxValidation: boolean }) => void
}
const tsLang = (monaco.languages as unknown as {
  typescript?: { typescriptDefaults: TsDefaults; javascriptDefaults: TsDefaults }
}).typescript
const noDiagnostics = { noSemanticValidation: true, noSyntaxValidation: true }
tsLang?.typescriptDefaults.setDiagnosticsOptions(noDiagnostics)
tsLang?.javascriptDefaults.setDiagnosticsOptions(noDiagnostics)

// 自定义主题注册
monaco.editor.defineTheme('facet-dark', facetDarkTheme)
monaco.editor.defineTheme('facet-light', facetLightTheme)

// 让 @monaco-editor/react 使用本地 monaco（不走 CDN）
loader.config({ monaco })

export { monaco }
