import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { Ionicons } from "@expo/vector-icons";

const PracticeTab = () => {
  const tests = [
    {
      id: "1",
      title: "Cambridge IELTS 7",
      description: "4 full tests with audio & answers",
    },
    {
      id: "2",
      title: "Cambridge IELTS 8",
      description: "Academic & General Training tests",
    },
    {
      id: "3",
      title: "Cambridge IELTS 9",
      description: "Listening, Reading, Writing samples",
    },
    {
      id: "4",
      title: "Cambridge IELTS 10",
      description: "Authentic practice for band 7+",
    },
    {
      id: "5",
      title: "Cambridge IELTS 11",
      description: "Academic English exam prep",
    },
    {
      id: "6",
      title: "Cambridge IELTS 12",
      description: "Official tests with answer keys",
    },
  ];

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
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
              placeholder="Tìm bộ đề Cambridge..."
              placeholderTextColor="#999"
              style={{ flex: 1, fontSize: 16, color: APP_COLOR.TEXT_PRIMARY }}
            />
          </View>

          <View>
            {tests.map((test) => (
              <View
                key={test.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                    marginBottom: 6,
                  }}
                >
                  {test.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: APP_COLOR.TEXT_SECONDARY,
                    marginBottom: 12,
                  }}
                >
                  {test.description}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: APP_COLOR.PRIMARY_BLUE,
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginRight: 8,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      console.log(`Go to Reading of ${test.title}`);
                      // Replace with router.push() if needed
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Reading
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "#FFD700",
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginLeft: 8,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      console.log(`Go to Listening of ${test.title}`);
                    }}
                  >
                    <Text style={{ color: "#000", fontWeight: "600" }}>
                      Listening
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default PracticeTab;
