import { Slot, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import "../../global.css";
import Toast from "react-native-toast-message";
import AppProvider from "./context/appContext";
const RootLayout = () => {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/start"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "Trang chu",
          }}
        />

        <Stack.Screen
          name="(user)/YourDeck"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="(user)/study"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />

        <Stack.Screen
          name="(user)/lessons"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(user)/exercises"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(user)/learnCard"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(user)/cards"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(user)/SavedDeck"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(user)/ExamPage"
          options={{
            animation: "slide_from_right",
            gestureEnabled: true,
          }}
        />
      </Stack>
      <Toast />
    </AppProvider>
  );
};
export default RootLayout;
