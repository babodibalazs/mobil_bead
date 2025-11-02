import useUser from "../../hooks/useUser";

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const Profile = () => {
  const [email, setEmail] = useState("asd@asd.com")
  const [password, setPasword] = useState("asdasd")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const {user, signup, login, logout, reset} = useUser()

  const login_action = async () => {
    setError("")
  
    let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let email_check = email.match(email_regex)

    if (email_check != null) {
      reset()
      setError("Loading...")
      await login({email, password})
      console.log(user)
      if (user["error"] == null){
        setLoggedIn(true)
        setError("")
      } else {
        const type = user["error"]
        switch (type) {
          case "auth/too-many-requests": setError("Too many requests"); break
          case "auth/invalid-credential": setError("Invalid credentials"); break
          default: setError("Unknown error"); break
        }
      }
    } else {
      setError("Wrong email format")
    }
  }

  const signup_action = async () => {
    setError("")
  
    let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let email_check = email.match(email_regex)

    if (email_check != null) {
      setError("Loading...")
      await signup({email, password})
      setLoggedIn(await user["token"] != null)
      setError("")
      if (!loggedIn) {
        setError("Invalid credentials")
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
        <View>
          <Button title="Login" onPress={(e) => login_action()} />
          <Button title="Signup" onPress={(e) => signup_action()} />
        </View>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.base_view}>
        <Text style={styles.text}>Logged in as: {email}</Text>
        <Button title="Logout" onPress={(e) => {logout(), setLoggedIn(false), setError("")}} />
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
    height: 40,
    width: 180,
    margin: 6,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
  text: {
    padding: 10,
    fontWeight: "bold"
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: 6
  }
});

export default Profile;