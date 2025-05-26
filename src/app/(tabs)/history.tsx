import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TextInput, View, ScrollView } from "react-native";

const HistoryTab = () => {
  const songs = [
    { id: "1", name: "Name of Song", artist: "Artist", score: "95" },
    { id: "2", name: "Another Song", artist: "Singer", score: "87" },
    { id: "3", name: "Favorite Track", artist: "Someone", score: "100" },
  ];

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}>
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
              placeholder="Try typing a song or an artist..."
              placeholderTextColor="#999"
              style={{ flex: 1, fontSize: 16, color: APP_COLOR.TEXT_PRIMARY }}
            />
          </View>

          {/* History List */}
          <View>
            {songs.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: APP_COLOR.LIGHT_BLUE,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: APP_COLOR.TEXT_PRIMARY,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: APP_COLOR.TEXT_SECONDARY,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {item.artist}
                  </Text>
                </View>

                <Text
                  style={{
                    color: APP_COLOR.PRIMARY_BLUE,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {item.score}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HistoryTab;
