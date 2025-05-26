import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";

const SearchTab = () => {
  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={{ paddingTop: 32 }}>
            {/* Search Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <Ionicons
                name="search"
                size={20}
                color="#555"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Search songs, artists, playlists..."
                placeholderTextColor="#999"
                style={{ flex: 1, fontSize: 16, color: APP_COLOR.TEXT_PRIMARY }}
              />
            </View>

            {/* Suggestions Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {[...Array(12)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: "32%",
                    marginBottom: 16,
                    borderRadius: 12,
                    backgroundColor: "#E1F0FF",
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                  }}
                >
                  <Text
                    style={{ color: APP_COLOR.TEXT_PRIMARY, fontWeight: "600" }}
                  >
                    Item {i + 1}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default SearchTab;
