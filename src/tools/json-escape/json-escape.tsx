import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToolRun } from '@/hooks/use-tool-run'

type Mode = 'escape' | 'unescape'

export default function JsonEscapeTool() {
  const [mode, setMode] = useState<Mode>('escape')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, m = mode) =>
    run(text, (t) => invoke<string>('json_escape', { input: t, mode: m }))

  return (
    <ToolWorkbench
      title="JSON 转义"
      toolbar={
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode)
            exec(input, v as Mode)
          }}
        >
          <TabsList>
            <TabsTrigger value="escape">转义</TabsTrigger>
            <TabsTrigger value="unescape">反转义</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder={mode === 'escape' ? '含引号/换行的原始文本…' : '已转义的字符串内容…'}
      meta={`${new Blob([input]).size} 字节${error ? '' : input ? ' · ✓' : ''}`}
    />
  )
}
