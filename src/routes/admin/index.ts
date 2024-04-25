import { add_member } from '@/routes/admin/add_member'
import { delete_webhook } from '@/routes/admin/delete_webhook'
import { remove_member } from '@/routes/admin/remove_member'
import { set_webhook } from '@/routes/admin/set_webhook'
import { OpenAPIHono } from '@hono/zod-openapi'

const admin = new OpenAPIHono()

admin.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

admin.route('/admin', set_webhook)
admin.route('/admin', delete_webhook)
admin.route('/admin', add_member)
admin.route('/admin', remove_member)

export { admin }
