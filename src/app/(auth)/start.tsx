import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_COLOR } from "@/utils/constant";
import { Redirect } from "expo-router";
import tw from "twrnc";

const { height } = Dimensions.get("window");

const Logo = require("@/assets/auth/Logo/Manoke.png");
const Illustration = require("@/assets/auth/Image/im3.jpg");

const LoginPage = () => {
  const [redirectToSignIn, setRedirectToSignIn] = React.useState(false);
  const [redirectToSignUp, setRedirectToSignUp] = React.useState(false);

  if (redirectToSignIn) return <Redirect href="/(auth)/signin" />;
  if (redirectToSignUp) return <Redirect href="/(auth)/signup" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: APP_COLOR.BACKGROUND }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        {/* Logo & Illustration */}
        <View style={{ alignItems: "center" }}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "timing", duration: 1500 }}
            style={{ alignItems: "center", marginBottom: 16 }}
          >
            <Image
              source={Logo}
              style={{ width: 180, height: 60, resizeMode: "contain" }}
            />
          </MotiView>
          <Image
            source={Illustration}
            style={{
              width: "100%",
              height: height * 0.35,
              borderRadius: 20,
              marginTop: 20,
              resizeMode: "cover",
            }}
          />
        </View>

        {/* Text & Actions */}
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: APP_COLOR.TEXT_PRIMARY,
              textAlign: "center",
            }}
          >
            Learn English the Smart Way
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: APP_COLOR.TEXT_SECONDARY,
              textAlign: "center",
              marginTop: 12,
              lineHeight: 22,
              width: "90%",
            }}
          >
            Improve your vocabulary, reading & listening skills with daily
            practice, quizzes, and topic-based lessons.
          </Text>

          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: APP_COLOR.PRIMARY_BLUE,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
            onPress={() => setRedirectToSignUp(true)}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: "#fff",
              borderColor: APP_COLOR.PRIMARY_BLUE,
              borderWidth: 1.5,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
            onPress={() => setRedirectToSignIn(true)}
          >
            <Text
              style={{
                color: APP_COLOR.PRIMARY_BLUE,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
