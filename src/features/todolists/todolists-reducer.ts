import {ResultCode, todolistAPI, TodolistType} from "../../api/todolist-api"
import {AppThunk} from "../../app/store"
import {RequestStatusType, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
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
        case "SET-TODOLIST-ENTITY-STATUS":
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
    type: 'SET-TODOLIST-ENTITY-STATUS',
    id,
    status
} as const)

export const getTodoTC = (): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}

export const deleteTodoTC = (todoId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todoId, 'loading'))
        await todolistAPI.deleteTodolist(todoId)
        dispatch(removeTodolistAC(todoId))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        dispatch(changeTodolistEntityStatusAC(todoId, 'idle'))
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }

}

export const createTodoTC = (title: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTodolistAC(res.data.data.item))
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

export const changeTodoTitleTC = (todoId: string, title: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todoId, 'loading'))
        const res = await todolistAPI.updateTodolist(todoId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(changeTodolistTitleAC(todoId, title))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    } finally {
        dispatch(changeTodolistEntityStatusAC(todoId, 'idle'))
    }

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
    | setAppStatusACType
    | setAppErrorACType
    | ChangeTodolistEntityStatusType


export type AddTodoListACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>
export type SetTodoListsType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>


