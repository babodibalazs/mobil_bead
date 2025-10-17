import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function My_Posts() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [comments, setComments] = useState({})

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const get = async () => {
    const q = query(collection(db, "comments"))
    const querySnapshot = await getDocs(q);

    var temp = []
    querySnapshot.forEach((doc) => {
      if (user != undefined && user.email == doc.data()["user"]){
        temp.push(doc.data())
      }
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
      <Text style={{color: "red", fontWeight: "bold"}}>{(user != undefined) ? "" : "Guests can't view previuos posts"}</Text>
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
    paddingBottom: 10,
    fontWeight: "bold"
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
