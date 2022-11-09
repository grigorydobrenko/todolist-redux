import {ResultCode, todolistAPI, TodolistType} from "../../api/todolist-api"
import {AppThunk} from "../../app/store"
import {RequestStatusType, SetAppErrorType, setAppStatus, SetAppStatusType} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";

const initialState: Array<TodoListDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(t => t.id !== action.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.newTitle} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case "SET-TODOS":
            return action.todos.map(t => ({...t, filter: "active", entityStatus: 'idle'}))
        case "SET-ENTITY-STATUS":
            return state.map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
        default:
            return state
    }
}

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const changeTodolistTitleAC = (id: string, newTitle: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    newTitle
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todos: TodolistType[]) => ({type: 'SET-TODOS', todos} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'SET-ENTITY-STATUS',
    id,
    status
} as const)

export const getTodoTC = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolists().then(res => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatus('succeeded'))
    })
}

export const deleteTodoTC = (todoId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    dispatch(changeTodolistEntityStatusAC(todoId, 'loading'))
    todolistAPI.deleteTodolist(todoId).then(res => {
        dispatch(removeTodolistAC(todoId))
        dispatch(setAppStatus('succeeded'))
    }).catch((e: AxiosError) => {
        dispatch(changeTodolistEntityStatusAC(todoId, 'idle'))
        handleServerNetWorkError(dispatch, e)
    })
}

export const createTodoTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.createTodolist(title).then(res => {
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTodolistAC(res.data.data.item))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    }).catch((e: AxiosError) => {
        handleServerNetWorkError(dispatch, e)
    }).finally(() => {
        dispatch(setAppStatus('idle'))
    })
}

export const changeTodoTitleTC = (todoId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatus('loading'))
    todolistAPI.updateTodolist(todoId, title).then(res => {
        dispatch(changeTodolistTitleAC(todoId, title))
        dispatch(setAppStatus('succeeded'))
    })
}

//types
export type FilterType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export type TodolistActionsType =
    AddTodoListACType
    | RemoveTodolistAC
    | ChangeTodolistTitleACType
    | ChangeTodolistFilterAC
    | SetTodoListsType
    | SetAppStatusType
    | SetAppErrorType
    | ChangeTodolistEntityStatusType


export type AddTodoListACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>
export type SetTodoListsType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>


