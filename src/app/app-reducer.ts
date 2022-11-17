import {AppThunk} from "./store";
import {setIsLoggedInAC} from "../features/login/auth-reducer";
import {authAPI, ResultCode} from "../api/todolist-api";
import {handleServerAppError, handleServerNetWorkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false as boolean
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.value}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (value: string | null) => ({type: 'APP/SET-ERROR', value} as const)
export const setIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'APP/SET-INITIALIZED', isInitialized} as const)


export const initializeAppTC = (): AppThunk => async (dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    } finally {
        dispatch(setIsInitializedAC(true))
    }

}

export type AppActionsType = setAppStatusACType | setAppErrorACType | setIsInitializedACACType
export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type setIsInitializedACACType = ReturnType<typeof setIsInitializedAC>