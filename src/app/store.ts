import {TaskActionsType, tasksReducer} from '../features/todolists/tasks-reducer'
import {TodolistActionsType, todolistsReducer} from '../features/todolists/todolists-reducer'
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk"
import {appReducer, setIsInitializedACACType} from "./app-reducer";
import {authReducer, setIsLoggedInACType} from "../features/login/auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk))
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store


// type AppActionsType = TodosActionsType


type AppEntitiesActionsType = TaskActionsType | TodolistActionsType | setIsLoggedInACType | setIsInitializedACACType

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
// export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionsType>
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppActionsType>


export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppEntitiesActionsType>
