import { v4 as uuidv4 } from 'uuid'

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

export { todos }