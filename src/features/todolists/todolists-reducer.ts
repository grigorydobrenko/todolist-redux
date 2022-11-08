import {todolistAPI, TodolistType} from "../../api/todolist-api"
import {AppThunk} from "../../app/store"

const initialState: Array<TodoListDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(t => t.id !== action.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.newTitle} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case "SET-TODOS":
            return action.todos.map(el => ({...el, filter: "active"}))
        default:
            return state
    }
}

export const AddTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const RemoveTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const ChangeTodolistTitleAC = (id: string, newTitle: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    newTitle
} as const)
export const ChangeTodolistFilterAC = (id: string, filter: FilterType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todos: TodolistType[]) => ({type: 'SET-TODOS', todos} as const)

export const getTodoTC = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolists().then(res => {
        dispatch(setTodolistsAC(res.data))
    })
}

export const deleteTodoTC = (todoId: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTodolist(todoId).then(res => {
        dispatch(RemoveTodolistAC(todoId))
    })
}

export const createTodoTC = (title: string): AppThunk => (dispatch) => {
    todolistAPI.createTodolist(title).then(res => {
        dispatch(AddTodolistAC(res.data.data.item))
    })
}

export const changeTodoTitleTC = (todoId: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.updateTodolist(todoId, title).then(res => {
        dispatch(ChangeTodolistTitleAC(todoId, title))
    })
}

//types
export type FilterType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodolistType & {
    filter: FilterType
}

export type TodolistActionsType =
    AddTodoListACType
    | RemoveTodolistAC
    | ChangeTodolistTitleACType
    | ChangeTodolistFilterAC
    | SetTodoListsType


export type AddTodoListACType = ReturnType<typeof AddTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof RemoveTodolistAC>
export type ChangeTodolistTitleACType = ReturnType<typeof ChangeTodolistTitleAC>
export type ChangeTodolistFilterAC = ReturnType<typeof ChangeTodolistFilterAC>
export type SetTodoListsType = ReturnType<typeof setTodolistsAC>


