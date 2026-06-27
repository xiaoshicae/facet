import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'

export default function CaseConvertTool() {
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
      setOutput(await invoke<string>('case_convert', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  return (
    <ToolWorkbench
      title="命名风格转换"
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder="输入任意命名，如 hello_world 或 getHTTPResponse…"
      meta={error ? '' : output ? '✓ 已生成 6 种命名风格' : '支持 snake / camel / kebab 等互转'}
    />
  )
}
