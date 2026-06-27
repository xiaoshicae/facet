import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ToolWorkbench } from '@/components/tool-workbench'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToolRun } from '@/hooks/use-tool-run'

type Order = 'asc' | 'desc'

export default function JsonSortTool() {
  const [order, setOrder] = useState<Order>('asc')
  const { input, output, error, run } = useToolRun()

  const exec = (text: string, o = order) =>
    run(text, (t) => invoke<string>('json_sort', { input: t, order: o }))

  return (
    <ToolWorkbench
      title="JSON 键排序"
      language="json"
      toolbar={
        <Tabs
          value={order}
          onValueChange={(v) => {
            setOrder(v as Order)
            exec(input, v as Order)
          }}
        >
          <TabsList>
            <TabsTrigger value="asc">A → Z</TabsTrigger>
            <TabsTrigger value="desc">Z → A</TabsTrigger>
          </TabsList>
        </Tabs>
      }
      input={input}
      output={output}
      error={error}
      onInputChange={(v) => exec(v)}
      inputPlaceholder='{ "b": 1, "a": 2 }'
      meta={error ? '' : input.trim() ? '✓ 递归按键排序' : '粘贴 JSON 自动排序'}
    />
  )
}
