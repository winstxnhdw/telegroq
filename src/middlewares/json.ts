import type { MiddlewareHandler } from 'hono'

export const json =
  (options = { space: 4 }): MiddlewareHandler =>
  async (context, next) => {
    await next()
    if (context.req.query('json') !== '') return

    const response = await context.res.clone().json()
    context.res = new Response(JSON.stringify(response, null, options.space), context.res)
  }
