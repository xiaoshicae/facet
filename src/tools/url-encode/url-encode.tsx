import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToolRun } from '@/hooks/use-tool-run'

type Mode = 'encode' | 'decode'

export default function UrlEncodeTool() {
  const [mode, setMode] = useState<Mode>('encode')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, m = mode) =>
    run(text, (t) => invoke<string>(m === 'encode' ? 'url_encode' : 'url_decode', { input: t }))

  return (
    <ToolWorkbench
      title="URL 编解码"
      toolbar={
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode)
            exec(input, v as Mode)
          }}
        >
          <TabsList>
            <TabsTrigger value="encode">编码</TabsTrigger>
            <TabsTrigger value="decode">解码</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder={mode === 'encode' ? '输入要编码的 URL/文本…' : '输入要解码的内容…'}
      meta={`${new Blob([input]).size} 字节${error ? '' : input ? ' · ✓' : ''}`}
    />
  )
}
