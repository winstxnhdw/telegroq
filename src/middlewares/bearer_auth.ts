import { get_config } from '@/config'
import type { MiddlewareHandler } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'

export const bearer_auth: MiddlewareHandler = async (context, next) =>
  bearerAuth({ token: get_config(context.env).AUTH_TOKEN })(context, next)
