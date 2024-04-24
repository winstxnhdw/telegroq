import { json } from '@/middlewares'
import { delete_webhook, set_webhook } from '@/routes'
import { telegram } from '@/routes/telegram'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'

function main() {
  const openapi_documentation_route = '/openapi.json'
  const app = new OpenAPIHono().doc(openapi_documentation_route, {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'telegroq',
    },
  })

  return app
    .use(json())
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/', set_webhook)
    .route('/', delete_webhook)
    .route('/', telegram)
}

export default main()
