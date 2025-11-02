import { createContext, useReducer } from 'react';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import userReducer, { ERROR, initialState, SIGN_IN, SIGN_OUT } from './userReducer';

export const UserContext = createContext();

const UserProvider = (props: any) => {
  const [user, dispatch] = useReducer(userReducer, initialState)

  const authContext = {
    signup: async({email, password}) => {
      await createUserWithEmailAndPassword(auth, email, password).then(async (userCred) => {
        const token = await userCred.user.getIdToken()
        dispatch({type: SIGN_IN, payload: token})
      }).catch((err: Error) => {
        const err_type = err.message.substring(17, err.message.length - 2)
        dispatch({type: ERROR, payload: err_type})
      })
    },
    login: async({email, password}) => {
      await signInWithEmailAndPassword(auth, email, password).then(async (userCred) => {
        const token = await userCred.user.getIdToken()
        dispatch({type: SIGN_IN, payload: token})
      }).catch((err: Error) => {
        const err_type = err.message.substring(17, err.message.length - 2)
        dispatch({type: ERROR, payload: err_type})
      })
    },
    logout: async() => {
      await auth.signOut()
      dispatch({type: SIGN_OUT, payload: null})
    },
    reset: async() => {
      dispatch({type: ERROR, payload: null})
    },
    user
  }

  return <UserContext.Provider value={authContext} {...props} />;
};

export default UserProvider;
