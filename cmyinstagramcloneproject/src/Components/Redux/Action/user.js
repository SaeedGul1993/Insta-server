const User_Info_Method = (data) => {
    return (dispatch) => {
        dispatch({
            type: "USER_INFO",
            payload: data
        })
    }
}
const User_Update_Method = (data) => {
    return (dispatch) => {
        dispatch({
            type: "USER_UPDATE",
            payload: data
        })
    }
}

export { User_Info_Method, User_Update_Method };