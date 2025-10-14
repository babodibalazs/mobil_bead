import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [comment, setComment] = useState("")

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const submit = async () => {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        user: (user != undefined) ? user.email : "Guest",
        comment: comment
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.base}>
      <Text style={styles.text}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <TextInput style={styles.input} value={comment} onChangeText={setComment}/>
      <Button title="Submit" onPress={(e) => {submit()}} />
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
  },
  input: {
    height: "auto",

    margin: 6,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
})
