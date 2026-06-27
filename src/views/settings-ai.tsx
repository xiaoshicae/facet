import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { toast } from 'sonner'
import { Check, Plug, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAIStore } from '@/stores/ai-store'
import { DEFAULT_PROVIDER, maskKey, type AIProvider } from '@/lib/ai'
import { cn } from '@/lib/utils'

function uid() {
  return `prov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function SettingsAI() {
  const providers = useAIStore((s) => s.providers)
  const activeId = useAIStore((s) => s.activeId)
  const upsert = useAIStore((s) => s.upsert)
  const remove = useAIStore((s) => s.remove)
  const setActive = useAIStore((s) => s.setActive)

  const [form, setForm] = useState({
    name: DEFAULT_PROVIDER.name,
    baseUrl: DEFAULT_PROVIDER.baseUrl,
    model: DEFAULT_PROVIDER.model,
    apiKey: '',
  })
  const [testing, setTesting] = useState(false)

  async function test() {
    if (!form.apiKey.trim()) return toast.error('请先填写 API Key')
    setTesting(true)
    try {
      const msg = await invoke<string>('ai_test', {
        req: {
          requestId: 'test',
          format: 'anthropic',
          baseUrl: form.baseUrl,
          model: form.model,
          apiKey: form.apiKey,
          system: null,
          prompt: 'ping',
        },
      })
      toast.success(msg)
    } catch (e) {
      toast.error(String(e))
    } finally {
      setTesting(false)
    }
  }

  function save() {
    if (!form.apiKey.trim()) return toast.error('请先填写 API Key')
    const p: AIProvider = {
      id: uid(),
      name: form.name.trim() || 'Anthropic',
      format: 'anthropic',
      baseUrl: form.baseUrl.trim() || DEFAULT_PROVIDER.baseUrl,
      model: form.model.trim() || DEFAULT_PROVIDER.model,
      apiKey: form.apiKey.trim(),
    }
    upsert(p)
    toast.success('已保存 provider')
    setForm((f) => ({ ...f, apiKey: '' }))
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI 服务</CardTitle>
        <p className="text-xs text-muted-foreground">
          配置后,工具工作台会出现 ✨ AI 副驾。你的输入将发送到所配置的服务处理。
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 已配置列表 */}
        {providers.length > 0 && (
          <div className="space-y-1.5">
            {providers.map((p) => {
              const isActive = p.id === activeId
              return (
                <div
                  key={p.id}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    isActive
                      ? 'border-primary/40 bg-overlay/[0.04] glow-ring'
                      : 'border-overlay/[0.08] bg-overlay/[0.03]'
                  )}
                >
                  <button
                    onClick={() => setActive(p.id)}
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-overlay/[0.15] cursor-pointer"
                    title={isActive ? '当前使用' : '设为当前'}
                  >
                    {isActive && <Check className="size-3 text-primary" />}
                  </button>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.model}</span>
                  <span className="text-xs text-muted-foreground/70">{maskKey(p.apiKey)}</span>
                  <button
                    onClick={() => remove(p.id)}
                    className="ml-auto text-muted-foreground hover:text-destructive cursor-pointer"
                    title="删除"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* 新增表单 */}
        <div className="space-y-2 rounded-xl border border-overlay/[0.08] p-3">
          <div className="text-xs font-medium text-muted-foreground">添加 provider（Anthropic 兼容）</div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="名称"
            />
            <Input
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              placeholder="模型 ID"
            />
          </div>
          <Input
            value={form.baseUrl}
            onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
            placeholder="Base URL"
          />
          <Input
            type="password"
            value={form.apiKey}
            onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
            placeholder="API Key"
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={save}>
              保存
            </Button>
            <Button size="sm" variant="outline" onClick={test} disabled={testing}>
              <Plug />
              {testing ? '测试中…' : '测试连接'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
