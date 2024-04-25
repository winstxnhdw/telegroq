import type { SessionData } from '@/bot/types'
import type { Bindings } from '@/types'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context, SessionFlavor } from 'grammy'

type Env = {
  env: Bindings
}

export type GrammyContext = ParseModeFlavor<Context & SessionFlavor<SessionData> & AutoChatActionFlavor & Env>
