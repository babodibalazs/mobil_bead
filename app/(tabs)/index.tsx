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
      <Text style={styles.item_user}>{user + " (" + date.toDate().toDateString() + ")"}</Text>
      <Text style={styles.item_comment}>{comment}</Text>
    </View>
  );

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    get()
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.base}>
      <Text style={styles.welcome}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <TextInput multiline style={styles.input} value={comment} onChangeText={setComment}/>
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
  welcome: {
    paddingTop: 4,
    fontWeight: "bold"
  },
  input: {
    width: "80%",
    height: 100,
    justifyContent: "flex-start",
    margin: 6,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
  list: {
    flex: 1,
    flexDirection: "row",
    width: "90%",
    paddingTop: 22,
    paddingBottom: 10
  },
  item: {
    flex: 1,
    flexDirection: "column",
    fontSize: 18,
    height: 44,
    borderColor: "black",
    borderWidth: 2
  },
  item_user: {
    fontStyle: "italic",
    padding: 4,
    borderColor: "black",
    borderBottomWidth: 1
  },
  item_comment : {
    padding: 4,
  },
})
