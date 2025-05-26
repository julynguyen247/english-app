import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { MotiPressable } from "moti/interactions";
import AnimatedWrapper from "@/components/animation/animate";
import { getAccountAPI } from "@/utils/api";

const ProfileTab = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await getAccountAPI();
        setEmail(res.email);
      } catch (error) {
        console.log("Lỗi load profile:", error);
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
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
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
              onPress={() => router.push("/record")}
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
                  name="mic-outline"
                  size={20}
                  color={APP_COLOR.TEXT_PRIMARY}
                />
                <Text style={{ marginLeft: 12, color: APP_COLOR.TEXT_PRIMARY }}>
                  Your Recordings
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
              onPress={() => router.push("/playlist")}
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
                  name="musical-notes-outline"
                  size={20}
                  color={APP_COLOR.TEXT_PRIMARY}
                />
                <Text style={{ marginLeft: 12, color: APP_COLOR.TEXT_PRIMARY }}>
                  Your Playlists
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={APP_COLOR.TEXT_PRIMARY}
              />
            </MotiPressable>
          </View>

          {/* Log out */}
          <View style={{ marginTop: "auto", marginBottom: 32 }}>
            <MotiPressable
              from={{ scale: 1 }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
              transition={{ type: "timing", duration: 150 }}
              onPress={() => console.log("Log out")}
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
