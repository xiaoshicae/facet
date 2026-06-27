import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { useToolRun } from '@/hooks/use-tool-run'

export default function XmlFormatTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('xml_format', { input: t }))

  return (
    <ToolWorkbench
      title="XML 格式化"
      language="xml"
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="<root><item>value</item></root>"
      meta={`${new Blob([input]).size} 字节${error ? '' : input.trim() ? ' · ✓ 合法' : ''}`}
    />
  )
}
