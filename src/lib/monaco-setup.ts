import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { facetDarkTheme, facetLightTheme } from './monaco-themes'

// Worker 注册
self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') return new jsonWorker()
    return new editorWorker()
  },
}

// 自定义主题注册
monaco.editor.defineTheme('facet-dark', facetDarkTheme)
monaco.editor.defineTheme('facet-light', facetLightTheme)

// 让 @monaco-editor/react 使用本地 monaco（不走 CDN）
loader.config({ monaco })

export { monaco }
