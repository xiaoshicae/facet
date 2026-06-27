import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Order = 'asc' | 'desc'

export default function JsonSortTool() {
  const [order, setOrder] = useState<Order>('asc')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string>()

  async function run(text: string, o = order) {
    setInput(text)
    if (!text.trim()) {
      setOutput('')
      setError(undefined)
      return
    }
    try {
      setOutput(await invoke<string>('json_sort', { input: text, order: o }))
      setError(undefined)
    } catch (e) {
      setError(String(e))
      setOutput('')
    }
  }

  function switchOrder(o: Order) {
    setOrder(o)
    run(input, o)
  }

  return (
    <ToolWorkbench
      title="JSON 键排序"
      language="json"
      toolbar={
        <Tabs value={order} onValueChange={(v) => switchOrder(v as Order)}>
          <TabsList>
            <TabsTrigger value="asc">A → Z</TabsTrigger>
            <TabsTrigger value="desc">Z → A</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => run(v)}
      inputPlaceholder='{ "b": 1, "a": 2 }'
      meta={error ? '' : input.trim() ? '✓ 递归按键排序' : '粘贴 JSON 自动排序'}
    />
  )
}
