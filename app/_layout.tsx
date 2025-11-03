import ImagesProvider from "@/utils/imagesContext";
import { Stack } from "expo-router";
import '../config/firebase';
import UserProvider from '../utils/userContext';

export default function RootLayout() {
  return <ImagesProvider>
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider> 
  </ImagesProvider>
};
