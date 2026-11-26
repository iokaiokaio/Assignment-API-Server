import { afterEach, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../src/app.js'

let createdTodoIds = []

beforeEach(() => {
  createdTodoIds = []
})

afterEach(async () => {
  await Promise.all(
    createdTodoIds.map(id => request(app).delete(`/todos/${id}`))
  )
})

async function createTodo(title = 'Integration test todo') {
  const response = await request(app)
    .post('/todos')
    .send({ title, description: 'Created by an API integration test' })

  assert.equal(response.status, 201)
  if (response.body.id) {
    createdTodoIds.push(response.body.id)
  }

  return response
}

describe('GET /todos', () => {
  test('responds with 200 and a JSON array', async () => {
    const response = await request(app)
      .get('/todos')
      .expect('Content-Type', /json/i)
      .expect(200)

    assert.ok(Array.isArray(response.body))
    assert.ok(response.body.some(todo => todo.title === 'Study REST APIs'))
  })

  test('returns filtered CSV when the client requests text/csv', async () => {
    const created = await createTodo('Task, "quoted"')
    await request(app)
      .put(`/todos/${created.body.id}`)
      .send({
        title: created.body.title,
        description: created.body.description,
        state: 'done'
      })
      .expect(200)

    const response = await request(app)
      .get('/todos')
      .query({ state: 'done' })
      .set('Accept', 'text/csv')
      .expect('Content-Type', /text\/csv/i)
      .expect(200)

    assert.ok(response.text.startsWith('id,title,description,state,createdAt,modifiedAt\r\n'))
    assert.ok(response.text.includes('"Task, ""quoted"""'))
    assert.ok(response.text.includes(',done,'))
    assert.ok(!response.text.includes('Study REST APIs'))
  })

  test('responds with 400 for an invalid state filter', async () => {
    await request(app)
      .get('/todos')
      .query({ state: 'invalid' })
      .set('Accept', 'text/csv')
      .expect(400)
  })

  test('responds with 406 when no supported response format is accepted', async () => {
    await request(app)
      .get('/todos')
      .set('Accept', 'application/xml')
      .expect(406)
  })
})

describe('GET /todos/:id', () => {
  test('responds with 200 and the matching todo', async () => {
    const todos = await request(app).get('/todos').expect(200)
    const expectedTodo = todos.body.find(todo => todo.title === 'Study REST APIs')

    assert.ok(expectedTodo, 'The seeded todo should exist')

    const response = await request(app)
      .get(`/todos/${expectedTodo.id}`)
      .expect('Content-Type', /json/i)
      .expect(200)

    assert.deepStrictEqual(response.body, expectedTodo)
  })

  test('responds with 404 for a todo that does not exist', async () => {
    await request(app)
      .get('/todos/nonexistent-todo-id')
      .expect(404)
  })
})

describe('GET /todos/state', () => {
  test('returns todos matching a valid state', async () => {
    const response = await request(app)
      .get('/todos/state')
      .query({ state: 'todo' })
      .expect('Content-Type', /json/i)
      .expect(200)

    assert.ok(Array.isArray(response.body))
    assert.ok(response.body.every(todo => todo.state === 'todo'))
  })

  test('responds with 400 when the state is missing or invalid', async () => {
    await request(app).get('/todos/state').expect(400)
    await request(app)
      .get('/todos/state')
      .query({ state: 'invalid' })
      .expect(400)
  })
})

describe('POST /todos', () => {
  test('creates a todo and responds with 201 and the created object', async () => {
    const response = await createTodo()

    assert.match(response.headers['content-type'], /json/i)
    assert.equal(response.body.title, 'Integration test todo')
    assert.equal(response.body.description, 'Created by an API integration test')
    assert.equal(response.body.state, 'todo')
    assert.ok(response.body.id)
    assert.equal(typeof response.body.createdAt, 'number')
    assert.equal(typeof response.body.modifiedAt, 'number')
  })
})

describe('PUT /todos/:id', () => {
  test('updates an existing todo', async () => {
    const created = await createTodo()

    const response = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({
        title: 'Updated integration test todo',
        description: 'Updated by an API integration test',
        state: 'doing'
      })
      .expect('Content-Type', /json/i)
      .expect(200)

    assert.equal(response.body.id, created.body.id)
    assert.equal(response.body.title, 'Updated integration test todo')
    assert.equal(response.body.description, 'Updated by an API integration test')
    assert.equal(response.body.state, 'doing')
  })

  test('responds with 404 for a todo that does not exist', async () => {
    await request(app)
      .put('/todos/nonexistent-todo-id')
      .send({ title: 'Missing', description: 'Missing', state: 'todo' })
      .expect(404)
  })
})

describe('DELETE /todos/:id', () => {
  test('deletes an existing todo', async () => {
    const created = await createTodo()

    await request(app)
      .delete(`/todos/${created.body.id}`)
      .expect(200)

    await request(app)
      .get(`/todos/${created.body.id}`)
      .expect(404)
  })

  test('responds with 404 for a todo that does not exist', async () => {
    await request(app)
      .delete('/todos/nonexistent-todo-id')
      .expect(404)
  })
})
