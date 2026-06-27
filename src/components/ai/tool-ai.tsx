import { useContext, useState } from 'react'
import { Sparkles, Copy, CornerDownLeft, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ToolContext } from '@/components/tool-context'
import { useAIStore } from '@/stores/ai-store'
import { useAIAction } from '@/hooks/use-ai-action'
import { Button } from '@/components/ui/button'
import type { AIAction } from '@/lib/ai'

interface Props {
  input: string
  output: string
  onWriteBack: (v: string) => void
}

/** 工具内 AI 副驾:✨ 菜单 + 流式结果浮层。仅在配置了 provider 且工具声明了 aiActions 时出现。 */
export function ToolAI({ input, output, onWriteBack }: Props) {
  const tool = useContext(ToolContext)
  const active = useAIStore((s) => s.active())
  const actions = tool?.aiActions ?? []
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<AIAction | null>(null)
  const ai = useAIAction()

  if (!active || actions.length === 0) return null

  function runAction(a: AIAction) {
    setMenuOpen(false)
    setPanel(a)
    ai.run(active!, a, { input, output })
  }

  function close() {
    setPanel(null)
    ai.reset()
  }

  return (
    <>
      <div className="relative">
        <Button size="sm" variant="outline" onClick={() => setMenuOpen((o) => !o)} title="AI 副驾">
          <Sparkles className="text-primary" />
          AI
        </Button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-1 w-56 glass-card rounded-xl p-1 shadow-2xl">
              {actions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => runAction(a)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-overlay/[0.06] cursor-pointer"
                >
                  <Sparkles className="size-3.5 text-primary" />
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {panel && (
        <div className="fixed bottom-5 right-5 z-50 flex max-h-[60vh] w-[440px] max-w-[90vw] flex-col glass-card rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2 border-b border-overlay/[0.08] px-4 py-2.5">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium">{panel.label}</span>
            {ai.running && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
            <button
              onClick={close}
              className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-sm whitespace-pre-wrap break-words font-mono">
            {ai.error ? (
              <span className="text-destructive">✕ {ai.error}</span>
            ) : (
              ai.output || <span className="text-muted-foreground">生成中…</span>
            )}
          </div>

          {!ai.error && ai.output && !ai.running && (
            <div className="flex items-center gap-2 border-t border-overlay/[0.08] px-4 py-2.5">
              {panel.writeBack && (
                <Button
                  size="sm"
                  onClick={() => {
                    onWriteBack(ai.output)
                    toast.success('已写回输入')
                    close()
                  }}
                >
                  <CornerDownLeft />
                  写回输入
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(ai.output)
                  toast.success('已复制')
                }}
              >
                <Copy />
                复制
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
