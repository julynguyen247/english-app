import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import tw from "twrnc";

import { APP_COLOR } from "@/utils/constant";
import { login } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;

const SignIn = () => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isButtonActive = username.length > 0 && password.length > 0;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignIn = async () => {
    if (!username || !password) {
      Toast.show({
        type: "error",
        text1: "Missing information",
        text2: "Please enter both username and password.",
      });
      return;
    }

    setIsLoading(true);
    const response = await login(username, password);
    if (response?.success === true) {
      await AsyncStorage.setItem("access_token", response.data);
      Toast.show({ type: "success", text1: "Login successful" });
      setTimeout(() => router.replace("/(tabs)/home"), 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Incorrect username or password",
      });
    }
    setIsLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    const redirectUrl = AuthSession.makeRedirectUri({ useProxy: true } as any);
    console.log(redirectUrl);
    const baseUrl =
      "https://englishapp-api-165787629721.asia-southeast1.run.app";
    const url =
      provider === "google"
        ? `${baseUrl}/api/Authentication/signin-google?redirectUrl=${encodeURIComponent(
            redirectUrl
          )}`
        : `${baseUrl}/api/Authentication/login-facebook?redirectUrl=${encodeURIComponent(
            redirectUrl
          )}`;

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
    if (result.type !== "success" || !result.url.includes("access_token")) {
      Toast.show({ type: "error", text1: `Login with ${provider} failed` });
      return;
    }

    const tokenMatch = result.url.match(/access_token=([^&]+)/);
    const token = tokenMatch?.[1];

    if (!token) {
      Toast.show({ type: "error", text1: "Invalid token" });
      return;
    }

    await AsyncStorage.setItem("access_token", token);
    Toast.show({ type: "success", text1: `Login with ${provider} successful` });
    setTimeout(() => router.replace("/(tabs)/home"), 1000);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <LinearGradient
        colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
        style={tw`flex-1`}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: modalHeight,
              backgroundColor: "#F3F2F8",
              transform: [{ translateY: slideAnim }],
            },
            tw`rounded-t-3xl items-center justify-start`,
          ]}
        >
          <View style={tw`w-full items-center mt-10`}>
            <Image source={require("@/assets/auth/Icon/avatar.png")} />
            <Text style={tw`text-xl font-bold text-gray-800 mt-4`}>Login</Text>
            <Text style={tw`text-sm text-center text-gray-500 mt-2 px-10`}>
              Enter the username and password you used when you created your
              account.
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Username"
              style={tw`w-11/12 h-12 bg-gray-200 rounded px-4 mb-3 text-gray-800`}
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
            <View
              style={tw`w-11/12 h-12 bg-gray-200 rounded px-4 mb-3 flex-row items-center`}
            >
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={tw`flex-1 text-gray-800`}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgotpassword")}
            >
              <Text style={tw`text-sm text-blue-500 mt-2`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`w-full items-center mt-8`}>
            <TouchableOpacity
              style={tw`w-4/5 h-12 rounded bg-blue-600 justify-center items-center`}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white font-bold text-base`}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Text style={tw`text-sm text-gray-500 mt-4`}>Or</Text>

            <TouchableOpacity
              onPress={() => handleOAuthLogin("google")}
              style={tw`w-4/5 h-12 rounded bg-gray-300 justify-center items-center flex-row mt-3`}
            >
              <Image
                source={require("@/assets/auth/Icon/google.png")}
                style={tw`w-5 h-5 mr-2`}
              />
              <Text style={tw`text-white font-bold`}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOAuthLogin("facebook")}
              style={tw`w-4/5 h-12 rounded bg-blue-700 justify-center items-center flex-row mt-3`}
            >
              <Image
                source={require("@/assets/auth/Icon/fb.png")}
                style={tw`w-5 h-5 mr-2`}
              />
              <Text style={tw`text-white font-bold`}>
                Sign in with Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={tw`text-sm text-blue-600 mt-5`}>
                Don’t have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignIn;
