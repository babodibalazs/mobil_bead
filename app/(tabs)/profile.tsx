import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import useUser from "../../hooks/useUser";

import sleep from "@/utils/sleep";
import { useState } from "react";
import { Button, Platform, StyleSheet, Text, TextInput, View } from "react-native";

const Profile = () => {
  const [email, setEmail] = useState("asd@asd.com")
  const [password, setPasword] = useState("asdasd")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const {login, logout} = useUser()

  const login_action = async () => {
    setError("")
  
    let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let email_check = email.match(email_regex)

    // console.log(email)
    // console.log(email_check?.[0])
    
    if (email_check != null) {
      login({email, password})
      setError("Checking credentials...")
      await sleep(1000)
      if (Platform.OS === "web") {
        setLoggedIn(await AsyncStorage.getItem('userToken') != null)
      } else {
        setLoggedIn(await SecureStore.getItemAsync('userToken') != null)
      }
      setError("")
      if (!loggedIn) {
        setError("Wrong password")
      }
    } else {
      setError("Wrong email format")
    }
  }
  
  if (!loggedIn) {
    return (
      <View style={styles.base_view}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}/>
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPasword}/>
        <Button title="Login" onPress={(e) => login_action()} />
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.base_view}>
        <Text style={styles.text}>Logged in as {email}</Text>
        <Button title="Logout" onPress={(e) => {logout(), setLoggedIn(false)}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  base_view: {
    flex: 1,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 30,
    margin: 6,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
  text: {
    padding: 10
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: 6
  }
});

export default Profile;