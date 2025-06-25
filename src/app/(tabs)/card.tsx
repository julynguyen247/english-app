import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { router } from "expo-router";

const topics = [
  { id: 1, title: "Travel", color: "#FFDEE9" },
  { id: 2, title: "Business", color: "#B5FFFC" },
  { id: 3, title: "Technology", color: "#D5FFB0" },
  { id: 4, title: "Health", color: "#FFC6A5" },
  { id: 5, title: "Education", color: "#C4C1FF" },
  { id: 6, title: "Food", color: "#FEEBCB" },
  { id: 7, title: "Music", color: "#CFFAFE" },
  { id: 8, title: "Science", color: "#E0BBE4" },
  { id: 9, title: "Daily Life", color: "#FFFFB5" },
];

const CardTab = () => {
  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
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
                placeholder="Search cards"
                placeholderTextColor="#999"
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: APP_COLOR.TEXT_PRIMARY,
                }}
              />
            </View>

            {/* Topic Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() =>
                    router.push({
                      pathname: "/(user)/learnCard",
                      params: {
                        categoryId: topic.id.toString(),
                        level: "Beginner",
                      },
                    })
                  }
                  style={{
                    width: "32%",
                    marginBottom: 16,
                    borderRadius: 12,
                    backgroundColor: topic.color,
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
                    style={{
                      color: APP_COLOR.TEXT_PRIMARY,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {topic.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default CardTab;
