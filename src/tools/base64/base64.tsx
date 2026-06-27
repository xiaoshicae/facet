import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, m = mode) {
    setInput(text)
    if (!text) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      const cmd = m === 'encode' ? 'base64_encode' : 'base64_decode'
      setOutput(await invoke<string>(cmd, { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function switchMode(m: 'encode' | 'decode') {
    setMode(m)
    run(input, m)
  }

  return (
    <ToolWorkbench
      title="Base64 编解码"
      toolbar={
        <Tabs value={mode} onValueChange={(v) => switchMode(v as 'encode' | 'decode')}>
          <TabsList>
            <TabsTrigger value="encode">编码</TabsTrigger>
            <TabsTrigger value="decode">解码</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder={mode === 'encode' ? '输入要编码的文本…' : '输入要解码的 Base64…'}
      meta={`${new Blob([input]).size} 字节 · UTF-8${error ? '' : input ? ' · ✓' : ''}`}
    />
  )
}
