const initialStates = {
    userExist: {}
}

const UserReducer = (state = initialStates, action) => {
    if (action.type === "USER_INFO") {
        return { ...state, userExist: action.payload }
    }
    if (action.type === "USER_UPDATE") {
        return {
            ...state, userExist: action.payload
        }
    }
    return state;
}

export default UserReducer;