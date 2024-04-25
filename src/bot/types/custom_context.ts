import type { SessionData } from '@/bot/types'
import type { get_config } from '@/config'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context, SessionFlavor } from 'grammy'

type Config = {
  config: ReturnType<typeof get_config>
}

export type CustomContext = ParseModeFlavor<Context & SessionFlavor<SessionData> & AutoChatActionFlavor & Config>
