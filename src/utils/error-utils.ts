import {Dispatch} from "redux";
import {setAppError, SetAppErrorType, setAppStatus, SetAppStatusType} from "../app/app-reducer";
import {ResponseType} from "../api/todolist-api";

export const handleServerAppError = <D>(dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('some error'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetWorkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: {message: string})=> {
    dispatch(setAppError(error.message))
    dispatch(setAppStatus('failed'))
}

type ErrorUtilsDispatchType = SetAppErrorType | SetAppStatusType

