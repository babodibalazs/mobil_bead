import { auth, db } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, Platform, StyleSheet, Text, TextInput, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const submit = async () => {
    try {
      let userName: string = "Guest"

      if (user != undefined) {
        const q = query(collection(db, "users"), where("email", "==", user.email), limit(1))
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size != 0){
          querySnapshot.forEach((doc) => { 
            userName = doc.data()["username"]
          })
        }
      }

      if (comment != ""){
        const docRef = await addDoc(collection(db, "comments"), {
          user: userName,
          comment: comment,
          post_time: new Date(Date.now()),
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

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Random Forum",
        body: `${(user != undefined) ? user.email : "A Guest"} has just posted`,
        data: { data: comment, test: { test1: 'more data' } },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('myNotificationChannel', {
        name: 'A channel is needed for the permissions prompt to appear',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  type ItemProps = {user: string, comment: string, date: Timestamp};

  const Item = ({user, comment, date}: ItemProps) => (
    <View style={styles.item}>
      <View style={styles.item_user_view}>
        <Image
          style={styles.item_image}
          source={require("./img/default_user.jpg")}
        />
        <Text style={styles.item_user}>{user}</Text>
        <Text style={styles.item_date}>{"(" + date.toDate().toDateString() + ")"}</Text>
      </View>
      <Text style={styles.item_comment}>{comment}</Text>
    </View>
  );

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    get_comments()
    return subscriber;
  }, []);

    useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  if (initializing) return null;
 
  return (
    <View style={styles.base}>
      <Text style={styles.welcome}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <TextInput multiline style={styles.input} value={comment} onChangeText={setComment}/>
      <Button title="Submit" onPress={async (e) => {submit(); schedulePushNotification()}} />
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
