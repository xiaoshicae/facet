import { useState, useCallback, useRef } from 'react'

/**
 * 拖拽改变宽度（按比例 0~1）。提取自 qai app-layout。
 * @param initial 初始比例
 * @param min 最小比例
 * @param max 最大比例
 */
export function useResizable(initial: number, min: number, max: number) {
  const [width, setWidth] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      const container = (e.currentTarget as HTMLElement).parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return
        const ratio = (ev.clientX - rect.left) / rect.width
        setWidth(Math.min(max, Math.max(min, ratio)))
      }
      const onMouseUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [min, max]
  )

  return { width, onMouseDown }
}
