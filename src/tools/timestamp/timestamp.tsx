import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Button } from '@/components/ui/button'

export default function TimestampTool() {
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
      setOutput(await invoke<string>('timestamp_convert', { input: text }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function now() {
    run(String(Math.floor(Date.now() / 1000)))
  }

  return (
    <ToolWorkbench
      title="时间戳转换"
      toolbar={
        <Button size="sm" variant="outline" onClick={now}>
          当前时间戳
        </Button>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={run}
      inputPlaceholder="输入 Unix 时间戳（秒/毫秒）或日期 2024-01-01 00:00:00…"
      meta={error ? '' : '自动识别：数字→日期 · 日期→时间戳'}
    />
  )
}
