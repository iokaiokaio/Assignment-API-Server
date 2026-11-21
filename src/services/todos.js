import { todos } from '../db/db.js'
import { v4 as uuidv4 } from 'uuid'


export function getTodos() {
  return todos
}

export function getTodoById(id) {
  return todos.find(todo => todo.id === id)
}

export function getTodosbyState(state) {
  return todos.filter(todo => todo.state === state)
}

export function createTodo(title, description) {
  const newTodo = {
    "id": uuidv4(),
    "title": title,
    "description": description,
    "state": "todo",
    "createdAt": Date.now(),
    "modifiedAt": Date.now()
  }
  todos.push(newTodo)
  return newTodo
}

export function updateTodo(id,title, description, state) {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
      todo.title = title
      todo.description = description
      todo.state = state
      todo.modifiedAt = Date.now()
      return todo
    }
    return null
}

export function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
        todos.splice(index, 1)
        return true
    }
    return false
}