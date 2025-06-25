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
import tw from "twrnc";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { signUpSendOtpAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;
const avatar = require("@/assets/auth/Icon/avatar.png");

const SignUp = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Missing information",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);
    const res = await signUpSendOtpAPI(email, password, confirmPassword);

    if (res && res.success === true) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.message || "OTP sent to your email",
      });

      setTimeout(() => {
        router.push({
          pathname: "/(auth)/otpverify",
          params: { email },
        });
      }, 1000);
    } else {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: res.message || "Failed to send OTP",
      });
    }

    setIsLoading(false);
  };

  const isButtonActive =
    email.length > 0 && password.length > 0 && confirmPassword.length > 0;

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
              transform: [{ translateY: slideAnim }],
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
              Register
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
              Create your account below
            </Text>
          </View>

          <View style={tw`w-full items-center mt-10`}>
            <TextInput
              placeholder="Email"
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
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
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

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={!isButtonActive || isLoading}
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
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                {isLoading ? "Sending..." : "Next"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("./signin")}>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 12,
                  color: APP_COLOR.PRIMARY_BLUE,
                }}
              >
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUp;
