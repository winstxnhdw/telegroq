import { delete_webhook, set_webhook } from '@/routes'
import { telegram } from '@/routes/telegram'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { prettyJSON } from 'hono/pretty-json'
import { bearer_auth } from './middlewares/bearer_auth.js'

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
    .use('/webhook/*', bearer_auth)
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/webhook', set_webhook)
    .route('/webhook', delete_webhook)
    .route('/', telegram)
}

export default main()
