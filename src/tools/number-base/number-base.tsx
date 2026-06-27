import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Select } from '@/components/ui/select'
import { useToolRun } from '@/hooks/use-tool-run'

const BASES = [
  { value: '2', label: '二进制 (2)' },
  { value: '8', label: '八进制 (8)' },
  { value: '10', label: '十进制 (10)' },
  { value: '16', label: '十六进制 (16)' },
]

export default function NumberBaseTool() {
  const [base, setBase] = useState('10')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, b = base) =>
    run(text, (t) => invoke<string>('number_base', { input: t, fromBase: b }))

  return (
    <ToolWorkbench
      title="进制转换"
      toolbar={
        <Select
          value={base}
          onChange={(b) => {
            setBase(b)
            exec(input, b)
          }}
          options={BASES}
          className="w-40"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder="输入一个数（按所选来源进制解析）…"
      meta={error ? '' : `来源：${BASES.find((x) => x.value === base)?.label}`}
    />
  )
}
