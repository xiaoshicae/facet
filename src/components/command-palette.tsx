import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { tools } from '@/registry'
import { useCommandStore } from '@/stores/tool-store'

export function CommandPalette() {
  const open = useCommandStore((s) => s.open)
  const setOpen = useCommandStore((s) => s.setOpen)
  const navigate = useNavigate()

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="命令面板"
      className="glass-card fixed left-1/2 top-1/4 z-50 w-[520px] max-w-[90vw] -translate-x-1/2 rounded-2xl p-2 shadow-2xl"
    >
      <Command.Input
        autoFocus
        placeholder="搜索工具…"
        className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
      />
      <Command.List className="mt-2 max-h-80 overflow-y-auto">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          没有匹配的工具
        </Command.Empty>
        {tools.map((t) => (
          <Command.Item
            key={t.id}
            value={`${t.name} ${t.keywords.join(' ')}`}
            onSelect={() => {
              navigate(`/tool/${t.id}`)
              setOpen(false)
            }}
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
