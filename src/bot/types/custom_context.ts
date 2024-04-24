import type { SessionData } from '@/bot/types'
import type { Context, SessionFlavor } from 'grammy'

export type CustomContext = Context & SessionFlavor<SessionData>
