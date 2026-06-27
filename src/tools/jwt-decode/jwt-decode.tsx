import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { useToolRun } from '@/hooks/use-tool-run'

export default function JwtDecodeTool() {
  const { input, output, error, run } = useToolRun()
  const exec = (text: string) => run(text, (t) => invoke<string>('jwt_decode', { input: t }))

  return (
    <ToolWorkbench
      title="JWT 解析"
      outputLanguage="javascript"
      input={input}
      output={output}
      error={error}
      onInputChange={exec}
      inputPlaceholder="粘贴 JWT（eyJ...）…"
      meta={error ? '' : output ? '✓ 已解析（不验签）' : '粘贴 JWT 自动解析 Header / Payload'}
    />
  )
}
