import { auth } from "@/config/firebase";
import useImages from "@/hooks/useImages";
import * as ImagePicker from 'expo-image-picker';
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function Settings() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const {uploadImage, list} = useImages()

  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
      list()
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <View style={styles.base}>
      <Text style={styles.welcome}>Welcome {(user != undefined) ? user.email : "Guest"}</Text>
      <Text style={{color: "red", fontWeight: "bold"}}>{(user != undefined) ? "" : "Guests can't change their settings"}</Text>
      <Button title="Upload Profile Image" onPress={pickImage} />
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
