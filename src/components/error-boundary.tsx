import { Component, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** 隔离单个工具的渲染错误，避免整个应用白屏。按路由 key 重置。 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <TriangleAlert className="size-8 text-destructive" />
          <div className="text-sm font-medium">该工具渲染出错</div>
          <pre className="max-w-lg overflow-auto rounded-lg bg-overlay/[0.06] p-3 text-left text-xs text-muted-foreground">
            {this.state.error.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
