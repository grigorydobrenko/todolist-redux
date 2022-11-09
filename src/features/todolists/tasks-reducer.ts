import {TasksStateType} from "../../app/App"
import {AddTodoListACType, RemoveTodolistAC, SetTodoListsType} from "./todolists-reducer"
import {ModelType, ResultCode, TaskType, todolistAPI} from "../../api/todolist-api"
import {AppRootStateType, AppThunk} from "../../app/store"
import {setAppError, setAppStatus, SetAppStatusType} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError} from "../../utils/error-utils";

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
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        case "SET-TASKS":
            return {...state, [action.todoId]: action.tasks}
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

export const fetchTasksTC = (todoId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.getTasks(todoId).then(res => {
        dispatch(setTasksAC(res.data.items, todoId))
        dispatch(setAppStatus('succeeded'))
    })
}

export const deleteTaskTC = (todoId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.deleteTask(todoId, taskId).then(res => {
        dispatch(removeTaskAC(taskId, todoId))
        dispatch(setAppStatus('succeeded'))
    })
}

export const createTaskTC = (todoId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.createTask(todoId, title).then(res => {
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTaskAC(todoId, res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    }).catch((e:AxiosError) => {
        dispatch(setAppError(e.message))
        dispatch(setAppStatus('failed'))
    }).finally(() => {
        dispatch(setAppStatus('idle'))
    })
}

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskType): AppThunk => (dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...value
        }
        dispatch(setAppStatus('loading'))
        todolistAPI.updateTask(todoId, taskId, model).then(res => {
            const updatedTask = res.data.data.item
            dispatch(updateTaskAC(taskId, updatedTask, todoId))
            dispatch(setAppStatus('succeeded'))
        })
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

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof updateTaskAC>
type setTasksACType = ReturnType<typeof setTasksAC>

type UpdateTaskType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}


