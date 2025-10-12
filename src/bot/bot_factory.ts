import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { conversations, createConversation } from '@grammyjs/conversations'
import { hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession } from 'grammy'
import { bot_info } from '@/bot'
import { ask_all, ask_human, ask_lty, chat, clear, start } from '@/bot/composers'
import {
  ask_all_conversation,
  ask_human_conversation,
  ask_lty_conversation,
  reply_human_conversation,
} from '@/bot/conversations'
import { env, groq, kv, members } from '@/bot/middlewares'
import type { GrammyContext } from '@/bot/types'
import { get_config } from '@/config'
import type { Bindings } from '@/types'

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
    autoChatAction(bot.api),
    conversations(),
    kv(environment.telegroq),
    env(environment),
    groq(environment),
    members(environment),
    createConversation(ask_human_conversation(environment.telegroq), 'ask_human'),
    createConversation(reply_human_conversation(environment.telegroq), 'reply_human'),
    createConversation(ask_lty_conversation(environment.telegroq), 'ask_lty'),
    createConversation(ask_all_conversation(environment.telegroq), 'ask_all'),
    ask_human,
    ask_lty,
    ask_all,
    clear,
    start,
    chat,
  )

  bot.catch(console.error)

  return bot
}
