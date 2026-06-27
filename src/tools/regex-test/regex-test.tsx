import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Input } from '@/components/ui/input'

export default function RegexTestTool() {
  const [pattern, setPattern] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, pat = pattern) {
    setInput(text)
    if (!pat) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('regex_test', { input: text, pattern: pat }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function onPatternChange(p: string) {
    setPattern(p)
    run(input, p)
  }

  return (
    <ToolWorkbench
      title="正则验证"
      toolbar={
        <Input
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="正则表达式，如 \d+"
          className="h-8 w-64 font-mono text-xs"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder="在此粘贴要匹配的文本…"
      meta={pattern ? `模式 /${pattern}/` : '先在右上角输入正则表达式'}
    />
  )
}
