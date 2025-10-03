import { Tabs } from "expo-router";

export default function TabLayout() {

  return (
    <Tabs screenOptions={{ headerShown: true, headerTitleAlign: "center" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name="my_posts"
        options={{
          title: 'My Posts'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile'
        }}
      />
    </Tabs>
  )
}