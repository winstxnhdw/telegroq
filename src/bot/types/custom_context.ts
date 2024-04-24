import type { SessionData } from '@/bot/types'
import type { get_config } from '@/config'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { Context, SessionFlavor } from 'grammy'

export type CustomContext = Context &
  SessionFlavor<SessionData> &
  AutoChatActionFlavor & {
    config: ReturnType<typeof get_config>
  }
