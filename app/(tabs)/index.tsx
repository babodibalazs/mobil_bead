import { auth, db } from "@/config/firebase";
import * as Notifications from 'expo-notifications';
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

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
    const q = query(collection(db, "comments"), orderBy("post_time", "desc"))
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
      <View style={styles.item_user_view}>
        <Image
          style={styles.item_image}
          source={require("C:\\Users\\Megathor\\OneDrive\\Desktop\\Egyetem\\code\\mobil\\mobil_bead\\assets\\images\\default_user.jpg")} 
        />
        <Text style={styles.item_user}>{user}</Text>
        <Text style={styles.item_date}>{"(" + date.toDate().toDateString() + ")"}</Text>
      </View>
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
    backgroundColor: "#eeeeee",
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
    flexDirection: "row",
    fontSize: 18,
    borderColor: "black",
    borderWidth: 2
  },
  item_user_view: {
    width: 160,
    padding: 5,
    alignContent: "center",
    borderColor: "black",
    borderRightWidth: 1,
    backgroundColor: "#dddddd"
  },
  item_image: {
    width: "100%",
    height: 150,
    borderColor: "black",
    borderWidth: 1,
  },
  item_user: {
    textAlign: "center",
    fontWeight: "bold",
  },
  item_date: {
    textAlign: "center",
    fontStyle: "italic",
  },
  item_comment : {
    flex: 1,
    padding: 4,
    backgroundColor: "white"
  },
})
