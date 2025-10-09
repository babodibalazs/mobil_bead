import useUser from "@/hooks/useUser";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, } from "react-native";

const Profile = () => {
  const [email, setEmail] = useState("asd@asd.com")
  const [password, setPasword] = useState("asdasd")
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const {login, logout} = useUser()

  
  const login_action = () => {
    setError("")
  
    let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let email_check = email.match(email_regex)

    // console.log(email)
    // console.log(email_check?.[0])
    
    if (email_check != null) {
      setLoggedIn(true)
      login({email, password})
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
        <Button title="Logout" onPress={(e) => logout()} />
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