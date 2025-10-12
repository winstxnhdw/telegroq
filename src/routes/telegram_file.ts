import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HonoContext } from '@/types'

const ParamsSchema = z.object({
  path: z.string(),
})

const route = createRoute({
  method: 'get',
  path: '/file/:path',
  request: { params: ParamsSchema },
  responses: {
    200: { description: 'The response from the endpoint.' },
  },
})

export const telegram_file = new OpenAPIHono<HonoContext>().openapi(route, (context) =>
  fetch(`https://api.telegram.org/file/bot${context.env.BOT_TOKEN}/${context.req.param('path')}`),
)
