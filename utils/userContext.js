import * as SecureStore from 'expo-secure-store';
import { createContext, useReducer } from 'react';

import { auth } from '../config/firebase';
import userReducer, { SIGN_IN, SIGN_OUT, initialState } from './userReducer';

export const UserContext = createContext();

const UserProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, initialState)

  const authContext = {
    login: async({userName, password}) => {
      const { user } = await auth.sighInWithEmailAndPassword(userName, password)
      const token = await user.getIdToken()
      await SecureStore.setItemAsync('userToken', token)
      dispatch({type: SIGN_IN, payload: token})
    },
    logout: async() => {
      await auth.signOut()
      await SecureStore.deleteItemAsync("userToken")
      dispatch({type:SIGN_OUT})
    },
    user
  }

  return <UserContext.Provider value={authContext} {...props} />;
};

export default UserProvider;
