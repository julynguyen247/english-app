import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
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

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignIn = () => {
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const googleLogo = require("@/assets/auth/Icon/google.png");
  const facebookLogo = require("@/assets/auth/Icon/fb.png");
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
        text1: "Thiếu thông tin",
        text2: "Vui lòng nhập đầy đủ tài khoản và mật khẩu",
      });
      return;
    }

    const response = await login(username, password);
    if (response?.success === true) {
      await AsyncStorage.setItem("access_token", response.data);
      Toast.show({ type: "success", text1: "Đăng nhập thành công" });
      setTimeout(() => router.replace("/(tabs)/home"), 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại",
        text2: "Sai tài khoản hoặc mật khẩu",
      });
    }
  };

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    const redirectUrl = "myapp://redirect";
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const url =
      provider === "google"
        ? `${baseUrl}/api/Authentication/signin-google?returnUrl=/api/Authentication/profile`
        : `${baseUrl}/api/Authentication/login-facebook`;

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

    if (result.type !== "success" || !result.url.includes("access_token")) {
      Toast.show({ type: "error", text1: `Đăng nhập ${provider} thất bại` });
      return;
    }

    const tokenMatch = result.url.match(/access_token=([^&]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      Toast.show({ type: "error", text1: "Token không hợp lệ" });
      return;
    }

    await AsyncStorage.setItem("access_token", token);
    Toast.show({ type: "success", text1: `Đăng nhập ${provider} thành công` });
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
                Password Lost?
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
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Sign In
              </Text>
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
                  Login with Google
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
                  Login with Facebook
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
                No Account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignIn;
