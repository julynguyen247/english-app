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
import { getAllSavedDecksAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const SavedDecksScreen = () => {
  const [decks, setDecks] = useState<
    { id: number; name: string; flashCardNumber: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getAllSavedDecksAPI();
        setDecks(data);
      } catch (err) {
        Toast.show({ type: "error", text1: "Không thể tải Saved Decks" });
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

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
            <Ionicons name="bookmark-outline" size={48} color="#3b82f6" />
            <Text className="text-black font-bold text-2xl mt-2">
              Saved Decks
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              The decks you have saved will be displayed here.
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color={"#3b82f6"} size="large" />
          ) : decks.length === 0 ? (
            <Text className="text-center text-gray-500">Chưa có deck nào.</Text>
          ) : (
            decks.map((deck) => (
              <TouchableOpacity
                key={deck.id}
                className="flex-row items-center mb-5"
                onPress={() =>
                  router.push({
                    pathname: "/(user)/cards",
                    params: { id: deck.id.toString(), name: deck.name },
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
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SavedDecksScreen;
