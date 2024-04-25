import type { get_config } from '@/config'

type AI = {
  // biome-ignore lint/suspicious/noExplicitAny: no type available yet
  run(model: string, ...args: unknown[]): Promise<any>
}

export type Bindings = ReturnType<typeof get_config> & {
  telegroq: KVNamespace
  ai: AI
}
