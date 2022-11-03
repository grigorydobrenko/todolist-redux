import {TasksStateType} from "../App";
import {AddTodoListACType, RemoveTodolistAC, SetTodoListsType} from "./todolists-reducer";
import {ModelType, TaskType, todolistAPI} from "../api/todolist-api";
import {AppRootStateType, AppThunk} from "./store";

const initialState: TasksStateType = {}


export const tasksReducer = (state = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS": {
            let copyState = {...state}
            action.todos.forEach(el =>
                copyState[el.id] = []
            )
            return copyState
        }
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        }

        case "ADD-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]
            }
        }

        case "SET-TASKS": {
            return {
                ...state,
                [action.payload.todoId]: action.payload.tasks
            }
        }

        case 'UPDATE-TASK': {

            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((el) => el.id === action.payload.task.id ? {...el, ...action.payload.task} : el)
            }
        }

        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.payload.TodolistId]: state[action.payload.TodolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    title: action.payload.newTitle
                } : {...t})
            }
        }

        case 'ADD-TODOLIST': {
            return {...state, [action.payload.todolistId]: []}
        }

        case 'REMOVE-TODOLIST': {
            const newState = {...state}
            delete newState[action.payload.todolistId]
            return newState
        }

        default:
            return state
    }
}

export type TaskActionsType =
    removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodoListACType
    | RemoveTodolistAC
    | SetTodoListsType
    | setTasksACType


type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof updateTaskAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type setTasksACType = ReturnType<typeof setTasksAC>

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}

export const addTaskAC = (todolistId: string, task: TaskType) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistId,
            task
        }
    } as const
}

export const updateTaskAC = (taskId: string, task: TaskType, todolistId: string) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            taskId,
            task,
            todolistId
        }
    } as const
}


export const changeTaskTitleAC = (TodolistId: string, taskId: string, newTitle: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            TodolistId,
            taskId,
            newTitle
        }
    } as const
}

export const setTasksAC = (tasks: TaskType[], todoId: string) => {
    return {
        type: 'SET-TASKS',
        payload: {
            tasks,
            todoId
        }
    } as const
}


export const fetchTasksTC = (todoId: string): AppThunk => (dispatch) => {
    todolistAPI.getTasks(todoId).then(res => {
        dispatch(setTasksAC(res.data.items, todoId))
    })
}

export const deleteTaskTC = (todoId: string, taskId: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTask(todoId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todoId))
    })
}

export const createTaskTC = (todoId: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.createTask(todoId, title).then(res => {
        dispatch(addTaskAC(todoId, res.data.data.item))
    })
}

type UpdateTaskType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}


export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...value
        }
        todolistAPI.updateTask(todoId, taskId, model).then(res => {
            const updatedTask = res.data.data.item
            dispatch(updateTaskAC(taskId, updatedTask, todoId))
        })
    }
}



