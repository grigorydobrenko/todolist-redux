import {Dispatch} from "redux";
import {setAppErrorAC, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../app/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerAppError = <D>(dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('some error'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetWorkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: {message: string})=> {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

export type ErrorUtilsDispatchType = setAppErrorACType | setAppStatusACType


