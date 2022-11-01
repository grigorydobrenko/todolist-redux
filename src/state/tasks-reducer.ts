import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListACType, RemoveTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

const initialState: TasksStateType = {}


export const tasksReducer = (state = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        }
        case 'ADD-TASK': {
            const newTask: TaskType = {
                id: v1(),
                title: action.payload.newTitle,
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: action.payload.todolistId,
                order: 0,
                addedDate: ''
            }
            return {...state, [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]}
        }

        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    status: action.payload.status
                } : t)
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


type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}

export const addTaskAC = (newTitle: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            newTitle,
            todolistId
        }
    } as const
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            status,
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


