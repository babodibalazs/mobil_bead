import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext, useReducer } from 'react';
import { Platform } from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import userReducer, { SIGN_IN, SIGN_OUT, initialState } from './userReducer';

export const UserContext = createContext();

const UserProvider = (props: any) => {
  const [user, dispatch] = useReducer(userReducer, initialState)

  const authContext = {
    login: async({email, password}) => {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const token = await user.getIdToken()
      if (Platform.OS === "web") {
        await AsyncStorage.setItem('userToken', token)
      } else {
        await SecureStore.setItemAsync('userToken', token)
      }
      dispatch({type: SIGN_IN, payload: token})
    },
    logout: async() => {
      await auth.signOut()
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem('userToken')
      } else {
        await SecureStore.deleteItemAsync('userToken')
      }
      dispatch({type: SIGN_OUT, payload: null})
    },
    user
  }

  return <UserContext.Provider value={authContext} {...props} />;
};

export default UserProvider;
