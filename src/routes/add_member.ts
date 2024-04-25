import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Failed to set the webhook!'),
})

const route = createRoute({
  method: 'get',
  path: '/add_member',
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
          example: {
            message: 'https://example.com/telegram has been successfully set as the Telegram webhook endpoint!',
          },
        },
      },
      description: 'The response when the Telegram webhook is set successfully.',
    },
    401: {
      content: {
        'text/plain': {
          schema: z.literal('Unauthorized'),
        },
      },
      description: 'The response when the request is unauthorized.',
    },
    500: {
      content: {
        'application/json': { schema: ResponseErrorSchema },
      },
      description: 'The response when the Telegram webhook has failed to be set.',
    },
  },
})

const add_member = new OpenAPIHono()

add_member.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

add_member.openapi(route, async (context) => {
  return context.json({ message: 'hello' })
})

export { add_member }
