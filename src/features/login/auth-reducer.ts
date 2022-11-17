import {setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer";
import {LoginPayloadType} from "./Login";
import {AppThunk} from "../../app/store";
import {authAPI, ResultCode} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)


// thunks
export const loginTC = (data: LoginPayloadType): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
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

export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, res.data )
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}




// types

export type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
type ActionsType = setIsLoggedInACType | setAppStatusACType | setAppErrorACType
