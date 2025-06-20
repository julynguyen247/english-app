import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { useRouter } from "expo-router";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import { sendResetPasswordCodeAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;

const ResetPasswordStep1 = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendOtp = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập email",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await sendResetPasswordCodeAPI(email);
      Toast.show({
        type: "success",
        text1: "OTP đã được gửi",
        text2: res?.data?.message || "Vui lòng kiểm tra email của bạn",
      });

      setTimeout(() => {
        router.push({
          pathname: "/(auth)/newpassword",
          params: { email },
        });
      }, 1000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Không thể gửi OTP",
        text2:
          error?.response?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi khi gửi OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <LinearGradient
        colors={[
          APP_COLOR.PRIMARY_BLUE,
          APP_COLOR.BLACK,
          APP_COLOR.PRIMARY_BLUE,
        ]}
        style={tw`flex-1`}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5, 1]}
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
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: APP_COLOR.TEXT_PRIMARY,
              marginTop: 80,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Quên mật khẩu
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: APP_COLOR.TEXT_SECONDARY,
              textAlign: "center",
              marginBottom: 30,
              paddingHorizontal: 30,
            }}
          >
            Nhập email của bạn để nhận mã xác nhận.
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 text-base`}
            placeholderTextColor="#A0A0A0"
          />

          <TouchableOpacity
            onPress={handleSendOtp}
            disabled={isLoading || !email}
            style={[
              tw`w-[80%] h-[50px] rounded-lg items-center justify-center`,
              {
                backgroundColor: email
                  ? APP_COLOR.PRIMARY_BLUE
                  : APP_COLOR.BUTTON1,
              },
            ]}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/signin")}
            disabled={isLoading}
          >
            <Text
              style={{
                fontSize: 14,
                marginTop: 12,
                color: APP_COLOR.PRIMARY_BLUE,
              }}
            >
              Quay lại đăng nhập
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ResetPasswordStep1;
