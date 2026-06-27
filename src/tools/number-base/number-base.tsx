import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Select } from '@/components/ui/select'

const BASES = [
  { value: '2', label: '二进制 (2)' },
  { value: '8', label: '八进制 (8)' },
  { value: '10', label: '十进制 (10)' },
  { value: '16', label: '十六进制 (16)' },
]

export default function NumberBaseTool() {
  const [base, setBase] = useState('10')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, b = base) {
    setInput(text)
    if (!text.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('number_base', { input: text, fromBase: b }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function onBaseChange(b: string) {
    setBase(b)
    run(input, b)
  }

  return (
    <ToolWorkbench
      title="进制转换"
      toolbar={<Select value={base} onChange={onBaseChange} options={BASES} className="w-40" />}
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder="输入一个数（按所选来源进制解析）…"
      meta={error ? '' : `来源：${BASES.find((x) => x.value === base)?.label}`}
    />
  )
}
