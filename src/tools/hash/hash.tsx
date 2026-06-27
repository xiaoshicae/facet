import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Select } from '@/components/ui/select'

const ALGOS = [
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha512', label: 'SHA-512' },
]

export default function HashTool() {
  const [algo, setAlgo] = useState('sha256')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, a = algo) {
    setInput(text)
    if (!text) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('hash_text', { input: text, algo: a }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function onAlgoChange(a: string) {
    setAlgo(a)
    run(input, a)
  }

  return (
    <ToolWorkbench
      title="哈希计算"
      toolbar={<Select value={algo} onChange={onAlgoChange} options={ALGOS} className="w-36" />}
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder="输入要计算哈希的文本…"
      meta={`${new Blob([input]).size} 字节 · ${algo.toUpperCase()}${output ? ` · ${output.length * 4} bit` : ''}`}
    />
  )
}
