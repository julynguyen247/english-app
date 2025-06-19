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
  const slideAnim = useRef(new Animated.Value(-modalHeight)).current;
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  const handleSendOtp = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Email không được để trống" });
      return;
    }

    try {
      await signUpSendOtpAPI(email, passcode, passcode);
      Toast.show({
        type: "success",
        text1: "OTP đã được gửi đến email của bạn",
      });
      router.push({
        pathname: "./signup2",
        params: { email, passcode },
      });
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Gửi OTP thất bại",
        text2: err?.response?.data?.message || "Đã xảy ra lỗi",
      });
    }
  };

  const isButtonActive = email.length > 0 && passcode.length > 0;

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
              Enter your email to receive a passcode.
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
            <TouchableOpacity style={tw`mb-5`} onPress={handleSendOtp}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                  color: APP_COLOR.PRIMARY_BLUE,
                }}
              >
                Send Passcode
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Passcode"
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
              value={passcode}
              onChangeText={setPasscode}
            />
          </View>

          <View style={tw`w-full items-center mt-5`}>
            <TouchableOpacity
              onPress={() => router.push("./signup2")}
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
                Next
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
                Already Have An Account?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUp;
