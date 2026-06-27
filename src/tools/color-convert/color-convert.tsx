import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'

export default function ColorConvertTool() {
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
      setOutput(await invoke<string>('color_convert', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  return (
    <ToolWorkbench
      title="颜色转换"
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder="#ff0000 或 #f00 或 rgb(255, 0, 0)"
      meta={error ? '' : output ? '✓ HEX / RGB / HSL' : '支持 #HEX 与 rgb() 输入'}
    />
  )
}
