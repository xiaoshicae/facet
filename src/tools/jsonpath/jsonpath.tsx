import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Input } from '@/components/ui/input'
import { useToolRun } from '@/hooks/use-tool-run'

export default function JsonPathTool() {
  const [path, setPath] = useState('$')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, p = path) =>
    run(text, (t) => invoke<string>('json_path', { input: t, path: p }))

  return (
    <ToolWorkbench
      title="JSONPath 查询"
      language="json"
      toolbar={
        <Input
          value={path}
          onChange={(e) => {
            setPath(e.target.value)
            exec(input, e.target.value)
          }}
          placeholder="$.store.books[*].title"
          className="h-8 w-72 font-mono text-xs"
        />
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder='{ "store": { "books": [ ... ] } }'
      meta={path ? `路径 ${path}` : '在右上角输入 JSONPath'}
    />
  )
}
