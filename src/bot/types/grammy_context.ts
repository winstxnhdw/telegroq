import type { SessionData } from '@/bot/types'
import type { Bindings } from '@/types'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context, SessionFlavor } from 'grammy'
import type { Groq } from 'groq-sdk'

type Env = {
  env: Bindings
}

type GroqBinding = {
  groq: Groq
}

export type GrammyContext = ParseModeFlavor<
  Context &
    SessionFlavor<SessionData> &
    AutoChatActionFlavor &
    Env &
    GroqBinding
>
