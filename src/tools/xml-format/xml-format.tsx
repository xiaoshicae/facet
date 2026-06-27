import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'

export default function XmlFormatTool() {
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
      setOutput(await invoke<string>('xml_format', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  return (
    <ToolWorkbench
      title="XML 格式化"
      language="xml"
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder="<root><item>value</item></root>"
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓ 合法' : ''}`}
    />
  )
}
