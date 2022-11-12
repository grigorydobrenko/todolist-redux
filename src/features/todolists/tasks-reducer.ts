import {AddTodoListACType, RemoveTodolistAC, SetTodoListsType} from "./todolists-reducer"
import {ModelType, ResultCode, TaskType, todolistAPI} from "../../api/todolist-api"
import {AppRootStateType, AppThunk} from "../../app/store"
import {RequestStatusType, setAppStatus, SetAppStatusType} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TaskActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TODOS":
            let copyState = {...state}
            action.todos.forEach(el =>
                copyState[el.id] = []
            )
            return copyState
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {
                ...state,
                [action.todolistId]: [{...action.task, entityStatus: 'idle'}, ...state[action.todolistId]]
            }
        case "SET-TASKS":
            return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((el) => el.id === action.taskId ? {...el, ...action.task} : el)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const newState = {...state}
            delete newState[action.id]
            return newState
        case "SET-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((el) => el.id === action.TaskId ? {
                    ...el,
                    entityStatus: action.status
                } : el)
            }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (todolistId: string, task: TaskType) => ({type: 'ADD-TASK', todolistId, task} as const)
export const updateTaskAC = (taskId: string, task: UpdateTaskType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    taskId,
    task,
    todolistId
} as const)

export const setTasksAC = (tasks: TaskType[], todoId: string) => ({type: 'SET-TASKS', tasks, todoId} as const)
export const changeTaskEntityStatusAC = (todolistId: string, TaskId: string, status: RequestStatusType) => ({
    type: 'SET-TASK-ENTITY-STATUS',
    todolistId,
    TaskId,
    status
} as const)

export const fetchTasksTC = (todoId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.getTasks(todoId)
        dispatch(setTasksAC(res.data.items, todoId))
        dispatch(setAppStatus('succeeded'))
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}

export const deleteTaskTC = (todoId: string, taskId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatus('loading'))
        dispatch(changeTaskEntityStatusAC(todoId, taskId, 'loading'))
        const res = await todolistAPI.deleteTask(todoId, taskId)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(removeTaskAC(taskId, todoId))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}

export const createTaskTC = (todoId: string, title: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.createTask(todoId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTaskAC(todoId, res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskType): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...value
        }
        try {
            dispatch(setAppStatus('loading'))
            dispatch(changeTaskEntityStatusAC(todoId, taskId, 'loading'))
            const res = await todolistAPI.updateTask(todoId, taskId, model)
            if (res.data.resultCode === ResultCode.OK) {
                const updatedTask = res.data.data.item
                dispatch(updateTaskAC(taskId, updatedTask, todoId))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            const err = e as Error | AxiosError
            if (axios.isAxiosError(err)) {
                handleServerNetWorkError(dispatch, err)
            }
        } finally {
            dispatch(changeTaskEntityStatusAC(todoId, taskId, 'idle'))
        }

    }
}

//types
export type TaskActionsType =
    removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | AddTodoListACType
    | RemoveTodolistAC
    | SetTodoListsType
    | setTasksACType
    | SetAppStatusType
    | changeTaskEntityStatusACType

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof updateTaskAC>
type setTasksACType = ReturnType<typeof setTasksAC>
type changeTaskEntityStatusACType = ReturnType<typeof changeTaskEntityStatusAC>

type UpdateTaskType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [id: string]: TaskDomainType[]
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}


