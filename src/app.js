import express from 'express'
import docsRouter from './routers/docs.js'
import todosRouter from './routers/todos.js'

const app = express()

app.use(express.json())
app.use('/doc', docsRouter)
app.use('/', todosRouter)

export default app
