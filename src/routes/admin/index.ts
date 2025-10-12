import { OpenAPIHono } from '@hono/zod-openapi'
import { bearerAuth } from 'hono/bearer-auth'
import { add_admin } from '@/routes/admin/add_admin'
import { add_member } from '@/routes/admin/add_member'
import { delete_webhook } from '@/routes/admin/delete_webhook'
import { remove_admin } from '@/routes/admin/remove_admin'
import { remove_member } from '@/routes/admin/remove_member'
import { set_webhook } from '@/routes/admin/set_webhook'

const admin = new OpenAPIHono()

admin.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

admin
  .use('/secure/*', bearerAuth({ verifyToken: (token, context) => token === context.env.AUTH_TOKEN }))
  .route('/secure', set_webhook)
  .route('/secure', delete_webhook)
  .route('/secure', add_member)
  .route('/secure', remove_member)
  .route('/secure', add_admin)
  .route('/secure', remove_admin)

export { admin }
