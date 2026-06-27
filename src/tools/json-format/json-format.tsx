import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToolRun } from '@/hooks/use-tool-run'

type Mode = 'pretty' | 'minify' | 'validate'

export default function JsonFormatTool() {
  const [mode, setMode] = useState<Mode>('pretty')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, m = mode) =>
    run(text, (t) => invoke<string>('json_format', { input: t, mode: m }))

  return (
    <ToolWorkbench
      title="JSON 格式化"
      language="json"
      toolbar={
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode)
            exec(input, v as Mode)
          }}
        >
          <TabsList>
            <TabsTrigger value="pretty">美化</TabsTrigger>
            <TabsTrigger value="minify">压缩</TabsTrigger>
            <TabsTrigger value="validate">校验</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder='{ "hello": "world" }'
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓ 合法' : ''}`}
    />
  )
}
