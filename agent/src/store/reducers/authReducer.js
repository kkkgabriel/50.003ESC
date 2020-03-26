import * as actionTypes from '../actions/actionTypes'

const initialAuth = {
    token: null,
    email: null,
    userId: null,
    displayName: null,
    loading: false,
    error: null
}

const authFail = (state, action) => {
    return {
        ...state,
        error: action.error,
        loading: false
    }
}

const authStart = (state, action) => {
    return {
        ...state,
        error: null,
        loading: true
    }
}

const authSuccess = (state, action) => {
    return {
        ...state,
        email: action.email,
        token: action.token,
        userId: action.userId,
        displayName: action.displayName,
        loading: false,
        error: null
    }
}

const authSignOut = (state, action) => {
    return {
        ...state,
        email: null,
        token: null,
        userId: null,
        displayName: null,
        loading: false,
        error: null
    }
}
const reducer = (state = initialAuth, action) => {
    switch(action.type){
        case actionTypes.AUTH_FAIL:
            return authFail(state, action)
        case actionTypes.AUTH_START:
            return authStart(state, action)
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action)
        case actionTypes.AUTH_SIGNOUT:
            return authSignOut(state,action)
        default:
            break;
    }
    return state
}

export default reducer