/** biome-ignore-all lint/suspicious/noExplicitAny: reply_parameters is guaranteed to be on payload */

import type { Context, Transformer } from 'grammy'

export function auto_quote<C extends Context>(ctx: C): Transformer {
  const transformer: Transformer = (prev, method, payload, signal) => {
    const messageId = ctx.msgId ?? (payload as any).reply_parameters?.message_id

    if (!method.startsWith('send') || method === 'sendChatAction' || !messageId) {
      return prev(method, payload, signal)
    }

    const reply_parameters = {
      message_id: messageId,
      chat_id: (payload as any).reply_parameters?.chat_id ?? ctx.chat?.id,
      ...(payload as any).reply_parameters,
    } as const

    const new_payload = {
      reply_parameters: reply_parameters,
      ...payload,
    } as const

    return prev(method, new_payload, signal)
  }

  return transformer
}
