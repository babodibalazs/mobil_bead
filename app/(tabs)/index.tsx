import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState({})

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
      get()
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const get = async () => {
    const q = query(collection(db, "comments"))
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setComments(doc.data())
    });
  }

  type ItemProps = {title: string};

  const Item = ({title}: ItemProps) => (
    <View style={styles.base}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );

  useEffect(() => {
    get()
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.base}>
      <Text style={styles.text}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <TextInput style={styles.input} value={comment} onChangeText={setComment}/>
      <Button title="Submit" onPress={(e) => {submit()}} />
      <FlatList
        data={[comments]}
        renderItem={({item}) => <Item title={item.data} />}
        keyExtractor={item => item.id}
      />
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
