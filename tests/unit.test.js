import { describe, test } from "node:test"
import assert from "node:assert/strict"
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, getTodosbyState } from '../services/todos.js'

describe("Todos Get Test", () => {
    test("Get all Todos", () => {
        const todos = getTodos()
        assert.equal(todos.length, 1)
        assert.ok(users.some(todo => todo.title === "Study REST APIs"))
    })
    test("Test get todo by id", () => {
        const todos = getTodos()
        const todo = todos[0].id
        assert.deepStrictEqual(todo, todos[0])
    })
    test("Get Todos by state", () => {
        const todo = getTodosbyState("todo")
        assert.equal(todo.title="Study REST APIs")
    })
    test("get Undifined back", () => {
        const todo = getTodoById(632574)
        assert.equal(todo, undefined)
    })
})
describe("Create and update a Todo", () => {
    test("create a todo", () => {
        const todo=createTodo("test Todo", "todo test")
        assert.equal(getTodoById(todo.id), todo)
    })
    test("update a todo", () => {
        const todos = getTodos()
        const todo = todos[0]
        const todoAfter = updateTodo(todo.id, "Test change title", "Test change description", "doing")
        assert.equal(todoAfter, todos[0]) 
    })
    test("Todo to update not found", () => {
        const todo = updateTodo(7132892683479, "Test change title", "Test change description", "doing")
        assert.equal(todo, undefined) 
    })
})
describe("Delete a task", () => {
    test("Delete a task", () => {
        const todos = getTodos
        const todo = todos[0]
        assert.ok(deleteTodo(todo.id))
        assert.equal(getTodoById(todo.id), undefined)
    })
    test("Task not found", () => {
        assert.ok(deleteTodo(8732618794))
    })
})
