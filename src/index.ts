import { bearer_auth } from '@/middlewares'
import { delete_webhook, set_webhook } from '@/routes'
import { telegram } from '@/routes/telegram'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { prettyJSON } from 'hono/pretty-json'

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
    .use(prettyJSON())
    .use('/admin/*', bearer_auth)
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/admin', set_webhook)
    .route('/admin', delete_webhook)
    .route('/', telegram)
}

export default main()
