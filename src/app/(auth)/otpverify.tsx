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
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { signUpReceiveOtpAPI } from "@/utils/api";

const { height: screenHeight } = Dimensions.get("window");
const modalHeight = screenHeight * 0.9;

const OtpVerify = () => {
  const slideAnim = useRef(new Animated.Value(modalHeight)).current;
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email: rawEmail } = useLocalSearchParams();
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail || "";
  const isSubmitting = useRef(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVerifyOtp = async () => {
    if (isLoading || isSubmitting.current) return;
    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the OTP code.",
      });
      return;
    }

    setIsLoading(true);
    isSubmitting.current = true;

    try {
      const res = await signUpReceiveOtpAPI(email, otp);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.data?.message || "OTP verified successfully!",
      });

      setTimeout(() => {
        router.replace("/signin");
      }, 1000);
    } catch (error: any) {
      let errorMessage = "OTP verification failed.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
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
              width: "100%",
              height: modalHeight,
              backgroundColor: "#F3F2F8",
              transform: [{ translateY: slideAnim }],
              bottom: 0,
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
              marginBottom: 16,
            }}
          >
            Enter OTP
          </Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              marginBottom: 24,
              paddingHorizontal: 30,
              color: APP_COLOR.TEXT_SECONDARY,
            }}
          >
            We've sent a one-time password (OTP) to your email. Please enter the
            code below.
          </Text>

          <TextInput
            placeholder="Enter OTP"
            style={tw`w-[80%] h-[50px] bg-white rounded-lg my-10 px-4 text-center text-lg`}
            placeholderTextColor={"#A0A0A0"}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            editable={!isLoading}
            maxLength={6}
          />

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isLoading || otp.length === 0}
            style={[
              tw`w-[80%] h-[50px] rounded-lg items-center justify-center`,
              {
                backgroundColor:
                  otp.length > 0 && !isLoading
                    ? APP_COLOR.PRIMARY_BLUE
                    : APP_COLOR.BUTTON1,
              },
            ]}
          >
            <Text style={tw`text-white text-lg font-bold`}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OtpVerify;
