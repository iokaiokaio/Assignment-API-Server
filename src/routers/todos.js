import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

var todos = [
  {
    "id": uuidv4(),
    "title": "Study REST APIs",
    "description": "Read a dissertation by Roy Fielding",
    "state": "todo",
    "createdAt": Date.now(),
    "modifiedAt": Date.now()
  }
]
router.get('/todos', (req, res) => {
  res.json(todos)
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
  const filteredTodos = todos.filter(todo => todo.state === req.query.state)
  res.json(filteredTodos)
})

router.get('/todos/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id)
  if (todo) {
    res.json(todo)
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

router.post('/todos', (req, res) => { 
  const newTodo = {
    "id": uuidv4(),
    "title": req.body.title,
    "description": req.body.description,
    "state": "todo",
    "createdAt": Date.now(),
    "modifiedAt": Date.now()
  }
  todos.push(newTodo)
  res.json(newTodo)
})

router.put('/todos/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === req.params.id)
  if (todo) {
    todo.title = req.body.title
    todo.description = req.body.description
    todo.state = req.body.state
    todo.modifiedAt = Date.now()
    res.json(todo)
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

router.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(todo => todo.id === req.params.id)
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1)
    res.json({"message": "Todo deleted"})
  } else {
    res.status(404).json({"error": "Todo not found"})
  }
})

export default router