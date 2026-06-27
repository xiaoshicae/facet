import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Mode = 'escape' | 'unescape'

export default function JsonEscapeTool() {
  const [mode, setMode] = useState<Mode>('escape')
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
      setOutput(await invoke<string>('json_escape', { input: text, mode: m }))
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
      title="JSON 转义"
      toolbar={
        <Tabs value={mode} onValueChange={(v) => switchMode(v as Mode)}>
          <TabsList>
            <TabsTrigger value="escape">转义</TabsTrigger>
            <TabsTrigger value="unescape">反转义</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder={mode === 'escape' ? '含引号/换行的原始文本…' : '已转义的字符串内容…'}
      meta={`${new Blob([input]).size} 字节${error ? '' : input ? ' · ✓' : ''}`}
    />
  )
}
