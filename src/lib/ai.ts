/** provider 线格式。目前实现 anthropic 一种;加新家时在此扩展并在 Rust 侧加分支。 */
export type ProviderFormat = 'anthropic'

export interface AIProvider {
  id: string
  name: string
  format: ProviderFormat
  baseUrl: string
  model: string
  apiKey: string
}

/** AI 动作能拿到的上下文:当前工具的输入与输出。 */
export interface AIActionContext {
  input: string
  output: string
}

/** 工具声明的 AI 动作。放进 ToolMeta.aiActions 即生效,核心零改动。 */
export interface AIAction {
  id: string
  label: string
  /** 可选 system 提示 */
  system?: string
  /** 由当前输入/输出构造发给模型的 prompt */
  prompt: (ctx: AIActionContext) => string
  /** 是否允许把结果一键写回输入 */
  writeBack?: boolean
}

export const DEFAULT_PROVIDER: Omit<AIProvider, 'id' | 'apiKey'> = {
  name: 'Anthropic',
  format: 'anthropic',
  baseUrl: 'https://api.anthropic.com',
  model: 'claude-opus-4-8',
}

/** 脱敏展示 API Key */
export function maskKey(key: string): string {
  if (key.length <= 8) return '••••'
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}
