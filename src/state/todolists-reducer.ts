import {FilterType, TodoListsType, TodoListType} from "../App";
import {v1} from "uuid";

export const todolistsReducer = (state: TodoListsType, action: TsarType):TodoListsType => {
    switch (action.type) {
        case 'ADD-TODOLIST': {

            const newTodo: TodoListType = {id: action.payload.todolistId, title: action.payload.todolistTitle, filter: 'all'}
            return [...state, newTodo]

        }
        case 'REMOVE-TODOLIST': {
            return state.filter(t => t.id !== action.payload.todolistId)
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(t => t.id === action.payload.todolistId ? {...t, title: action.payload.newTitle} : {...t})
        }

        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(t => t.id === action.payload.todolistID ? {...t, filter: action.payload.filter} : {...t})

        }


        default:
            return state
    }
}

export type TsarType = AddTodoListACType | RemoveTodolistAC | ChangeTodolistTitleACType | ChangeTodolistFilterAC


export type AddTodoListACType = ReturnType<typeof AddTodolistAC>

export const AddTodolistAC = (todolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolistTitle,
            todolistId: v1()
        }
    } as const
}


export type RemoveTodolistAC = ReturnType<typeof RemoveTodolistAC>
export const RemoveTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistId
        }
    } as const
}


type ChangeTodolistTitleACType = ReturnType<typeof ChangeTodolistTitleAC>
export const ChangeTodolistTitleAC = (todolistId: string, newTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId,
            newTitle
        }
    } as const
}

type ChangeTodolistFilterAC = ReturnType<typeof ChangeTodolistFilterAC>

export const ChangeTodolistFilterAC = (todolistID: string, filter: FilterType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            todolistID, filter
        }
    } as const

}