import { afterEach, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  getTodosbyState,
  updateTodo
} from '../src/services/todos.js'

let createdTodoIds = []

beforeEach(() => {
  createdTodoIds = []
})

afterEach(() => {
  createdTodoIds.forEach(id => deleteTodo(id))
})

function makeTodo(title = 'Unit test todo', description = 'Created in a unit test') {
  const todo = createTodo(title, description)
  createdTodoIds.push(todo.id)
  return todo
}

describe('Todo queries', () => {
  test('gets all todos', () => {
    const todos = getTodos()

    assert.ok(Array.isArray(todos))
    assert.ok(todos.some(todo => todo.title === 'Study REST APIs'))
  })

  test('gets a todo by id', () => {
    const expectedTodo = makeTodo()

    assert.equal(getTodoById(expectedTodo.id), expectedTodo)
  })

  test('gets todos by state', () => {
    const expectedTodo = makeTodo()
    const todos = getTodosbyState('todo')

    assert.ok(Array.isArray(todos))
    assert.ok(todos.includes(expectedTodo))
    assert.ok(todos.every(todo => todo.state === 'todo'))
  })

  test('returns undefined for a missing todo id', () => {
    assert.equal(getTodoById('missing-todo-id'), undefined)
  })
})

describe('Todo creation and updates', () => {
  test('creates a todo', () => {
    const todo = makeTodo()

    assert.equal(getTodoById(todo.id), todo)
    assert.equal(todo.title, 'Unit test todo')
    assert.equal(todo.description, 'Created in a unit test')
    assert.equal(todo.state, 'todo')
  })

  test('updates an existing todo', () => {
    const todo = makeTodo()

    const updatedTodo = updateTodo(
      todo.id,
      'Updated unit test todo',
      'Updated in a unit test',
      'doing'
    )

    assert.equal(updatedTodo, todo)
    assert.equal(todo.title, 'Updated unit test todo')
    assert.equal(todo.description, 'Updated in a unit test')
    assert.equal(todo.state, 'doing')
  })

  test('returns null when updating a missing todo', () => {
    const todo = updateTodo(
      'missing-todo-id',
      'Missing todo',
      'Should not be updated',
      'doing'
    )

    assert.equal(todo, null)
  })
})

describe('Todo deletion', () => {
  test('deletes an existing todo', () => {
    const todo = makeTodo()

    assert.equal(deleteTodo(todo.id), true)
    assert.equal(getTodoById(todo.id), undefined)
  })

  test('returns false when deleting a missing todo', () => {
    assert.equal(deleteTodo('missing-todo-id'), false)
  })
})
