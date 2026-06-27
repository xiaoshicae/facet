import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { tools } from '@/registry'
import type { ToolMeta } from '@/registry/types'
import { useCommandStore } from '@/stores/tool-store'
import { useAIRoute } from '@/hooks/use-ai-route'

export function CommandPalette() {
  const open = useCommandStore((s) => s.open)
  const setOpen = useCommandStore((s) => s.setOpen)
  const navigate = useNavigate()
  const [suggestion, setSuggestion] = useState<ToolMeta | null>(null)
  const [search, setSearch] = useState('')
  const aiRoute = useAIRoute()

  // 打开时读取剪贴板，按 detectClipboard 给出工具建议（best-effort，失败静默）
  useEffect(() => {
    if (!open) {
      setSuggestion(null)
      setSearch('')
      return
    }
    navigator.clipboard
      .readText()
      .then((text) => {
        const t = text.trim()
        if (!t) return
        const match = tools.find((tool) => tool.detectClipboard?.(t))
        if (match) setSuggestion(match)
      })
      .catch(() => {})
  }, [open])

  function go(id: string) {
    navigate(`/tool/${id}`)
    setOpen(false)
  }

  async function askAI() {
    const q = search.trim()
    if (!q || aiRoute.routing) return
    const res = await aiRoute.route(q)
    if (res.ok) {
      setOpen(false)
    } else if (res.message) {
      toast.error(res.message)
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="命令面板"
      shouldFilter
      className="glass-card fixed left-1/2 top-1/4 z-50 w-[520px] max-w-[90vw] -translate-x-1/2 rounded-2xl p-2 shadow-2xl"
    >
      <Command.Input
        autoFocus
        value={search}
        onValueChange={setSearch}
        placeholder="搜索工具，或描述需求让 AI 找…"
        className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
      />

      {/* AI 路由：描述需求 → 选中工具并预填 */}
      {aiRoute.enabled && search.trim() && (
        <button
          onClick={askAI}
          className="mt-2 flex w-full items-center gap-2 rounded-lg border border-primary/30 bg-overlay/[0.04] px-3 py-2 text-sm transition-colors hover:bg-overlay/[0.06] cursor-pointer"
        >
          {aiRoute.routing ? (
            <Loader2 className="size-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="size-4 text-primary" />
          )}
          <span>
            让 AI 找工具并打开：<b>{search.trim()}</b>
          </span>
        </button>
      )}

      {suggestion && (
        <button
          onClick={() => go(suggestion.id)}
          className="mt-2 flex w-full items-center gap-2 rounded-lg border border-primary/30 bg-overlay/[0.04] px-3 py-2 text-sm transition-colors hover:bg-overlay/[0.06] cursor-pointer"
        >
          <suggestion.icon className="size-4 text-primary" />
          <span>
            剪贴板内容像 <b>{suggestion.name}</b>，点此打开
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{suggestion.category}</span>
        </button>
      )}

      <Command.List className="mt-2 max-h-80 overflow-y-auto">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          没有匹配的工具
        </Command.Empty>
        {tools.map((t) => (
          <Command.Item
            key={t.id}
            value={`${t.name} ${t.keywords.join(' ')}`}
            onSelect={() => go(t.id)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer data-[selected=true]:bg-overlay/[0.06] data-[selected=true]:glow-ring"
          >
            <t.icon className="size-4 text-muted-foreground" />
            <span>{t.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{t.category}</span>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  )
}
