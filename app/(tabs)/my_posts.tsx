import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function My_Posts() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.base}>
      <Text style={styles.text}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <Text style={{color: "red", fontWeight: "bold"}}>{(user != undefined) ? "" : "Guests can't view previuos posts"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold"
  }
})
