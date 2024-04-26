import { add_admin } from '@/routes/admin/add_admin'
import { add_member } from '@/routes/admin/add_member'
import { delete_webhook } from '@/routes/admin/delete_webhook'
import { remove_admin } from '@/routes/admin/remove_admin'
import { remove_member } from '@/routes/admin/remove_member'
import { set_webhook } from '@/routes/admin/set_webhook'
import { OpenAPIHono } from '@hono/zod-openapi'
import { bearerAuth } from 'hono/bearer-auth'

const admin = new OpenAPIHono()

admin.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

admin
  .use('/admin/*', bearerAuth({ verifyToken: (token, context) => token === context.env.AUTH_TOKEN }))
  .route('/admin', set_webhook)
  .route('/admin', delete_webhook)
  .route('/admin', add_member)
  .route('/admin', remove_member)
  .route('/admin', add_admin)
  .route('/admin', remove_admin)

export { admin }
