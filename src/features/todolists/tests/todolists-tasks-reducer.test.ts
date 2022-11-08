import {TasksStateType} from "../../../app/App"
import {tasksReducer} from "../tasks-reducer"
import {AddTodolistAC, TodoListDomainType, todolistsReducer} from "../todolists-reducer"
import {TodolistType} from "../../../api/todolist-api"

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListDomainType> = []

    const todolist: TodolistType = {
        id: 'blabla',
        title: 'newTodolistTitle',
        order: 0,
        addedDate: ''
    }

    const action = AddTodolistAC(todolist)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})
