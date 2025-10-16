import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, query, Timestamp } from "firebase/firestore";
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
        comment: comment,
        post_time: new Date(Date.now())
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

    var temp = []
    querySnapshot.forEach((doc) => {
      temp.push(doc.data())
    });
    setComments(temp)
  }

  type ItemProps = {user: string, comment: string, date: Timestamp};

  const Item = ({user, comment, date}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.item_text}>{user + " (" + date.toDate().toDateString() + ")"}</Text>
      <Text style={styles.item_text}>{comment}</Text>
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
      <View style={styles.list}>
        <FlatList
          data={comments}
          renderItem={({item}) => <Item user={item.user} comment={item.comment} date={item.post_time} />}
          keyExtractor={item => item.id}
        />
      </View>
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
  list: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  item_text: {
    fontStyle: "italic"
  },
})
