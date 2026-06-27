import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToolRun } from '@/hooks/use-tool-run'

type Dir = 'j2y' | 'y2j'

export default function JsonYamlTool() {
  const [dir, setDir] = useState<Dir>('j2y')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, d = dir) =>
    run(text, (t) => invoke<string>('json_yaml', { input: t, direction: d }))

  return (
    <ToolWorkbench
      title="JSON ⟷ YAML"
      language={dir === 'j2y' ? 'json' : 'yaml'}
      outputLanguage={dir === 'j2y' ? 'yaml' : 'json'}
      toolbar={
        <Tabs
          value={dir}
          onValueChange={(v) => {
            setDir(v as Dir)
            exec(input, v as Dir)
          }}
        >
          <TabsList>
            <TabsTrigger value="j2y">JSON → YAML</TabsTrigger>
            <TabsTrigger value="y2j">YAML → JSON</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder={dir === 'j2y' ? '{ "key": "value" }' : 'key: value'}
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓' : ''}`}
    />
  )
}
