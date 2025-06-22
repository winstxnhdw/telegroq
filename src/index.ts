import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { prettyJSON } from 'hono/pretty-json'
import { admin, telegram } from '@/routes'

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
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/', admin)
    .route('/', telegram)
}

export default main()
