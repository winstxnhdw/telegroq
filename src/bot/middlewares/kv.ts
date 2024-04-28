import { KV } from '@/kv'
import type { Context, NextFunction } from 'grammy'

export const kv = (kv_binding: KVNamespace) => (context: Context & { kv: KV }, next: NextFunction) => {
  context.kv = new KV(kv_binding)
  return next()
}
