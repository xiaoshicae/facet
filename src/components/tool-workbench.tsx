import { useContext, useEffect, type ReactNode } from 'react'
import { CodeEditor } from '@/components/ui/code-editor'
import { useResizable } from '@/hooks/use-resizable'
import { Button } from '@/components/ui/button'
import { ToolAI } from '@/components/ai/tool-ai'
import { ToolContext } from '@/components/tool-context'
import { usePrefillStore } from '@/stores/prefill-store'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  title: string
  toolbar?: ReactNode
  input: string
  output: string
  error?: string
  /** 状态条：字节数 / 有效性等 */
  meta?: string
  onInputChange: (v: string) => void
  inputPlaceholder?: string
  language?: EditorLanguage
  /** 输出区语言，默认与 language 一致（输入/输出语言不同的工具用，如 JSON↔YAML） */
  outputLanguage?: EditorLanguage
}

type EditorLanguage = 'json' | 'xml' | 'html' | 'javascript' | 'typescript' | 'yaml' | 'plaintext'

/** 所有工具复用的玻璃态双栏工作台（signature 组件）。 */
export function ToolWorkbench(p: Props) {
  const { width, onMouseDown } = useResizable(0.5, 0.2, 0.8)
  const tool = useContext(ToolContext)
  const consumePrefill = usePrefillStore((s) => s.consume)
  const onInputChange = p.onInputChange

  // AI 路由跳转过来时,挂载即消费一次预填输入(只在工具切换时触发)
  useEffect(() => {
    if (!tool) return
    const pre = consumePrefill(tool.id)
    if (pre != null) onInputChange(pre)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool?.id])

  async function copyOutput() {
    if (!p.output) return
    try {
      await navigator.clipboard.writeText(p.output)
      toast.success('已复制')
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight">{p.title}</h2>
        <div className="flex items-center gap-2">
          {p.toolbar}
          <ToolAI input={p.input} output={p.output} onWriteBack={p.onInputChange} />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div
          className="glass-card min-h-0 overflow-hidden"
          style={{ flexBasis: `${width * 100}%` }}
        >
          <CodeEditor
            value={p.input}
            onChange={p.onInputChange}
            language={p.language}
            placeholder={p.inputPlaceholder}
          />
        </div>
        <div
          onMouseDown={onMouseDown}
          className="w-1 mx-1 shrink-0 cursor-col-resize divider-glow rounded-full"
        />
        <div className="glass-card relative min-h-0 flex-1 overflow-hidden">
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 z-10"
            onClick={copyOutput}
            title="复制结果"
          >
            <Copy />
          </Button>
          <CodeEditor
            value={p.error ?? p.output}
            language={p.error ? 'plaintext' : (p.outputLanguage ?? p.language)}
            readOnly
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs tabular-nums">
        {p.error ? (
          <span className="text-destructive">✕ 解析失败，详见右侧</span>
        ) : (
          <span className="text-muted-foreground">{p.meta}</span>
        )}
      </div>
    </div>
  )
}
