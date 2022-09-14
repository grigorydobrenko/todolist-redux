import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    value: string
    callBack: (newTitle: string) => void
}

const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    console.log('edit span')
    const {value, callBack} = props

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(value)

    const ActivateEditMode = () => {
        setEditMode(!editMode)
        callBack(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }


    return (
        editMode ?

            <TextField
                onChange={onChangeHandler}
                value={title}
                onBlur={ActivateEditMode}
                autoFocus
                variant="outlined"
                size="small"/>
            :
            <span onDoubleClick={ActivateEditMode}>{value}</span>
    );
})

export default EditableSpan;