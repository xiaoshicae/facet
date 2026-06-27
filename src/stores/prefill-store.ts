import { create } from 'zustand'

/** AI 路由跳转到某工具时,暂存要预填进该工具输入的内容,由 ToolWorkbench 挂载时消费一次。 */
interface PrefillState {
  pending: { toolId: string; value: string } | null
  set: (toolId: string, value: string) => void
  consume: (toolId: string) => string | null
}

export const usePrefillStore = create<PrefillState>((set, get) => ({
  pending: null,
  set: (toolId, value) => set({ pending: { toolId, value } }),
  consume: (toolId) => {
    const p = get().pending
    if (p && p.toolId === toolId) {
      set({ pending: null })
      return p.value
    }
    return null
  },
}))
