import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Mode = 'pretty' | 'minify' | 'validate'

export default function JsonFormatTool() {
  const [mode, setMode] = useState<Mode>('pretty')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, m = mode) {
    setInput(text)
    if (!text.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('json_format', { input: text, mode: m }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function switchMode(m: Mode) {
    setMode(m)
    run(input, m)
  }

  return (
    <ToolWorkbench
      title="JSON 格式化"
      language="json"
      toolbar={
        <Tabs value={mode} onValueChange={(v) => switchMode(v as Mode)}>
          <TabsList>
            <TabsTrigger value="pretty">美化</TabsTrigger>
            <TabsTrigger value="minify">压缩</TabsTrigger>
            <TabsTrigger value="validate">校验</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder='{ "hello": "world" }'
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓ 合法' : ''}`}
    />
  )
}
