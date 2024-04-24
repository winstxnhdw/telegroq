import { set_webhook } from '@/routes/set_webhook'
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
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/', set_webhook)
    .route('/', telegram)
}

export default main()
