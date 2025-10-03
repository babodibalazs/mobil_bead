export const initialState = {
    token: null,
    isLoading: true,
}

export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

const userReducer = (state, {payload, type}) => {
    switch (type) {
        case SIGN_IN:
            return {...state, token: payload}
        case SIGN_OUT:
            return {...state, token: null}
        default:
            return initialState
    }
}

export default userReducer