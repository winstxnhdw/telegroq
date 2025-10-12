import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { ConversationFlavor } from '@grammyjs/conversations'
import type { FileFlavor } from '@grammyjs/files'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Context } from 'grammy'
import type { Groq } from 'groq-sdk'
import type { Member } from '@/bot/types'
import type { KV } from '@/kv'
import type { Bindings } from '@/types'

type Env = {
  env: Bindings
}

type GroqBinding = {
  groq: Groq
}

type KVBinding = {
  kv: KV
}

export type GrammyContext = FileFlavor<
  ConversationFlavor<ParseModeFlavor<Context & AutoChatActionFlavor & Env & GroqBinding & KVBinding & Member>>
>
