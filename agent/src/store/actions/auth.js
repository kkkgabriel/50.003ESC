import * as actionTypes from './actionTypes'

export const authStart = () => {
    console.log("[Reducer] Start")
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (email, userId, displayName, token) => {
    console.log("[Reducer] Success")
    return {
        type: actionTypes.AUTH_SUCCESS,
        email: email,
        userId: userId,
        displayName: displayName,
        token: token
    }
}

export const authFail = (error) => {
    console.log("[Reducer] Fail")
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}