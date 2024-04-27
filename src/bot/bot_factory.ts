import { bot_info } from '@/bot'
import { chat, clear, human_expert } from '@/bot/composers'
import { ask_human, reply_human } from '@/bot/conversations'
import { env, groq, ignore_old, members } from '@/bot/middlewares'
import type { GrammyContext } from '@/bot/types'
import { get_config } from '@/config'
import type { Bindings } from '@/types'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { conversations, createConversation } from '@grammyjs/conversations'
import { hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession } from 'grammy'

export const bot_factory = (environment: Bindings): Bot<GrammyContext> => {
  const config = get_config(environment)
  const bot = new Bot<GrammyContext>(config.BOT_TOKEN, {
    client: { canUseWebhookReply: (method) => method === 'sendChatAction' },
    botInfo: bot_info,
  })

  bot.use(
    lazySession({
      initial: () => ({}),
      storage: new KvAdapter(environment.telegroq),
    }),
  )

  bot.api.config.use(autoRetry())
  bot.use(
    hydrateReply,
    conversations(),
    autoChatAction(),
    ignore_old(),
    env(environment),
    groq(environment),
    members(environment),
    createConversation(ask_human, 'ask_human'),
    createConversation(reply_human, 'reply_human'),
    clear,
    chat,
    human_expert,
  )

  bot.catch(console.error)

  return bot
}
