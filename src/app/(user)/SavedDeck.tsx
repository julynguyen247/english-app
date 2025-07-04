import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import { getAllSavedDecksAPI, saveDeckAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useCurrentApp } from "../context/appContext";

interface ISavedDeck {
  id: number;
  name: string;
  flashCardNumber: number;
}

const SavedDecksScreen = () => {
  const [decks, setDecks] = useState<ISavedDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const { appState } = useCurrentApp();

  useEffect(() => {
    const fetchSavedDecks = async () => {
      if (!appState?.userId) {
        Toast.show({
          type: "error",
          text1: "User not found",
          text2: "Please log in again.",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getAllSavedDecksAPI(Number(appState?.userId));
        setDecks(data);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Failed to load saved decks",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDecks();
  }, [appState]);

  const handleUnsave = async (deckId: number) => {
    try {
      await saveDeckAPI(deckId);
      Toast.show({ type: "success", text1: "Deck unsaved!" });
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to unsave deck." });
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_BLUE, "#fff"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 32,
        }}
      >
        <View className="bg-white rounded-2xl px-6 py-6 shadow-md min-h-[75vh]">
          <View className="items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="self-end"
            >
              <Text className="text-blue-400 font-bold text-base mr-1">
                Done
              </Text>
            </TouchableOpacity>
            <Ionicons name="bookmark-outline" size={48} color="#3b82f6" />
            <Text className="text-black font-bold text-2xl mt-2">
              Saved Decks
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              All the decks you’ve saved will appear here.
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#3b82f6" size="large" />
          ) : decks.length === 0 ? (
            <Text className="text-center text-gray-500">
              You haven’t saved any decks yet.
            </Text>
          ) : (
            decks.map((deck) => (
              <View
                key={deck.id}
                className="flex-row items-center justify-between mb-5"
              >
                <TouchableOpacity
                  className="flex-row items-center flex-1"
                  onPress={() =>
                    router.push({
                      pathname: "/(user)/SaveDeckCard",
                      params: {
                        id: deck.id.toString(),
                        name: deck.name,
                      },
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
                <TouchableOpacity
                  onPress={() => handleUnsave(deck.id)}
                  className="bg-red-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-red-600 font-semibold text-sm">
                    Unsave
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SavedDecksScreen;
