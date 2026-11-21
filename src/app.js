import express from 'express'
import todosRouter from './routers/todos.js'

const app = express()

app.use(express.json())
app.use('/', todosRouter)

export default app
