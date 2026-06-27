import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('合并并按 tailwind 语义去重（后者覆盖前者）', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('忽略 falsy 值', () => {
    expect(cn('a', null, undefined, '', 'c')).toBe('a c')
  })
})
