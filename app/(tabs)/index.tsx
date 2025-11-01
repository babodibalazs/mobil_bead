import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";

import Dictionary from "@/utils/dictionary";

import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [userImages, setUserImages] = useState({})

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const getUserImages = async () => {
    if (comments.length != 0){
      let temp: Dictionary<string> = {}

      comments.forEach((comm: Dictionary<string>) => {
        const img = comm["img"]
        if (temp[img] == undefined){
          temp[img] = "C:\\Users\\Megathor\\OneDrive\\Desktop\\Egyetem\\code\\mobil\\mobil_bead\\assets\\profile\\" + img
        }
      })
      console.log(temp)
      setUserImages(temp)
    }
  }

  const submit = async () => {
    try {
      let userName: string = "Guest"
      let userImage: string = "default_user.jpg"

      if (user != undefined) {
        const q = query(collection(db, "users"), where("email", "==", user.email), limit(1))
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size != 0){
          querySnapshot.forEach((doc) => { 
            userName = doc.data()["username"],
            userImage = doc.data()["img"]
          })
        }
      }

      if (comment != ""){
        const docRef = await addDoc(collection(db, "comments"), {
          user: userName,
          comment: comment,
          post_time: new Date(Date.now()),
          img : userImage,
        });
        get_comments()
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const get_comments = async () => {
    const q = query(collection(db, "comments"), orderBy("post_time", "desc"))
    const querySnapshot = await getDocs(q);

    var temp = []
    querySnapshot.forEach((doc) => {
      temp.push(doc.data())
    });
    setComments(temp)
  }

  type ItemProps = {user: string, comment: string, date: Timestamp, img: string};

  const Item = ({user, comment, date, img}: ItemProps) => (
    <View style={styles.item}>
      <View style={styles.item_user_view}>
        <Image
          style={styles.item_image}
          source={require(`C:\\Users\\Megathor\\OneDrive\\Desktop\\Egyetem\\code\\mobil\\mobil_bead\\assets\\profile\\${img}`)}
        />
        <Text style={styles.item_user}>{user}</Text>
        <Text style={styles.item_date}>{"(" + date.toDate().toDateString() + ")"}</Text>
      </View>
      <Text style={styles.item_comment}>{comment}</Text>
    </View>
  );

  useEffect(() => {
    getUserImages()
    console.log(userImages)
  },[comments])

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    get_comments()
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
          renderItem={({item}) => <Item user={item.user} comment={item.comment} date={item.post_time} img={item.img} />}
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
    width: 120,
    height: 120,
    alignSelf: "center",
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
