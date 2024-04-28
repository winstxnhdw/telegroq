import { bot_info } from '@/bot'
import { ask_human, chat, clear } from '@/bot/composers'
import { ask_human_conversation, reply_human_conversation } from '@/bot/conversations'
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
    autoChatAction(),
    ignore_old(),
    env(environment),
    groq(environment),
    members(environment),
    conversations(),
    createConversation(ask_human_conversation, 'ask_human'),
    createConversation(reply_human_conversation, 'reply_human'),
    ask_human,
    clear,
    chat,
  )

  bot.catch(console.error)

  return bot
}
