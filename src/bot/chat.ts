import type { CustomContext } from '@/bot/types'
import { Router } from '@grammyjs/router'

const router = new Router<CustomContext>((context) => context.session.history)

export { router }
