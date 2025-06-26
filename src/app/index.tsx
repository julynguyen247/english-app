import React, { useState, useEffect } from "react";
import { Image, Text } from "react-native";
import { APP_COLOR } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppProvider, { useCurrentApp } from "./context/appContext";
import { getCurrentUserInfoAPI } from "@/utils/api";

const Logo = require("@/assets/auth/Logo/Logo.png");

const WelcomePage = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(true);
  const { setAppState } = useCurrentApp();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await getCurrentUserInfoAPI();
        console.log(res);
        if (res) {
          setAppState(res);
          router.replace("/(tabs)/home");
        } else {
          setCheckingAccount(false);
        }
      } catch (err) {
        setCheckingAccount(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (!checkingAccount) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checkingAccount]);

  if (shouldRedirect) {
    return <Redirect href="/(auth)/start" />;
  }

  return (
    <LinearGradient
      colors={[APP_COLOR.NAVY_BLUE, APP_COLOR.BLUE]}
      className="flex-1"
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center">
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "timing", duration: 2500 }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              marginBottom: 32,
            }}
          >
            SMART WAY
          </Text>
        </MotiView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WelcomePage;
