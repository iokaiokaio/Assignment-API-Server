import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const router = express.Router()
const openApiFile = fileURLToPath(new URL('./openapi.yaml', import.meta.url))

router.get('/openapi.yaml', (req, res) => {
  res.type('application/yaml').send(readFileSync(openApiFile, 'utf8'))
})
router.use('/', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerUrl: '/doc/openapi.yaml'
}))

export default router
