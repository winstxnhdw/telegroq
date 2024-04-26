import { bot_info } from '@/bot'
import { chat, clear_command } from '@/bot/composers'
import { env, groq, ignore_old } from '@/bot/middlewares'
import type { GrammyContext, SessionData } from '@/bot/types'
import { get_config } from '@/config'
import type { Bindings } from '@/types'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession } from 'grammy'

export const bot_factory = (environment: Bindings): Bot<GrammyContext> => {
  const config = get_config(environment)
  const bot = new Bot<GrammyContext>(config.BOT_TOKEN, { botInfo: bot_info })

  bot.api.config.use(autoRetry())
  bot.use(autoChatAction(), hydrateReply, ignore_old(), env(environment), groq(environment), clear_command, chat)

  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(environment.telegroq),
    }),
  )

  return bot
}
