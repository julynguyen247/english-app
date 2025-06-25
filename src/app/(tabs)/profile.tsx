import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import AnimatedWrapper from "@/components/animation/animate";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { getCurrentUserInfoAPI } from "@/utils/api";

const ProfileTab = () => {
  const [email, setEmail] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      Toast.show({ type: "success", text1: "Đã đăng xuất" });
      router.replace("/(auth)/signin");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể đăng xuất",
      });
    }
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await getCurrentUserInfoAPI();
        setEmail(res.email);
      } catch (error) {
        Toast.show({ type: "error", text1: "Lỗi lấy thông tin người dùng" });
      }
    };
    fetchEmail();
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 48,
            marginTop: 64,
          }}
        >
          {/* Avatar */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: APP_COLOR.LIGHT_BLUE,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <Text
              style={{
                marginTop: 12,
                fontSize: 18,
                fontWeight: "bold",
                color: APP_COLOR.TEXT_PRIMARY,
              }}
            >
              {email || "Loading..."}
            </Text>
          </View>

          {/* Options */}
          <View style={{ gap: 12 }}>
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.96 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => router.push("/(user)/deck")}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="albums-outline"
                  size={20}
                  color={APP_COLOR.TEXT_PRIMARY}
                />
                <Text style={{ marginLeft: 12, color: APP_COLOR.TEXT_PRIMARY }}>
                  Your Decks
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={APP_COLOR.TEXT_PRIMARY}
              />
            </MotiPressable>

            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.96 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => router.push("/(user)/study")}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={APP_COLOR.TEXT_PRIMARY}
                />
                <Text style={{ marginLeft: 12, color: APP_COLOR.TEXT_PRIMARY }}>
                  Start Studying
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={APP_COLOR.TEXT_PRIMARY}
              />
            </MotiPressable>
          </View>

          {/* Logout */}
          <View style={{ marginTop: 128, marginBottom: 32 }}>
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={handleLogout}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: APP_COLOR.RED,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Log out
              </Text>
            </MotiPressable>
          </View>
        </View>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default ProfileTab;
