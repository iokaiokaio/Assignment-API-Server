import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, getTodosbyState } from '../services/todos.js'

const router = express.Router()


router.get('/todos', (req, res) => {
  res.json(getTodos())
})

router.get('/', (req, res) => {
  res.json({"status": "running"})
})

router.get('/todos/state', (req, res) => {
  if (!req.query.state) {
    return res.status(400).json({"error": "Missing state query parameter"})
  }
  if (req.query.state !== 'todo' && req.query.state !== 'doing' && req.query.state !== 'done') {
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
  
  res.json(createTodo)
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