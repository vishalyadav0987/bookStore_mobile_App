import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from '../components/SafeScreen'
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from '../store/authStore'

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments();
  // console.log("segemets: ", segments);
  // if i on login page ---->  segemets:  ["(auth)"]
  // if i on register page ---->  segemets:  ["(auth)", "signup"]

  const { token, user, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [])

  // Handle navigattion based on the auth State
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isLoggedIn = user && token;

    if (!isLoggedIn && !inAuthScreen) router.replace('/(auth)');
    else if (isLoggedIn && inAuthScreen) router.replace('/(tabs)');

  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          {/* createing routes here  */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
