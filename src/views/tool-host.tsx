import { Suspense } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toolMap } from '@/registry'
import { ToolContext } from '@/components/tool-context'

export function ToolHost() {
  const { id } = useParams<{ id: string }>()
  const tool = id ? toolMap.get(id) : undefined

  if (!tool) return <Navigate to="/" replace />

  const ToolComponent = tool.component

  return (
    <ToolContext.Provider value={tool}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <ToolComponent />
      </Suspense>
    </ToolContext.Provider>
  )
}

export default ToolHost
