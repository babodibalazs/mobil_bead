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

  if (user != undefined) {
    return (
      <View style={styles.base}>
        <Text>Welcome {user.email}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.base}>
        <Text>Welcome Guest</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})
