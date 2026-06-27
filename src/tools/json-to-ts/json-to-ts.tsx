import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { useToolRun } from '@/hooks/use-tool-run'

export default function JsonToTsTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('json_to_ts', { input: t }))

  return (
    <ToolWorkbench
      title="JSON → TypeScript"
      language="json"
      outputLanguage="typescript"
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder='{ "id": 1, "name": "facet", "tags": ["a"] }'
      meta={error ? '' : input.trim() ? '✓ 已生成 Root 类型' : '粘贴 JSON 自动推导类型'}
    />
  )
}
