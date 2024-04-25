import type { get_config } from '@/config'

export type Bindings = ReturnType<typeof get_config> & {
  telegroq: KVNamespace
  // biome-ignore lint/suspicious/noExplicitAny: no type available yet
  ai: any
}
