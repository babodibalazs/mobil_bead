export const initialState = {
    token: null,
    isLoading: true,
    error: null,
}

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const ERROR = 'ERROR'

const userReducer = (state, {payload, type}) => {
    switch (type) {
        case SIGN_IN:
            return {...state, token: payload}
        case SIGN_OUT:
            return {...state, token: null}
        case ERROR:
            return {...state, error: payload}
        default:
            return initialState
    }
}

export default userReducer