import { admin, telegram } from '@/routes'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { bearerAuth } from 'hono/bearer-auth'
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
    .use('/admin/*', bearerAuth({ verifyToken: (token, context) => token === context.env.AUTH_TOKEN }))
    .get('/docs', swaggerUI({ url: openapi_documentation_route }))
    .route('/', admin)
    .route('/', telegram)
}

export default main()
