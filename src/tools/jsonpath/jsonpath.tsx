import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Input } from '@/components/ui/input'

export default function JsonPathTool() {
  const [path, setPath] = useState('$')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, p = path) {
    setInput(text)
    if (!text.trim() || !p.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('json_path', { input: text, path: p }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function onPathChange(p: string) {
    setPath(p)
    run(input, p)
  }

  return (
    <ToolWorkbench
      title="JSONPath 查询"
      language="json"
      toolbar={
        <Input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          placeholder="$.store.books[*].title"
          className="h-8 w-72 font-mono text-xs"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder='{ "store": { "books": [ ... ] } }'
      meta={path ? `路径 ${path}` : '在右上角输入 JSONPath'}
    />
  )
}
