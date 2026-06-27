import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'

export default function JwtDecodeTool() {
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
      setOutput(await invoke<string>('jwt_decode', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  return (
    <ToolWorkbench
      title="JWT 解析"
      outputLanguage="javascript"
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder="粘贴 JWT（eyJ...）…"
      meta={error ? '' : output ? '✓ 已解析（不验签）' : '粘贴 JWT 自动解析 Header / Payload'}
    />
  )
}
