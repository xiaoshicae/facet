import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Input } from '@/components/ui/input'
import { useToolRun } from '@/hooks/use-tool-run'

export default function RegexTestTool() {
  const [pattern, setPattern] = useState('')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, p = pattern) =>
    run(text, (t) => invoke<string>('regex_test', { input: t, pattern: p }))

  return (
    <ToolWorkbench
      title="正则验证"
      toolbar={
        <Input
          value={pattern}
          onChange={(e) => {
            setPattern(e.target.value)
            exec(input, e.target.value)
          }}
          placeholder="正则表达式，如 \d+"
          className="h-8 w-64 font-mono text-xs"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder="在此粘贴要匹配的文本…"
      meta={pattern ? `模式 /${pattern}/` : '先在右上角输入正则表达式'}
    />
  )
}
