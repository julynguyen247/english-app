import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const StudyScreen = () => {
  const decks = [
    { id: "1", name: "English Vocabulary", total: 12 },
    { id: "2", name: "IELTS Listening", total: 8 },
    { id: "3", name: "Travel Essentials", total: 10 },
    { id: "4", name: "Business Terms", total: 6 },
  ];

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 32,
        }}
        className="h-full"
      >
        <View className="bg-white rounded-2xl px-6 py-6 shadow-md h-[75vh]">
          <TouchableOpacity onPress={() => router.back()} className="self-end">
            <Text className="text-blue-400 font-bold text-base mr-1">Done</Text>
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Ionicons name="school-outline" size={48} color="#3b82f6" />
            <Text className="text-black font-bold text-2xl mt-2">
              Start Studying
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              Select a deck below to begin learning.
            </Text>
          </View>

          {decks.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center mb-5"
              onPress={() => router.push("/learnCard")}
            >
              <View className="w-20 h-20 bg-blue-200 rounded-lg mr-4" />
              <View className="justify-center">
                <Text className="text-black font-bold">{item.name}</Text>
                <Text className="text-gray-500">Flashcards: {item.total}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default StudyScreen;
