import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Dir = 'j2y' | 'y2j'

export default function JsonYamlTool() {
  const [dir, setDir] = useState<Dir>('j2y')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, d = dir) {
    setInput(text)
    if (!text.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('json_yaml', { input: text, direction: d }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function switchDir(d: Dir) {
    setDir(d)
    run(input, d)
  }

  return (
    <ToolWorkbench
      title="JSON ⟷ YAML"
      language={dir === 'j2y' ? 'json' : 'yaml'}
      outputLanguage={dir === 'j2y' ? 'yaml' : 'json'}
      toolbar={
        <Tabs value={dir} onValueChange={(v) => switchDir(v as Dir)}>
          <TabsList>
            <TabsTrigger value="j2y">JSON → YAML</TabsTrigger>
            <TabsTrigger value="y2j">YAML → JSON</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder={dir === 'j2y' ? '{ "key": "value" }' : 'key: value'}
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓' : ''}`}
    />
  )
}
