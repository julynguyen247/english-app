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
import { loginAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignIn = () => {
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    router.replace("/(tabs)/home");
    // try {
    //   const response = await loginAPI(username, password);
    //   console.log("Login API response: ", response);
    //   if (response?.accessToken) {
    //     await AsyncStorage.setItem("access_token", response.accessToken);

    //     Toast.show({
    //       type: "success",
    //       text1: "Success",
    //       text2: "Logged in successfully!",
    //     });

    //     setTimeout(() => {
    //       router.replace("/(tabs)/home");
    //     }, 1000);
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1: "Failed",
    //       text2: "Login Failed!",
    //     });
    //   }
    // } catch (error) {
    //   console.log("Login error: ", error);
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Something went wrong!",
    //   });
    // }
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
              width: "100%",
              height: modalHeight,
              backgroundColor: "#FFFFFF",
              bottom: slideAnim,
              left: 0,
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
            <TouchableOpacity>
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

            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 12,
                  color: APP_COLOR.PRIMARY_BLUE,
                }}
              >
                No Manoke Account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignIn;
