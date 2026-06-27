import { useCallback, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useNavigate } from 'react-router-dom'
import { tools, toolMap } from '@/registry'
import { useAIStore } from '@/stores/ai-store'
import { usePrefillStore } from '@/stores/prefill-store'

/** 由 registry 生成给模型的工具目录(无需每个工具新增字段)。 */
function toolDefs() {
  return tools.map((t) => ({
    name: t.id,
    description: `${t.name}(分类:${t.category})。关键词: ${t.keywords.join('、')}。${t.aiHint ?? ''}`.trim(),
    input_schema: {
      type: 'object',
      properties: {
        input: { type: 'string', description: '用户想用该工具处理的内容/文本' },
      },
      required: ['input'],
    },
  }))
}

interface RouteResult {
  tool: string | null
  input: string | null
  text: string | null
}

export function useAIRoute() {
  const navigate = useNavigate()
  const active = useAIStore((s) => s.active())
  const setPrefill = usePrefillStore((s) => s.set)
  const [routing, setRouting] = useState(false)

  const route = useCallback(
    async (query: string): Promise<{ ok: boolean; message?: string }> => {
      if (!active || !query.trim()) return { ok: false }
      setRouting(true)
      try {
        const res = await invoke<RouteResult>('ai_route', {
          req: {
            format: active.format,
            baseUrl: active.baseUrl,
            model: active.model,
            apiKey: active.apiKey,
            query,
            tools: toolDefs(),
          },
        })
        if (res.tool && toolMap.has(res.tool)) {
          if (res.input) setPrefill(res.tool, res.input)
          navigate(`/tool/${res.tool}`)
          return { ok: true }
        }
        return { ok: false, message: res.text ?? '没找到合适的工具' }
      } catch (e) {
        return { ok: false, message: String(e) }
      } finally {
        setRouting(false)
      }
    },
    [active, navigate, setPrefill]
  )

  return { route, routing, enabled: !!active }
}
