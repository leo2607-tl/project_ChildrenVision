import { Stack } from 'expo-router';

type RootStackParamList = {
  index: undefined;
  Home: undefined;
  Play: undefined;
  Profile: undefined;
  Hide: undefined;
};

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/HideScreen" options={{ headerShown: false , title: ""}} />
      <Stack.Screen name="screens/FruitScreen" options={{ headerShown: false , title: ""}} />
      <Stack.Screen name="screens/ProfileScreen" options={{ headerShown: false , title: ""}} />
      <Stack.Screen name="screens/HomeScreen" options={{ headerShown: false , title: ""}} />
    </Stack>
  );
}
