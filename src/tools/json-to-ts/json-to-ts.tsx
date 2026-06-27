import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'

export default function JsonToTsTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string) {
    setInput(text)
    if (!text.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('json_to_ts', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  return (
    <ToolWorkbench
      title="JSON → TypeScript"
      language="json"
      outputLanguage="typescript"
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder='{ "id": 1, "name": "facet", "tags": ["a"] }'
      meta={error ? '' : input.trim() ? '✓ 已生成 Root 类型' : '粘贴 JSON 自动推导类型'}
    />
  )
}
