import { useThemeStore } from '@/stores/theme-store'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SettingsAI } from './settings-ai'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'

const MODES = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
] as const

export function Settings() {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-xl font-semibold tracking-tight">设置</h1>

        <Card>
          <CardHeader>
            <CardTitle>外观</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => {
                const active = mode === m.value
                return (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-all cursor-pointer',
                      active
                        ? 'border-primary/40 bg-overlay/[0.06] glow-ring'
                        : 'border-overlay/[0.08] bg-overlay/[0.03] hover:bg-overlay/[0.06]'
                    )}
                  >
                    <m.icon className="size-4 text-muted-foreground" />
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <SettingsAI />

        <p className="mt-6 text-center text-xs text-muted-foreground/60">Facet · v0.1.0</p>
      </div>
    </div>
  )
}

export default Settings
