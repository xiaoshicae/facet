import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Select } from '@/components/ui/select'
import { useToolRun } from '@/hooks/use-tool-run'

const ALGOS = [
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha512', label: 'SHA-512' },
]

export default function HashTool() {
  const [algo, setAlgo] = useState('sha256')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, a = algo) =>
    run(text, (t) => invoke<string>('hash_text', { input: t, algo: a }))

  return (
    <ToolWorkbench
      title="哈希计算"
      toolbar={
        <Select
          value={algo}
          onChange={(a) => {
            setAlgo(a)
            exec(input, a)
          }}
          options={ALGOS}
          className="w-36"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder="输入要计算哈希的文本…"
      meta={`${new Blob([input]).size} 字节 · ${algo.toUpperCase()}${output ? ` · ${output.length * 4} bit` : ''}`}
    />
  )
}
