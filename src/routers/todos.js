import express from 'express'
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, getTodosbyState, toCsv } from '../services/todos.js'

const router = express.Router()
const todoStates = ['todo', 'doing', 'done']

router.get('/todos', (req, res) => {
  const { state } = req.query
  let todos = getTodos()

  if (state !== undefined) {
    if (!todoStates.includes(state)) {
      return res.status(400).json({ error: 'Invalid state query parameter' })
    }
    todos = getTodosbyState(state)
  }

  const format = req.accepts(['application/json', 'text/csv'])
  res.vary('Accept')

  if (format === 'text/csv') {
    return res.type('text/csv').send(toCsv(todos))
  }
  if (format === 'application/json') {
    return res.json(todos)
  }
  return res.status(406).json({ error: 'Not acceptable' })
})

router.get('/', (req, res) => {
  res.json({"status": "running"})
})

router.get('/todos/state', (req, res) => {
  if (!req.query.state) {
    return res.status(400).json({"error": "Missing state query parameter"})
  }
  if (!todoStates.includes(req.query.state)) {
    return res.status(400).json({"error": "Invalid state query parameter"})
  }
  res.json(getTodosbyState(req.query.state))
})

router.get('/todos/:id', (req, res) => {
  if (getTodoById(req.params.id)) {
    res.json(getTodoById(req.params.id))
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

router.post('/todos', (req, res) => {
  const todo = createTodo(req.body.title, req.body.description)
  res.status(201).json(todo)
})

router.put('/todos/:id', (req, res) => {
  const todo = updateTodo(req.params.id,req.body.title,req.body.description,req.body.state)
  if (todo) {
    res.json(todo)
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

router.delete('/todos/:id', (req, res) => {
  const todoDeleted = deleteTodo(req.params.id)
  if (todoDeleted) {
    res.json({"message": "Todo deleted"})
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

export default router