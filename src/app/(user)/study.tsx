import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { getOwnDecksAPI, getAllSavedDecksAPI } from "@/utils/api";
import { useCurrentApp } from "../context/appContext";

interface IDeck {
  id: number;
  name: string;
  flashCardNumber: number;
}

const StudyScreen = () => {
  const { appState } = useCurrentApp();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDecks = async () => {
    if (!appState?.userId) return;
    try {
      setLoading(true);
      const [ownRes, savedRes] = await Promise.all([
        getOwnDecksAPI(appState.userId),
        getAllSavedDecksAPI(appState.userId),
      ]);

      const ownDecks: IDeck[] = ownRes || [];
      const savedDecks: IDeck[] = savedRes || [];

      const mergedDecks = [...ownDecks, ...savedDecks];
      setDecks(mergedDecks);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load decks" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [appState?.userId]);

  const renderDeckItem = (deck: IDeck) => (
    <TouchableOpacity
      key={deck.id}
      className="flex-row items-center mb-5"
      onPress={() =>
        router.push({
          pathname: "/learnCard",
          params: { categoryId: deck.id.toString() },
        })
      }
    >
      <View className="w-20 h-20 bg-blue-200 rounded-lg mr-4" />
      <View className="justify-center">
        <Text className="text-black font-bold">{deck.name}</Text>
        <Text className="text-gray-500">
          Flashcards: {deck.flashCardNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
      >
        <View className="bg-white rounded-2xl px-6 py-6 shadow-md min-h-[75vh]">
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

          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" />
          ) : decks.length === 0 ? (
            <Text className="text-center text-gray-500">No decks found.</Text>
          ) : (
            decks.map(renderDeckItem)
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default StudyScreen;
