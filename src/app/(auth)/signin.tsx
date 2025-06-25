import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/utils/api";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");
const googleLogo = require("@/assets/auth/Icon/google.png");
const facebookLogo = require("@/assets/auth/Icon/fb.png");

const SignIn = () => {
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const isButtonActive = username.length > 0 && password.length > 0;

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
    const baseUrl =
      "https://englishapp-api-165787629721.asia-southeast1.run.app";
    const url =
      provider === "google"
        ? `${baseUrl}/api/Authentication/signin-google?returnUrl=${encodeURIComponent(
            redirectUrl
          )}`
        : `${baseUrl}/api/Authentication/login-facebook?returnUrl=${encodeURIComponent(
            redirectUrl
          )}`;

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

    if (result.type !== "success" || !result.url.includes("access_token")) {
      Toast.show({ type: "error", text1: `Login with ${provider} failed` });
      return;
    }

    const tokenMatch = result.url.match(/access_token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

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
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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
            <Image source={avatar} style={tw`mt-5 mb-5`} />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: APP_COLOR.TEXT_PRIMARY,
              }}
            >
              Login
            </Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 40,
                color: APP_COLOR.TEXT_SECONDARY,
              }}
            >
              Enter the username and password you used when you created your
              account to log in.
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Username"
              style={{
                width: "85%",
                height: 50,
                backgroundColor: "#F5F5F5",
                borderRadius: 10,
                paddingHorizontal: 16,
                marginBottom: 12,
                color: APP_COLOR.TEXT_PRIMARY,
              }}
              placeholderTextColor={"#999"}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={{
                width: "85%",
                height: 50,
                backgroundColor: "#F5F5F5",
                borderRadius: 10,
                paddingHorizontal: 16,
                marginBottom: 12,
                color: APP_COLOR.TEXT_PRIMARY,
              }}
              placeholderTextColor={"#999"}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgotpassword")}
            >
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 8,
                  color: APP_COLOR.PRIMARY_BLUE,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TouchableOpacity
              style={{
                width: "80%",
                height: 50,
                borderRadius: 10,
                backgroundColor: isButtonActive
                  ? APP_COLOR.PRIMARY_BLUE
                  : APP_COLOR.BUTTON1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View style={tw`w-full items-center mt-6`}>
              <Text style={{ fontSize: 14, color: "#888" }}>Or</Text>
              <TouchableOpacity
                onPress={() => handleOAuthLogin("google")}
                style={{
                  width: "80%",
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 12,
                }}
              >
                <Image
                  source={googleLogo}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOAuthLogin("facebook")}
                style={{
                  width: "80%",
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: "#4267B2",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 12,
                }}
              >
                <Image
                  source={facebookLogo}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Sign in with Facebook
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 16,
                  color: APP_COLOR.PRIMARY_BLUE,
                }}
              >
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
