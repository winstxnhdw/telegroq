import type { Bindings } from '@/types'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context } from 'grammy'
import type { Groq } from 'groq-sdk'

type Env = {
  env: Bindings
}

type GroqBinding = {
  groq: Groq
}

type Members = {
  username: string
}

export type GrammyContext = ParseModeFlavor<Context & AutoChatActionFlavor & Env & GroqBinding & Members>
