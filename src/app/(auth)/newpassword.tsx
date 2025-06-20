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
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import { resetPasswordAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;

const NewPass = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);
  const router = useRouter();
  const { email: rawEmail } = useLocalSearchParams();
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail || "";

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập đầy đủ OTP và mật khẩu mới.",
      });
      return;
    }

    setIsLoading(true);
    isSubmitting.current = true;

    try {
      const res = await resetPasswordAPI(email, resetCode, newPassword);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: res.data?.message || "Đặt lại mật khẩu thành công",
      });

      setTimeout(() => {
        router.replace("/signin");
      }, 1000);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2:
          error?.response?.data?.message ||
          error?.message ||
          "Không thể đặt lại mật khẩu.",
      });
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
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
            Reset Password
          </Text>

          <TextInput
            placeholder="OTP Code"
            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 text-base`}
            placeholderTextColor={"#A0A0A0"}
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            editable={!isLoading}
          />

          <TextInput
            placeholder="New Password"
            style={tw`w-[85%] h-[50px] bg-white rounded-lg px-4 mb-4 text-base`}
            placeholderTextColor={"#A0A0A0"}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading}
            style={[
              tw`w-[80%] h-[50px] rounded-lg items-center justify-center`,
              {
                backgroundColor:
                  resetCode && newPassword
                    ? APP_COLOR.PRIMARY_BLUE
                    : APP_COLOR.BUTTON1,
              },
            ]}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {isLoading ? "Resetting..." : "Reset Password"}
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
              Back to Login
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default NewPass;
