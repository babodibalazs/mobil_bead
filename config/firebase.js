import Constants from "expo-constants";
import firebase from "firebase/app";

import 'firebase/auth';
import 'firebase/firestore';

const {firebaseConfig} = Constants.expoConfig.extra
console.log(firebaseConfig)

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const db = firebase.firestore()
export default firebase
