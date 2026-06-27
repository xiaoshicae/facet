import { describe, it, expect } from 'vitest'
import { tools, toolMap, toolsByCategory, categories } from './index'

describe('registry', () => {
  it('自动注册到至少一个工具', () => {
    expect(tools.length).toBeGreaterThan(0)
  })

  it('工具 id 唯一', () => {
    const ids = tools.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每个工具的元数据完整', () => {
    for (const t of tools) {
      expect(t.id, `${t.id} 缺 id`).toBeTruthy()
      expect(t.name, `${t.id} 缺 name`).toBeTruthy()
      expect(t.category, `${t.id} 缺 category`).toBeTruthy()
      expect(Array.isArray(t.keywords), `${t.id} keywords 非数组`).toBe(true)
      expect(t.component, `${t.id} 缺 component`).toBeTruthy()
    }
  })

  it('toolMap 覆盖全部工具', () => {
    expect(toolMap.size).toBe(tools.length)
    for (const t of tools) expect(toolMap.get(t.id)).toBe(t)
  })

  it('分组包含全部工具且无遗漏', () => {
    const grouped = categories.flatMap((c) => toolsByCategory[c])
    expect(grouped.length).toBe(tools.length)
  })
})
