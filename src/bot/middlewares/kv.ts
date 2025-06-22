import type { Context, NextFunction } from 'grammy'
import { KV } from '@/kv'

export const kv = (kv_binding: KVNamespace) => (context: Context & { kv: KV }, next: NextFunction) => {
  context.kv = new KV(kv_binding)
  return next()
}
